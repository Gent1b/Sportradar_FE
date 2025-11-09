import { renderCalendar } from "./calendar.js";
import { loadEvents } from "./data.js";

const app = document.getElementById("app");


async function renderCalendarPlaceholder() {
  app.innerHTML = `
    <h2>Sports Event Calendar</h2>
    <p>Loading events...</p>
  `;
  try {
    const events = await loadEvents();
    const now = new Date();
    renderCalendar(app, events, now.getFullYear(), now.getMonth());
  } catch (err) {
    console.error("Error loading events:", err);
    app.innerHTML = `<p style="color:red;">Failed to load events.</p>`;
  }
}

function renderAddEventPlaceholder() {
  app.innerHTML = `
    <h2>Add New Event</h2>
    <p>Form will go here.</p>
  `;
}

// Handle navigation button clicks to switch views
document.querySelectorAll("nav button").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.view === "calendar") {
      renderCalendarPlaceholder();
    }
    if (btn.dataset.view === "add") {
      renderAddEventPlaceholder();
    }
  });
});

// Initial load of the calendar view
renderCalendarPlaceholder();
