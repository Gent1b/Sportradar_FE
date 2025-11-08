import { getDaysInMonth, getMonthLabel } from "./utils.js";

export function renderCalendar(app, events, year, month) {
  const days = getDaysInMonth(year, month);

  app.innerHTML = `
    <div class="toolbar">
      <button id="prevMonth">&lt;</button>
      <strong>${getMonthLabel(year, month)}</strong>
      <button id="nextMonth">&gt;</button>
    </div>
    <div class="calendar"></div>
  `;

  const grid = app.querySelector(".calendar");

  for (const d of days) {
    const dateStr = d.toLocaleDateString("en-CA");
    const dayEvents = events.filter(e => e.dateVenue === dateStr);

    const div = document.createElement("div");
    div.className = "day";
    if (dayEvents.length) div.classList.add("has-event");

    div.innerHTML = `
      <div class="date">${d.getDate()}</div>
      ${dayEvents.length ? "<div class='dot'></div>" : ""}
    `;

    grid.appendChild(div);
  }
}
