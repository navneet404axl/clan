// Edit these to match your clan. (Later these could move to env or the DB.)

export interface JoinRequirements {
  minTownHall: number;
  minTrophies: number;
}

export interface ClanConfig {
  name: string;
  tagline: string;
  /** Join requirements used by the "Do I qualify?" check. */
  requirements: JoinRequirements;
}

export const clanConfig: ClanConfig = {
  name: "Your Clan",
  tagline: "War-hardened. Always recruiting.",
  requirements: {
    minTownHall: 13,
    minTrophies: 3000,
  },
};
