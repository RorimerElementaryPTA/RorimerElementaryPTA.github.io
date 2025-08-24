async function loadEvents() {
  const root = document.getElementById('events-root');
  try {
    // Detect if we're on Spanish pages
    const isSpanish = window.location.pathname.includes('/es/');
    const dataPath = 'data/events.json';
    
    const res = await fetch(dataPath);
    if (!res.ok) throw new Error('Failed to load events');
    const json = await res.json();
    const events = json.events || [];
    if (!events.length) {
      root.innerHTML = isSpanish ? '<p>No hay eventos próximos aún.</p>' : '<p>No upcoming events yet.</p>';
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
    // Different order for Spanish vs English
    const order = isSpanish ? 
      ['Todo el Año','Agosto','Septiembre','Octubre','Noviembre','Diciembre','Enero','Febrero','Marzo','Abril','Mayo','Junio'] :
      ['All Year','August','September','October','November','December','January','February','March','April','May','June'];

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
            const locale = isSpanish ? 'es-ES' : 'en-US';
            dateText = new Date(ev.date).toLocaleDateString(locale, {year:'numeric',month:'short',day:'numeric'});
          } else if (/^\d{4}-\d{2}$/.test(ev.date)) {
            const [y,m] = ev.date.split('-');
            const d = new Date(y, parseInt(m,10)-1, 1);
            const locale = isSpanish ? 'es-ES' : 'en-US';
            dateText = d.toLocaleDateString(locale, {year:'numeric',month:'long'});
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
    const isSpanish = window.location.pathname.includes('/es/');
    root.innerHTML = isSpanish ? '<p>No se pudieron cargar los eventos.</p>' : '<p>Could not load events.</p>';
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadEvents);
