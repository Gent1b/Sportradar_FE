import { getDaysInMonth, getMonthLabel } from "./utils.js";

const sportColors = {
  football: "#22c55e",
  basketball: "#f97316",
  tennis: "#facc15",
  rugby: "#a855f7",
  boxing: "#ef4444",
  "ice hockey": "#3b82f6",
  cycling: "#ec4899",
};

export function renderCalendar(app, events, year, month) {
  // get all days to render in month
  const days = getDaysInMonth(year, month);

  // render toolbar with month tile and navigation
  app.innerHTML = `
    <div class="toolbar">
      <button id="prevMonth">&lt;</button>
      <strong>${getMonthLabel(year, month)}</strong>
      <button id="nextMonth">&gt;</button>
    </div>
        <div class="weekday-row"></div>

    <div class="calendar"></div>
    <div class = "legend"></div>
  `;

  const grid = app.querySelector(".calendar");

  const weekdayRow = app.querySelector(".weekday-row");

  // weekday labels
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  weekdayRow.innerHTML = weekDays
    .map((d) => `<div class="weekday">${d}</div>`)
    .join("");

  // calculate offset for first day (so Monday = 0, Sunday = 6)
  const firstDayIndex = (days[0].getDay() + 6) % 7;

  // add empty placeholder cells before the first day
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
    if (dayEvents.length) {
      div.classList.add("has-event");
      // group events by sport and count how many per sport
      const groupedBySport = {};
      dayEvents.forEach((ev) => {
        const sport = ev.sport?.toLowerCase() || "football";
        groupedBySport[sport] = (groupedBySport[sport] || 0) + 1;
      });
      // sport color for specific day
      const raw =
        dayEvents.find((ev) => typeof ev.sport === "string")?.sport ||
        "football";
      const color = sportColors[raw.toLowerCase()] || "#2563eb";
      // prepare tooltip text for all events on this date
      const tooltipText = dayEvents
        .map(
          (ev) =>
            `${ev.homeTeam?.name || "TBD"} vs ${ev.awayTeam?.name || "TBD"} (${
              ev.status
            })`
        )
        .join("\n");

      div.dataset.tooltip = tooltipText;

 const dots = Object.entries(groupedBySport)
        .map(([sport, count]) => {
          const color = sportColors[sport] || "#2563eb";
          return `<div class="dot" style="background:${color}" title="${sport}">${count}</div>`;
        })
        .join("");

      div.innerHTML = `
        <div class="date">${d.getDate()}</div>
        <div class="dot-group">${dots}</div>
      `;
    } else {
      div.innerHTML = `<div class="date">${d.getDate()}</div>`;
    }

    grid.appendChild(div);
  
  }
// tooltip behavior
grid.querySelectorAll(".day.has-event").forEach((dayEl) => {
  dayEl.addEventListener("mouseenter", (e) => {
    const tip = document.createElement("div");
    tip.className = "tooltip";
    tip.textContent = dayEl.dataset.tooltip;
    document.body.appendChild(tip);

    //follow mouse movement
    const moveTooltip = (ev) => {
      tip.style.left = ev.pageX + 12 + "px";
      tip.style.top = ev.pageY + 12 + "px";
    };

    moveTooltip(e);
    dayEl.addEventListener("mousemove", moveTooltip);


    //remove tooltip on mouse leave.
    dayEl.addEventListener(
      "mouseleave",
      () => {
        tip.remove();
        dayEl.removeEventListener("mousemove", moveTooltip);
      },
      { once: true }
    );
  });
});

  const legend = app.querySelector(".legend");

  legend.innerHTML = `
   <h4>Sport Legend</h4>
  <div class="legend-items">
    ${Object.entries(sportColors)
      .map(
        ([sport, color]) =>
          `<div class="legend-item">
             <span class="legend-dot" style="background:${color}"></span>
             <span class="legend-label">${sport}</span>
           </div>`
      )
      .join("")}
  </div>
  `;
  //navigate to previous month
  document.getElementById("prevMonth").addEventListener("click", () => {
    const prev = new Date(year, month - 1);
    renderCalendar(app, events, prev.getFullYear(), prev.getMonth());
  });
  // navigate to next month
  document.getElementById("nextMonth").addEventListener("click", () => {
    const next = new Date(year, month + 1);
    renderCalendar(app, events, next.getFullYear(), next.getMonth());
  });
}
