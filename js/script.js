/* =========================================================
   Royal Menu — script.js
   1) CONFIG   2) ICONS   3) BUILD   4) MENU + LIVE THEME
   5) AUDIO    6) INTRO   7) BACKGROUND
   ========================================================= */

/* ---------- 1) CONFIG — edit your content here ---------- */
const AVATAR_SRC = "media/avatar.jpg";   // profile picture inside the media folder
const MUSIC_SRC  = "media/music.mp3";   // put YOUR song in the media folder (falls back to ambient if missing)
const TRACK_NAME = "Royal Theme";        // name shown in the player

const LINKS = [
  { n: "Discord",   i: "discord",   u: "https://discord.com/users/755456390717374635" },
  { n: "Instagram", i: "instagram", u: "https://instagram.com/8ydv" },
  { n: "YouTube",   i: "youtube",   u: "https://youtube.com/@Medo-t8c" },
  { n: "TikTok",    i: "tiktok",    u: "https://tiktok.com/@iczer21" },
  { n: "Ko-fi",     i: "kofi",      u: "https://ko-fi.com/imedo" },
  { n: "Telegram",  i: "telegram",  u: "https://t.me/i8ydv" }
];

/* [name, ghost word, description] */
const MENU = [
  ["Main Mods",       "MAIN",     "Core options for your own player."],
  ["Weapon Menu",     "WEAPON",   "Every weapon class, fun weapons and bullet changes."],
  ["Lobby Menu",      "LOBBY",    "Control the whole lobby, match and XP."],
  ["Account Menu",    "ACCOUNT",  "Prestige, levels, unlocks and clan tags."],
  ["Fun Menu",        "FUN",      "Views, effects and extras just for fun."],
  ["Killstreaks Menu","STREAKS",  "Give yourself any killstreak instantly."],
  ["Players Menu",    "PLAYERS",  "Pick a player and act on them."],
  ["Message Menu",    "MESSAGE",  "Quick chat lines and on-screen messages."],
  ["Menu Settings",   "SETTINGS", "Change how the menu looks. Open it and try Menu Color."]
];

/* same colours as the in-game Menu Color list */
const COLORS = [
  ["Default Color", [246,246,246]], ["Red", [255,50,50]], ["Green", [40,235,90]],
  ["Blue", [60,110,255]], ["Black", [105,105,105]], ["Cyan", [40,230,240]],
  ["Yellow", [255,225,40]], ["Magenta", [255,60,230]], ["Random", null], ["Rainbow", null]
];

const GAMES = [
  ["BO1","Call of Duty: Black Ops"], ["BO2","Call of Duty: Black Ops II"], ["GHOST","Call of Duty: Ghosts"],
  ["MWR","Modern Warfare Remastered"], ["AW","Advanced Warfare"], ["IW","Infinite Warfare"],
  ["WW2","Call of Duty: WWII"], ["MW2CR","Modern Warfare 2 Campaign Remastered"], ["VG","Call of Duty: Vanguard"],
  ["MW2019","Modern Warfare (2019)"], ["MW2-2022","Modern Warfare II (2022)"]
];

/* ---------- 2) ICONS ---------- */
const IC = {
  discord:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.74 19.74 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.1 13.1 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 01.078-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.079.01c.12.1.246.198.373.292a.077.077 0 01-.007.128 12.3 12.3 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>',
  instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor"/></svg>',
  youtube:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 7.2a2.8 2.8 0 00-2-2C18.8 4.8 12 4.8 12 4.8s-6.8 0-8.5.4a2.8 2.8 0 00-2 2C1 8.9 1 12 1 12s0 3.1.5 4.8a2.8 2.8 0 002 2c1.7.4 8.5.4 8.5.4s6.8 0 8.5-.4a2.8 2.8 0 002-2c.5-1.7.5-4.8.5-4.8s0-3.1-.5-4.8zM9.8 15.2V8.8l5.6 3.2z"/></svg>',
  tiktok:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.5.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
  kofi:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 8h14v6a5 5 0 01-5 5H8a5 5 0 01-5-5zM17 10h2a2.5 2.5 0 010 5h-2"/><path d="M10 15.5s-3-1.8-3-3.6a1.6 1.6 0 013-.4 1.6 1.6 0 013 .4c0 1.8-3 3.6-3 3.6z" fill="currentColor"/></svg>',
  telegram:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 3.3L2.6 10.8c-1.3.5-1.3 1.3-.2 1.6l4.9 1.5 1.9 5.7c.2.6.1.8.7.8.5 0 .7-.2 1-.5l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.7-.8l3.2-15.1c.3-1.3-.5-1.9-1.3-1.6zM8.5 13.5l10.7-6.7c.5-.3 1-.1.6.2l-8.7 7.9-.3 3.8z"/></svg>'
};
const PLAY  = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>';
const PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';

/* ---------- 3) BUILD static content ---------- */
const $ = s => document.querySelector(s), root = document.documentElement;
$("#avatarImg").src = AVATAR_SRC;
$("#socials").innerHTML = LINKS.map(l =>
  `<a class="soc" href="${l.u}" target="_blank" rel="noopener" aria-label="${l.n}" data-n="${l.n}">${IC[l.i]}</a>`).join("");
const gcap = $("#gcap"), gdef = GAMES.length + " titles · all on PS4";
gcap.textContent = gdef;
$("#chips").innerHTML = GAMES.map((g, i) => `<span class="chip" data-i="${i}">${g[0]}</span>`).join("");
document.querySelectorAll(".chip").forEach(c => {
  c.addEventListener("mouseenter", () => { gcap.textContent = GAMES[c.dataset.i][1] + " · PS4"; gcap.classList.add("on"); blip(600, .04); });
  c.addEventListener("mouseleave", () => { gcap.textContent = gdef; gcap.classList.remove("on"); });
});
$("#tn").textContent = TRACK_NAME;
$("#pp").innerHTML = PLAY;

/* ---------- 4) MENU + LIVE THEME ---------- */
const list = $("#list"), info = $("#info"), mt = $("#mt"), ghost = $("#ghost"), VIEW = 9;
let A = [246,246,246], rainbow = false, colName = "Default Color";
let view = "main", cur = 0, start = 0, pulse = 0, toastT;

const rowsOf = () => view === "main"
  ? MENU.map(m => ({ t: m[0], d: m[2], w: m[1], go: m[0] === "Menu Settings" ? "col" : null }))
  : [{ t: "Back", d: "Return to the main menu.", back: 1, w: "SETTINGS" }].concat(
      COLORS.map(c => ({ t: c[0], c: c[1], w: c[0].split(" ")[0].toUpperCase(), d: "Apply " + c[0] + " to the menu and this whole page." })));

function swatch(x) {
  const bg = x.c ? `rgb(${x.c})` : x.t === "Rainbow"
    ? "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" : "linear-gradient(135deg,#ff3b3b,#3be8f0,#ffe13b)";
  return `<span class="sw" style="background:${bg};display:block;width:20px;height:20px;border:2px solid rgba(255,255,255,.35)"></span>`;
}
function mark(x) {
  if (x.back) return "<i>‹</i>";
  if (x.go) return "<i>›</i>";
  if (view === "col") return `<em style="display:flex;gap:10px;align-items:center;font-style:normal">${x.t === colName ? '<i class="ck" style="color:var(--white)">✓</i>' : ""}${swatch(x)}</em>`;
  return "<i></i>";
}
function render() {
  const rs = rowsOf(), n = rs.length;
  mt.textContent = view === "main" ? "Royal Menu" : "Menu Color";
  if (cur < start) start = cur;
  if (cur >= start + VIEW) start = cur - VIEW + 1;
  start = Math.max(0, Math.min(start, Math.max(0, n - VIEW)));
  list.innerHTML = rs.slice(start, start + VIEW).map((x, k) => {
    const i = start + k;
    return `<button class="row${i === cur ? " on" : ""}" role="menuitem" data-i="${i}"><span>${x.t}</span>${mark(x)}</button>`;
  }).join("");
  list.querySelectorAll(".row").forEach(r => {
    const i = +r.dataset.i;
    r.onmouseenter = () => { if (i !== cur) { cur = i; hl(); blip(430 + i * 30, .05); } };
    r.onclick = () => act(i);
  });
  hl(true);
}
function hl(skipRows) {
  const rs = rowsOf(), x = rs[cur];
  if (!skipRows) list.querySelectorAll(".row").forEach(r => r.classList.toggle("on", +r.dataset.i === cur));
  info.classList.remove("ok");
  info.innerHTML = `<b>${x.t}${rs.length > VIEW ? `<small style="float:right;font-weight:400;color:var(--mute);font-size:16px">${cur + 1}/${rs.length}</small>` : ""}</b><span>${x.d}</span>`;
  setGhost(x.w);
}
function setGhost(w) {
  if (ghost.textContent === w) return;
  ghost.classList.add("sw");
  setTimeout(() => { ghost.textContent = w; ghost.classList.remove("sw"); }, 180);
}
function flash(msg) {
  info.classList.add("ok"); info.querySelector("span").textContent = msg;
  clearTimeout(toastT); toastT = setTimeout(() => hl(true), 1500);
}
function setA(c) { A = c; root.style.setProperty("--a", c.join(",")); }
function applyColor(x) {
  colName = x.t; rainbow = x.t === "Rainbow";
  if (!rainbow) setA(x.t === "Random" ? [0,1,2].map(() => 90 + Math.random() * 165 | 0) : x.c);
  pulse = 1;                                  /* whole page flashes in the new colour */
}
function act(i) {
  const x = rowsOf()[i]; cur = i;
  if (x.back)  { view = "main"; cur = MENU.length - 1; start = 0; render(); blip(330); return; }
  if (x.go)    { view = x.go; cur = 1; start = 0; render(); blip(660); return; }
  if (view === "col") { applyColor(x); render(); flash("Colour applied."); blip(820); return; }
  pulse = .5; flash("Available in the in-game menu."); blip(740);
}
function move(d) {
  const n = rowsOf().length; cur = (cur + d + n) % n; render(); blip(430 + cur * 30, .05);
}
$("#box").addEventListener("keydown", e => {
  const k = e.key;
  if (!["ArrowDown","ArrowUp","Enter","ArrowRight","ArrowLeft","Backspace","Escape"].includes(k)) return;
  e.preventDefault();
  if (k === "ArrowDown") move(1); else if (k === "ArrowUp") move(-1);
  else if (k === "Enter" || k === "ArrowRight") act(cur);
  else if (view !== "main") act(0);
});
$("#box").addEventListener("wheel", e => {
  const n = rowsOf().length; if (n <= VIEW) return; e.preventDefault();
  start = Math.max(0, Math.min(n - VIEW, start + (e.deltaY > 0 ? 1 : -1)));
  cur = Math.max(start, Math.min(cur, start + VIEW - 1)); render();
}, { passive: false });
$("#box").addEventListener("mouseenter", () => $("#box").focus({ preventScroll: true }));
render();

/* 3D tilt (pointer devices only) */
if (matchMedia("(hover:hover)").matches && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
  const s = $("#stage"), t = $("#tilt"), sh = $("#shine");
  s.addEventListener("pointermove", e => {
    const r = s.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    t.style.transform = `rotateY(${(x - .5) * 12}deg) rotateX(${(.5 - y) * 9}deg)`;
    sh.style.setProperty("--sx", x * 100 + "%"); sh.style.setProperty("--sy", y * 100 + "%");
  });
  s.addEventListener("pointerleave", () => t.style.transform = "");
}

/* ---------- 5) AUDIO ---------- */
let ac, master, an, data, audioEl, sfx, playing = false, vol = .55;
let usingFile = !!MUSIC_SRC, routed = false, ambientOn = false;
const level = () => vol * .35 * (usingFile ? 3 : 1);
const live  = () => playing && (!usingFile || routed);   /* is the analyser receiving real audio? */

function buildAmbient() {                                /* built-in ambient pad (fallback) */
  if (ambientOn) return; ambientOn = true;
  const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 700; lp.connect(master);
  const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = .07; lg.gain.value = 320;
  l.connect(lg); lg.connect(lp.frequency); l.start();
  [55, 82.41, 110, 164.81, 220].forEach((f, i) => [-4, 4].forEach(d => {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = i % 2 ? "triangle" : "sawtooth"; o.frequency.value = f; o.detune.value = d;
    g.gain.value = .12 / (i + 1); o.connect(g); g.connect(lp); o.start();
  }));
  setInterval(() => {
    if (!playing || usingFile) return;
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(40, t + .4);
    g.gain.setValueAtTime(.4, t); g.gain.exponentialRampToValueAtTime(.001, t + .5);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + .55);
  }, 1800);
}
function initAudio() {
  if (ac) return;
  ac = new (window.AudioContext || window.webkitAudioContext)();
  master = ac.createGain(); master.gain.value = 0;
  an = ac.createAnalyser(); an.fftSize = 128; data = new Uint8Array(an.frequencyBinCount);
  master.connect(an); an.connect(ac.destination);
  sfx = ac.createGain(); sfx.gain.value = .12; sfx.connect(ac.destination);
  if (usingFile) {
    audioEl = new Audio(MUSIC_SRC); audioEl.loop = true;
    audioEl.addEventListener("error", toAmbient);
    if (location.protocol !== "file:") {                 /* analyser needs http(s); file:// plays without it */
      try { ac.createMediaElementSource(audioEl).connect(master); routed = true; } catch (e) {}
    }
  } else buildAmbient();
}
function toAmbient() {                                   /* song file missing or unsupported */
  if (!usingFile) return;
  usingFile = false; routed = false; audioEl = null;
  buildAmbient(); $("#tn").textContent = "Royal Ambient";
  if (playing) master.gain.linearRampToValueAtTime(level(), ac.currentTime + 2);
}
function setPlay(p) {
  initAudio(); playing = p; ac.resume();
  if (audioEl) {
    audioEl.volume = routed ? 1 : vol;
    p ? audioEl.play().catch(e => { if (e.name === "NotSupportedError" || e.name === "NotFoundError") toAmbient(); }) : audioEl.pause();
  }
  const on = p && (routed || !usingFile);
  master.gain.cancelScheduledValues(ac.currentTime);
  master.gain.linearRampToValueAtTime(on ? level() : 0, ac.currentTime + (p ? 2.5 : .3));
  $("#pp").innerHTML = p ? PAUSE : PLAY;
}
function blip(f, v) {
  if (!ac) return;
  const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
  o.type = "square"; o.frequency.value = f;
  g.gain.setValueAtTime(v || .4, t); g.gain.exponentialRampToValueAtTime(.001, t + .08);
  o.connect(g); g.connect(sfx); o.start(t); o.stop(t + .09);
}
$("#pp").onclick = () => setPlay(!playing);
$("#vol").oninput = e => {
  vol = e.target.value / 100;
  if (audioEl && !routed) audioEl.volume = vol; else if (playing) master.gain.value = level();
};

/* ---------- 6) INTRO ---------- */
$("#enter").onclick = () => { $("#intro").classList.add("out"); setPlay(true); };

/* ---------- 7) BACKGROUND (grid + embers, tinted by the menu colour) ---------- */
const cv = $("#bg"), cx = cv.getContext("2d"), vz = $("#viz"), vx = vz.getContext("2d");
const still = matchMedia("(prefers-reduced-motion:reduce)").matches;
let W, H, mx = .5, my = .4, lv = 0, off = 0, pts = [];

function hsl(h) { const f = n => { const k = (n + h / 30) % 12; return Math.round(255 * (.5 - .5 * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); }; return [f(0), f(8), f(4)]; }
function resize() {
  const d = Math.min(devicePixelRatio || 1, 2);
  W = cv.width = innerWidth * d; H = cv.height = innerHeight * d;
  pts = Array.from({ length: Math.round(innerWidth / 18) }, () => ({
    x: Math.random() * W, y: Math.random() * H, r: (Math.random() * 1.5 + .4) * d,
    v: (Math.random() * .4 + .15) * d, a: Math.random() * .5 + .15
  }));
}
addEventListener("resize", resize); resize();
addEventListener("pointermove", e => { mx = e.clientX / innerWidth; my = e.clientY / innerHeight; });

function frame() {
  if (rainbow) setA(hsl((Date.now() / 18) % 360));
  let bass = 0;
  if (an && live()) { an.getByteFrequencyData(data); for (let i = 0; i < 6; i++) bass += data[i]; bass /= 1530; }
  else if (playing) bass = .22 + .12 * Math.sin(Date.now() / 380);
  pulse *= .93;
  lv += (Math.max(bass, pulse) - lv) * .15;
  root.style.setProperty("--glow", lv.toFixed(3));
  const c = A.join(",");

  cx.fillStyle = "#070707"; cx.fillRect(0, 0, W, H);
  const g = cx.createRadialGradient(W * mx, H * my, 0, W * mx, H * my, Math.max(W, H) * .55);
  g.addColorStop(0, `rgba(${c},${.08 + lv * .16})`); g.addColorStop(1, `rgba(${c},0)`);
  cx.fillStyle = g; cx.fillRect(0, 0, W, H);

  const hz = H * .6, v0 = W * (.5 + (mx - .5) * .15); cx.lineWidth = 1;
  for (let i = -24; i <= 24; i++) {
    cx.strokeStyle = `rgba(${c},${Math.max(0, .22 - Math.abs(i) * .007)})`;
    cx.beginPath(); cx.moveTo(v0 + i * 14, hz); cx.lineTo(v0 + i * W * .63, H); cx.stroke();
  }
  off = (off + (still ? 0 : .005 + lv * .02)) % 1;
  for (let k = 0; k < 14; k++) {
    const z = (k + off) / 14, y = hz + (H - hz) * z * z;
    cx.strokeStyle = `rgba(${c},${.05 + z * .22 + lv * .2})`;
    cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke();
  }
  const hg = cx.createLinearGradient(0, hz - 90, 0, hz);
  hg.addColorStop(0, `rgba(${c},0)`); hg.addColorStop(1, `rgba(${c},${.06 + lv * .14})`);
  cx.fillStyle = hg; cx.fillRect(0, hz - 90, W, 90);

  pts.forEach(q => {
    if (!still) { q.y -= q.v * (1 + lv * 3); q.x += (mx - .5) * .3; if (q.y < -5) { q.y = H + 5; q.x = Math.random() * W; } }
    cx.fillStyle = `rgba(${c},${q.a})`; cx.beginPath(); cx.arc(q.x, q.y, q.r, 0, 7); cx.fill();
  });

  const w = vz.width, h = vz.height, n = 32, bw = (w - 4) / n; vx.clearRect(0, 0, w, h);
  for (let i = 0; i < n; i++) {
    const v = an && live() ? data[i] / 255 : playing ? .2 + .18 * Math.abs(Math.sin(Date.now() / 230 + i * .8)) : .05 + Math.sin(Date.now() / 600 + i) * .03, bh = Math.max(3, v * h);
    vx.fillStyle = v > .6 ? `rgb(${c})` : `rgba(${c},.5)`; vx.fillRect(2 + i * bw, h - bh, bw - 3, bh);
  }
  requestAnimationFrame(frame);
}
frame();

/* ---------- 8) CUSTOM CURSOR ----------
   A square dot that follows the pointer exactly, plus a bracket frame that
   glides after it and snaps around whatever you can click. Uses the menu colour. */
if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
  root.classList.add("has-cursor");
  const dot = document.createElement("div"), fr = document.createElement("div");
  dot.id = "cur"; fr.id = "curf"; document.body.append(dot, fr);
  const HOVER = "a,button,.row,.chip,.vf,input[type=range]", k = still ? 1 : .22;
  let px = -100, py = -100, fx = 0, fy = 0, fw = 34, fh = 34, tx = 0, ty = 0, tw = 34, th = 34, down = false, vis = false;

  addEventListener("pointermove", e => {
    px = e.clientX; py = e.clientY;
    if (!vis) { vis = true; fx = px - 17; fy = py - 17; dot.style.opacity = fr.style.opacity = 1; }
  }, { passive: true });
  document.addEventListener("mouseleave", () => { vis = false; dot.style.opacity = fr.style.opacity = 0; });
  document.addEventListener("mouseenter", () => { vis = true; dot.style.opacity = fr.style.opacity = 1; });
  addEventListener("pointerdown", e => {
    down = true;
    const r = document.createElement("i"); r.className = "rip"; r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px";
    document.body.append(r); setTimeout(() => r.remove(), 600);
  });
  addEventListener("pointerup", () => down = false);

  (function loop() {
    const el = vis ? document.elementFromPoint(px, py) : null;
    const hov = el && el.closest ? el.closest(HOVER) : null;
    if (hov) {                                   /* lock the frame around the target */
      const r = hov.getBoundingClientRect(), pad = hov.matches(".row") ? 0 : 5;
      tx = r.left - pad; ty = r.top - pad; tw = r.width + pad * 2; th = r.height + pad * 2;
    } else {                                     /* idle: small frame centred on the pointer */
      const s = down ? 22 : 34; tw = th = s; tx = px - s / 2; ty = py - s / 2;
    }
    fx += (tx - fx) * k; fy += (ty - fy) * k; fw += (tw - fw) * k; fh += (th - fh) * k;
    dot.style.transform = `translate3d(${px}px,${py}px,0) rotate(${hov ? 45 : 0}deg) scale(${down ? .6 : 1})`;
    fr.style.transform = `translate3d(${fx}px,${fy}px,0)`; fr.style.width = fw + "px"; fr.style.height = fh + "px";
    fr.classList.toggle("lock", !!hov);
    requestAnimationFrame(loop);
  })();
}
