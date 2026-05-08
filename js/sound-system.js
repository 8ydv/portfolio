/* ═══════════════════════════════════════════════
   ROYAL SYSTEMS — SOUND SYSTEM
   sound-system.js · Complete Audio Engine
   
   Features:
   - Web Audio API generated UI sounds (no files needed)
   - Music player with external file support
   - Real-time audio visualizer (canvas bars)
   - Master volume + mute control
   - Floating mini-player UI
═══════════════════════════════════════════════ */

const SoundSystem = (() => {

  /* ══════════════════════════════════════════
     AUDIO CONTEXT
  ══════════════════════════════════════════ */
  let actx = null;
  let masterGain = null;
  let analyser = null;
  let masterVolume = 0.7;
  let muted = false;

  function getCtx() {
    if (!actx) {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = actx.createGain();
      masterGain.gain.value = masterVolume;

      analyser = actx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;

      masterGain.connect(analyser);
      analyser.connect(actx.destination);
    }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }

  function setMasterVolume(val) {
    masterVolume = Math.max(0, Math.min(1, val));
    if (masterGain) masterGain.gain.setTargetAtTime(muted ? 0 : masterVolume, getCtx().currentTime, 0.05);
    updateVolumeUI();
  }

  function toggleMute() {
    muted = !muted;
    if (masterGain) masterGain.gain.setTargetAtTime(muted ? 0 : masterVolume, getCtx().currentTime, 0.05);
    updateMuteUI();
  }

  /* ══════════════════════════════════════════
     UI SOUND LIBRARY (Web Audio API — no files)
  ══════════════════════════════════════════ */
  const UI = {

    // Generic tone builder
    _tone(freq, dur, type = 'sine', vol = 0.12, attack = 0.01, decay = 0.1) {
      try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.connect(env);
        env.connect(masterGain);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        env.gain.setValueAtTime(0, ctx.currentTime);
        env.gain.linearRampToValueAtTime(vol, ctx.currentTime + attack);
        env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + dur + 0.05);
      } catch(e) {}
    },

    _chord(freqs, dur, type = 'sine', vol = 0.08) {
      freqs.forEach((f, i) => setTimeout(() => this._tone(f, dur, type, vol), i * 30));
    },

    _noise(dur, vol = 0.05) {
      try {
        const ctx = getCtx();
        const bufSize = ctx.sampleRate * dur;
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const env = ctx.createGain();
        const filt = ctx.createBiquadFilter();
        filt.type = 'bandpass';
        filt.frequency.value = 1200;
        src.connect(filt);
        filt.connect(env);
        env.connect(masterGain);
        env.gain.setValueAtTime(vol, ctx.currentTime);
        env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        src.start(ctx.currentTime);
        src.stop(ctx.currentTime + dur + 0.05);
      } catch(e) {}
    },

    // ── INDIVIDUAL SOUNDS ──────────────────
    click()      { this._tone(1200, 0.08, 'square', 0.06); },
    hover()      { this._tone(800,  0.05, 'sine',   0.03); },
    tabSwitch()  {
      this._tone(440, 0.12, 'sine', 0.08);
      setTimeout(() => this._tone(660, 0.15, 'sine', 0.06), 80);
    },
    open()       {
      this._tone(330, 0.08, 'sine', 0.07);
      setTimeout(() => this._tone(440, 0.08, 'sine', 0.07), 60);
      setTimeout(() => this._tone(550, 0.15, 'sine', 0.07), 120);
    },
    close()      {
      this._tone(550, 0.08, 'sine', 0.07);
      setTimeout(() => this._tone(440, 0.08, 'sine', 0.07), 60);
      setTimeout(() => this._tone(330, 0.15, 'sine', 0.05), 120);
    },
    success()    { this._chord([523, 659, 784, 1047], 0.4, 'sine', 0.07); },
    error()      {
      this._tone(200, 0.15, 'sawtooth', 0.07);
      setTimeout(() => this._tone(150, 0.3, 'sawtooth', 0.05), 150);
    },
    boot()       {
      [110, 165, 220, 330, 440, 660].forEach((f, i) =>
        setTimeout(() => this._tone(f, 0.2, 'sine', 0.08), i * 80)
      );
    },
    notification() {
      this._tone(880, 0.1, 'sine', 0.08);
      setTimeout(() => this._tone(1100, 0.2, 'sine', 0.06), 120);
    },
    glitch()     {
      [440, 220, 880, 110, 660].forEach((f, i) =>
        setTimeout(() => this._noise(0.05, 0.08 - i * 0.01), i * 40)
      );
    },
    achievement() {
      const melody = [523, 659, 784, 659, 784, 1047];
      melody.forEach((f, i) => setTimeout(() => this._tone(f, 0.18, 'sine', 0.09), i * 90));
    },
    cardFlip()   {
      this._noise(0.05, 0.04);
      setTimeout(() => this._tone(660, 0.15, 'sine', 0.06), 30);
    },
    powerDown()  {
      const freqs = [440, 330, 220, 165, 110, 55];
      freqs.forEach((f, i) => setTimeout(() => this._tone(f, 0.25, 'sawtooth', 0.06), i * 100));
    },
  };

  /* ══════════════════════════════════════════
     MUSIC PLAYER
  ══════════════════════════════════════════ */
  const Player = (() => {
    let audio = null;
    let sourceNode = null;
    let tracks = [];
    let currentIdx = 0;
    let isPlaying = false;
    let playerEl = null;
    let progressRaf = null;

    // Default tracks — can be overridden
    const DEFAULT_TRACKS = [
    ];

    function setTracks(trackList) {
      tracks = trackList;
      if (playerEl) renderTrackInfo();
    }

    function init(trackList = DEFAULT_TRACKS) {
  tracks = trackList;

  const bgEl = document.getElementById('bgMusic');
  if (tracks.length === 0 && bgEl) {
    const src = bgEl.querySelector('source')?.src || bgEl.src;
    tracks = [{ title: 'GHOST_SIGNAL_X', artist: 'ROYAL_SYS', src }];
  }

  audio = bgEl || new Audio();
audio.volume = masterVolume;
audio.loop = true;
audio.onended = () => {
  audio.currentTime = 0;
  audio.play().catch(() => {});
};
audio.ontimeupdate = updateProgress;
audio.onloadedmetadata = updateProgress;
audio.onplay = () => {
  isPlaying = true;
  updatePlayBtn();
};
audio.onpause = () => {
  isPlaying = false;
  updatePlayBtn();
};

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && audio && audio.paused && isPlaying) {
    audio.play().catch(() => {});
  }
});

  try {
    const ctx = getCtx();
    if (!sourceNode) {
      sourceNode = ctx.createMediaElementSource(audio);
      sourceNode.connect(masterGain);
    }
  } catch(e) {}

  buildPlayerUI();
  requestAnimationFrame(() => {
    if (playerEl) playerEl.classList.add('show');
  });
}

    function buildPlayerUI() {
      if (document.getElementById('ss-player')) {
        playerEl = document.getElementById('ss-player');
        return;
      }

      playerEl = document.createElement('div');
      playerEl.id = 'ss-player';
      playerEl.className = 'ss-player';
      playerEl.innerHTML = `
        <div class="ss-player__header">
          <span class="ss-player__label">// AUDIO_SYSTEM</span>
          <div class="ss-player__controls-top">
            <button class="ss-player__mute" id="ss-mute-btn" title="Mute/Unmute">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path class="ss-vol-lines" d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            </button>
            <input type="range" class="ss-player__vol" id="ss-vol" min="0" max="100" value="70" title="Volume">
          </div>
        </div>

        <div class="ss-player__track-info">
          <div class="ss-player__track-name" id="ss-track-name">NO_TRACK_LOADED</div>
          <div class="ss-player__track-artist" id="ss-track-artist">—</div>
        </div>

        <div class="ss-player__progress-wrap">
          <span class="ss-player__time" id="ss-time-cur">0:00</span>
          <div class="ss-player__progress" id="ss-progress-bar">
            <div class="ss-player__progress-fill" id="ss-progress-fill"></div>
          </div>
          <span class="ss-player__time" id="ss-time-tot">0:00</span>
        </div>

        <div class="ss-player__controls">
          <button class="ss-btn" id="ss-prev" title="Previous">&#9664;&#9664;</button>
          <button class="ss-btn ss-btn--main" id="ss-play" title="Play/Pause">&#9654;</button>
          <button class="ss-btn" id="ss-next" title="Next">&#9654;&#9654;</button>
          <button class="ss-btn ss-btn--loop" id="ss-loop" title="Loop">⟳</button>
        </div>

        <canvas class="ss-visualizer" id="ss-visualizer" height="40"></canvas>

        <div class="ss-player__track-list" id="ss-track-list"></div>
      `;

      document.body.appendChild(playerEl);

      // Events
      document.getElementById('ss-play').addEventListener('click', togglePlay);
      document.getElementById('ss-prev').addEventListener('click', prevTrack);
      document.getElementById('ss-next').addEventListener('click', nextTrack);
      document.getElementById('ss-loop').addEventListener('click', toggleLoop);
      document.getElementById('ss-mute-btn').addEventListener('click', () => { toggleMute(); UI.click(); });
      document.getElementById('ss-progress-bar').addEventListener('click', seek);

      const volSlider = document.getElementById('ss-vol');
      volSlider.addEventListener('input', (e) => {
        setMasterVolume(e.target.value / 100);
        if (audio) audio.volume = masterVolume;
        UI.hover();
      });

      renderTrackList();
      renderTrackInfo();
      startVisualizer();
    }

    function renderTrackInfo() {
      const nameEl = document.getElementById('ss-track-name');
      const artistEl = document.getElementById('ss-track-artist');
      if (!nameEl) return;
      if (tracks.length > 0) {
        nameEl.textContent = tracks[currentIdx]?.title || 'UNKNOWN_TRACK';
        artistEl.textContent = tracks[currentIdx]?.artist || '—';
      } else {
        nameEl.textContent = 'NO_TRACK_LOADED';
        artistEl.textContent = 'ADD TRACKS TO PLAYLIST';
      }
    }

    function renderTrackList() {
      const listEl = document.getElementById('ss-track-list');
      if (!listEl) return;
      if (tracks.length === 0) {
        listEl.innerHTML = '<div class="ss-no-tracks">// No tracks loaded<br>Add mp3 files via SoundSystem.Player.setTracks([])</div>';
        return;
      }
      listEl.innerHTML = tracks.map((t, i) => `
        <div class="ss-track-item ${i === currentIdx ? 'active' : ''}" data-idx="${i}">
          <span class="ss-track-item__num">${String(i+1).padStart(2,'0')}</span>
          <span class="ss-track-item__title">${t.title}</span>
          <span class="ss-track-item__dur">${t.duration || '--:--'}</span>
        </div>
      `).join('');
      listEl.querySelectorAll('.ss-track-item').forEach(el => {
        el.addEventListener('click', () => { loadTrack(parseInt(el.dataset.idx)); play(); UI.click(); });
      });
    }

    function loadTrack(idx) {
      if (!tracks[idx]) return;
      currentIdx = idx;
      audio.src = tracks[idx].src;
      audio.load();
      renderTrackInfo();
      renderTrackList();
    }

    function play() {
      if (tracks.length === 0) return;
      if (!audio.src && tracks[0]) loadTrack(0);
      audio.play().then(() => {
        isPlaying = true;
        updatePlayBtn();
      }).catch(e => console.warn('Playback blocked:', e));
    }

    function pause() {
      audio.pause();
      isPlaying = false;
      updatePlayBtn();
    }

    function togglePlay() {
      UI.click();
      isPlaying ? pause() : play();
    }

    function nextTrack() {
      if (tracks.length === 0) return;
      currentIdx = (currentIdx + 1) % tracks.length;
      loadTrack(currentIdx);
      if (isPlaying) play();
      UI.tabSwitch();
    }

    function prevTrack() {
      if (tracks.length === 0) return;
      currentIdx = (currentIdx - 1 + tracks.length) % tracks.length;
      loadTrack(currentIdx);
      if (isPlaying) play();
      UI.tabSwitch();
    }

    function toggleLoop() {
      audio.loop = !audio.loop;
      document.getElementById('ss-loop').classList.toggle('active', audio.loop);
      UI.click();
    }

    function seek(e) {
      if (!audio.duration) return;
      const bar = document.getElementById('ss-progress-bar');
      const rect = bar.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      audio.currentTime = ratio * audio.duration;
    }

    function updateProgress() {
      if (!audio.duration) return;
      const ratio = audio.currentTime / audio.duration;
      const fill = document.getElementById('ss-progress-fill');
      const cur  = document.getElementById('ss-time-cur');
      const tot  = document.getElementById('ss-time-tot');
      if (fill) fill.style.width = (ratio * 100) + '%';
      if (cur)  cur.textContent  = formatTime(audio.currentTime);
      if (tot)  tot.textContent  = formatTime(audio.duration);
    }

    function updatePlayBtn() {
      const btn = document.getElementById('ss-play');
      if (btn) btn.innerHTML = isPlaying ? '&#9646;&#9646;' : '&#9654;';
    }

    function formatTime(s) {
      if (isNaN(s)) return '0:00';
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${m}:${String(sec).padStart(2,'0')}`;
    }

    return { init, setTracks, play, pause, togglePlay, nextTrack, prevTrack };
  })();

  /* ══════════════════════════════════════════
     VISUALIZER
  ══════════════════════════════════════════ */
  function startVisualizer() {
    const canvas = document.getElementById('ss-visualizer');
    if (!canvas) return;
    const ctx2d = canvas.getContext('2d');

    function resize() {
      canvas.width = canvas.offsetWidth;
    }
    resize();
    window.addEventListener('resize', resize);

    const bufLen = analyser ? analyser.frequencyBinCount : 64;
    const dataArr = new Uint8Array(bufLen);

    function draw() {
      requestAnimationFrame(draw);
      if (!analyser) return;
      analyser.getByteFrequencyData(dataArr);

      const W = canvas.width;
      const H = canvas.height;
      ctx2d.clearRect(0, 0, W, H);

      const barCount = 32;
      const barW = (W / barCount) - 1.5;
      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--c-accent').trim() || '#c8a96e';

      for (let i = 0; i < barCount; i++) {
        const value = dataArr[Math.floor(i * bufLen / barCount)] / 255;
        const barH = Math.max(2, value * H);
        const alpha = 0.3 + value * 0.7;

        ctx2d.fillStyle = accentColor;
        ctx2d.globalAlpha = alpha;
        ctx2d.fillRect(i * (barW + 1.5), H - barH, barW, barH);

        // Mirror top
        ctx2d.globalAlpha = alpha * 0.3;
        ctx2d.fillRect(i * (barW + 1.5), 0, barW, barH * 0.3);
      }
      ctx2d.globalAlpha = 1;
    }
    draw();
  }

  /* ══════════════════════════════════════════
     VOLUME UI HELPERS
  ══════════════════════════════════════════ */
  function updateVolumeUI() {
    const slider = document.getElementById('ss-vol');
    if (slider) slider.value = Math.round(masterVolume * 100);
  }

  function updateMuteUI() {
    const btn = document.getElementById('ss-mute-btn');
    if (!btn) return;
    const lines = btn.querySelector('.ss-vol-lines');
    if (lines) lines.style.opacity = muted ? '0' : '1';
    btn.style.opacity = muted ? '0.4' : '1';
  }

  /* ══════════════════════════════════════════
     AUTO-ATTACH UI SOUNDS
  ══════════════════════════════════════════ */
  function attachUISounds() {
    // Hover sounds
    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest('.nav__item, .proj-card, .skill-tag');
      if (el && !el._hoverSound) {
        el._hoverSound = true;
        UI.hover();
        setTimeout(() => { el._hoverSound = false; }, 300);
      }
    });

    // Click sounds
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button:not(.ss-btn):not(#ss-mute-btn), .nav__item');
      if (btn) UI.click();
    });

    // Tab switch sounds — patch Tabs module
    const origActivate = window.Tabs?.activate;
    if (origActivate) {
      Tabs.activate = function(index, silent) {
        if (index !== Tabs.getCurrent()) UI.tabSwitch();
        return origActivate.call(Tabs, index, silent);
      };
    }

    // Project open/close
    const origOpen = window.System?.openProjectDetail;
    const origClose = window.System?.closeProjectDetail;
    if (origOpen) System.openProjectDetail = function(id) { UI.open(); return origOpen.call(System, id); };
    if (origClose) System.closeProjectDetail = function() { UI.close(); return origClose.call(System); };
  }

  /* ══════════════════════════════════════════
     CSS INJECTION
  ══════════════════════════════════════════ */
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `

    /* ── PLAYER CONTAINER ── */
    .ss-player {
      position: fixed;
      bottom: 20px; right: 20px;
      width: 220px;
      background: rgba(4,4,4,0.97);
      border: 1px solid rgba(200,169,110,0.25);
      z-index: 9000;
      transform: translateY(16px);
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
      box-shadow: 0 0 40px rgba(0,0,0,0.8), 0 0 20px rgba(200,169,110,0.08);
      font-family: monospace;
    }
    .ss-player.show { transform: translateY(0); opacity: 1; }

    /* ── HEADER ── */
    .ss-player__header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px 8px;
      border-bottom: 1px solid rgba(200,169,110,0.08);
    }
    .ss-player__label {
      font-size: 0.45rem; letter-spacing: 3px;
      color: var(--c-accent, #c8a96e); opacity: 0.6;
    }
    .ss-player__controls-top {
      display: flex; align-items: center; gap: 8px;
    }
    .ss-player__mute {
      background: none; border: none; color: rgba(255,255,255,0.4);
      cursor: pointer; padding: 0; display: flex; align-items: center;
      transition: color 0.2s;
    }
    .ss-player__mute:hover { color: var(--c-accent, #c8a96e); }

    /* ── VOLUME SLIDER ── */
    .ss-player__vol {
      -webkit-appearance: none;
      width: 70px; height: 2px;
      background: rgba(255,255,255,0.1);
      border-radius: 2px; outline: none; cursor: pointer;
    }
    .ss-player__vol::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 10px; height: 10px;
      background: var(--c-accent, #c8a96e);
      border-radius: 50%;
      box-shadow: 0 0 6px var(--c-accent, #c8a96e);
      cursor: pointer;
    }

    /* ── TRACK INFO ── */
    .ss-player__track-info {
      padding: 8px 12px 6px;
    }
    .ss-player__track-name {
      font-size: 0.55rem; letter-spacing: 2px; color: #fff;
      font-weight: 700; white-space: nowrap;
      overflow: hidden; text-overflow: ellipsis;
    }
    .ss-player__track-artist {
      font-size: 0.45rem; letter-spacing: 2px;
      color: rgba(255,255,255,0.3); margin-top: 2px;
    }

    /* ── PROGRESS ── */
    .ss-player__progress-wrap {
      display: flex; align-items: center; gap: 8px;
      padding: 0 14px 10px;
    }
    .ss-player__time {
      font-size: 0.45rem; color: rgba(255,255,255,0.3);
      letter-spacing: 1px; flex-shrink: 0;
    }
    .ss-player__progress {
      flex: 1; height: 2px; background: rgba(255,255,255,0.08);
      cursor: pointer; position: relative;
    }
    .ss-player__progress:hover { height: 3px; }
    .ss-player__progress-fill {
      height: 100%; background: var(--c-accent, #c8a96e);
      width: 0%; transition: width 0.3s linear;
      box-shadow: 0 0 6px var(--c-accent, #c8a96e);
    }

    /* ── CONTROLS ── */
    .ss-player__controls {
      display: flex; align-items: center; justify-content: center;
      gap: 6px; padding: 4px 12px 8px;
    }
    .ss-btn {
      background: none; border: 1px solid rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.5); cursor: pointer;
      padding: 5px 9px; font-size: 0.5rem;
      transition: all 0.2s; letter-spacing: 1px;
    }
    .ss-btn:hover {
      border-color: var(--c-accent, #c8a96e);
      color: var(--c-accent, #c8a96e);
    }
    .ss-btn--main {
      padding: 7px 14px; font-size: 0.6rem;
      border-color: var(--c-accent, #c8a96e);
      color: var(--c-accent, #c8a96e);
      box-shadow: 0 0 12px rgba(200,169,110,0.15);
    }
    .ss-btn--main:hover {
      background: rgba(200,169,110,0.1);
      box-shadow: 0 0 20px rgba(200,169,110,0.3);
    }
    .ss-btn--loop.active {
      color: var(--c-accent, #c8a96e);
      border-color: var(--c-accent, #c8a96e);
    }

    /* ── VISUALIZER ── */
    .ss-visualizer {
      display: block; width: 100%;
      height: 28px;
      border-top: 1px solid rgba(200,169,110,0.06);
      border-bottom: 1px solid rgba(200,169,110,0.06);
    }

    /* ── TRACK LIST ── */
    .ss-player__track-list {
      max-height: 80px; overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(200,169,110,0.2) transparent;
      padding: 4px 0;
    }
    .ss-track-item {
      display: flex; align-items: center; gap: 10px;
      padding: 6px 14px; cursor: pointer;
      transition: background 0.15s;
      font-size: 0.55rem; letter-spacing: 1px;
      color: rgba(255,255,255,0.35);
    }
    .ss-track-item:hover { background: rgba(200,169,110,0.05); color: rgba(255,255,255,0.7); }
    .ss-track-item.active { color: var(--c-accent, #c8a96e); background: rgba(200,169,110,0.06); }
    .ss-track-item__num { opacity: 0.4; flex-shrink: 0; }
    .ss-track-item__title { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ss-track-item__dur { opacity: 0.4; flex-shrink: 0; }
    .ss-no-tracks {
      padding: 14px; font-size: 0.5rem; letter-spacing: 1px;
      color: rgba(255,255,255,0.2); line-height: 1.8;
    }

    `;
    document.head.appendChild(style);
  }

  /* ══════════════════════════════════════════
     PUBLIC INIT
  ══════════════════════════════════════════ */
  function init(tracks = []) {
    injectStyles();
    Player.init(tracks);
    // attachUISounds بعد تفاعل المستخدم
    document.addEventListener('click', () => attachUISounds(), { once: true });
  }

  return { init, UI, Player, setMasterVolume, toggleMute, getAnalyser: () => analyser };

})();
