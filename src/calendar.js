import { getDaysInMonth, getMonthLabel } from "./utils.js";

export function renderCalendar(app, events, year, month) {
  const days = getDaysInMonth(year, month);

  app.innerHTML = `
    <div class="toolbar">
      <button id="prevMonth">&lt;</button>
      <strong>${getMonthLabel(year, month)}</strong>
      <button id="nextMonth">&gt;</button>
    </div>
        <div class="weekday-row"></div>

    <div class="calendar"></div>
  `;

  const grid = app.querySelector(".calendar");

  const weekdayRow = app.querySelector(".weekday-row");

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  weekdayRow.innerHTML = weekDays
    .map((d) => `<div class="weekday">${d}</div>`)
    .join("");

  const firstDayIndex = (days[0].getDay() + 6) % 7; 


  for (let i = 0; i < firstDayIndex; i++) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    grid.appendChild(empty);
  }
  for (const d of days) {
    const dateStr = d.toLocaleDateString("en-CA");
    const dayEvents = events.filter((e) => e.dateVenue === dateStr);

    const div = document.createElement("div");
    div.className = "day";
    if (dayEvents.length) div.classList.add("has-event");

    div.innerHTML = `
      <div class="date">${d.getDate()}</div>
      ${dayEvents.length ? "<div class='dot'></div>" : ""}
    `;

    grid.appendChild(div);
  }
  document.getElementById("prevMonth").addEventListener("click", () => {
    const prev = new Date(year, month - 1);
    renderCalendar(app, events, prev.getFullYear(), prev.getMonth());
  });

  document.getElementById("nextMonth").addEventListener("click", () => {
    const next = new Date(year, month + 1);
    renderCalendar(app, events, next.getFullYear(), next.getMonth());
  });
}
