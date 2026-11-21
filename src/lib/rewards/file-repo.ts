import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Repo } from "./repo";
import type {
  Coupon,
  LedgerEntry,
  Member,
  MemberBadge,
  OrderLink,
  Referral,
  Spin,
  Visit,
  WalletRegistration,
} from "./types";

interface Db {
  members: Member[];
  ledger: LedgerEntry[];
  visits: Visit[];
  referrals: Referral[];
  badges: MemberBadge[];
  spins: Spin[];
  coupons: Coupon[];
  orderLinks: OrderLink[];
  wallet: WalletRegistration[];
}

const empty = (): Db => ({
  members: [],
  ledger: [],
  visits: [],
  referrals: [],
  badges: [],
  spins: [],
  coupons: [],
  orderLinks: [],
  wallet: [],
});

/** Outside the project so dev writes don't trigger Fast Refresh. */
export const DEV_DATA_DIR = process.env.REWARDS_DATA_DIR || path.join(os.tmpdir(), "vaportech-rewards");

/**
 * JSON file store for local dev and tests. Not for production: no locking
 * across processes. Re-reads the file on every call because Next loads route
 * handlers and pages as separate module instances.
 */
export class FileRepo implements Repo {
  private db: Db | null = null;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private readonly file: string | null = path.join(DEV_DATA_DIR, "rewards.json")) {}

  private async load(): Promise<Db> {
    if (!this.file) return (this.db ??= empty());
    try {
      this.db = { ...empty(), ...JSON.parse(await fs.readFile(this.file, "utf8")) };
    } catch {
      this.db = empty();
    }
    return this.db!;
  }

  private async save() {
    if (!this.file || !this.db) return;
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    await fs.writeFile(this.file, JSON.stringify(this.db, null, 2));
  }

  private read<T>(fn: (db: Db) => T): Promise<T> {
    return this.load().then(fn);
  }

  private write<T>(fn: (db: Db) => T): Promise<T> {
    const run = this.queue.then(async () => {
      const db = await this.load();
      const out = fn(db);
      await this.save();
      return out;
    });
    this.queue = run.catch(() => undefined);
    return run;
  }

  getMember(id: string) {
    return this.read((db) => db.members.find((m) => m.id === id) ?? null);
  }
  getMemberByPhone(phone: string) {
    return this.read((db) => db.members.find((m) => m.phone === phone) ?? null);
  }
  getMemberByQrToken(token: string) {
    return this.read((db) => db.members.find((m) => m.qrToken === token) ?? null);
  }
  getMemberByReferralCode(code: string) {
    const c = code.toUpperCase();
    return this.read((db) => db.members.find((m) => m.referralCode === c) ?? null);
  }
  getMemberByCloverCustomer(customerId: string) {
    return this.read((db) => db.members.find((m) => m.cloverCustomerId === customerId) ?? null);
  }
  createMember(member: Member) {
    return this.write((db) => {
      if (db.members.some((m) => m.phone === member.phone)) throw new Error("phone_taken");
      if (db.members.some((m) => m.referralCode === member.referralCode)) throw new Error("code_taken");
      db.members.push(member);
      return member;
    });
  }
  updateMember(id: string, patch: Partial<Member>) {
    return this.write((db) => {
      const m = db.members.find((x) => x.id === id);
      if (!m) throw new Error("member_not_found");
      Object.assign(m, patch);
      return m;
    });
  }

  addLedger(entry: LedgerEntry) {
    return this.write((db) => {
      if (db.ledger.some((e) => e.ref === entry.ref)) return false;
      db.ledger.push(entry);
      return true;
    });
  }
  listLedger(memberId: string) {
    return this.read((db) => db.ledger.filter((e) => e.memberId === memberId));
  }

  addVisit(visit: Visit) {
    return this.write((db) => {
      db.visits.push(visit);
    });
  }
  listVisits(memberId: string) {
    return this.read((db) => db.visits.filter((v) => v.memberId === memberId));
  }

  createReferral(referral: Referral) {
    return this.write((db) => {
      if (db.referrals.some((r) => r.refereeId === referral.refereeId)) return;
      db.referrals.push(referral);
    });
  }
  getReferralByReferee(refereeId: string) {
    return this.read((db) => db.referrals.find((r) => r.refereeId === refereeId) ?? null);
  }
  updateReferral(id: string, patch: Partial<Referral>) {
    return this.write((db) => {
      const r = db.referrals.find((x) => x.id === id);
      if (r) Object.assign(r, patch);
    });
  }
  listReferralsByReferrer(referrerId: string) {
    return this.read((db) => db.referrals.filter((r) => r.referrerId === referrerId));
  }
  referralCountsSince(since: string) {
    return this.read((db) => {
      const counts = new Map<string, number>();
      for (const r of db.referrals) {
        if (r.status === "completed" && r.completedAt && r.completedAt >= since) {
          counts.set(r.referrerId, (counts.get(r.referrerId) ?? 0) + 1);
        }
      }
      return [...counts].map(([referrerId, count]) => ({ referrerId, count }));
    });
  }

  addBadge(badge: MemberBadge) {
    return this.write((db) => {
      if (!db.badges.some((b) => b.memberId === badge.memberId && b.badgeId === badge.badgeId)) db.badges.push(badge);
    });
  }
  listBadges(memberId: string) {
    return this.read((db) => db.badges.filter((b) => b.memberId === memberId));
  }

  addSpin(spin: Spin) {
    return this.write((db) => {
      if (db.spins.some((s) => s.memberId === spin.memberId && s.day === spin.day)) return false;
      db.spins.push(spin);
      return true;
    });
  }
  listSpins(memberId: string) {
    return this.read((db) => db.spins.filter((s) => s.memberId === memberId));
  }

  addCoupon(coupon: Coupon) {
    return this.write((db) => {
      db.coupons.push(coupon);
    });
  }
  listCoupons(memberId: string) {
    return this.read((db) => db.coupons.filter((c) => c.memberId === memberId));
  }
  getCouponByCode(code: string) {
    const c = code.toUpperCase();
    return this.read((db) => db.coupons.find((x) => x.code === c) ?? null);
  }
  updateCoupon(id: string, patch: Partial<Coupon>) {
    return this.write((db) => {
      const c = db.coupons.find((x) => x.id === id);
      if (c) Object.assign(c, patch);
    });
  }

  upsertOrderLink(link: OrderLink) {
    return this.write((db) => {
      const existing = db.orderLinks.find((l) => l.orderId === link.orderId);
      if (existing) Object.assign(existing, link);
      else db.orderLinks.push(link);
    });
  }
  getOrderLink(orderId: string) {
    return this.read((db) => db.orderLinks.find((l) => l.orderId === orderId) ?? null);
  }
  updateOrderLink(orderId: string, patch: Partial<OrderLink>) {
    return this.write((db) => {
      const l = db.orderLinks.find((x) => x.orderId === orderId);
      if (l) Object.assign(l, patch);
    });
  }

  addWalletRegistration(reg: WalletRegistration) {
    return this.write((db) => {
      if (db.wallet.some((w) => w.deviceId === reg.deviceId && w.serial === reg.serial)) return false;
      db.wallet.push(reg);
      return true;
    });
  }
  removeWalletRegistration(deviceId: string, serial: string) {
    return this.write((db) => {
      db.wallet = db.wallet.filter((w) => !(w.deviceId === deviceId && w.serial === serial));
    });
  }
  listWalletRegistrationsBySerial(serial: string) {
    return this.read((db) => db.wallet.filter((w) => w.serial === serial));
  }
  listWalletSerialsForDevice(deviceId: string, passTypeId: string) {
    return this.read((db) =>
      db.wallet.filter((w) => w.deviceId === deviceId && w.passTypeId === passTypeId).map((w) => w.serial),
    );
  }
}
