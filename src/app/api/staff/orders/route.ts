import { handle, json } from "@/lib/api";
import { getClover } from "@/lib/clover";
import { requireStaff } from "@/lib/staff/guard";

export const GET = handle(async () => {
  const denied = await requireStaff();
  if (denied) return denied;
  const clover = getClover();
  return json({ mode: clover.mode, orders: await clover.listOpenOrders() });
});
