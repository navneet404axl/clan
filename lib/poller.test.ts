import { describe, it, expect } from "vitest";
import { nextPollDelayMs, buildSnapshots, parseCocDate } from "./poller";
import type { CocClan, CocMember, CocCurrentWar } from "./coc/types";

describe("nextPollDelayMs", () => {
  it("polls most often during an active war", () => {
    expect(nextPollDelayMs("inWar")).toBeLessThan(nextPollDelayMs("preparation"));
    expect(nextPollDelayMs("preparation")).toBeLessThan(nextPollDelayMs("notInWar"));
  });

  it("treats a private war log like the idle cadence", () => {
    expect(nextPollDelayMs("private")).toBe(nextPollDelayMs("notInWar"));
  });
});

describe("parseCocDate", () => {
  it("parses CoC compact timestamps", () => {
    expect(parseCocDate("20260115T120000.000Z")?.toISOString()).toBe(
      "2026-01-15T12:00:00.000Z",
    );
  });

  it("returns null for missing input", () => {
    expect(parseCocDate(undefined)).toBeNull();
  });
});

describe("buildSnapshots", () => {
  const clan: CocClan = {
    tag: "#C",
    name: "Test Clan",
    clanLevel: 10,
    members: 2,
    clanPoints: 30000,
    warWins: 50,
    warWinStreak: 3,
  };
  const members: CocMember[] = [
    { tag: "#P1", name: "A", role: "leader", expLevel: 200, trophies: 5000, donations: 100, donationsReceived: 20, clanRank: 1 },
    { tag: "#P2", name: "B", role: "member", expLevel: 150, trophies: 4000, donations: 10, donationsReceived: 200, clanRank: 2 },
  ];

  it("extracts clan + member fields and maps the war", () => {
    const war: CocCurrentWar = {
      state: "inWar",
      teamSize: 15,
      opponent: { tag: "#O", name: "Foe", stars: 10 },
      clan: { stars: 20, destructionPercentage: 85.5, attacks: 25 },
      endTime: "20260115T120000.000Z",
    };
    const s = buildSnapshots("#C", clan, members, war);
    expect(s.clan.memberCount).toBe(2);
    expect(s.members).toHaveLength(2);
    expect(s.war.state).toBe("inWar");
    expect(s.war.clanStars).toBe(20);
    expect(s.war.endTime?.toISOString()).toBe("2026-01-15T12:00:00.000Z");
  });

  it("nulls the war payload when the log is private", () => {
    const s = buildSnapshots("#C", clan, members, { state: "private" });
    expect(s.war.payload).toBeNull();
    expect(s.war.opponentTag).toBeNull();
  });
});
