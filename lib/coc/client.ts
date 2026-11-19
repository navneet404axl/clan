import { normalizeTag } from "../env";
import type { CocClan, CocMember, CocCurrentWar, CocPlayer } from "./types";

/** Error carrying the HTTP status and the API's `reason` string. */
export class CocApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly reason?: string,
  ) {
    super(message);
    this.name = "CocApiError";
  }
}

export interface CocClientOptions {
  token?: string;
  baseUrl?: string;
  /** Inject fetch for testing. */
  fetchImpl?: typeof fetch;
}

/** Encode a tag for a URL path: "#ABC" -> "%23ABC". */
export function encodeTag(tag: string): string {
  return encodeURIComponent(normalizeTag(tag));
}

export function createCocClient(opts: CocClientOptions = {}) {
  const token = opts.token ?? process.env.COC_API_TOKEN;
  const baseUrl = (
    opts.baseUrl ??
    process.env.COC_BASE_URL ??
    "https://api.clashofclans.com/v1"
  ).replace(/\/$/, "");
  const doFetch = opts.fetchImpl ?? fetch;

  if (!token) throw new Error("CoC client: no API token (set COC_API_TOKEN)");

  async function get<T>(path: string): Promise<T> {
    const res = await doFetch(`${baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    if (!res.ok) {
      let reason: string | undefined;
      try {
        reason = ((await res.json()) as { reason?: string })?.reason;
      } catch {
        /* body was not JSON */
      }
      throw new CocApiError(`CoC API ${res.status} on ${path}`, res.status, reason);
    }
    return (await res.json()) as T;
  }

  return {
    getClan: (tag: string) => get<CocClan>(`/clans/${encodeTag(tag)}`),

    getMembers: async (tag: string): Promise<CocMember[]> =>
      (await get<{ items: CocMember[] }>(`/clans/${encodeTag(tag)}/members`)).items,

    /** Current war, or { state: "private" } when the war log is private (403). */
    getCurrentWar: async (tag: string): Promise<CocCurrentWar> => {
      try {
        return await get<CocCurrentWar>(`/clans/${encodeTag(tag)}/currentwar`);
      } catch (e) {
        if (e instanceof CocApiError && e.status === 403) {
          return { state: "private" };
        }
        throw e;
      }
    },

    getPlayer: (tag: string) => get<CocPlayer>(`/players/${encodeTag(tag)}`),
  };
}

export type CocClient = ReturnType<typeof createCocClient>;
