import { renderAddEventForm } from "./addEventForm.js";
import { renderCalendar } from "./calendar.js";
import { loadEvents } from "./data.js";

const app = document.getElementById("app");
let events = []; // shared in-memory event list


async function renderCalendarPlaceholder() {
  app.innerHTML = `
    <h2>Sports Event Calendar</h2>
    <p>Loading events...</p>
  `;
  try {
    if (events.length === 0) {
      events = await loadEvents(); // only load once
    }
    const now = new Date();
    renderCalendar(app, events, now.getFullYear(), now.getMonth());
  } catch (err) {
    console.error("Error loading events:", err);
    app.innerHTML = `<p style="color:red;">Failed to load events.</p>`;
  }
}


// Handle navigation button clicks to switch views
document.querySelectorAll("nav button").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.view === "calendar") {
      renderCalendarPlaceholder();
    }
    // open add event form
    if (btn.dataset.view === "add") {
      const now = new Date();
      renderAddEventForm(app, events, { year: now.getFullYear(), month: now.getMonth() });
    }
  });
});

// Initial load of the calendar view
renderCalendarPlaceholder();
