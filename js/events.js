async function loadEvents() {
  const root = document.getElementById('events-root');
  try {
    // Detect language from path
    const isSpanish = window.location.pathname.includes('/es/');
    const isChinese = window.location.pathname.includes('/zh/');
    const dataPath = 'data/events.json';
    
    const res = await fetch(dataPath);
    if (!res.ok) throw new Error('Failed to load events');
    const json = await res.json();
    const events = json.events || [];
    if (!events.length) {
      let message = '<p>No upcoming events yet.</p>';
      if (isSpanish) message = '<p>No hay eventos próximos aún.</p>';
      if (isChinese) message = '<p>暂无即将举行的活动。</p>';
      root.innerHTML = message;
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
    // Different order for each language
    let order = ['All Year','August','September','October','November','December','January','February','March','April','May','June'];
    if (isSpanish) {
      order = ['Todo el Año','Agosto','Septiembre','Octubre','Noviembre','Diciembre','Enero','Febrero','Marzo','Abril','Mayo','Junio'];
    } else if (isChinese) {
      order = ['全年','八月','九月','十月','十一月','十二月','一月','二月','三月','四月','五月','六月'];
    }

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
            let locale = 'en-US';
            if (isSpanish) locale = 'es-ES';
            if (isChinese) locale = 'zh-CN';
            dateText = new Date(ev.date).toLocaleDateString(locale, {year:'numeric',month:'short',day:'numeric'});
          } else if (/^\d{4}-\d{2}$/.test(ev.date)) {
            const [y,m] = ev.date.split('-');
            const d = new Date(y, parseInt(m,10)-1, 1);
            let locale = 'en-US';
            if (isSpanish) locale = 'es-ES';
            if (isChinese) locale = 'zh-CN';
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
    const isChinese = window.location.pathname.includes('/zh/');
    let message = '<p>Could not load events.</p>';
    if (isSpanish) message = '<p>No se pudieron cargar los eventos.</p>';
    if (isChinese) message = '<p>无法加载活动。</p>';
    root.innerHTML = message;
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadEvents);
