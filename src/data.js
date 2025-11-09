export async function loadEvents() {
  const saved = localStorage.getItem("events");
  if (saved) return JSON.parse(saved);

  const res = await fetch("./events.json");
  const data = await res.json();

  localStorage.setItem("events", JSON.stringify(data));
  return data;
}
