/* ═══════════════════════════════════════════════
   ROYAL SYSTEMS — VIEW COUNTER WIDGET
   view-counter.js · Live Visitor Counter
═══════════════════════════════════════════════ */

const ViewCounter = (() => {

  /* ══════════════════════════════════════════
     CONFIG
  ══════════════════════════════════════════ */
  const CONFIG = {
    namespace: 'royalmenu',
    key:       'royalmenu_xyz_visits',
    apiBase:   'https://api.counterapi.dev/v1',
  };

  /* ══════════════════════════════════════════
     FETCH & INCREMENT
  ══════════════════════════════════════════ */
  async function getCount() {
    try {
      const res = await fetch(`${CONFIG.apiBase}/${CONFIG.namespace}/${CONFIG.key}/up`);
      const data = await res.json();
      return data.count ?? data.value ?? 0;
    } catch {
      const local = parseInt(localStorage.getItem('vc_fallback') || '0') + 1;
      localStorage.setItem('vc_fallback', local);
      return local;
    }
  }

  /* ══════════════════════════════════════════
     FORMAT NUMBER  →  1,234,567
  ══════════════════════════════════════════ */
  function formatNum(n) {
    return Number(n).toLocaleString('en-US');
  }

  /* ══════════════════════════════════════════
     ANIMATE COUNTER (roll-up effect)
  ══════════════════════════════════════════ */
  function animateCount(el, target) {
    const duration = 1800;
    const start    = performance.now();
    const from     = 0;

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const current  = Math.round(from + (target - from) * ease);
      el.textContent = formatNum(current);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ══════════════════════════════════════════
     BUILD WIDGET
  ══════════════════════════════════════════ */
  function buildWidget() {
    const widget = document.createElement('div');
    widget.id        = 'vc-widget';
    widget.className = 'vc-widget';
    widget.innerHTML = `
      <div class="vc-inner">
        <div class="vc-label">
          <span class="vc-dot"></span>
          VISITORS
        </div>
        <div class="vc-number" id="vc-number">—</div>
        <div class="vc-sub">TOTAL VISITS</div>
      </div>
      <div class="vc-corner vc-tl"></div>
      <div class="vc-corner vc-br"></div>
    `;
    document.body.appendChild(widget);

    requestAnimationFrame(() => {
      setTimeout(() => widget.classList.add('vc-show'), 0);
    });

    return widget;
  }

  /* ══════════════════════════════════════════
     INJECT STYLES
  ══════════════════════════════════════════ */
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `

    /* ── WIDGET SHELL ── */
    .vc-widget {
      position: fixed;
      bottom: 109px;
      left: 50px;
      z-index: 9000;
      opacity: 0;
      transform: translateY(12px);
      transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1),
                  transform 0.6s cubic-bezier(0.16,1,0.3,1);
      pointer-events: none;
    }
    .vc-widget.vc-show {
      opacity: 1;
      transform: translateY(0);
    }

    /* ── INNER CARD ── */
    .vc-inner {
      background: rgba(6, 5, 4, 0.92);
      border: 1px solid rgba(200, 169, 110, 0.25);
      padding: 14px 20px 12px;
      min-width: 130px;
      position: relative;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow:
        0 0 0 1px rgba(0,0,0,0.6),
        0 8px 32px rgba(0,0,0,0.5),
        inset 0 0 24px rgba(200,169,110,0.03);
    }

    /* ── CORNER ACCENTS ── */
    .vc-corner {
      position: absolute;
      width: 10px;
      height: 10px;
      border-color: var(--c-accent, #c8a96e);
      border-style: solid;
      opacity: 0.5;
    }
    .vc-tl { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
    .vc-br { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }

    /* ── LABEL ROW ── */
    .vc-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: monospace;
      font-size: 0.42rem;
      letter-spacing: 3px;
      color: rgba(200, 169, 110, 0.5);
      margin-bottom: 6px;
    }

    /* ── LIVE DOT ── */
    .vc-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--c-accent, #c8a96e);
      box-shadow: 0 0 6px var(--c-accent, #c8a96e);
      animation: vc-pulse 2s ease-in-out infinite;
      flex-shrink: 0;
    }
    @keyframes vc-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.4; transform: scale(0.7); }
    }

    /* ── MAIN NUMBER ── */
    .vc-number {
      font-family: monospace;
      font-size: 1.45rem;
      font-weight: 700;
      letter-spacing: 2px;
      color: var(--c-accent, #c8a96e);
      line-height: 1;
      margin-bottom: 5px;
      text-shadow: 0 0 20px rgba(200,169,110,0.3);
    }

    /* ── SUB LABEL ── */
    .vc-sub {
      font-family: monospace;
      font-size: 0.38rem;
      letter-spacing: 2.5px;
      color: rgba(255,255,255,0.12);
    }

    @media (max-width: 768px) {
  .vc-widget {
    bottom: 20px;
    left: 16px;
    transform: translateY(12px);
  }
  .vc-widget.vc-show {
    transform: translateY(0);
  }
}

    `;
    document.head.appendChild(style);
  }

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */
  async function init() {
    injectStyles();
    const widget    = buildWidget();
    const numberEl  = widget.querySelector('#vc-number');

    const count = await getCount();
    animateCount(numberEl, count);
  }

  return { init };

})();
