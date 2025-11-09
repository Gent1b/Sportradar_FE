// addEventForm.js
import { renderCalendar } from "./calendar.js";

export function renderAddEventForm(app, events, ctx) {
  app.innerHTML = `
    <header class="toolbar">
      <button id="backBtn">&lt; Back</button>
      <strong>Add New Event</strong>
    </header>

    <form id="eventForm" class="form-card">
      <div class="grid-2">
        <label class="field">
          <span>Sport</span>
          <select name="sport" required>
            <option value="" selected>Select sport</option>
            <option>football</option>
            <option>basketball</option>
            <option>tennis</option>
            <option>rugby</option>
            <option>boxing</option>
            <option>ice hockey</option>
            <option>cycling</option>
          </select>
        </label>

        <label class="field">
          <span>Status</span>
          <select name="status" required>
            <option value="scheduled" selected>scheduled</option>
            <option value="played">played</option>
            <option value="cancelled">cancelled</option>
          </select>
        </label>

        <label class="field">
          <span>Date</span>
          <input type="date" name="date" required />
        </label>

        <label class="field">
          <span>Time (UTC)</span>
          <input type="time" name="time" required />
        </label>

        <label class="field full">
          <span>Home Team</span>
          <input type="text" name="homeTeam" required maxlength="80"/>
        </label>

        <label class="field full">
          <span>Away Team</span>
          <input type="text" name="awayTeam" required maxlength="80"/>
        </label>

        <label class="field full">
          <span>Venue</span>
          <input type="text" name="stadium" placeholder="Venue TBA" maxlength="120"/>
        </label>

        <label class="field">
          <span>Stage</span>
          <input type="text" name="stage" placeholder="ROUND OF 16" maxlength="60"/>
        </label>

        <label class="field">
          <span>Season</span>
          <input type="text" name="season" placeholder="2026" maxlength="12"/>
        </label>

        <label class="field full">
          <span>Competition</span>
          <input type="text" name="competition" placeholder="AFC Champions League" maxlength="120"/>
        </label>
      </div>

      <div class="result-box" data-result hidden>
        <h4>Result (only if finished)</h4>
        <div class="grid-2">
          <label class="field">
            <span>Home Goals</span>
            <input type="number" name="homeGoals" min="0" step="1"/>
          </label>
          <label class="field">
            <span>Away Goals</span>
            <input type="number" name="awayGoals" min="0" step="1"/>
          </label>
        </div>
      </div>

      <div class="actions">
        <button type="submit" class="btn-primary">Add Event</button>
      </div>
    </form>
  `;

  // Back button to return to calendar view
  document.getElementById("backBtn").onclick = () =>
    renderCalendar(app, events, ctx.year, ctx.month);

  const form = document.getElementById("eventForm");
  const statusEl = form.elements.status;
  const resultBox = form.querySelector("[data-result]");

  const syncResult = () => {
    const played = statusEl.value === "played";
    resultBox.hidden = !played;
    form.elements.homeGoals.required = played;
    form.elements.awayGoals.required = played;
  };
  statusEl.addEventListener("change", syncResult);
  syncResult();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements;

    // form validation
    if (!f.sport.value || !f.date.value || !f.time.value || !f.homeTeam.value || !f.awayTeam.value) {
      alert("Please fill Sport, Date, Time, Home Team, and Away Team.");
      return;
    }

    const ev = {
      dateVenue: f.date.value,               // YYYY-MM-DD
      timeVenueUTC: f.time.value,            // HH:mm
      sport: f.sport.value,
      homeTeam: { name: f.homeTeam.value.trim() },
      awayTeam: { name: f.awayTeam.value.trim() },
      stadium: (f.stadium.value || "Venue TBA").trim(),
      status: f.status.value,
      stage: f.stage.value ? { name: f.stage.value.trim() } : undefined,
      season: f.season.value.trim() || undefined,
      originCompetitionName: f.competition.value.trim() || undefined,
    };

    // Result only if match is played
    if (f.status.value === "played") {
      const hg = Number(f.homeGoals.value);
      const ag = Number(f.awayGoals.value);
      if (![hg, ag].every(Number.isInteger) || hg < 0 || ag < 0) {
        alert("Enter non-negative whole numbers for goals.");
        return;
      }
      ev.result = {
        homeGoals: hg,
        awayGoals: ag,
        winner: hg > ag ? "home" : hg < ag ? "away" : "draw",
      };
    }

    // Add in-memory and go to that month in calendar view
    events.push(ev);
    const d = new Date(f.date.value + "T00:00:00Z");
    const y = isNaN(d) ? ctx.year : d.getFullYear();
    const m = isNaN(d) ? ctx.month : d.getMonth();
    renderCalendar(app, events, y, m);
  });
}
