import { renderCalendar } from "./calendar.js";
import { sportColors, DEFAULT_COLOR } from "../constants.js";

function renderSingleEvent(app, event, events, fromDate) {
  const color = sportColors[event.sport?.toLowerCase()] || DEFAULT_COLOR;
  const sport = event.sport || "Sport";
  const home = event.homeTeam?.name || "TBD";
  const away = event.awayTeam?.name || "TBD";
  const dateLabel = new Date(event.dateVenue).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  app.innerHTML = `
    <header class="toolbar">
      <button id="backBtn">&lt; Back</button>
      <strong>${sport}</strong>
    </header>

    <div class="event-details-page single">
      <div class="event-card" style="border-left:5px solid ${color}">
        <div class="sport-badge" style="background:${color}">${sport}</div>
        <h2>${home} vs ${away}</h2>
        <div class="event-meta">
          <p><strong>Date:</strong> ${dateLabel}</p>
          <p><strong>Time:</strong> ${event.timeVenueUTC || "TBA"}</p>
          <p><strong>Venue:</strong> ${event.stadium || "Venue TBA"}</p>
          <p><strong>Status:</strong> ${event.status || "N/A"}</p>
          <p><strong>Stage:</strong> ${event.stage?.name || "Unknown"}</p>
          ${
            event.result 
              ? `<p><strong>Result:</strong> ${event.result.homeGoals ?? 0} - ${event.result.awayGoals ?? 0} (${event.result.winner || "No winner"})</p>` 
              : ""
          }
          <p><strong>Season:</strong> ${event.season || "Unknown"}</p>
          ${
            event.originCompetitionName 
              ? `<p><strong>Competition:</strong> ${event.originCompetitionName}</p>` 
              : ""
          }
        </div>
      </div>
    </div>
  `;
  window.scrollTo(0, 0);

  // Back button returns to either the list view for that date or the full calendar 
  document.getElementById("backBtn").addEventListener("click", () => {
    if (fromDate) {
      // Return to the list of events for that date
      renderEventDetails(app, events, fromDate);
    } else {
      // Return to the calendar month of this event
      const d = new Date(event.dateVenue);
      renderCalendar(app, events, d.getFullYear(), d.getMonth());
    }
  });
}

export function renderEventDetails(app, events, date) {
  const dayEvents = events.filter((e) => e.dateVenue === date);

  // If only one event on this date, show single-event page directly
  if (dayEvents.length === 1) {
    renderSingleEvent(app, dayEvents[0], events);
    return;
  }

  // If more than one event, show list of events for the date
  const dayLabel = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  app.innerHTML = `
    <header class="toolbar">
      <button id="backToCalendar">Back</button>
      <strong>Events on ${dayLabel}</strong>
    </header>

    <div class="event-details-page list">
      ${
        dayEvents.length
          ? dayEvents
              .map((ev, idx) => {
                const color = sportColors[ev.sport?.toLowerCase()] || DEFAULT_COLOR;
                const sport = ev.sport || "Sport";
                const home = ev.homeTeam?.name || "TBD";
                const away = ev.awayTeam?.name || "TBD";
                const time = ev.timeVenueUTC || "TBA";
                const venue = ev.stadium || "Venue TBA";
                const stage = ev.stage?.name || "—";
                return `
                  <div class="event-card clickable" data-idx="${idx}" style="border-left:5px solid ${color}">
                    <div class="sport-badge" style="background:${color}">${sport}</div>
                    <h2>${home} vs ${away}</h2>
                    <div class="event-meta">
                      <p><strong>Time:</strong> ${time}</p>
                      <p><strong>Venue:</strong> ${venue}</p>
                      <p><strong>Stage:</strong> ${stage}</p>
                    </div>
                    <button class="secondary view-btn" data-idx="${idx}">View details</button>
                  </div>
                `;
              })
              .join("")
          : "<p>No events on this date.</p>"
      }
    </div>
  `;
  window.scrollTo(0, 0);

  // Back button returns to the calendar month view
  document.getElementById("backToCalendar").addEventListener("click", () => {
    const d = new Date(date);
    renderCalendar(app, events, d.getFullYear(), d.getMonth());
  });

  // Helper to open the single-event view from a list item
  const openDetail = (idx) => renderSingleEvent(app, dayEvents[idx], events, date);

  app.querySelectorAll(".event-card.clickable").forEach((card) => {
    const idx = Number(card.dataset.idx);
    card.addEventListener("click", () => openDetail(idx));
  });

  app.querySelectorAll(".view-btn").forEach((btn) => {
    const idx = Number(btn.dataset.idx);
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openDetail(idx);
    });
  });
}
