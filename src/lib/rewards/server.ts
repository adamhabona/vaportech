import "server-only";
import { after } from "next/server";
import { pushAppleUpdate } from "@/lib/wallet/apple";
import { pushGoogleUpdate } from "@/lib/wallet/google";
import { toPassData } from "@/lib/wallet/shared";
import { getRepo } from "./index";
import { createRewardsService, type RewardsService } from "./service";
import type { Member } from "./types";

let svc: RewardsService | null = null;

async function refreshWallets(member: Member) {
  const summary = await rewards().summary(member.id);
  if (!summary) return;
  await Promise.allSettled([pushAppleUpdate(member.id), pushGoogleUpdate(toPassData(summary))]);
}

/** App-wide rewards service. Wallet refreshes run after the response is sent. */
export function rewards(): RewardsService {
  if (svc) return svc;
  svc = createRewardsService({
    repo: getRepo(),
    notify: (member) => {
      try {
        after(() => refreshWallets(member));
      } catch {
        // Outside a request scope (scripts): run inline.
        void refreshWallets(member);
      }
    },
  });
  return svc;
}
