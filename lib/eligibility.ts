import type { JoinRequirements } from "./clan-config";

export interface PlayerForEligibility {
  name: string;
  townHallLevel: number;
  trophies: number;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

/** Pure: compare a player against the clan's join requirements. */
export function evaluateEligibility(
  player: PlayerForEligibility,
  req: JoinRequirements,
): EligibilityResult {
  const reasons: string[] = [];
  if (player.townHallLevel < req.minTownHall) {
    reasons.push(
      `Town Hall ${req.minTownHall}+ required — you're TH${player.townHallLevel}.`,
    );
  }
  if (player.trophies < req.minTrophies) {
    reasons.push(
      `${req.minTrophies.toLocaleString()}+ trophies required — you have ${player.trophies.toLocaleString()}.`,
    );
  }
  return { eligible: reasons.length === 0, reasons };
}
