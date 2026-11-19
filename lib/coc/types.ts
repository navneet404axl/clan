// Minimal shapes for the Clash of Clans API fields we actually use.

export interface CocClan {
  tag: string;
  name: string;
  clanLevel: number;
  members: number;
  clanPoints: number;
  warWins: number;
  warWinStreak: number;
  memberList?: CocMember[];
}

export interface CocMember {
  tag: string;
  name: string;
  role: string;
  expLevel: number;
  trophies: number;
  donations: number;
  donationsReceived: number;
  clanRank: number;
}

export type WarState =
  | "notInWar"
  | "preparation"
  | "inWar"
  | "warEnded"
  | "private";

export interface CocWarClan {
  tag?: string;
  name?: string;
  stars?: number;
  destructionPercentage?: number;
  attacks?: number;
}

export interface CocCurrentWar {
  state: WarState;
  teamSize?: number;
  preparationStartTime?: string;
  endTime?: string;
  clan?: CocWarClan;
  opponent?: CocWarClan;
}
