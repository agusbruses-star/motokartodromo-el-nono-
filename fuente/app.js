// Cuenta regresiva de la próxima fecha y selector día / noche de la vista aérea.
for (const el of document.querySelectorAll('[data-countdown]')) {
  const target = new Date(el.dataset.countdown).getTime();
  const set = (k, v) => { el.querySelector(`[data-u="${k}"]`).textContent = String(v).padStart(2, '0'); };
  const tick = () => {
    const left = target - Date.now();
    if (left <= 0) {
      el.hidden = true;
      clearInterval(timer);
      return;
    }
    set('d', Math.floor(left / 864e5));
    set('h', Math.floor(left / 36e5) % 24);
    set('m', Math.floor(left / 6e4) % 60);
    set('s', Math.floor(left / 1e3) % 60);
  };
  const timer = setInterval(tick, 1000);
  tick();
}

for (const view of document.querySelectorAll('[data-track-view]')) {
  const buttons = view.querySelectorAll('.tv-switch button');
  for (const button of buttons) {
    button.addEventListener('click', () => {
      view.dataset.show = button.dataset.v;
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
    });
  }
}

// Slider de la galería: la foto centrada toma color y se filtra por categoría.
for (const gx of document.querySelectorAll('[data-gx]')) {
  const track = gx.querySelector('.gx-track');
  const slides = [...gx.querySelectorAll('.gx-slide')];
  const chips = [...gx.querySelectorAll('.gx-chip')];
  const count = gx.querySelector('.gx-count');
  const dots = gx.querySelector('.gx-dots');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let shown = slides;
  let active = null;
  let queued = false;
  const pad = (v) => String(v).padStart(2, '0');
  const center = (slide, smooth = true) => track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2, behavior: smooth && !reduce ? 'smooth' : 'auto' });
  const activate = (slide) => {
    if (slide === active) return;
    if (active) active.classList.remove('is-active');
    active = slide;
    slide.classList.add('is-active');
    const i = shown.indexOf(slide);
    count.textContent = pad(i + 1) + ' / ' + pad(shown.length);
    [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
  };
  const detect = () => {
    queued = false;
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = shown[0];
    let dist = Infinity;
    for (const s of shown) {
      const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
      if (d < dist) { dist = d; best = s; }
    }
    if (best) activate(best);
  };
  const paintDots = () => { dots.innerHTML = shown.map(() => '<i></i>').join(''); };
  const refresh = () => {
    paintDots();
    active = null;
    slides.forEach((s) => s.classList.remove('is-active'));
    center(shown[0], false);
    activate(shown[0]);
  };
  track.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(detect); } }, { passive: true });
  addEventListener('resize', () => { if (active) center(active, false); }, { passive: true });
  for (const chip of chips) {
    chip.addEventListener('click', () => {
      for (const c of chips) c.setAttribute('aria-pressed', String(c === chip));
      const f = chip.dataset.gxFilter;
      for (const s of slides) s.hidden = f !== 'todas' && s.dataset.tipo !== f;
      shown = slides.filter((s) => !s.hidden);
      refresh();
    });
  }
  for (const arrow of gx.querySelectorAll('[data-gx-step]')) {
    arrow.addEventListener('click', () => {
      const i = shown.indexOf(active);
      const next = shown[(i + Number(arrow.dataset.gxStep) + shown.length) % shown.length];
      activate(next);
      center(next);
    });
  }
  for (const s of slides) {
    s.addEventListener('click', (e) => {
      if (s !== active) { e.preventDefault(); activate(s); center(s); }
    });
  }
  refresh();
}

// Selector de categorías: elegir una abre su panel.
for (const gr of document.querySelectorAll('[data-gr]')) {
  const tabs = [...gr.querySelectorAll('.gr-tab')];
  const rail = gr.querySelector('.gr-tabs');
  const stage = gr.querySelector('.gr-stage');
  const select = (tab, focus) => {
    if (tab.getAttribute('aria-selected') === 'true') return;
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      gr.querySelector('#' + t.getAttribute('aria-controls')).hidden = !on;
    }
    if (rail.scrollWidth > rail.clientWidth) rail.scrollTo({ left: tab.offsetLeft - (rail.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' });
    if (focus) tab.focus();
  };
  const canHover = matchMedia('(hover: hover)').matches;
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    if (canHover) tab.addEventListener('pointerenter', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
    });
  });
  // Las fotos se cargan apenas se llega a la sección, para cambiar sin demora.
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { io.disconnect(); gr.querySelectorAll('.gr-photo').forEach((p) => { p.loading = 'eager'; }); }
    }, { rootMargin: '400px' });
    io.observe(gr);
  }
  // Profundidad: foto y número se desplazan en sentidos opuestos.
  if (canHover && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      stage.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3));
      stage.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3));
    }, { passive: true });
    stage.addEventListener('pointerleave', () => { stage.style.setProperty('--mx', 0); stage.style.setProperty('--my', 0); });
  }
}
