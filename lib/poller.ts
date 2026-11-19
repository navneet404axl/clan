import type { CocClan, CocMember, CocCurrentWar, WarState } from "./coc/types";

/** How long to wait before the next poll, by current war state (smart cadence). */
export function nextPollDelayMs(state: WarState): number {
  const MIN = 60_000;
  switch (state) {
    case "inWar":
      return 10 * MIN; // attacks are landing — stay close
    case "preparation":
      return 30 * MIN;
    case "warEnded":
      return 60 * MIN; // grab the final result, then idle
    case "notInWar":
    case "private":
    default:
      return 6 * 60 * MIN; // nothing war-related to track
  }
}

/** Parse CoC's compact timestamps ("20260115T120000.000Z") to a Date, else null. */
export function parseCocDate(s: string | undefined): Date | null {
  if (!s) return null;
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/.exec(s);
  if (!m) {
    const d = new Date(s);
    return Number.isNaN(+d) ? null : d;
  }
  const [, y, mo, d, h, mi, se] = m;
  return new Date(`${y}-${mo}-${d}T${h}:${mi}:${se}Z`);
}

export interface ClanSnapshotInput {
  clanTag: string;
  name: string;
  clanLevel: number;
  memberCount: number;
  clanPoints: number;
  warWins: number;
  warWinStreak: number;
  payload: unknown;
}

export interface WarSnapshotInput {
  clanTag: string;
  state: WarState;
  warKey: string | null;
  teamSize: number | null;
  opponentTag: string | null;
  opponentName: string | null;
  clanStars: number | null;
  opponentStars: number | null;
  clanDestruction: number | null;
  clanAttacks: number | null;
  endTime: Date | null;
  payload: unknown;
}

export interface MemberSnapshotInput {
  clanTag: string;
  playerTag: string;
  name: string;
  role: string;
  expLevel: number;
  trophies: number;
  donations: number;
  donationsReceived: number;
  clanRank: number;
}

export interface Snapshots {
  clan: ClanSnapshotInput;
  war: WarSnapshotInput;
  members: MemberSnapshotInput[];
}

/** Shape API responses into the rows we persist. Pure — easy to test. */
export function buildSnapshots(
  clanTag: string,
  clan: CocClan,
  members: CocMember[],
  war: CocCurrentWar,
): Snapshots {
  return {
    clan: {
      clanTag,
      name: clan.name,
      clanLevel: clan.clanLevel,
      memberCount: clan.members,
      clanPoints: clan.clanPoints,
      warWins: clan.warWins,
      warWinStreak: clan.warWinStreak,
      payload: clan,
    },
    war: {
      clanTag,
      state: war.state,
      warKey: war.preparationStartTime ?? null,
      teamSize: war.teamSize ?? null,
      opponentTag: war.opponent?.tag ?? null,
      opponentName: war.opponent?.name ?? null,
      clanStars: war.clan?.stars ?? null,
      opponentStars: war.opponent?.stars ?? null,
      clanDestruction: war.clan?.destructionPercentage ?? null,
      clanAttacks: war.clan?.attacks ?? null,
      endTime: parseCocDate(war.endTime),
      payload: war.state === "private" ? null : war,
    },
    members: members.map((m) => ({
      clanTag,
      playerTag: m.tag,
      name: m.name,
      role: m.role,
      expLevel: m.expLevel,
      trophies: m.trophies,
      donations: m.donations,
      donationsReceived: m.donationsReceived,
      clanRank: m.clanRank,
    })),
  };
}
