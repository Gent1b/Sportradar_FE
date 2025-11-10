import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderCalendar } from "../modules/calendar.js";

// small helper to set up a blank DOM before each test
function setupDom() {
  document.body.innerHTML = `<div id="app"></div>`;
  if (!window.scrollTo) window.scrollTo = vi.fn();
  return document.getElementById("app");
}

describe("Calendar Rendering", () => {
  beforeEach(() => {
    // starting each test with a clean
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("shows the month name and weekday labels", () => {
    const app = setupDom();
    renderCalendar(app, [], 2025, 10); // November 2025

    // check if month the month and weekdays appear
    const month = app.querySelector(".month-label")?.textContent;
    expect(month).toContain("November");
    expect(app.querySelectorAll(".weekday").length).toBe(7);
  });

  it("marks days that have events", () => {
    const app = setupDom();
    const events = [
      { dateVenue: "2025-11-03", sport: "football", status: "played" },
    ];

    renderCalendar(app, events, 2025, 10);

    // the date should be highlighted with ".has-event"
    expect(app.querySelector(".has-event")).not.toBeNull();
  });

  it("filters events by selected sport", () => {
    const app = setupDom();
    const date = "2025-11-05";
    const events = [
      { dateVenue: date, sport: "football", status: "scheduled" },
      { dateVenue: date, sport: "basketball", status: "scheduled" },
    ];

    renderCalendar(app, events, 2025, 10);

    // both events visible first
    expect(app.querySelectorAll(".dot").length).toBe(2);

    // simulate filtering by football
    const select = app.querySelector(".filter-dropdown");
    select.value = "football";
    select.dispatchEvent(new Event("change"));

    // only football events stay visible
    expect(app.querySelectorAll(".dot").length).toBe(1);
  });
});
