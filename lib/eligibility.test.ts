import { describe, it, expect } from "vitest";
import { evaluateEligibility } from "./eligibility";

const req = { minTownHall: 13, minTrophies: 3000 };

describe("evaluateEligibility", () => {
  it("passes a qualified player", () => {
    const r = evaluateEligibility({ name: "A", townHallLevel: 15, trophies: 4200 }, req);
    expect(r.eligible).toBe(true);
    expect(r.reasons).toHaveLength(0);
  });

  it("fails and explains a low town hall", () => {
    const r = evaluateEligibility({ name: "B", townHallLevel: 11, trophies: 4200 }, req);
    expect(r.eligible).toBe(false);
    expect(r.reasons[0]).toMatch(/Town Hall/);
  });

  it("lists every unmet requirement", () => {
    const r = evaluateEligibility({ name: "C", townHallLevel: 10, trophies: 1000 }, req);
    expect(r.reasons).toHaveLength(2);
  });
});
