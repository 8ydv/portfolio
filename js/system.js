const System = (() => {

  let appEl, projectsData;

  async function init() {
    appEl = document.getElementById('app');
    await loadData();
    initClock();
    buildProjects();
    buildAbout();
    buildDashboard();
    initProjectDetail();
    initKeyboard();
    initHoverables();
  }

  async function loadData() {
    try {
      const res = await fetch('data/projects.json');
      if (!res.ok) throw new Error('fetch failed');
      projectsData = await res.json();
    } catch (e) {
      projectsData = getFallbackData();
    }
  }

  function getFallbackData() {
    return {
      projects: [
        {
          id:'aw', uid:'0x8821', title:'ADVANCED WARFARE',
          subtitle:'Call of Duty Series', year:'2014',
          genre:'FPS / ACTION', platform:'PC · PS4 · XBOX',
          status:'COMPLETED',
          description:'Future-warfare FPS featuring advanced exoskeleton mechanics, vertical movement, and high-tech weaponry. One of the most innovative entries in the franchise.',
          tags:['FPS','Multiplayer','Campaign','Zombies'],
          image:'assets/images/aw.png', color:'#c8a96e',
          stats:{ rating:9.1, hours:120, achievements:47 }
        },
        {
          id:'mwr', uid:'0x4412', title:'MODERN WARFARE R',
          subtitle:'Remastered Edition', year:'2016',
          genre:'FPS / TACTICAL', platform:'PC · PS4 · XBOX',
          status:'COMPLETED',
          description:'A faithful remaster of the groundbreaking original with upgraded visuals, rebalanced audio, and refined gameplay. The definitive version of a classic.',
          tags:['FPS','Remaster','Classic','Multiplayer'],
          image:'assets/images/mwr.png', color:'#7ea8c8',
          stats:{ rating:9.4, hours:95, achievements:39 }
        },
        {
          id:'ww2', uid:'0x1102', title:'WORLD WAR II',
          subtitle:'Call of Duty Series', year:'2017',
          genre:'FPS / HISTORICAL', platform:'PC · PS4 · XBOX',
          status:'COMPLETED',
          description:'A return to roots on the European theater with visceral infantry combat, a moving campaign, and War mode built for teamwork.',
          tags:['FPS','Historical','War','Co-op'],
          image:'assets/images/ww2.png', color:'#a0896b',
          stats:{ rating:8.8, hours:80, achievements:33 }
        }
      ],
      owner: {
        name:'MOHAMMED', title:'GAME SYSTEMS DEVELOPER',
        bio:'Passionate about game development and interactive design. Specializing in front-end systems, UI/UX for games, and building polished digital experiences that leave an impression.',
        skills:['HTML / CSS / JS','Game UI Design','System Architecture','Interactive Media','Visual Design'],
        contact:{ email:'otiebym@gmail.com', support:'https://ko-fi.com/imedo', discord:'9id.' },
        stats:{ projects:3, hours:295, achievements:119, years:2 }
      }
    };
  }

  function initCursor() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    if (!dot || !ring || window.matchMedia('(hover: none)').matches) {
      if (dot)  dot.style.display  = 'none';
      if (ring) ring.style.display = 'none';
      document.body.style.cursor = 'auto';
      return;
    }

    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let rx = tx, ry = ty;
    let visible = false;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
      }
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
      visible = false;
    });

    document.addEventListener('mouseenter', () => {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
      visible = true;
    });

    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

    dot.style.opacity  = '0';
    ring.style.opacity = '0';

    function tick() {
      if (visible) {
        dot.style.left = tx + 'px';
        dot.style.top  = ty + 'px';

        rx += (tx - rx) * 0.14;
        ry += (ty - ry) * 0.14;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
      }

      requestAnimationFrame(tick);
    }
    tick();
  }

  function initHoverables() {
    const SEL = 'button, .nav__item, .proj-card, .skill-tag, .contact-item, .header__exit, [role="button"]';

    function attach() {
      document.querySelectorAll(SEL).forEach(el => {
        if (el._hoverBound) return;
        el._hoverBound = true;
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    }

    attach();
    new MutationObserver(attach).observe(document.body, { childList: true, subtree: true });
  }

  function initClock() {
    const el = document.getElementById('sys-clock');
    if (!el) return;

    function tick() {
      const d  = new Date();
      const hh = String(d.getHours()).padStart(2,'0');
      const mm = String(d.getMinutes()).padStart(2,'0');
      const ss = String(d.getSeconds()).padStart(2,'0');
      const dd = String(d.getDate()).padStart(2,'0');
      const mo = String(d.getMonth()+1).padStart(2,'0');
      el.textContent = `${d.getFullYear()}.${mo}.${dd}  //  ${hh}:${mm}:${ss}  //  ROYAL_OS_V4`;
    }
    tick();
    setInterval(tick, 1000);
  }

  function buildProjects() {
    const container = document.getElementById('projects-grid');
    if (!container || !projectsData) return;

    container.innerHTML = '';

    projectsData.projects.forEach((proj, i) => {
      const card = document.createElement('article');
      card.className = 'proj-card';
      card.style.animationDelay = (i * 0.1) + 's';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View details for ${proj.title}`);
      card.dataset.projId = proj.id;

      card.innerHTML = `
        <div class="proj-card__img-wrap">
          <img
            src="${proj.image}"
            alt="${proj.title}"
            class="proj-card__img"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
          >
          <div class="proj-card__img-placeholder" style="display:none;">${proj.id.toUpperCase()}</div>
        </div>
        <div class="proj-card__body">
          <div class="proj-card__uid">UID: ${proj.uid}</div>
          <div class="proj-card__title">${proj.title}</div>
          <div class="proj-card__meta">
            ${proj.tags.map(t => `<span class="proj-card__tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="proj-card__footer">
          <div class="proj-card__rating">${proj.stats.rating}</div>
          <div class="proj-card__status">${proj.status}</div>
        </div>
      `;

      card.addEventListener('click',   () => openProjectDetail(proj.id));
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openProjectDetail(proj.id); });

      container.appendChild(card);
    });

    const countEl = document.getElementById('projects-count');
    if (countEl) countEl.textContent = projectsData.projects.length + ' ENTRIES';
  }

  function buildAbout() {
    if (!projectsData) return;
    const o = projectsData.owner;

    document.querySelectorAll('[data-owner-name]').forEach(el => el.textContent  = o.name);
    document.querySelectorAll('[data-owner-title]').forEach(el => el.textContent = o.title);

    const bioEl = document.getElementById('owner-bio');
    if (bioEl) bioEl.textContent = o.bio;

    const skillsList = document.getElementById('skills-list');
    if (skillsList) {
      skillsList.innerHTML = o.skills.map(s =>
        `<span class="skill-tag">${s}</span>`
      ).join('');
    }

    const fields = {
      'contact-email':   o.contact.email,
      'contact-support':  o.contact.support,
      'contact-discord': o.contact.discord,
    };
    Object.entries(fields).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    });
  }

  function buildDashboard() {
    if (!projectsData) return;
    const s = projectsData.owner.stats;

    const map = {
      'stat-projects':     { val: s.projects,     suffix: '',  dec: 0 },
      'stat-hours':        { val: s.hours,         suffix: 'h', dec: 0 },
      'stat-achievements': { val: s.achievements,  suffix: '',  dec: 0 },
      'stat-years':        { val: s.years,         suffix: 'Y', dec: 0 },
    };

    Object.entries(map).forEach(([id, cfg]) => {
      const el = document.getElementById(id);
      if (el) {
        el.dataset.countup  = cfg.val;
        el.dataset.suffix   = cfg.suffix;
        el.dataset.decimals = cfg.dec;
      }
    });
  }

  function initProjectDetail() {
    const overlay = document.getElementById('proj-detail');
    if (!overlay) return;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeProjectDetail();
    });
  }

  function openProjectDetail(id) {
    if (!projectsData) return;
    const proj = projectsData.projects.find(p => p.id === id);
    if (!proj) return;

    const overlay = document.getElementById('proj-detail');

    const fields = {
      'detail-uid':          `UID: ${proj.uid}`,
      'detail-title':        proj.title,
      'detail-subtitle':     proj.subtitle,
      'detail-year':         proj.year,
      'detail-genre':        proj.genre,
      'detail-platform':     proj.platform,
      'detail-status':       proj.status,
      'detail-rating':       proj.stats.rating + ' / 10',
      'detail-hours':        proj.stats.hours + ' HRS',
      'detail-achievements': proj.stats.achievements + ' UNLOCKED',
      'detail-desc':         proj.description,
    };
    Object.entries(fields).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    });

    const cover   = document.getElementById('detail-cover');
    const coverPh = document.getElementById('detail-cover-placeholder');
    if (cover) {
      cover.src    = proj.image;
      cover.onerror = () => {
        cover.style.display = 'none';
        if (coverPh) { coverPh.style.display = 'flex'; coverPh.textContent = proj.id.toUpperCase(); }
      };
      cover.onload = () => {
        cover.style.display = 'block';
        if (coverPh) coverPh.style.display = 'none';
      };
      cover.style.display = 'block';
      if (coverPh) coverPh.style.display = 'none';
    }

    const tagsEl = document.getElementById('detail-tags');
    if (tagsEl) {
      tagsEl.innerHTML = proj.tags.map(t => `<span class="proj-card__tag">${t}</span>`).join('');
    }

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectDetail() {
    const overlay = document.getElementById('proj-detail');
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeProjectDetail();
      if (['1','2','3'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
        const overlay = document.getElementById('proj-detail');
        if (overlay && !overlay.classList.contains('open')) {
          Tabs.activate(parseInt(e.key) - 1);
        }
      }
    });
  }

  function show() {
    appEl.classList.add('active');
    appEl.removeAttribute('aria-hidden');
    setTimeout(() => Tabs.activate(0), 100);
  }

  function hide(onComplete) {
    appEl.classList.add('glitch');

    setTimeout(() => {
      appEl.style.opacity   = '0';
      appEl.style.transform = 'scale(1.03)';

      setTimeout(() => {
        appEl.classList.remove('active','glitch');
        appEl.style.opacity   = '';
        appEl.style.transform = '';
        appEl.setAttribute('aria-hidden','true');

        document.querySelectorAll('.nav__item').forEach(n => n.classList.remove('active'));
        document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.skill-item__fill').forEach(f => f.style.width = '0%');

        Particles.setIntensity(1);
        if (onComplete) onComplete();
      }, 500);
    }, 300);
  }

  return { init, initCursor, show, hide, openProjectDetail, closeProjectDetail };

})();
