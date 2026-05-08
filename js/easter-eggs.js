/* ═══════════════════════════════════════════════
   ROYAL SYSTEMS — EASTER EGGS MODULE
   easter-eggs.js · Hidden Secrets & Surprises
═══════════════════════════════════════════════ */

const EasterEggs = (() => {

  /* ══════════════════════════════════════════
     SHARED STATE & UTILITIES
  ══════════════════════════════════════════ */
  const achievements = new Set();
  let keyBuffer = '';
  let clickCount = 0;
  let clickTimer = null;
  let tripleClickCount = 0;
  let tripleClickTimer = null;
  let matrixActive = false;
  let hackActive = false;
  let royalThemeActive = false;

  /* ── LOCALSTORAGE HELPERS ────────────────── */
  const STORAGE_KEY = 'ee_unlocked';

  function getUnlocked() {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
    } catch {
      return new Set();
    }
  }

  function saveUnlocked(set) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    } catch {}
  }

  function isUnlocked(title) {
    return getUnlocked().has(title);
  }

  function markUnlocked(title) {
    const unlocked = getUnlocked();
    unlocked.add(title);
    saveUnlocked(unlocked);
  }

  /* ── ACHIEVEMENT TOAST ───────────────────── */
  function showAchievement(icon, title, desc) {
    if (achievements.has(title)) return;
    if (isUnlocked(title)) {
      achievements.add(title);
      return;
    }

    achievements.add(title);
    markUnlocked(title);

    const toast = document.createElement('div');
    toast.className = 'ee-achievement';
    toast.innerHTML = `
      <div class="ee-achievement__icon">${icon}</div>
      <div class="ee-achievement__body">
        <div class="ee-achievement__label">ACHIEVEMENT UNLOCKED</div>
        <div class="ee-achievement__title">${title}</div>
        <div class="ee-achievement__desc">${desc}</div>
      </div>
      <div class="ee-achievement__glow"></div>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 600);
    }, 4000);
  }

  /* ── SECRET MESSAGE POPUP ────────────────── */
  function showSecretMessage(lines, color = '#c8a96e') {
    const existing = document.getElementById('ee-secret-msg');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.id = 'ee-secret-msg';
    msg.className = 'ee-secret-msg';
    msg.style.setProperty('--ee-accent', color);
    msg.innerHTML = `
      <div class="ee-secret-msg__inner">
        <div class="ee-secret-msg__header">
          <span class="ee-secret-msg__tag">// SECRET MESSAGE</span>
          <button class="ee-secret-msg__close" onclick="this.closest('#ee-secret-msg').remove()">✕</button>
        </div>
        <div class="ee-secret-msg__body">
          ${lines.map(l => `<p>${l}</p>`).join('')}
        </div>
        <div class="ee-secret-msg__footer">CLASSIFIED · ROYAL_OS_V4</div>
      </div>
    `;
    document.body.appendChild(msg);
    requestAnimationFrame(() => msg.classList.add('show'));
    setTimeout(() => { msg.classList.remove('show'); setTimeout(() => msg.remove(), 600); }, 8000);
  }

  /* ── SCREEN FLASH ────────────────────────── */
  function screenFlash(color = '#c8a96e', duration = 300) {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed; inset:0; z-index:99999; pointer-events:none;
      background:${color}; opacity:0; transition:opacity ${duration/2}ms ease;
    `;
    document.body.appendChild(flash);
    requestAnimationFrame(() => { flash.style.opacity = '0.18'; });
    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), duration/2);
    }, duration/2);
  }

  /* ── PLAY BEEP SOUND ─────────────────────── */
  function playBeep(freq = 440, duration = 120, type = 'square', vol = 0.08) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration / 1000);
    } catch(e) {}
  }

  function playHackSound() {
    const freqs = [880, 660, 990, 440, 770, 550];
    freqs.forEach((f, i) => setTimeout(() => playBeep(f, 80, 'sawtooth', 0.06), i * 60));
  }

  function playKonamiSound() {
    const melody = [523, 659, 784, 1047];
    melody.forEach((f, i) => setTimeout(() => playBeep(f, 150, 'sine', 0.1), i * 120));
  }

  function playClickSound() {
    playBeep(1200, 40, 'square', 0.04);
  }

  /* ══════════════════════════════════════════
     1. KONAMI CODE — CHEAT MODE
     ↑ ↑ ↓ ↓ ← → ← → B A
  ══════════════════════════════════════════ */
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIdx = 0;

  function initKonami() {
    document.addEventListener('keydown', (e) => {
      if (e.key === KONAMI[konamiIdx]) {
        konamiIdx++;
        if (konamiIdx === KONAMI.length) {
          konamiIdx = 0;
          activateCheatMode();
        }
      } else {
        konamiIdx = e.key === KONAMI[0] ? 1 : 0;
      }
    });
  }

  function activateCheatMode() {
    if (isUnlocked('KONAMI MASTER')) return;

    playKonamiSound();
    screenFlash('#c8a96e', 400);

    // Particle overdrive
    if (window.Particles) Particles.setIntensity(2);

    // Full screen effect
    const overlay = document.createElement('div');
    overlay.className = 'ee-cheat-overlay';
    overlay.innerHTML = `
      <div class="ee-cheat-inner">
        <div class="ee-cheat-tag">[ CHEAT CODE DETECTED ]</div>
        <div class="ee-cheat-title">GOD MODE</div>
        <div class="ee-cheat-sub">ACTIVATED</div>
        <div class="ee-cheat-code">↑↑↓↓←→←→BA</div>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));

    setTimeout(() => {
      overlay.classList.add('hide');
      setTimeout(() => overlay.remove(), 800);
      if (window.Particles) Particles.setIntensity(1);
    }, 3000);

    showAchievement('🎮', 'KONAMI MASTER', 'You know the ancient code.');
  }

  /* ══════════════════════════════════════════
     2. TYPE "HACK" — HACKER MODE
  ══════════════════════════════════════════ */
  function initHackWord() {
    document.addEventListener('keydown', (e) => {
      if (document.activeElement.tagName === 'INPUT') return;
      keyBuffer += e.key.toLowerCase();
      keyBuffer = keyBuffer.slice(-10);

      if (keyBuffer.includes('hack') && !hackActive) {
        hackActive = true;
        activateHackMode();
        setTimeout(() => { hackActive = false; }, 8000);
      }

      if (keyBuffer.includes('royal') && !royalThemeActive) {
        activateRoyalTheme();
      }
    });
  }

  function activateHackMode() {
    if (isUnlocked('GHOST IN THE MACHINE')) return;

    playHackSound();
    screenFlash('#00ff41', 200);

    // Glitch the entire app
    const app = document.getElementById('app') || document.body;
    app.classList.add('ee-glitch-heavy');

    // Matrix-style log flood
    const logLines = [
      '[ROOT]   :: UNAUTHORIZED_ACCESS_ATTEMPT',
      '[SYS]    :: FIREWALL_BYPASS_INITIATED',
      '[KERN]   :: PRIVILEGE_ESCALATION_DETECTED',
      '[NET]    :: PACKET_INJECTION_ACTIVE',
      '[SEC]    :: AES_KEY_COMPROMISED',
      '[AUTH]   :: ROOT_ACCESS_GRANTED ✓',
      '[DATA]   :: EXTRACTING_CLASSIFIED_FILES',
      '[HACK]   :: SYSTEM_COMPROMISED ⚠',
    ];

    const terminal = document.createElement('div');
    terminal.className = 'ee-hack-terminal';
    terminal.innerHTML = `<div class="ee-hack-terminal__header">// INTRUSION DETECTED //</div><div class="ee-hack-terminal__log"></div>`;
    document.body.appendChild(terminal);
    requestAnimationFrame(() => terminal.classList.add('show'));

    const logEl = terminal.querySelector('.ee-hack-terminal__log');
    logLines.forEach((line, i) => {
      setTimeout(() => {
        const span = document.createElement('span');
        span.textContent = line;
        logEl.appendChild(span);
        logEl.appendChild(document.createElement('br'));
        playBeep(200 + i * 80, 40, 'sawtooth', 0.03);
      }, i * 250);
    });

    setTimeout(() => {
      app.classList.remove('ee-glitch-heavy');
      terminal.classList.remove('show');
      setTimeout(() => terminal.remove(), 600);

      showSecretMessage([
        '> ACCESS_LEVEL: CLASSIFIED',
        '> You have breached the outer shell.',
        '> Welcome to the ROYAL inner sanctum.',
        '> Handle with care. You were warned.'
      ], '#00ff41');

      showAchievement('💀', 'GHOST IN THE MACHINE', 'You broke through the firewall.');
    }, 5000);
  }

  /* ══════════════════════════════════════════
     3. TYPE "ROYAL" — THEME SWITCH
  ══════════════════════════════════════════ */
  const THEMES = [
    { name: 'GOLD',    accent: '#c8a96e', glow: 'rgba(200,169,110,0.4)' },
    { name: 'CYAN',    accent: '#00d4ff', glow: 'rgba(0,212,255,0.4)' },
    { name: 'CRIMSON', accent: '#ff3366', glow: 'rgba(255,51,102,0.4)' },
    { name: 'MATRIX',  accent: '#00ff41', glow: 'rgba(0,255,65,0.4)' },
    { name: 'VIOLET',  accent: '#b06cff', glow: 'rgba(176,108,255,0.4)' },
  ];
  let themeIdx = 0;

  function initRoyalTheme() {}

  function activateRoyalTheme() {
    royalThemeActive = true;
    themeIdx = (themeIdx + 1) % THEMES.length;
    const theme = THEMES[themeIdx];

    playBeep(660, 100, 'sine', 0.08);
    screenFlash(theme.accent, 300);

    document.documentElement.style.setProperty('--c-accent', theme.accent);
    document.documentElement.style.setProperty('--c-accent-glow', theme.glow);

    // Animated theme announcement
    const badge = document.createElement('div');
    badge.className = 'ee-theme-badge';
    badge.style.setProperty('--ee-accent', theme.accent);
    badge.innerHTML = `<span>THEME ACTIVATED</span><strong>${theme.name}_MODE</strong>`;
    document.body.appendChild(badge);
    requestAnimationFrame(() => badge.classList.add('show'));
    setTimeout(() => {
      badge.classList.remove('show');
      setTimeout(() => badge.remove(), 500);
    }, 2500);

    showAchievement('🎨', 'CHROMATIC SHIFT', `Theme changed to ${theme.name} — type ROYAL again for next.`);

    setTimeout(() => { royalThemeActive = false; }, 1000);
  }

  /* ══════════════════════════════════════════
     4. CLICK SCREEN 10 TIMES — MATRIX RAIN
  ══════════════════════════════════════════ */
  function initMatrixClick() {
  document.addEventListener('click', (e) => {
    
    if (e.target.closest('button, a, .nav__item, .proj-card, input, #ee-secret-msg, #ss-player')) return;
    if (isUnlocked('ENTER THE MATRIX')) return;
    if (matrixActive) return;

    const now = Date.now();
    if (initMatrixClick._lastClick && now - initMatrixClick._lastClick < 100) return;
    initMatrixClick._lastClick = now;

    clickCount++;
    playBeep(300 + clickCount * 50, 30, 'square', 0.03);
    showClickProgress(clickCount);

    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, 3000);

    if (clickCount >= 10) {
      clickCount = 0;
      clearTimeout(clickTimer);
      activateMatrixRain();
    }
  });
}

  let progressDots = null;
  function showClickProgress(count) {
    if (!progressDots) {
      progressDots = document.createElement('div');
      progressDots.className = 'ee-click-progress';
      document.body.appendChild(progressDots);
    }
    progressDots.innerHTML = Array.from({length: 10}, (_, i) =>
      `<span class="${i < count ? 'filled' : ''}"></span>`
    ).join('');
    progressDots.classList.add('show');
    clearTimeout(progressDots._hideTimer);
    progressDots._hideTimer = setTimeout(() => {
      progressDots.classList.remove('show');
      setTimeout(() => { if (progressDots) { progressDots.remove(); progressDots = null; } }, 400);
    }, 2500);
  }

  function activateMatrixRain() {
    if (isUnlocked('ENTER THE MATRIX')) return;

    matrixActive = true;
    playBeep(110, 400, 'sawtooth', 0.07);
    screenFlash('#00ff41', 200);

    const canvas = document.createElement('canvas');
    canvas.className = 'ee-matrix-canvas';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    requestAnimationFrame(() => canvas.classList.add('show'));

    const ctx = canvas.getContext('2d');
    const cols = Math.floor(canvas.width / 16);
    const drops = Array(cols).fill(0);
    const chars = 'ROYALSYSTEMAPEXABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

    let frameId;
    function drawMatrix() {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff41';
      ctx.font = '14px monospace';

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = y === 0 ? '#ffffff' : '#00ff41';
        ctx.fillText(char, i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      frameId = requestAnimationFrame(drawMatrix);
    }
    drawMatrix();

    showAchievement('🌧️', 'ENTER THE MATRIX', 'You unlocked the digital rain.');
    showSecretMessage([
      '> INITIATING MATRIX PROTOCOL',
      '> Reality is just a simulation.',
      '> You clicked 10 times. Impressive.',
      '> Or just very bored. Either way — welcome.'
    ], '#00ff41');

    setTimeout(() => {
      cancelAnimationFrame(frameId);
      canvas.classList.remove('show');
      setTimeout(() => canvas.remove(), 600);
      matrixActive = false;
    }, 8000);
  }

  /* ══════════════════════════════════════════
     5. TRIPLE CLICK ON NAME — SECRET CARD
  ══════════════════════════════════════════ */
  function initTripleClick() {
    document.addEventListener('DOMContentLoaded', attachTripleClick);
    attachTripleClick();

    setTimeout(attachTripleClick, 2000);
  }

  function attachTripleClick() {
    const nameEls = document.querySelectorAll('[data-owner-name], .about-id-card__name, #owner-name');
    nameEls.forEach(el => {
      if (el._tripleClickBound) return;
      el._tripleClickBound = true;
      el.addEventListener('click', handleTripleClick);
    });

    // Also watch for dynamically added name elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll('[data-owner-name]').forEach(el => {
        if (el._tripleClickBound) return;
        el._tripleClickBound = true;
        el.addEventListener('click', handleTripleClick);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function handleTripleClick() {
    if (isUnlocked('SHADOW PROTOCOL')) return;

    tripleClickCount++;
    playClickSound();
    clearTimeout(tripleClickTimer);
    tripleClickTimer = setTimeout(() => { tripleClickCount = 0; }, 800);

    if (tripleClickCount >= 3) {
      tripleClickCount = 0;
      showSecretCard();
    }
  }

  function showSecretCard() {
    if (isUnlocked('SHADOW PROTOCOL')) return;

    const existing = document.getElementById('ee-secret-card');
    if (existing) { existing.remove(); return; }

    playBeep(880, 80, 'sine', 0.07);
    playBeep(1100, 120, 'sine', 0.07);
    setTimeout(() => playBeep(1320, 200, 'sine', 0.08), 100);

    screenFlash('#c8a96e', 300);

    const card = document.createElement('div');
    card.id = 'ee-secret-card';
    card.className = 'ee-secret-card';
    card.innerHTML = `
      <div class="ee-secret-card__inner">
        <div class="ee-secret-card__corner tl"></div>
        <div class="ee-secret-card__corner tr"></div>
        <div class="ee-secret-card__corner bl"></div>
        <div class="ee-secret-card__corner br"></div>
        <div class="ee-secret-card__classified">⬛ CLASSIFIED ⬛</div>
        <div class="ee-secret-card__avatar">M</div>
        <div class="ee-secret-card__name">MOHAMMED</div>
        <div class="ee-secret-card__rank">RANK: SHADOW_DEVELOPER</div>
        <div class="ee-secret-card__divider"></div>
        <div class="ee-secret-card__stats">
          <div><span>CLEARANCE</span><strong>LEVEL 7</strong></div>
          <div><span>FACTION</span><strong>ROYAL_SYS</strong></div>
          <div><span>STATUS</span><strong>ACTIVE ●</strong></div>
        </div>
        <div class="ee-secret-card__msg">
          "Not all code is meant to be seen.<br>Some of it just… watches."
        </div>
        <div class="ee-secret-card__uid">UID: 0x????  //  EYES ONLY</div>
        <button class="ee-secret-card__close" onclick="document.getElementById('ee-secret-card').remove()">[ CLOSE FILE ]</button>
      </div>
    `;
    document.body.appendChild(card);
    requestAnimationFrame(() => card.classList.add('show'));

    showAchievement('🃏', 'SHADOW PROTOCOL', 'You found the hidden identity card.');
  }

  /* ══════════════════════════════════════════
     CSS INJECTION
  ══════════════════════════════════════════ */
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `

    /* ── ACHIEVEMENT TOAST ── */
    .ee-achievement {
      position: fixed;
      bottom: 30px; right: 30px;
      display: flex; align-items: center; gap: 16px;
      background: rgba(5,5,5,0.97);
      border: 1px solid var(--c-accent, #c8a96e);
      padding: 16px 20px;
      z-index: 99999;
      min-width: 320px;
      transform: translateX(120%);
      transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
      box-shadow: 0 0 30px rgba(200,169,110,0.2), inset 0 0 20px rgba(200,169,110,0.03);
    }
    .ee-achievement.show { transform: translateX(0); }
    .ee-achievement__icon { font-size: 1.8rem; flex-shrink: 0; }
    .ee-achievement__label {
      font-size: 0.5rem; letter-spacing: 3px;
      color: var(--c-accent, #c8a96e); opacity: 0.7;
      font-family: monospace; margin-bottom: 3px;
    }
    .ee-achievement__title {
      font-size: 0.75rem; letter-spacing: 2px; font-weight: 700;
      color: #fff; font-family: monospace;
    }
    .ee-achievement__desc {
      font-size: 0.6rem; color: rgba(255,255,255,0.4);
      font-family: monospace; margin-top: 2px; letter-spacing: 1px;
    }
    .ee-achievement__glow {
      position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(135deg, rgba(200,169,110,0.05) 0%, transparent 60%);
    }

    /* ── SECRET MESSAGE ── */
    .ee-secret-msg {
      position: fixed; top: 50%; left: 50%; z-index: 99998;
      transform: translate(-50%, -50%) scale(0.85);
      opacity: 0; transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
      pointer-events: none;
    }
    .ee-secret-msg.show { transform: translate(-50%, -50%) scale(1); opacity: 1; pointer-events: auto; }
    .ee-secret-msg__inner {
      background: rgba(3,3,3,0.98);
      border: 1px solid var(--ee-accent, #c8a96e);
      padding: 28px 32px; min-width: 380px;
      box-shadow: 0 0 60px rgba(0,0,0,0.8), 0 0 20px color-mix(in srgb, var(--ee-accent, #c8a96e) 30%, transparent);
    }
    .ee-secret-msg__header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 12px;
    }
    .ee-secret-msg__tag {
      font-size: 0.5rem; letter-spacing: 3px; color: var(--ee-accent, #c8a96e);
      font-family: monospace;
    }
    .ee-secret-msg__close {
      background: none; border: none; color: rgba(255,255,255,0.3);
      cursor: pointer; font-size: 0.7rem; padding: 0;
    }
    .ee-secret-msg__close:hover { color: #fff; }
    .ee-secret-msg__body p {
      font-family: monospace; font-size: 0.7rem; letter-spacing: 1.5px;
      color: var(--ee-accent, #c8a96e); margin: 6px 0; line-height: 1.7;
    }
    .ee-secret-msg__footer {
      margin-top: 20px; font-size: 0.45rem; letter-spacing: 3px;
      color: rgba(255,255,255,0.15); font-family: monospace;
      border-top: 1px solid rgba(255,255,255,0.04); padding-top: 10px;
    }

    /* ── KONAMI OVERLAY ── */
    .ee-cheat-overlay {
      position: fixed; inset: 0; z-index: 99997;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0);
      transition: background 0.4s;
      pointer-events: none;
    }
    .ee-cheat-overlay.show { background: rgba(0,0,0,0.85); }
    .ee-cheat-overlay.hide { background: rgba(0,0,0,0); }
    .ee-cheat-inner { text-align: center; }
    .ee-cheat-tag {
      font-family: monospace; font-size: 0.55rem; letter-spacing: 4px;
      color: var(--c-accent, #c8a96e); opacity: 0;
      transition: opacity 0.5s 0.2s;
    }
    .ee-cheat-overlay.show .ee-cheat-tag { opacity: 0.7; }
    .ee-cheat-title {
      font-size: clamp(3rem, 12vw, 7rem); font-weight: 900;
      letter-spacing: 12px; color: var(--c-accent, #c8a96e);
      font-family: monospace; opacity: 0;
      transform: scale(0.8);
      transition: all 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s;
      text-shadow: 0 0 40px var(--c-accent, #c8a96e);
    }
    .ee-cheat-overlay.show .ee-cheat-title { opacity: 1; transform: scale(1); }
    .ee-cheat-sub {
      font-size: 1rem; letter-spacing: 8px; color: rgba(255,255,255,0.6);
      font-family: monospace; opacity: 0;
      transition: opacity 0.5s 0.5s;
    }
    .ee-cheat-overlay.show .ee-cheat-sub { opacity: 1; }
    .ee-cheat-code {
      margin-top: 20px; font-size: 0.65rem; letter-spacing: 4px;
      color: rgba(255,255,255,0.2); font-family: monospace;
      opacity: 0; transition: opacity 0.5s 0.7s;
    }
    .ee-cheat-overlay.show .ee-cheat-code { opacity: 1; }

    /* ── HACK TERMINAL ── */
    .ee-hack-terminal {
      position: fixed; bottom: 40px; left: 40px; z-index: 99998;
      background: rgba(0,10,0,0.97); border: 1px solid #00ff41;
      padding: 20px 24px; min-width: 400px;
      transform: translateY(20px); opacity: 0;
      transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
      box-shadow: 0 0 30px rgba(0,255,65,0.2), inset 0 0 20px rgba(0,255,65,0.03);
    }
    .ee-hack-terminal.show { transform: translateY(0); opacity: 1; }
    .ee-hack-terminal__header {
      font-family: monospace; font-size: 0.55rem; letter-spacing: 3px;
      color: #00ff41; margin-bottom: 14px; opacity: 0.6;
    }
    .ee-hack-terminal__log {
      font-family: monospace; font-size: 0.65rem; letter-spacing: 1px;
      color: #00ff41; line-height: 2; opacity: 0.9;
    }

    /* ── HEAVY GLITCH ── */
    @keyframes ee-glitch-shift {
      0%   { transform: translate(0); filter: none; }
      10%  { transform: translate(-3px, 1px); filter: hue-rotate(90deg); }
      20%  { transform: translate(3px, -1px); }
      30%  { transform: translate(-2px, 2px); filter: hue-rotate(180deg) brightness(1.2); }
      40%  { transform: translate(2px, -2px); }
      50%  { transform: translate(-3px, 0); filter: hue-rotate(270deg); }
      60%  { transform: translate(3px, 1px); }
      70%  { transform: translate(-1px, -1px); filter: hue-rotate(360deg); }
      80%  { transform: translate(1px, 2px); }
      90%  { transform: translate(-2px, -1px); filter: brightness(1.3); }
      100% { transform: translate(0); filter: none; }
    }
    .ee-glitch-heavy {
      animation: ee-glitch-shift 0.15s infinite;
    }

    /* ── MATRIX CANVAS ── */
    .ee-matrix-canvas {
      position: fixed; inset: 0; z-index: 99990;
      opacity: 0; transition: opacity 0.5s;
      pointer-events: none;
    }
    .ee-matrix-canvas.show { opacity: 0.92; }

    /* ── CLICK PROGRESS ── */
    .ee-click-progress {
      position: fixed; bottom: 24px; left: 50%; z-index: 99998;
      transform: translateX(-50%) translateY(10px);
      display: flex; gap: 6px; align-items: center;
      opacity: 0; transition: all 0.3s;
      pointer-events: none;
    }
    .ee-click-progress.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    .ee-click-progress span {
      width: 8px; height: 8px;
      border: 1px solid rgba(200,169,110,0.3);
      transition: all 0.2s;
    }
    .ee-click-progress span.filled {
      background: var(--c-accent, #c8a96e);
      border-color: var(--c-accent, #c8a96e);
      box-shadow: 0 0 8px var(--c-accent, #c8a96e);
    }

    /* ── THEME BADGE ── */
    .ee-theme-badge {
      position: fixed; top: 50%; left: 50%; z-index: 99999;
      transform: translate(-50%, -50%) scale(0.8);
      text-align: center; opacity: 0;
      transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
      pointer-events: none;
    }
    .ee-theme-badge.show { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    .ee-theme-badge span {
      display: block; font-family: monospace; font-size: 0.5rem;
      letter-spacing: 4px; color: rgba(255,255,255,0.4); margin-bottom: 6px;
    }
    .ee-theme-badge strong {
      display: block; font-family: monospace; font-size: 1.4rem;
      letter-spacing: 8px; color: var(--ee-accent, #c8a96e);
      text-shadow: 0 0 30px var(--ee-accent, #c8a96e);
    }

    /* ── SECRET CARD ── */
    .ee-secret-card {
      position: fixed; top: 50%; left: 50%; z-index: 99998;
      transform: translate(-50%, -50%) rotateY(90deg);
      opacity: 0;
      transition: all 0.6s cubic-bezier(0.16,1,0.3,1);
      perspective: 1000px;
    }
    .ee-secret-card.show {
      transform: translate(-50%, -50%) rotateY(0deg);
      opacity: 1;
    }
    .ee-secret-card__inner {
      background: linear-gradient(135deg, rgba(5,5,5,0.99) 0%, rgba(15,10,5,0.99) 100%);
      border: 1px solid var(--c-accent, #c8a96e);
      padding: 32px 36px; min-width: 340px; text-align: center;
      position: relative;
      box-shadow:
        0 0 60px rgba(0,0,0,0.9),
        0 0 30px rgba(200,169,110,0.15),
        inset 0 0 40px rgba(200,169,110,0.04);
    }
    .ee-secret-card__corner {
      position: absolute; width: 16px; height: 16px;
      border-color: var(--c-accent, #c8a96e); border-style: solid;
    }
    .ee-secret-card__corner.tl { top: 8px; left: 8px; border-width: 1px 0 0 1px; }
    .ee-secret-card__corner.tr { top: 8px; right: 8px; border-width: 1px 1px 0 0; }
    .ee-secret-card__corner.bl { bottom: 8px; left: 8px; border-width: 0 0 1px 1px; }
    .ee-secret-card__corner.br { bottom: 8px; right: 8px; border-width: 0 1px 1px 0; }
    .ee-secret-card__classified {
      font-family: monospace; font-size: 0.45rem; letter-spacing: 3px;
      color: rgba(255,60,60,0.7); margin-bottom: 20px;
    }
    .ee-secret-card__avatar {
      width: 72px; height: 72px; background: var(--c-accent, #c8a96e);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 2rem; font-weight: 900; color: #000; margin: 0 auto 14px;
      box-shadow: 0 0 24px rgba(200,169,110,0.4);
      font-family: monospace;
    }
    .ee-secret-card__name {
      font-family: monospace; font-size: 1.2rem; letter-spacing: 6px;
      color: #fff; font-weight: 700; margin-bottom: 4px;
    }
    .ee-secret-card__rank {
      font-family: monospace; font-size: 0.5rem; letter-spacing: 3px;
      color: var(--c-accent, #c8a96e); opacity: 0.7; margin-bottom: 20px;
    }
    .ee-secret-card__divider {
      height: 1px; background: rgba(200,169,110,0.15); margin: 0 0 20px;
    }
    .ee-secret-card__stats {
      display: flex; gap: 24px; justify-content: center; margin-bottom: 20px;
    }
    .ee-secret-card__stats div { text-align: center; }
    .ee-secret-card__stats span {
      display: block; font-family: monospace; font-size: 0.4rem;
      letter-spacing: 2px; color: rgba(255,255,255,0.3); margin-bottom: 4px;
    }
    .ee-secret-card__stats strong {
      font-family: monospace; font-size: 0.6rem; letter-spacing: 2px;
      color: var(--c-accent, #c8a96e);
    }
    .ee-secret-card__msg {
      font-family: monospace; font-size: 0.58rem; line-height: 1.8;
      color: rgba(255,255,255,0.35); font-style: italic;
      margin-bottom: 20px; letter-spacing: 1px;
    }
    .ee-secret-card__uid {
      font-family: monospace; font-size: 0.4rem; letter-spacing: 2px;
      color: rgba(255,255,255,0.15); margin-bottom: 20px;
    }
    .ee-secret-card__close {
      background: none; border: 1px solid rgba(200,169,110,0.2); color: rgba(255,255,255,0.3);
      font-family: monospace; font-size: 0.5rem; letter-spacing: 2px;
      padding: 8px 20px; cursor: pointer; transition: all 0.2s;
    }
    .ee-secret-card__close:hover {
      border-color: var(--c-accent, #c8a96e);
      color: var(--c-accent, #c8a96e);
    }

    `;
    document.head.appendChild(style);
  }

  /* ══════════════════════════════════════════
     PUBLIC INIT
  ══════════════════════════════════════════ */
  function init() {
    getUnlocked().forEach(title => achievements.add(title));

    injectStyles();
    initKonami();
    initHackWord();
    initMatrixClick();
    initTripleClick();
  }

  /* ══════════════════════════════════════════
    EasterEggs.reset()
  ══════════════════════════════════════════ */
  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    achievements.clear();
    console.log('[EasterEggs] All achievements reset.');
  }

  return { init, reset };

})();
