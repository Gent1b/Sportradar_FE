import { getDaysInMonth, getMonthLabel } from "./utils.js";
import { renderEventDetails } from "./eventDetails.js";
import { sportColors, DEFAULT_COLOR } from "./constants.js";
import { attachTooltips } from "./tooltip.js";

export function renderCalendar(app, events, year, month) {
  // get all days in the month
  const days = getDaysInMonth(year, month);

  // render toolbar with month name and navigation buttons
  app.innerHTML = `
<div class="calendar-header">
  <div class="month-nav">
    <button id="prevMonth">&lt;</button>
    <h2 class="month-label">${getMonthLabel(year, month)}</h2>
    <button id="nextMonth">&gt;</button>
  </div>
  <div class="filters">
    <select class="filter-dropdown">
      <option value="">All Sports</option>
      <!-- add more dynamically if needed -->
    </select>
  </div>
</div>

    <div class="weekday-row"></div>
    <div class="calendar"></div>
    <div class="legend"></div>
  `;
  window.scrollTo(0, 0);

  const grid = app.querySelector(".calendar");
  const weekdayRow = app.querySelector(".weekday-row");

  // populate weekday name headers
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  weekdayRow.innerHTML = weekDays
    .map((d) => `<div class="weekday">${d}</div>`)
    .join("");

  // calculate offset for first day of the month
  const firstDayIndex = (days[0].getDay() + 6) % 7;

  // add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayIndex; i++) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    grid.appendChild(empty);
  }

  // fill in day cells
  for (const d of days) {
    const dateStr = d.toLocaleDateString("en-CA");
    const dayEvents = events.filter((e) => e.dateVenue === dateStr);

    const cell = document.createElement("div");
    cell.className = "day";
    if (dayEvents.length) {
      cell.classList.add("has-event");
      // group events by sport to display multiple dots
      const groupedBySport = {};
      dayEvents.forEach((ev) => {
        const sport = ev.sport?.toLowerCase() || "football";
        groupedBySport[sport] = (groupedBySport[sport] || 0) + 1;
      });
      // determine color for this day
      const rawSport = dayEvents.find((ev) => typeof ev.sport === "string")?.sport || "football";
      const color = sportColors[rawSport.toLowerCase()] || DEFAULT_COLOR;
      // prepare tooltip text listing all events on this date
      const tooltipText = dayEvents
        .map(ev => `${ev.homeTeam?.name || "TBD"} vs ${ev.awayTeam?.name || "TBD"} (${ev.status})`)
        .join("\n");
      cell.dataset.tooltip = tooltipText;
      // create dot indicators for each sport (with count)
      const dotsHtml = Object.entries(groupedBySport)
        .map(([sport, count]) => {
          const dotColor = sportColors[sport] || DEFAULT_COLOR;
          return `<div class="dot" style="background:${dotColor}" title="${sport}">${count}</div>`;
        })
        .join("");
      cell.innerHTML = `
        <div class="date">${d.getDate()}</div>
        <div class="dot-group">${dotsHtml}</div>
      `;
    } else {
      // no events on this day
      cell.innerHTML = `<div class="date">${d.getDate()}</div>`;
    }

    grid.appendChild(cell);
    // Clicking a day with events opens the event details view for that date
    cell.addEventListener("click", () => {
      if (!dayEvents.length) return;
      renderEventDetails(app, events, dateStr);
    });
  }

  // Initialize tooltips on hover for days with events
  attachTooltips(grid);

  // render legend for sport colors
  const legend = app.querySelector(".legend");
  legend.innerHTML = `
    <h4>Sport Legend</h4>
    <div class="legend-items">
      ${Object.entries(sportColors)
        .map(([sport, color]) => 
           `<div class="legend-item">
              <span class="legend-dot" style="background:${color}"></span>
              <span class="legend-label">${sport}</span>
            </div>`)
        .join("")}
    </div>
  `;

  // month navigation buttons
  document.getElementById("prevMonth").addEventListener("click", () => {
    const prev = new Date(year, month - 1);
    renderCalendar(app, events, prev.getFullYear(), prev.getMonth());
  });
  document.getElementById("nextMonth").addEventListener("click", () => {
    const next = new Date(year, month + 1);
    renderCalendar(app, events, next.getFullYear(), next.getMonth());
  });
}
