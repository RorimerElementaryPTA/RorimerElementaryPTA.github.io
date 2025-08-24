async function loadEvents() {
  const root = document.getElementById('events-root');
  try {
    const res = await fetch('data/events.json');
    if (!res.ok) throw new Error('Failed to load events');
    const json = await res.json();
    const events = json.events || [];
    if (!events.length) {
      root.innerHTML = '<p>No upcoming events yet.</p>';
      return;
    }

    const ul = document.createElement('ul');
    ul.className = 'events-list';
    events.forEach(ev => {
      const li = document.createElement('li');
      const date = ev.date ? new Date(ev.date).toLocaleDateString(undefined, {year:'numeric',month:'short',day:'numeric'}) : '';
      const title = document.createElement('strong');
      title.textContent = ev.title;
      li.appendChild(title);
      li.insertAdjacentText('beforeend', ` — ${date}`);
      if (ev.location) li.insertAdjacentHTML('beforeend', ` <span class="muted">@ ${ev.location}</span>`);
      if (ev.description) li.insertAdjacentHTML('beforeend', `<div class="event-desc">${ev.description}</div>`);
      ul.appendChild(li);
    });
    root.innerHTML = '';
    root.appendChild(ul);
  } catch (err) {
    root.innerHTML = '<p>Could not load events.</p>';
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadEvents);
