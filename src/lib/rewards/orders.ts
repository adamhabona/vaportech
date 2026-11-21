import "server-only";
import { getClover } from "@/lib/clover";
import { normalizePhone } from "./engine";
import { getRepo } from "./index";
import { rewards } from "./server";
import { RewardsError } from "./service";

/**
 * Awards points for a paid Clover order. Safe to call repeatedly (webhook
 * retries, manual re-sync): the ledger ref purchase:{orderId} is unique.
 */
export async function processCloverOrder(orderId: string) {
  const repo = getRepo();
  const link = await repo.getOrderLink(orderId);
  if (link?.processedAt) return { status: "already_processed" as const };

  const order = await getClover().getPaidOrder(orderId);
  if (!order) return { status: "not_found" as const };
  if (!order.paid) return { status: "not_paid" as const };

  let memberId = link?.memberId ?? null;
  if (!memberId) {
    for (const id of order.customerIds) {
      const m = await repo.getMemberByCloverCustomer(id);
      if (m) {
        memberId = m.id;
        break;
      }
    }
  }
  if (!memberId) {
    for (const raw of order.customerPhones) {
      const phone = normalizePhone(raw);
      const m = phone ? await repo.getMemberByPhone(phone) : null;
      if (m) {
        memberId = m.id;
        break;
      }
    }
  }
  if (!memberId) return { status: "no_member" as const };

  const result = await rewards().recordPurchase({
    orderId,
    memberId,
    spendCents: order.spendCents,
    categories: order.categories,
    at: new Date(order.createdTime),
  });
  const now = new Date().toISOString();
  await repo.upsertOrderLink({ orderId, memberId, createdAt: link?.createdAt ?? now, processedAt: now });
  return { status: "awarded" as const, memberId, ...result };
}

export async function linkOrder(memberId: string, orderId: string) {
  const repo = getRepo();
  const existing = await repo.getOrderLink(orderId);
  if (existing && existing.memberId !== memberId) {
    throw new RewardsError("order_taken", "That order is already linked to another member.", 409);
  }
  if (!existing) {
    await repo.upsertOrderLink({ orderId, memberId, createdAt: new Date().toISOString(), processedAt: null });
  }
}

export async function applyCoupon(memberId: string, couponId: string, orderId: string | null) {
  const repo = getRepo();
  const coupon = (await repo.listCoupons(memberId)).find((c) => c.id === couponId);
  if (!coupon) throw new RewardsError("not_found", "Reward not found.", 404);
  if (coupon.status !== "active") throw new RewardsError("used", "That reward was already used.", 409);
  if (new Date(coupon.expiresAt).getTime() < Date.now()) {
    await repo.updateCoupon(coupon.id, { status: "expired" });
    throw new RewardsError("expired", "That reward has expired.", 409);
  }

  if (coupon.kind === "amount_off") {
    if (!orderId) throw new RewardsError("order_required", "Pick the open order to apply this discount to.");
    const clover = getClover();
    const order = await clover.getOrderSummary(orderId);
    if (!order) throw new RewardsError("order_not_found", "Couldn't find that order on the register.", 404);
    if (coupon.minSpendCents && order.subtotalCents < coupon.minSpendCents) {
      throw new RewardsError(
        "min_spend",
        `This order is $${(order.subtotalCents / 100).toFixed(2)}. The reward needs $${(coupon.minSpendCents / 100).toFixed(2)} before tax.`,
        409,
      );
    }
    // Never discount below the remaining amount (no free product).
    const amount = Math.min(coupon.amountCents ?? 0, Math.max(0, order.subtotalCents - 1));
    await clover.addDiscount(orderId, `Rewards: ${coupon.name}`, amount);
    await linkOrder(memberId, orderId);
  }

  await repo.updateCoupon(coupon.id, { status: "used", usedAt: new Date().toISOString(), orderId });
  await repo.updateMember(memberId, { updatedAt: new Date().toISOString() });
  return coupon;
}
