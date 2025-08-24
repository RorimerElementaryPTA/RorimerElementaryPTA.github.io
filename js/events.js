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

    // Group events by the 'group' field (month or All Year)
    const groups = events.reduce((acc, ev) => {
      const key = ev.group || 'Other';
      acc[key] = acc[key] || [];
      acc[key].push(ev);
      return acc;
    }, {});

    root.innerHTML = '';
    const order = ['All Year','August','September','October','November','December','January','February','March','April','May','June'];

    order.forEach(groupName => {
      const items = groups[groupName];
      if (!items) return;
      const h = document.createElement('h3');
      h.textContent = groupName;
      root.appendChild(h);

      const ul = document.createElement('ul');
      ul.className = 'events-list';
      items.forEach(ev => {
        const li = document.createElement('li');
        const title = document.createElement('strong');
        title.textContent = ev.title;
        li.appendChild(title);

        // display date if available
        if (ev.date) {
          let dateText = ev.date;
          // friendly formatting for ISO-like dates
          if (/^\d{4}-\d{2}-\d{2}$/.test(ev.date)) {
            dateText = new Date(ev.date).toLocaleDateString(undefined, {year:'numeric',month:'short',day:'numeric'});
          } else if (/^\d{4}-\d{2}$/.test(ev.date)) {
            const [y,m] = ev.date.split('-');
            const d = new Date(y, parseInt(m,10)-1, 1);
            dateText = d.toLocaleDateString(undefined, {year:'numeric',month:'long'});
          }
          li.insertAdjacentText('beforeend', ` — ${dateText}`);
        }

        if (ev.location) li.insertAdjacentHTML('beforeend', ` <span class="muted">@ ${ev.location}</span>`);
        if (ev.description) li.insertAdjacentHTML('beforeend', `<div class="event-desc">${ev.description}</div>`);
        ul.appendChild(li);
      });
      root.appendChild(ul);
    });

  } catch (err) {
    root.innerHTML = '<p>Could not load events.</p>';
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadEvents);
