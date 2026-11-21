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

/**
 * Storage boundary for rewards. Two implementations:
 * - SupabaseRepo (production, when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set)
 * - FileRepo (local dev and tests, JSON file under .data/)
 */
export interface Repo {
  getMember(id: string): Promise<Member | null>;
  getMemberByPhone(phone: string): Promise<Member | null>;
  getMemberByQrToken(token: string): Promise<Member | null>;
  getMemberByReferralCode(code: string): Promise<Member | null>;
  getMemberByCloverCustomer(customerId: string): Promise<Member | null>;
  createMember(member: Member): Promise<Member>;
  updateMember(id: string, patch: Partial<Member>): Promise<Member>;

  /** Inserts unless an entry with the same ref exists. Returns false on duplicate. */
  addLedger(entry: LedgerEntry): Promise<boolean>;
  listLedger(memberId: string): Promise<LedgerEntry[]>;

  addVisit(visit: Visit): Promise<void>;
  listVisits(memberId: string): Promise<Visit[]>;

  createReferral(referral: Referral): Promise<void>;
  getReferralByReferee(refereeId: string): Promise<Referral | null>;
  updateReferral(id: string, patch: Partial<Referral>): Promise<void>;
  listReferralsByReferrer(referrerId: string): Promise<Referral[]>;
  /** Completed referrals with completedAt >= since, grouped by referrer. */
  referralCountsSince(since: string): Promise<{ referrerId: string; count: number }[]>;

  addBadge(badge: MemberBadge): Promise<void>;
  listBadges(memberId: string): Promise<MemberBadge[]>;

  /** Inserts unless the member already spun that day. Returns false on duplicate. */
  addSpin(spin: Spin): Promise<boolean>;
  listSpins(memberId: string): Promise<Spin[]>;

  addCoupon(coupon: Coupon): Promise<void>;
  listCoupons(memberId: string): Promise<Coupon[]>;
  getCouponByCode(code: string): Promise<Coupon | null>;
  updateCoupon(id: string, patch: Partial<Coupon>): Promise<void>;

  upsertOrderLink(link: OrderLink): Promise<void>;
  getOrderLink(orderId: string): Promise<OrderLink | null>;
  updateOrderLink(orderId: string, patch: Partial<OrderLink>): Promise<void>;

  addWalletRegistration(reg: WalletRegistration): Promise<boolean>;
  removeWalletRegistration(deviceId: string, serial: string): Promise<void>;
  listWalletRegistrationsBySerial(serial: string): Promise<WalletRegistration[]>;
  listWalletSerialsForDevice(deviceId: string, passTypeId: string): Promise<string[]>;
}
