import { createClient, type SupabaseClient } from "@supabase/supabase-js";
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

type Row = Record<string, unknown>;

const snake = (k: string) => k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const camel = (k: string) => k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

function toRow(obj: object): Row {
  const out: Row = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined) out[snake(k)] = v;
  return out;
}

function fromRow<T>(row: Row | null): T | null {
  if (!row) return null;
  const out: Row = {};
  for (const [k, v] of Object.entries(row)) out[camel(k)] = v;
  return out as T;
}

const fromRows = <T,>(rows: Row[] | null): T[] => (rows ?? []).map((r) => fromRow<T>(r)!);

/** Postgres unique violation */
const isDuplicate = (error: { code?: string } | null) => error?.code === "23505";

function check(error: { message: string } | null) {
  if (error) throw new Error(`supabase: ${error.message}`);
}

export class SupabaseRepo implements Repo {
  private db: SupabaseClient;

  constructor(url: string, serviceRoleKey: string) {
    this.db = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  }

  private async one<T>(table: string, column: string, value: string): Promise<T | null> {
    const { data, error } = await this.db.from(table).select("*").eq(column, value).maybeSingle();
    check(error);
    return fromRow<T>(data);
  }

  private async many<T>(table: string, column: string, value: string): Promise<T[]> {
    const { data, error } = await this.db.from(table).select("*").eq(column, value);
    check(error);
    return fromRows<T>(data);
  }

  getMember(id: string) {
    return this.one<Member>("members", "id", id);
  }
  getMemberByPhone(phone: string) {
    return this.one<Member>("members", "phone", phone);
  }
  getMemberByQrToken(token: string) {
    return this.one<Member>("members", "qr_token", token);
  }
  getMemberByReferralCode(code: string) {
    return this.one<Member>("members", "referral_code", code.toUpperCase());
  }
  getMemberByCloverCustomer(customerId: string) {
    return this.one<Member>("members", "clover_customer_id", customerId);
  }
  async createMember(member: Member) {
    const { error } = await this.db.from("members").insert(toRow(member));
    if (isDuplicate(error)) throw new Error(error!.message.includes("phone") ? "phone_taken" : "code_taken");
    check(error);
    return member;
  }
  async updateMember(id: string, patch: Partial<Member>) {
    const { data, error } = await this.db.from("members").update(toRow(patch)).eq("id", id).select("*").single();
    check(error);
    return fromRow<Member>(data)!;
  }

  async addLedger(entry: LedgerEntry) {
    const { error } = await this.db.from("points_ledger").insert(toRow(entry));
    if (isDuplicate(error)) return false;
    check(error);
    return true;
  }
  listLedger(memberId: string) {
    return this.many<LedgerEntry>("points_ledger", "member_id", memberId);
  }

  async addVisit(visit: Visit) {
    const { error } = await this.db.from("visits").insert(toRow(visit));
    check(error);
  }
  listVisits(memberId: string) {
    return this.many<Visit>("visits", "member_id", memberId);
  }

  async createReferral(referral: Referral) {
    const { error } = await this.db.from("referrals").insert(toRow(referral));
    if (isDuplicate(error)) return;
    check(error);
  }
  getReferralByReferee(refereeId: string) {
    return this.one<Referral>("referrals", "referee_id", refereeId);
  }
  async updateReferral(id: string, patch: Partial<Referral>) {
    const { error } = await this.db.from("referrals").update(toRow(patch)).eq("id", id);
    check(error);
  }
  listReferralsByReferrer(referrerId: string) {
    return this.many<Referral>("referrals", "referrer_id", referrerId);
  }
  async referralCountsSince(since: string) {
    const { data, error } = await this.db
      .from("referrals")
      .select("referrer_id")
      .eq("status", "completed")
      .gte("completed_at", since);
    check(error);
    const counts = new Map<string, number>();
    for (const r of data ?? []) counts.set(r.referrer_id as string, (counts.get(r.referrer_id as string) ?? 0) + 1);
    return [...counts].map(([referrerId, count]) => ({ referrerId, count }));
  }

  async addBadge(badge: MemberBadge) {
    const { error } = await this.db.from("member_badges").upsert(toRow(badge), { ignoreDuplicates: true });
    check(error);
  }
  listBadges(memberId: string) {
    return this.many<MemberBadge>("member_badges", "member_id", memberId);
  }

  async addSpin(spin: Spin) {
    const { error } = await this.db.from("spins").insert(toRow(spin));
    if (isDuplicate(error)) return false;
    check(error);
    return true;
  }
  listSpins(memberId: string) {
    return this.many<Spin>("spins", "member_id", memberId);
  }

  async addCoupon(coupon: Coupon) {
    const { error } = await this.db.from("coupons").insert(toRow(coupon));
    check(error);
  }
  listCoupons(memberId: string) {
    return this.many<Coupon>("coupons", "member_id", memberId);
  }
  getCouponByCode(code: string) {
    return this.one<Coupon>("coupons", "code", code.toUpperCase());
  }
  async updateCoupon(id: string, patch: Partial<Coupon>) {
    const { error } = await this.db.from("coupons").update(toRow(patch)).eq("id", id);
    check(error);
  }

  async upsertOrderLink(link: OrderLink) {
    const { error } = await this.db.from("order_links").upsert(toRow(link));
    check(error);
  }
  getOrderLink(orderId: string) {
    return this.one<OrderLink>("order_links", "order_id", orderId);
  }
  async updateOrderLink(orderId: string, patch: Partial<OrderLink>) {
    const { error } = await this.db.from("order_links").update(toRow(patch)).eq("order_id", orderId);
    check(error);
  }

  async addWalletRegistration(reg: WalletRegistration) {
    const { error } = await this.db.from("wallet_registrations").insert(toRow(reg));
    if (isDuplicate(error)) return false;
    check(error);
    return true;
  }
  async removeWalletRegistration(deviceId: string, serial: string) {
    const { error } = await this.db
      .from("wallet_registrations")
      .delete()
      .eq("device_id", deviceId)
      .eq("serial", serial);
    check(error);
  }
  listWalletRegistrationsBySerial(serial: string) {
    return this.many<WalletRegistration>("wallet_registrations", "serial", serial);
  }
  async listWalletSerialsForDevice(deviceId: string, passTypeId: string) {
    const { data, error } = await this.db
      .from("wallet_registrations")
      .select("serial")
      .eq("device_id", deviceId)
      .eq("pass_type_id", passTypeId);
    check(error);
    return (data ?? []).map((r) => r.serial as string);
  }
}
