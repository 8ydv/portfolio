(function () {
  'use strict';

  window.addEventListener('DOMContentLoaded', () => {
    Particles.init();
    Loader.init();
    setTimeout(() => {
        System.initCursor();
    }, 50);
    initHeroBtnEvent();
  });

  function initHeroBtnEvent() {
    const btn = document.getElementById('hero-btn');
    const bgMusic = document.getElementById('bgMusic');

    if (btn) {
      btn.addEventListener('click', () => {
        if (bgMusic) {
          bgMusic.volume = 0.7;
          bgMusic.play().catch(e => console.warn("Audio autoplay blocked by browser context."));
        }
        
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

  document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('hero-btn');
    const audio = document.getElementById('bgMusic');

    if (startBtn && audio) {
        startBtn.addEventListener('click', () => {
            audio.volume = 0.4;
            audio.play().catch(error => {
                console.log("الارتباط بالصوت فشل: ", error);
            });
        });
    }
});

})();
