import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadEvents } from "../data.js";

describe("Data Loading", () => {
  beforeEach(() => {
    // clear previous data and mocks before each test
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("loads events from localStorage if they already exist", async () => {
    // pretend there is already one saved event
    const storedEvents = [{ sport: "football", dateVenue: "2025-11-03" }];
    localStorage.setItem("events", JSON.stringify(storedEvents));

    const result = await loadEvents();

    // should read the same event back
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].sport).toBe("football");
  });

  it("fetches events from events.json when localStorage is empty", async () => {
    // mock fetch() to return some fake data instead of loading a real file
    const fakeEvents = [{ sport: "basketball", dateVenue: "2025-11-04" }];
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(fakeEvents),
    });

    const result = await loadEvents();

    // should use fetched data and also store it locally
    expect(result).toEqual(fakeEvents);
    const stored = JSON.parse(localStorage.getItem("events"));
    expect(stored).toEqual(fakeEvents);
  });
});
