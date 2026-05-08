(function () {
  'use strict';

  window.addEventListener('DOMContentLoaded', () => {
  Particles.init();
  Loader.init();

  SoundSystem.init([
    { title: 'Fire_SIGNAL_X', artist: 'ROYAL_SYS', src: 'assets/audio/audio.mp3', duration: '01:59' },
    { title: 'GHOST_SIGNAL_X', artist: 'ROYAL_SYS', src: 'assets/audio/audio1.mp3', duration: '03:18' },
    { title: '108292_SIGNAL_X', artist: 'ROYAL_SYS', src: 'assets/audio/audio2.mp3', duration: '03:27' },
    { title: 'MAC11_SIGNAL_X', artist: 'ROYAL_SYS', src: 'assets/audio/audio3.mp3', duration: '04:50' }
  ]);

  const player = document.getElementById('ss-player');
  if (player) player.style.opacity = '0';
  setTimeout(() => System.initCursor(), 50);
  initHeroBtnEvent();
});

  function initHeroBtnEvent() {
  const btn = document.getElementById('hero-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      SoundSystem.Player.play();
      startBoot();
    });
  }
}

  async function startBoot() {
  Loader.start(async () => {
    await System.init();
    Tabs.init(onTabChange);
    System.show();
    EasterEggs.init();

    const player = document.getElementById('ss-player');
    if (player) {
      player.style.opacity = '';
      player.classList.add('show');
    }

    ViewCounter.init();
  });
}

  function onTabChange(index, prev) {
    switch (index) {
      case 0: Particles.setIntensity(1); break;
      case 1: Particles.setIntensity(1); break;
      case 2: Particles.setIntensity(0); break;
    }
  }

  window.exitSequence = function () {
    System.hide(() => {
      Loader.reset();
    });
  };

  window.closeDetail = function () {
    System.closeProjectDetail();
  };

})();
