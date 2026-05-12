const cursorEl = document.getElementById('cursor');
const cursorOuter = document.getElementById('cursor-outer');
const cursorInner = document.getElementById('cursor-inner');

let mouseX = 0, mouseY = 0;
let outerX = 0, outerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorInner.style.left = mouseX + 'px';
  cursorInner.style.top = mouseY + 'px';
});

function animateCursor() {
  outerX += (mouseX - outerX) * 0.12;
  outerY += (mouseY - outerY) * 0.12;
  cursorOuter.style.left = outerX + 'px';
  cursorOuter.style.top = outerY + 'px';

  ['tl','tr','bl','br'].forEach(id => {
    const el = document.getElementById('cursor-corner-' + id);
    if (el) {
      el.style.left = outerX + 'px';
      el.style.top = outerY + 'px';
    }
  });

  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('button, a, .menu-item, .enter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, lines = [], particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function initLines() {
  lines = [];
  const count = 18;
  for (let i = 0; i < count; i++) {
    lines.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      len: 60 + Math.random() * 140,
      opacity: 0.03 + Math.random() * 0.05,
      angle: Math.random() * Math.PI * 2,
      aSpeed: (Math.random() - 0.5) * 0.003,
    });
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.5 + Math.random() * 1.2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      opacity: 0.1 + Math.random() * 0.25,
    });
  }
}

function drawBg() {
  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(200,169,110,0.025)';
  ctx.lineWidth = 1;
  const gs = 80;
  for (let x = 0; x < W; x += gs) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += gs) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  for (let l of lines) {
    l.x += l.vx; l.y += l.vy; l.angle += l.aSpeed;
    if (l.x < -l.len) l.x = W + l.len;
    if (l.x > W + l.len) l.x = -l.len;
    if (l.y < -l.len) l.y = H + l.len;
    if (l.y > H + l.len) l.y = -l.len;

    const dx = Math.cos(l.angle) * l.len / 2;
    const dy = Math.sin(l.angle) * l.len / 2;

    const grad = ctx.createLinearGradient(l.x - dx, l.y - dy, l.x + dx, l.y + dy);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, `rgba(200,169,110,${l.opacity})`);
    grad.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.moveTo(l.x - dx, l.y - dy);
    ctx.lineTo(l.x + dx, l.y + dy);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  for (let p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,169,110,${p.opacity})`;
    ctx.fill();
  }

  requestAnimationFrame(drawBg);
}

resize(); initLines(); initParticles(); drawBg();
window.addEventListener('resize', () => { resize(); initLines(); initParticles(); });

function enterSite() {
  const intro = document.getElementById('introScreen');
  const main = document.getElementById('mainLayout');
  const bar = document.getElementById('audioBar');
  const cursor = document.getElementById('cursor');

  intro.classList.add('hidden');
  cursor.style.display = 'block';
  cursor.style.zIndex = '99999';

  setTimeout(() => {
    main.classList.add('visible');
    bar.classList.add('visible');
    const audio = document.getElementById('bgAudio');
    audio.volume = 0.7;
    audio.play().catch(() => {});
    document.getElementById('pauseIcon').style.display = '';
    document.getElementById('playIcon').style.display = 'none';
    document.getElementById('audioBars').classList.add('playing');

    document.querySelectorAll('button, a, .menu-item').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }, 400);
}

let isPlaying = false;

function toggleAudio() {
  const audio = document.getElementById('bgAudio');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const bars = document.getElementById('audioBars');

  if (audio.paused) {
    audio.play();
    playIcon.style.display = 'none';
    pauseIcon.style.display = '';
    bars.classList.add('playing');
    isPlaying = true;
  } else {
    audio.pause();
    playIcon.style.display = '';
    pauseIcon.style.display = 'none';
    bars.classList.remove('playing');
    isPlaying = false;
  }
}

function setVolume(val) {
  const audio = document.getElementById('bgAudio');
  audio.volume = val / 100;
  const slider = document.getElementById('volSlider');
  slider.style.setProperty('--val', val + '%');
}

function openItem(el, title, desc) {
  document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');

  document.getElementById('popupTitle').textContent = title;
  document.getElementById('popupDesc').textContent = desc;
  document.getElementById('contentPopup').classList.add('show');
  document.getElementById('backdrop').classList.add('show');
}

function closePopup() {
  document.getElementById('contentPopup').classList.remove('show');
  document.getElementById('backdrop').classList.remove('show');
}
