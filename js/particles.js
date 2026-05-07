/* ═══════════════════════════════════════════════
   ROYAL SYSTEMS — PARTICLE SYSTEM
   particles.js · Canvas Background Animation
═══════════════════════════════════════════════ */

const Particles = (() => {

  let canvas, ctx, particles, rafId;
  let W = 0, H = 0;
  let mouseX = -999, mouseY = -999;

  /* ── CONFIG ──────────────────────────────── */
  const CFG = {
    count:        55,
    speedMin:     0.3,
    speedMax:     1.4,
    lenMin:       8,
    lenMax:       28,
    alphaMin:     0.05,
    alphaMax:     0.18,
    mouseRadius:  100,
    mouseForce:   0.012,
  };

  /* ── PARTICLE CLASS ──────────────────────── */
  class Particle {
    constructor() { this.reset(true); }

    reset(randomY = false) {
      this.x     = Math.random() * W;
      this.y     = randomY ? Math.random() * H : -CFG.lenMax;
      this.speed = CFG.speedMin + Math.random() * (CFG.speedMax - CFG.speedMin);
      this.len   = CFG.lenMin   + Math.random() * (CFG.lenMax   - CFG.lenMin);
      this.alpha = CFG.alphaMin + Math.random() * (CFG.alphaMax - CFG.alphaMin);
      this.vx    = 0;
    }

    update() {
      // Mouse repulsion
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CFG.mouseRadius && dist > 0) {
        const force = (CFG.mouseRadius - dist) / CFG.mouseRadius;
        this.vx += (dx / dist) * force * CFG.mouseForce * 8;
      }

      this.vx *= 0.92; // damping
      this.x  += this.vx;
      this.y  += this.speed;

      if (this.y > H + this.len) this.reset();
    }

    draw(ctx) {
      ctx.globalAlpha = this.alpha;
      ctx.fillRect(this.x, this.y, 1, this.len);
    }
  }

  /* ── INIT ────────────────────────────────── */
  function init() {
    canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();
    buildParticles();

    window.addEventListener('resize',    resize);
    window.addEventListener('mousemove', onMouseMove);

    render();
  }

  function buildParticles() {
    particles = Array.from({ length: CFG.count }, () => new Particle());
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    if (particles) particles.forEach(p => {
      if (p.x > W) p.x = Math.random() * W;
    });
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  /* ── RENDER LOOP ─────────────────────────── */
  function render() {
    ctx.clearRect(0, 0, W, H);

    // Deep black background
    ctx.fillStyle = '#010101';
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, W, H);

    // Particles
    ctx.fillStyle = '#ffffff';
    particles.forEach(p => { p.update(); p.draw(ctx); });

    // Subtle vignette
    const vg = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.85);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.globalAlpha = 1;
    ctx.fillStyle   = vg;
    ctx.fillRect(0, 0, W, H);

    rafId = requestAnimationFrame(render);
  }

  /* ── PUBLIC API ──────────────────────────── */
  function pause()  { cancelAnimationFrame(rafId); }
  function resume() { render(); }

  function setIntensity(level) {
    // level: 0 = idle, 1 = active, 2 = alert
    switch(level) {
      case 0: CFG.speedMax = 0.8;  CFG.alphaMax = 0.1;  break;
      case 1: CFG.speedMax = 1.4;  CFG.alphaMax = 0.18; break;
      case 2: CFG.speedMax = 2.5;  CFG.alphaMax = 0.3;  break;
    }
  }

  return { init, pause, resume, setIntensity };

})();
