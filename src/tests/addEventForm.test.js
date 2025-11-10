import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderAddEventForm } from "../modules/addEventForm.js";

// small helper to set up a blank DOM before each test
function setupDom() {
  document.body.innerHTML = `<div id="app"></div>`;
  if (!window.scrollTo) window.scrollTo = vi.fn(); 
  return document.getElementById("app");
}

describe("Add Event Form", () => {
  beforeEach(() => {
    // starting each test with a clean
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("creates a scheduled event and stores it", () => {
    const app = setupDom();
    const ctx = { year: 2025, month: 10 };
    renderAddEventForm(app, [], ctx);

    const form = app.querySelector("#eventForm");

    // fill required fields
    form.elements.sport.value = "football";
    form.elements.status.value = "scheduled";
    form.elements.date.value = "2025-11-07";
    form.elements.time.value = "09:05";
    form.elements.homeTeam.value = "Alpha";
    form.elements.awayTeam.value = "Beta";

    // simulate form submit
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    // should appear in localStorage
    const stored = JSON.parse(localStorage.getItem("events"));
    expect(stored).toHaveLength(1);
    expect(stored[0].sport).toBe("football");
    expect(stored[0].homeTeam.name).toBe("Alpha");
  });

  it("creates a played event with goals and winner", () => {
    const app = setupDom();
    const ctx = { year: 2025, month: 10 };
    renderAddEventForm(app, [], ctx);

    const form = app.querySelector("#eventForm");

    // fill base info
    form.elements.sport.value = "basketball";
    form.elements.status.value = "played";
    form.elements.date.value = "2025-11-08";
    form.elements.time.value = "12:00";
    form.elements.homeTeam.value = "HomeFC";
    form.elements.awayTeam.value = "AwayFC";

    // fill result fields
    form.elements.homeGoals.value = "3";
    form.elements.awayGoals.value = "1";

    // submit
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    // check stored result
    const stored = JSON.parse(localStorage.getItem("events"));
    const ev = stored[0];
    expect(ev.result.homeGoals).toBe(3);
    expect(ev.result.awayGoals).toBe(1);
    expect(ev.result.winner).toBe("home");
  });
});
