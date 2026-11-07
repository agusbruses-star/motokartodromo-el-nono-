// Une el hero grande con el contenido claro tipo app, a partir de la copia publicada del 3/11.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, 'original-3-11');
const OUT = path.resolve(process.argv[2] || path.join(__dirname, '../el-nono-sitio'));
const IMG = path.join(__dirname, 'imagenes');
const LOGO = path.join(IMG, 'logo-original.png');
const INK = [5, 11, 44];
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smooth = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };

// Hero: se quitan logo, navegación y botones incrustados en la referencia.
async function desktopHero() {
  const { data, info } = await sharp(path.join(IMG, 'hero-referencia-desktop.png')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels;
  const at = (x, y, c) => data[(y * W + x) * C + c];
  const set = (x, y, c, v) => { data[(y * W + x) * C + c] = v; };
  const boundary = (x) => (x < 560 ? 118 : 92);
  const sample = [];
  for (let x = 0; x < W; x++) {
    const px = [0, 0, 0]; let n = 0;
    for (let dx = -60; dx <= 60; dx += 3) {
      const sx = Math.max(0, Math.min(W - 1, x + dx));
      for (let c = 0; c < 3; c++) px[c] += at(sx, boundary(x), c);
      n++;
    }
    sample.push(px.map((v) => v / n));
  }
  for (let x = 0; x < W; x++) {
    const b = boundary(x);
    for (let y = 0; y < b; y++) {
      const k = 1 - smooth(b - 12, b, y);
      for (let c = 0; c < 3; c++) set(x, y, c, at(x, y, c) * (1 - k) + sample[x][c] * k);
    }
  }
  const avgRow = (y, x0, x1, c) => { let s = 0; for (let x = x0; x < x1; x++) s += at(x, y, c); return s / (x1 - x0); };
  const X0 = 240, X1 = 1440;
  for (let y = 790; y < 906; y++) {
    const L = [0, 1, 2].map((c) => avgRow(y, 210, 238, c));
    const R = [0, 1, 2].map((c) => avgRow(y, 1442, 1470, c));
    const ky = smooth(790, 816, y) * (1 - smooth(895, 905, y));
    for (let x = X0; x < X1; x++) {
      const t = (x - X0) / (X1 - X0);
      const kx = smooth(X0, X0 + 90, x) * (1 - smooth(X1 - 90, X1, x));
      const k = ky * kx;
      for (let c = 0; c < 3; c++) set(x, y, c, at(x, y, c) * (1 - k) + (L[c] * (1 - t) + R[c] * t) * k);
    }
  }
  const FINAL = 905;
  for (let y = 815; y < FINAL; y++) {
    const k = smooth(815, FINAL - 2, y);
    for (let x = 0; x < W; x++) for (let c = 0; c < 3; c++) set(x, y, c, at(x, y, c) * (1 - k) + INK[c] * k);
  }
  const base = await sharp(data, { raw: { width: W, height: H, channels: C } }).extract({ left: 0, top: 0, width: W, height: FINAL }).png().toBuffer();
  for (const w of [800, 1200, 1672]) await sharp(base).resize({ width: w }).webp({ quality: 78 }).toFile(path.join(OUT, 'img/hero-desktop-' + w + '.webp'));
}
async function mobileHero() {
  const TOP = 130, BOTTOM = 1225;
  const { data, info } = await sharp(path.join(IMG, 'hero-referencia-mobile.png')).removeAlpha().extract({ left: 0, top: TOP, width: 1024, height: BOTTOM - TOP }).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels;
  for (let y = 0; y < H; y++) {
    const k = Math.max(1 - smooth(0, 34, y), smooth(H - 70, H - 2, y));
    if (!k) continue;
    for (let x = 0; x < W; x++) for (let c = 0; c < 3; c++) { const i = (y * W + x) * C + c; data[i] = data[i] * (1 - k) + INK[c] * k; }
  }
  const base = await sharp(data, { raw: { width: W, height: H, channels: C } }).png().toBuffer();
  for (const w of [480, 768, 1024]) await sharp(base).resize({ width: w }).webp({ quality: 78 }).toFile(path.join(OUT, 'img/hero-mobile-' + w + '.webp'));
}

// Logo original, sin fondo, para las zonas azul noche.
async function matte(left, top, width, height) {
  const { data, info } = await sharp(LOGO).removeAlpha().extract({ left, top, width, height }).raw().toBuffer({ resolveWithObject: true });
  const bg = [1, 1, 39];
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const c = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
    const a = clamp01(Math.max(...c.map((v, k) => Math.abs(v - bg[k]))) / 130);
    for (let k = 0; k < 3; k++) out[i * 4 + k] = a > 0.01 ? Math.max(0, Math.min(255, (c[k] - bg[k] * (1 - a)) / a)) : 0;
    out[i * 4 + 3] = a * 255;
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}
let LOCK_RATIO = 1;
async function brandAssets() {
  const brand = (n) => path.join(OUT, 'brand', n);
  const full = await matte(58, 256, 1130, 748);
  await sharp(full).resize({ width: 340 }).webp({ quality: 88 }).toFile(brand('logo-completo.webp'));
  const symbol = await matte(186, 256, 906, 470), words = await matte(58, 746, 1130, 258);
  const H = 136, sym = await sharp(symbol).resize({ height: H }).png().toBuffer();
  const symW = (await sharp(sym).metadata()).width;
  const wH = 100, wrd = await sharp(words).resize({ height: wH }).png().toBuffer();
  const wW = (await sharp(wrd).metadata()).width, gap = 12, W = symW + gap + wW;
  LOCK_RATIO = W / H;
  await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: sym, left: 0, top: 0 }, { input: wrd, left: symW + gap, top: Math.round((H - wH) / 2) }]).webp({ quality: 88 }).toFile(brand('logo-h.webp'));
  const square = async (size, bgc) => {
    const img = await sharp(symbol).resize({ width: Math.round(size * .9) }).png().toBuffer();
    const m = await sharp(img).metadata();
    return sharp({ create: { width: size, height: size, channels: 4, background: bgc || { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: img, left: Math.round((size - m.width) / 2), top: Math.round((size - m.height) / 2) }]);
  };
  for (const n of [96, 160, 256]) await (await square(n)).webp({ quality: 88 }).toFile(brand('emblema-' + n + '.webp'));
  await (await square(160)).png().toFile(brand('emblema-160.png'));
  const navy = { r: 5, g: 11, b: 44, alpha: 1 };
  await (await square(64, navy)).flatten({ background: navy }).png().toFile(brand('favicon.png'));
  await (await square(180, navy)).flatten({ background: navy }).png().toFile(brand('apple-touch-icon.png'));
}

async function predioPhoto() {
  for (const w of [480, 960, 1600]) await sharp(path.join(IMG, 'predio-parrilla.webp')).removeAlpha().resize({ width: w }).webp({ quality: 80 }).toFile(path.join(OUT, 'img/predio-parrilla-' + w + '.webp'));
}
async function trackPhotos() {
  const dia = await sharp(path.join(IMG, 'pista-aerea-dia.webp')).removeAlpha().extract({ left: 0, top: 3, width: 1020, height: 562 }).png().toBuffer();
  for (const w of [480, 800, 1020]) await sharp(dia).resize({ width: w }).webp({ quality: 82 }).toFile(path.join(OUT, 'img/pista-aerea-dia-' + w + '.webp'));
  const noche = await sharp(path.join(IMG, 'pista-aerea-noche.webp')).removeAlpha().png().toBuffer();
  for (const w of [480, 909]) await sharp(noche).resize({ width: w }).webp({ quality: 84 }).toFile(path.join(OUT, 'img/pista-aerea-noche-' + w + '.webp'));
}
const DIA_SRCSET = 'img/pista-aerea-dia-480.webp 480w, img/pista-aerea-dia-800.webp 800w, img/pista-aerea-dia-1020.webp 1020w';
const NOCHE_SRCSET = 'img/pista-aerea-noche-480.webp 480w, img/pista-aerea-noche-909.webp 909w';

const icon = (d) => '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
const I = {
  inicio: icon('<path d="M4 11.2 12 4l8 7.2"/><path d="M6.5 9.5V20h11V9.5"/><path d="M10 20v-5.5h4V20"/>'),
  calendario: icon('<rect x="4" y="5.5" width="16" height="15" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>'),
  posiciones: icon('<path d="M9 20v-9h6v9"/><path d="M3.5 20v-5.5H9"/><path d="M15 14h5.5v6"/><path d="M2.5 20h19"/><path d="m12 3.5.9 1.9 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3z"/>'),
  galeria: icon('<rect x="3.5" y="5" width="17" height="14.5" rx="2"/><circle cx="8.8" cy="10" r="1.6"/><path d="m4 17.5 5-4.5 3.5 3 3-2.6 4.8 4.2"/>'),
  mas: icon('<circle cx="5.5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="18.5" cy="12" r="1.3" fill="currentColor"/>'),
  piloto: icon('<path d="M3.5 14.5C3.5 9 7.5 5 12.5 5c4.6 0 8 3.4 8 8v3a2 2 0 0 1-2 2H9.2a3 3 0 0 1-2.4-1.2z"/><path d="M11 10.5h9.3V14H13a2 2 0 0 1-2-2z" fill="currentColor" fill-opacity=".3"/>'),
  categorias: icon('<path d="M5 21V4"/><path d="M5 5h14v10H5"/><path fill="currentColor" stroke="none" d="M5 5h3.5v3.3H5zM12 5h3.5v3.3H12zM8.5 8.3H12v3.4H8.5zM15.5 8.3H19v3.4h-3.5zM5 11.7h3.5V15H5zM12 11.7h3.5V15H12z"/>'),
  publico: icon('<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17 15a5.5 5.5 0 0 1 3.5 5"/>'),
  circuito: icon('<path d="M7.2 19.5a4.2 4.2 0 0 1-1.9-8l6.3-3.2a4.4 4.4 0 0 1 6.4 3.9c0 .9-.5 1.6-1.2 2.1l-.6.4a1.5 1.5 0 0 0 .8 2.8h.7a1 1 0 0 1 0 2z"/><path d="M12 19.5v-3"/>'),
  reglamento: icon('<path d="M6 3.5h9l4 4V20.5H6z"/><path d="M14.5 3.5v4.5H19M9.5 12.5h6M9.5 16h6"/>'),
  sponsors: icon('<circle cx="12" cy="9" r="5.5"/><path d="m8.6 13.6-1.6 7 5-2.6 5 2.6-1.6-7"/><path d="m12 6.6.8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.2z" fill="currentColor" stroke="none"/>'),
  contacto: icon('<path d="M4 6h16v12.5H4z"/><path d="m4.5 6.5 7.5 6.5 7.5-6.5"/>'),
  instagram: icon('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/>'),
  whatsapp: icon('<path d="m4 20 1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9.5 9.2c.2 2.8 2.5 5 5.3 5.3"/>'),
  chevron: icon('<path d="m9 5.5 6.5 6.5L9 18.5"/>'),
};

// Navegación: barra superior en desktop, barra superior y pestañas en celular.
const NAV = [['calendario', 'Calendario'], ['posiciones', 'Posiciones'], ['categorias', 'Categorías'], ['galeria', 'Galería'], ['circuito', 'Circuito'], ['soy-publico', 'Público'], ['reglamento', 'Reglamento', 'opt'], ['sponsors', 'Sponsors', 'opt'], ['contacto', 'Contacto']];
const TABS = [['index', 'Inicio', I.inicio], ['calendario', 'Calendario', I.calendario], ['posiciones', 'Posiciones', I.posiciones], ['galeria', 'Galería', I.galeria], ['mas', 'Más', I.mas]];
const MAIN_PAGES = new Set(['index', 'calendario', 'posiciones', 'galeria']);
const cur = (on) => (on ? ' aria-current="page"' : '');
function chrome(page) {
  const back = !MAIN_PAGES.has(page) && page !== 'mas' ? '<a class="app-back" href="./mas.html" aria-label="Volver a Más">' + icon('<path d="m15 5-7 7 7 7"/>') + '</a>' : '';
  return '<header class="app-top">' + back + '<a class="app-top-logo" href="./index.html" aria-label="Motokartódromo El Nono, inicio"><img src="brand/logo-h.webp" height="42" width="' + Math.round(42 * LOCK_RATIO) + '" alt="Motokartódromo El Nono"/></a><span class="app-top-div" aria-hidden="true"></span><nav aria-label="Secciones">'
    + NAV.map(([id, label, opt]) => '<a href="./' + id + '.html"' + (opt ? ' class="opt"' : '') + cur(id === page) + '>' + label + '</a>').join('') + '</nav>'
    + (page === 'soy-piloto' ? '' : '<a class="btn btn-primary" href="./soy-piloto.html">Soy piloto</a>') + '<span class="rgb-line" aria-hidden="true"></span></header>';
}
function tabs(page) {
  const active = MAIN_PAGES.has(page) ? page : 'mas';
  return '<nav class="app-tabs" aria-label="Navegación principal">' + TABS.map(([id, label, svg]) => '<a href="./' + id + '.html"' + cur(id === active) + '>' + svg + '<span>' + label + '</span></a>').join('') + '</nav>';
}

const TRACK_VIEW = (cls) => '<div class="track-view ' + cls + '" data-track-view data-show="dia"><img data-v="dia" src="img/pista-aerea-dia-800.webp" srcset="' + DIA_SRCSET + '" sizes="(min-width:1024px) 50vw, 100vw" width="1020" height="562" alt="Vista aérea de día del trazado del Motokartódromo El Nono" loading="lazy" decoding="async"/><img data-v="noche" src="img/pista-aerea-noche-909.webp" srcset="' + NOCHE_SRCSET + '" sizes="(min-width:1024px) 50vw, 100vw" width="909" height="532" alt="Vista aérea de noche de la pista iluminada" loading="lazy" decoding="async"/><div class="tv-switch" role="group" aria-label="Elegir vista de la pista"><button type="button" data-v="dia" aria-pressed="true">Día</button><button type="button" data-v="noche" aria-pressed="false">Noche</button></div></div>';

// Portada
const CATS = [['escuela-110', 'Escuela 110', '110 cc · 4T', 'foto-115', 960], ['juniors-130', 'Juniors 130 kg', '130 kg', 'foto-17', 960], ['150-155', '150 cc 155 kg', '150 cc · 4T', 'foto-13', 960], ['150-165-veteranos', '150 cc 165 kg Veteranos', '150 cc · 4T', 'foto-19', 960], ['150-170', '150 cc 170 kg', '150 cc · 4T', 'foto-14', 960], ['150-190', '150 cc 190 kg', '150 cc · 4T', 'foto-16', 960], ['150-200', '150 cc 200 kg', '150 cc · 4T', 'foto-30', 960], ['prokart-150', 'Prokart 150 cc', '150 cc · 4T', 'foto-prokart', 960]];
function leaders(src) {
  const out = [];
  const re = /<a href="\.\/posiciones\.html\?cat=([^"]+)" data-reveal[\s\S]*?sm:block">([^<]+)<[\s\S]*?italic">(\d+)<[\s\S]*?truncate[^>]*>([^<]+)<[\s\S]*?md:block">([^<]+)<[\s\S]*?text-white">(\d+)<span class="ml-1/g;
  for (const m of src.matchAll(re)) out.push({ slug: m[1], cat: m[2], num: m[3], name: m[4], gap: m[5], pts: m[6] });
  if (out.length !== 8) throw new Error('Líderes encontrados: ' + out.length);
  return out;
}
const head = (eye, title, href, label) => '<div class="block-head"><div><p class="block-eye">' + eye + '</p><h2>' + title + '</h2></div>' + (href ? '<a href="' + href + '">' + label + ' →</a>' : '') + '</div>';
const NUM_COLOR = { verde: ['#29d84f', '#04310f'], violeta: ['#8b4dff', '#fff'], rojo: ['#f0263c', '#fff'], negro: ['#12141f', '#fff'], amarillo: ['#f2d21b', '#1c1a00'] };
function categoryData() {
  const html = fs.readFileSync(path.join(SRC, 'categorias.html'), 'utf8');
  const out = [];
  const re = /text-celeste uppercase">([^<]+)<\/p><h2[^>]*>([^<]+)<\/h2><p[^>]*>([^<]+)<\/p>/g;
  for (const m of html.matchAll(re)) out.push({ spec: m[1], name: m[2], desc: m[3] });
  const list = out.filter((c) => CATS.some(([, name]) => name === c.name));
  if (list.length !== 8) throw new Error('Categorías encontradas: ' + list.length);
  return list;
}
function grilla(src) {
  const data = categoryData();
  const lead = leaders(src);
  const items = CATS.map(([slug, name, sub, img], i) => {
    const info = data.find((c) => c.name === name);
    const l = lead.find((x) => x.slug === slug);
    const parts = info.spec.split(' · ');
    const colorPart = parts.pop();
    const m = colorPart.match(/Número (\w+)/);
    const [cat, ink] = m && NUM_COLOR[m[1]] ? NUM_COLOR[m[1]] : ['#e3e8f4', '#0d1f5c'];
    return { slug, name, img, i, id: String(i + 1).padStart(2, '0'), desc: info.desc, tags: parts, colorPart, cat, ink, l, vars: '--cat:' + cat + ';--cat-ink:' + ink };
  });
  const tabs = items.map((c, k) => '<button type="button" role="tab" class="gr-tab" id="gr-tab-' + c.id + '" aria-controls="gr-panel-' + c.id + '" aria-selected="' + (k === 0) + '"' + (k === 0 ? '' : ' tabindex="-1"') + ' style="' + c.vars + '"><span class="gr-chip">' + c.l.num + '</span><span class="gr-t"><strong>' + c.name + '</strong><small>' + c.l.name + ' · ' + c.l.pts + ' pts</small></span><i class="gr-idx">' + c.id + '</i></button>').join('');
  const panels = items.map((c, k) => '<article role="tabpanel" class="gr-panel" id="gr-panel-' + c.id + '" aria-labelledby="gr-tab-' + c.id + '" style="' + c.vars + '"' + (k === 0 ? '' : ' hidden') + '>'
    + '<img class="gr-photo" src="img/' + c.img + '-960.webp" srcset="img/' + c.img + '-480.webp 480w, img/' + c.img + '-960.webp 960w' + (c.img === 'foto-prokart' ? ', img/foto-prokart-1200.webp 1200w' : ', img/' + c.img + '-1600.webp 1600w') + '" sizes="(min-width:1024px) 760px, 100vw" width="1600" height="1066" alt="" loading="lazy" decoding="async"/>'
    + '<span class="gr-shade" aria-hidden="true"></span><span class="gr-ghost" aria-hidden="true">' + c.id + '</span><span class="gr-check" aria-hidden="true"></span>'
    + '<div class="gr-plate"><small>Líder</small><b>' + c.l.num + '</b><em>' + c.l.pts + ' pts</em></div>'
    + '<div class="gr-body"><p class="gr-eye">Categoría ' + c.id + ' <span>/ 08</span></p><h3>' + c.name + '</h3><ul class="gr-tags">' + c.tags.map((t) => '<li>' + t + '</li>').join('') + '<li class="gr-color"><i></i>' + c.colorPart + '</li></ul><p class="gr-desc">' + c.desc + '</p>'
    + '<div class="gr-lead"><span role="img" aria-label="Argentina" class="flag gr-flag"></span><span class="gr-lead-t"><small>Lidera tras 5 fechas</small><strong>' + c.l.name + '</strong></span><span class="gr-gap">' + c.l.gap.replace(' sobre el 2.º', '') + '<small>sobre el 2.º</small></span><span class="gr-pts">' + c.l.pts + '<small>pts</small></span></div>'
    + '<div class="gr-actions"><a class="btn btn-primary" href="./posiciones.html?cat=' + c.slug + '">Ver posiciones <span aria-hidden="true">→</span></a><a class="btn btn-ghost" href="./categorias.html">Ficha completa</a></div></div></article>').join('');
  return '<div class="gr" data-gr><div class="gr-tabs" role="tablist" aria-label="Categorías del campeonato">' + tabs + '</div><div class="gr-stage">' + panels + '</div></div>';
}

// ---------- Calendario como temporada ----------
const ROUND_PHOTO = { F1: ['foto-17', 'Parque cerrado bajo las carpas'], F2: ['foto-30', 'Mecánicos ajustando el kart número 13'], F3: ['foto-14', 'Kart rojo número 45 con piloto de casco verde'], F4: ['foto-16', 'Grilla de karts lista para largar'], F5: ['foto-13', 'Kart número 30 en plena curva'] };
function calendarMain(html) {
  const rows = [];
  const re = /<li data-reveal[^>]*><span[^>]*>(\d+) ([A-Z]+)<\/span><span[^>]*>(F\d)<\/span><span role="img"[^>]*><\/span><span class="min-w-0"><span[^>]*>([^<]+)<\/span><span[^>]*>([^<]+)<\/span><\/span><span[^>]*>([^<]+)<\/span><\/li>/g;
  for (const m of html.matchAll(re)) rows.push({ d: m[1], mon: m[2], f: m[3], place: m[4], sub: m[5], status: m[6] });
  if (rows.length !== 8) throw new Error('Fechas encontradas: ' + rows.length);
  const done = rows.filter((r) => r.status === 'Finalizada');
  const next = rows.find((r) => r.status === 'Próxima');
  const later = rows.filter((r) => r.status === 'Programada');
  const nodes = rows.map((r) => '<li class="st-node is-' + (r.status === 'Finalizada' ? 'done' : r.status === 'Próxima' ? 'next' : 'todo') + '"><i></i><b>' + r.f + '</b><small>' + r.d + ' ' + r.mon + '</small></li>').join('');
  const season = '<section class="season" aria-label="Avance de la temporada"><div class="season-head"><div><p class="block-eye">Fechas 1–8</p><h2>Temporada 2026</h2></div><div class="season-stats"><div><b>' + done.length + '</b><span>corridas</span></div><div><b>' + (later.length + 1) + '</b><span>por correr</span></div></div></div><ol class="season-track" style="--done:' + (done.length / (rows.length - 1)) + '">' + nodes + '</ol></section>';
  const ticket = '<section class="cal-next"><img src="img/pista-aerea-dia-800.webp" srcset="' + DIA_SRCSET + '" sizes="(min-width:1024px) 500px, 100vw" width="1020" height="562" alt="Vista aérea del trazado del Motokartódromo El Nono" loading="lazy" decoding="async"/><div class="cal-next-body"><p class="block-eye">Próxima fecha</p><div class="cal-next-date"><b>' + next.d + '</b><span>' + next.mon + '</span></div><h3>Fecha ' + next.f.slice(1) + ' · ' + next.sub + '</h3><p class="cal-loc"><span role="img" aria-label="Argentina" class="flag gr-flag"></span>La Leonesa, Chaco, Argentina</p>'
    + '<div class="rt-count" role="timer" aria-label="Tiempo que falta para la largada" data-countdown="2026-11-08T09:00:00-03:00"><div><b data-u="d">--</b><span>días</span></div><div><b data-u="h">--</b><span>horas</span></div><div><b data-u="m">--</b><span>min</span></div><div><b data-u="s">--</b><span>seg</span></div></div>'
    + '<div class="cal-actions"><a class="btn btn-primary" href="./soy-piloto.html">Quiero correr</a><a class="btn btn-ghost" href="./soy-publico.html">Venir como público</a></div></div></section>';
  const upcoming = '<section class="cal-block"><h2 class="cal-h">Lo que viene</h2><div class="cal-later">' + later.map((r) => '<article class="cal-ticket' + (/final/i.test(r.sub) ? ' is-final' : '') + '"><div class="cal-date"><b>' + r.d + '</b><span>' + r.mon + '</span></div><div class="cal-info"><p>Fecha ' + r.f.slice(1) + '</p><h3>' + (/final/i.test(r.sub) ? r.sub : r.place) + '</h3><small>' + (/final/i.test(r.sub) ? r.place + ' · cierre del campeonato' : r.sub) + '</small></div><span class="cal-tag">' + r.status + '</span></article>').join('') + '</div></section>';
  const past = '<section class="cal-block"><div class="block-head"><h2 class="cal-h">Ya se corrieron</h2><a href="./posiciones.html">Ver posiciones →</a></div><div class="rail cal-past">' + done.slice().reverse().map((r) => '<a class="cal-shot" href="./galeria.html"><img src="img/' + ROUND_PHOTO[r.f][0] + '-480.webp" srcset="img/' + ROUND_PHOTO[r.f][0] + '-480.webp 480w, img/' + ROUND_PHOTO[r.f][0] + '-960.webp 960w" sizes="(min-width:1024px) 230px, 180px" width="480" height="320" alt="' + ROUND_PHOTO[r.f][1] + '" loading="lazy" decoding="async"/><span class="cal-badge">' + r.f + '</span><span class="cal-shot-t"><strong>' + r.d + ' ' + r.mon + '</strong><small>Finalizada · Ver fotos</small></span></a>').join('') + '</div></section>';
  const note = '<p class="cal-note"><b>Horarios a confirmar.</b> Las fechas pueden modificarse por condiciones climáticas. Cualquier cambio se comunica por nuestras redes.</p>';
  return '<div class="wrap cal">' + season + ticket + upcoming + past + note + '</div>';
}

function galleryData() {
  const html = fs.readFileSync(path.join(SRC, 'galeria.html'), 'utf8');
  const out = [];
  const re = /<button type="button" data-foto="true" data-tipo="([^"]+)"[^>]*data-etiqueta="([^"]+)"[^>]*>\s*<img src="img\/([a-z0-9-]+)-960\.webp"[^>]*alt="([^"]*)"/g;
  for (const m of html.matchAll(re)) out.push({ tipo: m[1], label: m[2], img: m[3], alt: m[4] });
  if (out.length !== 8) throw new Error('Fotos de galería encontradas: ' + out.length);
  return out;
}
function gallerySlider() {
  const fotos = galleryData();
  const n = (t) => fotos.filter((f) => f.tipo === t).length;
  const chip = (id, label, count, on) => '<button type="button" class="gx-chip" data-gx-filter="' + id + '" aria-pressed="' + on + '"><span>' + label + '</span><b>' + count + '</b></button>';
  const slides = fotos.map((f, i) => '<a class="gx-slide' + (i === 0 ? ' is-active' : '') + '" data-tipo="' + f.tipo + '" href="./galeria.html"><img src="img/' + f.img + '-960.webp" srcset="img/' + f.img + '-480.webp 480w, img/' + f.img + '-960.webp 960w, img/' + f.img + '-1600.webp 1600w" sizes="(min-width:1024px) 620px, 80vw" width="1920" height="1280" alt="' + f.alt + '" loading="lazy" decoding="async"/><span class="gx-cap"><small>' + f.label + '</small><strong>' + f.alt + '</strong></span></a>').join('');
  return '<div class="gx" data-gx><div class="gx-chips" role="group" aria-label="Filtrar fotos por categoría">' + chip('todas', 'Todas', fotos.length, true) + chip('carrera', 'Carreras', n('carrera'), false) + chip('prueba', 'Pruebas', n('prueba'), false) + '</div>'
    + '<div class="gx-track" tabindex="0" role="region" aria-label="Fotos del campeonato">' + slides + '</div>'
    + '<div class="gx-bar"><span class="gx-count" aria-live="polite">01 / 08</span><span class="gx-dots" aria-hidden="true"></span><span class="gx-arrows"><button type="button" class="gx-arrow" data-gx-step="-1" aria-label="Foto anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button><button type="button" class="gx-arrow" data-gx-step="1" aria-label="Foto siguiente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button></span></div></div>';
}
function home(src) {
  const rows = leaders(src).map((l) => '<a class="leader" href="./posiciones.html?cat=' + l.slug + '"><b>' + l.num + '</b><span><strong>' + l.name + '</strong><small>' + l.cat + '</small></span><em>' + l.pts + '<span>pts</span></em></a>').join('');
  const cats = CATS.map(([slug, name, sub, img], i) => '<a class="cat" href="./posiciones.html?cat=' + slug + '"><img src="img/' + img + '-480.webp" srcset="img/' + img + '-480.webp 480w, img/' + img + '-960.webp 960w" sizes="(min-width:1024px) 280px, 188px" width="480" height="320" alt="" loading="lazy" decoding="async"/><i>' + String(i + 1).padStart(2, '0') + '</i><span><strong>' + name + '</strong><small>' + sub + '</small></span></a>').join('');
  return '<main id="main"><section class="home-hero" aria-label="Motokartódromo El Nono"><h1 class="sr-only">Motokartódromo El Nono · Campeonato 2026 de karting en tierra en La Leonesa, Chaco</h1><picture><source media="(min-width:640px)" srcset="img/hero-desktop-800.webp 800w, img/hero-desktop-1200.webp 1200w, img/hero-desktop-1672.webp 1672w" sizes="100vw" width="1672" height="905"/><img src="img/hero-mobile-768.webp" srcset="img/hero-mobile-480.webp 480w, img/hero-mobile-768.webp 768w, img/hero-mobile-1024.webp 1024w" sizes="100vw" width="1024" height="1095" alt="Piloto con el kart número 97 acelerando sobre la pista de tierra" decoding="sync" fetchpriority="high"/></picture></section>'
    + '<div class="ticket-wrap"><div class="race-ticket"><div class="rt-date">08<small>NOV</small></div><div class="rt-info"><p class="rt-eyebrow">Próxima fecha</p><h2>Fecha 6 · Campeonato 2026</h2><p>Domingo · 9:00 hs · La Leonesa, Chaco</p></div>'
    + '<div class="rt-count" role="timer" aria-label="Tiempo que falta para la largada" data-countdown="2026-11-08T09:00:00-03:00"><div><b data-u="d">--</b><span>días</span></div><div><b data-u="h">--</b><span>horas</span></div><div><b data-u="m">--</b><span>min</span></div><div><b data-u="s">--</b><span>seg</span></div></div>'
    + '<div class="rt-actions"><a class="btn btn-primary" href="./soy-piloto.html">Quiero correr <span aria-hidden="true">→</span></a><a class="btn btn-ghost" href="./calendario.html">Calendario <span aria-hidden="true">→</span></a></div></div></div>'
    + '<div class="wrap"><div class="quick"><a href="./soy-piloto.html"><span><strong>Soy piloto</strong><small>Inscribite y tené tu QR y tus fichas</small></span>' + I.piloto + '</a><a href="./soy-publico.html"><span><strong>Soy público</strong><small>Todo para venir a ver la fecha</small></span>' + I.publico + '</a></div></div>'
    + '<section class="wrap hblock about"><div>' + TRACK_VIEW('') + '</div><div><p class="block-eye">El kartódromo</p><h2>Tierra, motores y familia</h2><p class="about-text">Karting en tierra en La Leonesa, Chaco: una comunidad de familias, mecánicos y pilotos que cada fecha llenan la grilla. De la Escuela 110 a las 150 cc, acá se corre en serio.</p><div class="stats"><div><b>8</b><span>Categorías</span></div><div><b>150 cc</b><span>Motores 4T</span></div><div><b>Tierra</b><span>Superficie</span></div></div><div class="about-links"><a class="btn btn-primary" href="./circuito.html">Conocer el circuito <span aria-hidden="true">→</span></a></div></div></section>'
    + '<section class="wrap hblock">' + head('8 categorías', 'Encontrá tu grilla', './categorias.html', 'Ver todas') + grilla(src) + '</section>'
    + '<section class="band"><div class="wrap">' + head('Tras 5 fechas', 'Quién manda', './posiciones.html', 'Ver tablas') + '<div class="rail">' + rows + '</div></div></section>'
    + '<section class="wrap hblock">' + head('Galería', 'Así se vive cada fecha', './galeria.html', 'Ver todas') + gallerySlider() + '</section>'
    + '<section class="cta"><div><h2>Tu lugar en la grilla</h2><p>Inscribite una sola vez por temporada y tené tu perfil, tu QR y tus fichas listas para cada fecha.</p></div><a class="btn" href="./soy-piloto.html">Inscribirme <span aria-hidden="true">→</span></a></section>'
    + '</main>';
}

const MORE = [['soy-piloto', 'Soy piloto', 'Inscripción, fichas y puntaje', I.piloto], ['categorias', 'Categorías', 'Las ocho grillas del campeonato', I.categorias], ['soy-publico', 'Soy público', 'Para venir a ver la fecha', I.publico], ['circuito', 'Circuito', 'Pista e instalaciones', I.circuito], ['reglamento', 'Reglamento', 'Normas del campeonato', I.reglamento], ['sponsors', 'Sponsors', 'Sumá tu marca', I.sponsors], ['contacto', 'Contacto', 'Inscripciones, pruebas y sponsors', I.contacto]];
const TILE_ICON = { categorias: I.categorias, 'soy-publico': I.publico, circuito: I.circuito, reglamento: I.reglamento, sponsors: I.sponsors, contacto: I.contacto };
const moreTile = (id, title, sub, svg) => '<li><a class="more-tile" href="./' + id + '.html"><span class="more-ico">' + svg + '</span><span class="more-tile-t"><strong>' + title + '</strong><small>' + sub + '</small></span></a></li>';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&amp;query=La%20Leonesa%2C%20Chaco%2C%20Argentina';
const MORE_MAIN = '<main id="main" class="app-more">'
  + '<header class="more-band"><div class="more-inner"><h1>Más</h1><p>El campeonato, el predio y cómo sumarte.</p></div></header>'
  + '<div class="more-inner more-body">'
  + '<section class="more-group"><h2>El campeonato</h2><ul class="more-grid">' + moreTile('categorias', 'Categorías', 'Las ocho grillas', I.categorias) + moreTile('reglamento', 'Reglamento', 'Normas y banderas', I.reglamento) + '</ul></section>'
  + '<section class="more-group"><h2>Vení al kartódromo</h2><ul class="more-grid">' + moreTile('soy-publico', 'Soy público', 'Guía para la fecha', I.publico) + moreTile('circuito', 'Circuito', 'Pista e instalaciones', I.circuito) + '</ul><a class="btn btn-primary more-btn" href="' + MAPS_URL + '" target="_blank" rel="noopener">' + icon('<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/>') + 'Cómo llegar en Maps</a></section>'
  + '<section class="more-group"><h2>Sumá tu marca</h2><div class="more-sponsor"><span class="more-ico">' + I.sponsors + '</span><div class="more-sponsor-t"><strong>Sponsors</strong><small>Cartelería, calcos, podio y redes en cada fecha.</small></div><a class="btn btn-primary more-btn" href="./sponsors.html">Ver cómo participar <span aria-hidden="true">→</span></a></div></section>'
  + '<section class="more-group"><h2>Contacto y redes</h2><div class="more-net-list"><a class="btn btn-primary more-btn" href="https://www.instagram.com/kartodromoelnono/" target="_blank" rel="noopener">' + I.instagram + 'Instagram</a><a class="btn btn-primary more-btn" href="https://chat.whatsapp.com/HH0gIHMWzUT06HPpMXuOM9" target="_blank" rel="noopener">' + I.whatsapp + 'Grupo de WhatsApp</a><a class="btn btn-ghost more-btn" href="./contacto.html">' + I.contacto + 'Contacto</a></div></section>'
  + '</div></main>';

const figure = (img, cap, big) => '<figure class="cx-item' + (big ? ' is-big' : '') + '"><img src="img/' + img + '-960.webp" srcset="img/' + img + '-480.webp 480w, img/' + img + '-960.webp 960w" sizes="' + (big ? '(min-width:1024px) 45vw, 100vw' : '(min-width:1024px) 22vw, 50vw') + '" width="960" height="640" alt="' + cap + '" loading="lazy" decoding="async"/><figcaption>' + cap + '</figcaption></figure>';
const COMPLEX = '<div class="cx mt-4">' + figure('predio-parrilla', 'Parrilla y mesas', true) + figure('boxes-equipo', 'Boxes y paddock') + figure('parque-cerrado', 'Parque cerrado') + '</div>';
const TRACK_RE = /<svg viewBox="0 0 380 180" class="([^"]*)"[^>]*>[\s\S]*?<\/svg>/;
const COPY = {
  categorias: [['Tabla de posiciones →', 'Ver posiciones →']],
  circuito: [['Abrir en Maps', 'Cómo llegar en Maps'], ['Info para el público', 'Guía para el público']],
  contacto: [['Instagram', 'Escribir por Instagram', 'btn'], ['Grupo de WhatsApp', 'Entrar al grupo', 'btn']],
  'soy-publico': [['Calendario completo', 'Ver todas las fechas'], ['Trazado', 'El complejo']],
  'soy-piloto': [['Trazado', 'El complejo']],
  sponsors: [[' WhatsApp', ' Pedir propuesta'], [' Instagram', ' Escribir por Instagram']],
};
const PLATE = { verde: '#29d84f', violeta: '#9a5cff', rojo: '#ff3b3b', negro: '#101018', amarillo: '#f2d21b' };
function retouch(main, page) {
  for (const [from, to, only] of COPY[page] || []) {
    const before = main;
    if (only === 'btn') main = main.replace(/<a\b[^>]*clip-btn[^>]*>[\s\S]*?<\/a>/g, (a) => a.split('>' + from + '<').join('>' + to + '<'));
    else main = main.split('>' + from + '<').join('>' + to + '<');
    if (before === main) console.log('AVISO texto no encontrado en', page + ':', from);
  }
  main = main.replace(/<a href="(https:\/\/www\.google\.com\/maps\/search[^"]*)" target="_blank" rel="noopener" class="mt-5 inline-block[^"]*">Cómo llegar →<\/a>/g, '<a class="btn btn-primary mt-5" href="$1" target="_blank" rel="noopener">Cómo llegar <span aria-hidden="true">→</span></a>');
  if (page === 'circuito') {
    main = main.replace(/<article(?:(?!<article)[\s\S])*?parque-cerrado(?:(?!<article)[\s\S])*?<\/article>/, (art) => art + art
      .replace(/img\/parque-cerrado/g, 'img/predio-parrilla').replace(/alt="Parque cerrado"/, 'alt="Parrilla y mesas bajo los árboles del predio"').replace(/width="1800" height="1200"/, 'width="1600" height="1065"')
      .replace(/>04</, '>05<').replace(/>Parque cerrado</, '>Parrilla y mesas<').replace(/>Área de control técnico[^<]*</, '>Sector con parrilla, mesas y sombra para pasar el día en el predio.<'));
  }
  if (page === 'sponsors') {
    main = main.replace(/<p class="[^"]*text-amarillo">Consultar<\/p>/g, '<a class="btn btn-primary mt-4" href="https://chat.whatsapp.com/HH0gIHMWzUT06HPpMXuOM9" target="_blank" rel="noopener">Consultar <span aria-hidden="true">→</span></a>');
  }
  return main.replace(/>Número (verde|violeta|rojo|negro|amarillo)</g, (_, c) => '><i class="plate-dot" style="--p:' + PLATE[c] + '"></i>Número ' + c + '<');
}
function must(html, re, value, what) {
  if (!re.test(html)) throw new Error('No se encontró: ' + what);
  return html.replace(re, value);
}
function transform(html, page) {
  html = must(html, /<link rel="stylesheet" href="assets\/site-c40c855a\.css">/, (m) => m + '\n<link rel="stylesheet" href="assets/app.css">', 'css');
  html = html.replace(/<meta name="theme-color"[^>]*>/, '<meta name="theme-color" content="#050b2c">');
  html = html.replace(/<link rel="preload" href="fonts\/orbitron\.woff2"[^>]*>\n?/, '<link rel="preload" href="fonts/saira.woff2" as="font" type="font/woff2" crossorigin>\n');
  html = html.replace(/<link rel="preload" href="fonts\/chakra-400\.woff2"[^>]*>\n?/, '<link rel="preload" href="fonts/saira-italic.woff2" as="font" type="font/woff2" crossorigin>\n');
  html = html.replace(/<link rel="preload" as="image" imageSrcSet="brand\/emblema-96[^>]*\/>/, '').replace(/<link rel="preload" as="image" href="brand\/emblema-256\.webp"\/>/, '');
  html = must(html, /<header id="hdr"[\s\S]*?<\/header><div id="menu" hidden=""[\s\S]*?<\/nav><\/div>(?=<main id="main">)/, () => chrome(page), 'header y menú');
  if (page === 'index') {
    html = must(html, /<main id="main">[\s\S]*<\/main>/, () => home(html), 'main portada');
    html = must(html, /<link rel="preload" as="image" imagesrcset="img\/foto-13[^>]*>/, '<link rel="preload" as="image" media="(max-width:639px)" imagesrcset="img/hero-mobile-480.webp 480w, img/hero-mobile-768.webp 768w, img/hero-mobile-1024.webp 1024w" imagesizes="100vw" fetchpriority="high">\n<link rel="preload" as="image" media="(min-width:640px)" imagesrcset="img/hero-desktop-800.webp 800w, img/hero-desktop-1200.webp 1200w, img/hero-desktop-1672.webp 1672w" imagesizes="100vw" fetchpriority="high">', 'preload hero');
    html = html.replace(/<link rel="preload" as="image" imageSrcSet="img\/foto-13[^>]*\/>/, '');
  } else {
    if (page === 'calendario') html = must(html, /<section class="mx-auto grid max-w-7xl gap-14[\s\S]*?<\/section>/, (m) => calendarMain(m), 'lista de fechas');
    html = html.replace(/<main id="main">[\s\S]*<\/main>/, (m) => retouch(m, page));
    if (page === 'circuito') {
      html = html.replace(/<img src="img\/pista-paisaje-960\.webp" srcSet="[^"]*" sizes="100vw" width="1800" height="1200" alt="" loading="eager"/, '<img src="img/pista-aerea-noche-909.webp" srcset="' + NOCHE_SRCSET + '" sizes="100vw" width="909" height="532" alt="" loading="eager"');
      html = html.replace(/<link rel="preload" as="image" imagesrcset="img\/pista-paisaje[^>]*>\n?/, '').replace(/<link rel="preload" as="image" imageSrcSet="img\/pista-paisaje[^>]*\/>/, '');
    }
    if (TRACK_RE.test(html)) {
      html = html.replace(TRACK_RE, (_, cls) => (page === 'circuito' ? TRACK_VIEW('mt-4') : COMPLEX));
    }
  }
  html = must(html, /<span class="flex items-center gap-3 select-none"><img src="brand\/emblema-96[\s\S]*?Motokartódromo<\/span><\/span><\/span>/, '<img class="brand-full" src="brand/logo-completo.webp" width="170" height="113" alt="Motokartódromo El Nono" loading="lazy" decoding="async"/>', 'logo pie');
  html = must(html, /<\/footer>/, (m) => m + tabs(page), 'footer');
  html = html.replace(/<\/body>/, '<script type="module" src="assets/app.js"></script>\n</body>');
  return html;
}
function buildMas(sponsors) {
  const headPart = sponsors.slice(0, sponsors.indexOf('<body>'))
    .replace(/<title>[^<]*<\/title>/, '<title>Más · Motokartódromo El Nono</title>')
    .replace(/<meta name="description"[^>]*>/, '<meta name="description" content="Todas las secciones del Motokartódromo El Nono: inscripción, categorías, circuito, reglamento, sponsors y contacto.">')
    .replace(/<meta property="og:title"[^>]*>/, '<meta property="og:title" content="Más · Motokartódromo El Nono">')
    .replace(/<meta property="og:description"[^>]*>/, '<meta property="og:description" content="Todas las secciones del Motokartódromo El Nono.">')
    .replace(/<link rel="preload" as="image"[^>]*>\n?/, '');
  return headPart + '<body>\n<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[90] focus:bg-red focus:px-4 focus:py-2">Saltar al contenido</a>' + chrome('mas') + MORE_MAIN + tabs('mas') + '\n<script type="module" src="assets/site-B7C4ZCCF.js"></script>\n<script type="module" src="assets/app.js"></script>\n</body>\n</html>\n';
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const entry of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, entry), { recursive: true, force: true });
  fs.cpSync(SRC, OUT, { recursive: true });
  await desktopHero();
  await mobileHero();
  await trackPhotos();
  await predioPhoto();
  await brandAssets();
  const FONTS = path.join(__dirname, 'node_modules/@fontsource-variable/saira/files');
  fs.copyFileSync(path.join(FONTS, 'saira-latin-wght-normal.woff2'), path.join(OUT, 'fonts/saira.woff2'));
  fs.copyFileSync(path.join(FONTS, 'saira-latin-wght-italic.woff2'), path.join(OUT, 'fonts/saira-italic.woff2'));
  fs.writeFileSync(path.join(OUT, 'assets/app.css'), fs.readFileSync(path.join(__dirname, 'estilos-base.css'), 'utf8') + fs.readFileSync(path.join(__dirname, 'estilos-detalle.css'), 'utf8'));
  fs.copyFileSync(path.join(__dirname, 'app.js'), path.join(OUT, 'assets/app.js'));
  const pages = fs.readdirSync(OUT).filter((f) => f.endsWith('.html'));
  for (const f of pages) {
    const page = f.replace('.html', '');
    fs.writeFileSync(path.join(OUT, f), transform(fs.readFileSync(path.join(OUT, f), 'utf8'), page));
  }
  fs.writeFileSync(path.join(OUT, 'mas.html'), buildMas(fs.readFileSync(path.join(OUT, 'sponsors.html'), 'utf8')));
  console.log('OK', pages.length + 1, 'páginas');
})().catch((e) => { console.error(e); process.exit(1); });
