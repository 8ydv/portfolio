
const Loader = (() => {

  let elHero, elLoader, elFill, elPct, elMsg, elLog;

  const BOOT_LOG = [
    { at:  0, msg: 'MOUNTING_FILESYSTEM',          log: '[BOOT]  :: INIT_SEQUENCE_STARTED' },
    { at: 12, msg: 'VERIFYING_KERNEL_INTEGRITY',   log: '[KERN]  :: INTEGRITY_CHECK_PASSED' },
    { at: 24, msg: 'LOADING_SECURITY_MODULES',     log: '[SEC]   :: AES-256_ENCRYPTION_LOADED' },
    { at: 38, msg: 'ESTABLISHING_SECURE_TUNNEL',   log: '[NET]   :: TUNNEL_ESTABLISHED_OK' },
    { at: 50, msg: 'LOADING_USER_PROFILE',         log: '[AUTH]  :: USER_LEVEL_7_GRANTED' },
    { at: 62, msg: 'DECRYPTING_ASSET_REGISTRY',    log: '[DATA]  :: PROJECTS_JSON_DECODED' },
    { at: 75, msg: 'INITIALIZING_RENDER_ENGINE',   log: '[GFX]   :: CANVAS_RENDERER_ONLINE' },
    { at: 88, msg: 'CALIBRATING_INTERFACE',        log: '[UI]    :: ALL_MODULES_SYNCHRONIZED' },
    { at: 96, msg: 'FINALIZING_SYSTEM_STATE',      log: '[SYS]   :: UPTIME_CLOCK_STARTED' },
    { at:100, msg: 'SYSTEM_READY',                 log: '[READY] :: ROYAL_OS_ONLINE ✓' },
  ];

  function init() {
    elHero   = document.getElementById('hero');
    elLoader = document.getElementById('loader');
    elFill   = document.getElementById('loader-fill');
    elPct    = document.getElementById('loader-pct');
    elMsg    = document.getElementById('loader-msg');
    elLog    = document.getElementById('loader-log');
  }

  function start(onComplete) {
    init();

    elFill.style.cssText = 'width:0%; transition:none; animation:none; position:absolute; top:0; left:0; height:3px; background:linear-gradient(to right, #c8a96e, #ffffff); box-shadow:0 0 12px rgba(200,169,110,0.8), 0 0 24px rgba(200,169,110,0.4); border-radius:2px;';

    elPct.textContent = '0%';
    elMsg.textContent = BOOT_LOG[0].msg;
    elLog.innerHTML   = '';

    elHero.classList.add('exit');
    setTimeout(() => { elHero.style.display = 'none'; }, 700);

    setTimeout(() => {
      elLoader.classList.add('active');
      elFill.style.transition = 'width 0.06s linear';
      Particles.setIntensity(2);
      runProgress(onComplete);
    }, 500);
  }

function runProgress(onComplete) {
    let progress   = 0;
    let logIdx     = 0;
    let lastMsgIdx = -1; 
    let lastMsgTime = 0; 
    let hasPlayed70   = false;
    let isUpdatingMsg = false;
    const MSG_DELAY = 1500; 

    const timer = setInterval(() => {
      progress = Math.min(progress + 0.5 + Math.random() * 0.2, 100);
      const successSound = document.getElementById('successSound');

      elFill.style.width = progress.toFixed(2) + '%';
      elPct.textContent  = Math.floor(progress) + '%';

      if (progress >= 70 && !hasPlayed70) {
            if (successSound) {
                successSound.currentTime = 0;
                successSound.play();
            }
            hasPlayed70 = true;
        }

      const now = Date.now();
      
      let currentTargetIdx = -1;
      for (let i = 0; i < BOOT_LOG.length; i++) {
        if (progress >= BOOT_LOG[i].at) {
          currentTargetIdx = i;
        }
      }

      if (currentTargetIdx > lastMsgIdx && !isUpdatingMsg) {
        if (now - lastMsgTime > MSG_DELAY || lastMsgIdx === -1) {
          
          isUpdatingMsg = true;
          lastMsgIdx = currentTargetIdx;
          lastMsgTime = now;
          
          elMsg.textContent = BOOT_LOG[lastMsgIdx].msg;
          
          elMsg.classList.remove('pulse');
          void elMsg.offsetWidth; 
          elMsg.classList.add('pulse');
          
          setTimeout(() => {
            elMsg.classList.remove('pulse');
            isUpdatingMsg = false;
          }, 600); 
        }
      }

      while (logIdx < BOOT_LOG.length && progress >= BOOT_LOG[logIdx].at) {
        appendLog(BOOT_LOG[logIdx].log);
        logIdx++;
      }

      if (progress >= 100) {
        clearInterval(timer);
        elFill.style.width = '100%';
        elPct.textContent  = '100%';
        setTimeout(() => finish(onComplete), 700);
      }
    }, 55);
}

  function appendLog(text) {
    const line = document.createElement('span');
    line.className   = 'loader__log-line new';
    line.textContent = text;
    elLog.appendChild(line);
    elLog.scrollTop  = elLog.scrollHeight;

    requestAnimationFrame(() => {
      const lines = elLog.querySelectorAll('.loader__log-line');
      lines.forEach((l, i) => {
        l.style.opacity = Math.max(0.07, 1 - (lines.length - 1 - i) * 0.15);
      });
    });
  }

  function finish(onComplete) {
    Particles.setIntensity(1);
    elLoader.style.opacity = '0';
    setTimeout(() => {
      elLoader.classList.remove('active');
      elLoader.style.opacity = '';
      if (onComplete) onComplete();
    }, 500);
  }

  function reset() {
    init();
    elFill.style.cssText = 'width:0%; transition:none; animation:none; position:absolute; top:0; left:0; height:3px; background:linear-gradient(to right, #c8a96e, #ffffff); border-radius:2px;';
    elPct.textContent    = '0%';
    elMsg.textContent    = BOOT_LOG[0].msg;
    elLog.innerHTML      = '';
    elLoader.classList.remove('active');
    elLoader.style.opacity = '';

    elHero.style.display = '';
    requestAnimationFrame(() => requestAnimationFrame(() => elHero.classList.remove('exit')));
  }

  return { init, start, reset };
})();
