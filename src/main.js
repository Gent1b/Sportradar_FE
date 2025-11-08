const app = document.getElementById("app");

function renderCalendarPlaceholder() {
  app.innerHTML = `
    <h2>Sports Event Calendar</h2>
    <p>This is where the calendar will be displayed.</p>
  `;
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
