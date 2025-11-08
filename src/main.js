import { loadEvents } from "./data";

const app = document.getElementById("app");

async function renderCalendarPlaceholder() {
  app.innerHTML = `
    <h2>Sports Event Calendar</h2>
    <p>Loading events...</p>
  `;

  try {
    const events = await loadEvents();
    console.log(events);

    app.innerHTML=`
    <h2>Sports Event Calendar</h2>
    <ul>
        ${events.map(e=>`
            <li>
             ${e.dateVenue} - ${e.sport}: ${e.homeTeam?.name ?? "TBD"} vs ${e.awayTeam?.name ?? "TBD"}
            </li>
            `).join("")}
    </ul>
    `;
  } catch (err)
  {
    console.error("Error loading events:",err);
    app.innerHTML = `<p style="color:red;">Failed to load events. </p>`
  }
}

function renderAddEventPlaceholder() {
  app.innerHTML = `
    <h2>Add New Event</h2>
    <p>Form will go here.</p>
  `;
}

document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.view === "calendar") renderCalendarPlaceholder();
    if (btn.dataset.view === "add") renderAddEventPlaceholder();
  });
});

renderCalendarPlaceholder();
