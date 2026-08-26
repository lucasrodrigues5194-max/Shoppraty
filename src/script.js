(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header: transparent -> solid on scroll */
  var header = document.getElementById('siteHeader');
  function onScroll(){
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScroll();
  document.addEventListener('scroll', onScroll, { passive:true });

  /* Cinematic hero intro: skip control + mark "settled" once the closing scene lands */
  var cinematicHero = document.getElementById('cinematicHero');
  var skipBtn = document.getElementById('skipIntro');
  if (cinematicHero && skipBtn) {
    if (reduced) {
      cinematicHero.classList.add('settled');
    } else {
      skipBtn.addEventListener('click', function () {
        cinematicHero.classList.add('skipped', 'settled');
      });
      var closingScene = cinematicHero.querySelector('.scene-closing');
      if (closingScene) {
        closingScene.addEventListener('animationend', function (e) {
          if (e.animationName === 'sceneClosing') cinematicHero.classList.add('settled');
        });
      }
    }
  }

  /* Mobile nav */
  var panel = document.getElementById('mobilePanel');
  document.getElementById('menuOpen').addEventListener('click', function(){
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  document.getElementById('menuClose').addEventListener('click', closePanel);
  panel.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closePanel); });
  function closePanel(){
    panel.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* Scroll reveal */
  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }

  /* Light parallax on the trending editorial image */
  if (!reduced) {
    var img = document.getElementById('parallaxImg');
    var ticking = false;
    function updateParallax(){
      ticking = false;
      if (!img) return;
      var rect = img.parentElement.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var progress = (vh - rect.top) / (vh + rect.height);
      progress = Math.max(0, Math.min(1, progress));
      var shift = (progress - 0.5) * 40;
      img.style.transform = 'translateY(' + shift.toFixed(1) + 'px)';
    }
    document.addEventListener('scroll', function(){
      if (!ticking) { window.requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive:true });
    updateParallax();
  }

  /* Quick add feedback */
  document.querySelectorAll('.quick-add').forEach(function(btn){
    btn.addEventListener('click', function(){
      var original = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(function(){ btn.textContent = original; }, 1400);
    });
  });
})();

/* Wix HTML-iframe integration: reports content height to the parent Wix page
   so the embed element can auto-resize. Pairs with the Velo snippet that
   listens for this message and sets $w('#html1').height accordingly. Safe
   no-op on any other host (window.parent === window when not embedded). */
(function () {
  if (window.parent === window) return;
  function sendHeight() {
    window.parent.postMessage(
      { type: 'shoppratyHeight', height: document.documentElement.scrollHeight },
      '*'
    );
  }
  window.addEventListener('load', sendHeight);
  window.addEventListener('resize', sendHeight);
  if ('ResizeObserver' in window) {
    new ResizeObserver(sendHeight).observe(document.body);
  } else {
    setInterval(sendHeight, 800);
  }
})();
