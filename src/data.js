export async function loadEvents(){
    const res = await fetch("/events.json");
    const json = await res.json();
    return json.data;
}