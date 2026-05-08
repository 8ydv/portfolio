const Tabs = (() => {

  let navItems, panes;
  let currentIndex = -1;
  let onChangeCallback = null;

  function init(onChangeFn) {
    navItems = document.querySelectorAll('.nav__item');
    panes    = document.querySelectorAll('.pane');
    onChangeCallback = onChangeFn;

    navItems.forEach((item, i) => {
      item.addEventListener('click',   () => activate(i));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate(i);
        }
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          activate(Math.min(i + 1, navItems.length - 1));
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          activate(Math.max(i - 1, 0));
        }
      });
    });
  }

  function activate(index, silent = false) {
    if (index === currentIndex) return;

    const prev = currentIndex;
    currentIndex = index;

    navItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
      item.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    panes.forEach((pane, i) => {
      if (i === index) {
        pane.classList.add('active');
        requestAnimationFrame(() => triggerPaneAnimations(pane));
      } else if (i === prev) {
        pane.classList.remove('active');
      } else {
        pane.classList.remove('active');
      }
    });

    if (!silent && onChangeCallback) {
      onChangeCallback(index, prev);
    }
  }

  function triggerPaneAnimations(pane) {
    pane.querySelectorAll('.skill-item__fill').forEach(fill => {
      const target = fill.dataset.width || '0%';
      fill.style.width = '0%';
      requestAnimationFrame(() => {
        fill.style.width = target;
      });
    });

    pane.querySelectorAll('[data-countup]').forEach(el => {
      const target = parseFloat(el.dataset.countup);
      const suffix = el.dataset.suffix || '';
      const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
      countUp(el, 0, target, 1400, suffix, decimals);
    });

    pane.querySelectorAll('.line-draw').forEach(el => {
      setTimeout(() => el.classList.add('drawn'), 200);
    });

    const uptimeFill = pane.querySelector('#uptime-fill');
    if (uptimeFill) {
      setTimeout(() => {
        uptimeFill.style.width = uptimeFill.dataset.target || '87%';
      }, 300);
    }
  }

  function countUp(el, from, to, duration, suffix = '', decimals = 0) {
    const start = performance.now();
    const range = to - from;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = from + range * ease;

      el.textContent = value.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  function getCurrent()     { return currentIndex; }
  function getCurrentPane() { return panes[currentIndex] || null; }

  return { init, activate, getCurrent, getCurrentPane };

})();
