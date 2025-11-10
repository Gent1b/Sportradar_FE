import { describe, it, expect } from "vitest";
import { getDaysInMonth, getMonthLabel } from "../utils.js";

describe("Utility Functions", () => {
  // checking leap year behavior like 2024
  it("getDaysInMonth gives 29 days for February 2024", () => {
    const days = getDaysInMonth(2024, 1); // month index 1 = Feb
    expect(days.length).toBe(29);
  });

  // checking a regular 30-day month
  it("getDaysInMonth gives 30 days for April 2025", () => {
    const days = getDaysInMonth(2025, 3); // month index 3 = Apr
    expect(days.length).toBe(30);
  });

  // checking that month label formatting looks right
  it("getMonthLabel returns readable text with month and year", () => {
    const label = getMonthLabel(2025, 10); // 10 = November
    expect(label).toMatch(/November/i);
    expect(label).toContain("2025");
  });
});
