import "server-only";
import { FileRepo } from "./file-repo";
import type { Repo } from "./repo";
import { SupabaseRepo } from "./supabase-repo";

let repo: Repo | null = null;

/** Supabase when configured, otherwise a local JSON file (dev only). */
export function getRepo(): Repo {
  if (repo) return repo;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    repo = new SupabaseRepo(url, key);
  } else {
    if (process.env.NODE_ENV === "production" && !process.env.REWARDS_ALLOW_FILE_STORE) {
      throw new Error("Rewards: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in production");
    }
    repo = new FileRepo();
  }
  return repo;
}

/** Test hook. */
export function setRepo(next: Repo) {
  repo = next;
}
