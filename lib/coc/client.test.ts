import { describe, it, expect, vi } from "vitest";
import { createCocClient, encodeTag, CocApiError } from "./client";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("encodeTag", () => {
  it("encodes the # and adds it when missing", () => {
    expect(encodeTag("#ABC")).toBe("%23ABC");
    expect(encodeTag("abc")).toBe("%23ABC");
  });
});

describe("createCocClient", () => {
  it("sends a bearer token to the encoded clan path", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({ tag: "#C", name: "X", clanLevel: 1, members: 0, clanPoints: 0, warWins: 0, warWinStreak: 0 }),
    );
    const coc = createCocClient({
      token: "TKN",
      baseUrl: "https://api.example/v1",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    await coc.getClan("#C");

    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.example/v1/clans/%23C");
    expect(init.headers).toMatchObject({ Authorization: "Bearer TKN" });
  });

  it("maps a private war log (403) to state 'private' instead of throwing", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ reason: "accessDenied" }, 403));
    const coc = createCocClient({ token: "T", fetchImpl: fetchImpl as unknown as typeof fetch });
    const war = await coc.getCurrentWar("#C");
    expect(war.state).toBe("private");
  });

  it("throws CocApiError on other failures", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ reason: "notFound" }, 404));
    const coc = createCocClient({ token: "T", fetchImpl: fetchImpl as unknown as typeof fetch });
    await expect(coc.getClan("#C")).rejects.toBeInstanceOf(CocApiError);
  });
});
