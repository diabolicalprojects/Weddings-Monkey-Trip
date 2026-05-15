/* ===========================================
   WEDDINGS MONKEY TRIP — Main JavaScript
   =========================================== */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     NAVBAR: scroll-aware + mobile menu
  ───────────────────────────────────────── */
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('nav-hamburger');
  const navLinks   = document.getElementById('nav-links');

  // Scroll handler
  function onScroll () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile hamburger toggle
  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    navbar.classList.toggle('menu-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      navbar.classList.remove('menu-open');
      document.body.style.overflow = '';
    });
  });

  /* ─────────────────────────────────────────
     INTERSECTION OBSERVER — Reveal Animation
  ───────────────────────────────────────── */
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        // Stagger children of the same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-reveal]'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(function () {
          entry.target.classList.add('revealed');
        }, idx * 120);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ─────────────────────────────────────────
     ANIMATED COUNTER — Hero Stats
  ───────────────────────────────────────── */
  function animateCounter (el, target, duration) {
    var start = 0;
    var startTime = null;

    function step (timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.floor(eased * target);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  var statsAnimated = false;
  var heroStats = document.querySelector('.hero-stats');

  if (heroStats) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          document.querySelectorAll('[data-count]').forEach(function (el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            animateCounter(el, target, 2000);
          });
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(heroStats);
  }

  /* ─────────────────────────────────────────
     TESTIMONIAL SLIDER
  ───────────────────────────────────────── */
  var track       = document.getElementById('testimonial-track');
  var prevBtn     = document.getElementById('slider-prev');
  var nextBtn     = document.getElementById('slider-next');
  var dotsContainer = document.getElementById('slider-dots');

  if (track && prevBtn && nextBtn) {
    var cards       = track.querySelectorAll('.testimonial-card');
    var totalCards  = cards.length;
    var currentIdx  = 0;
    var autoTimer   = null;
    var slidesVisible = getSlidesVisible();

    function getSlidesVisible () {
      return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    }

    function maxIndex () {
      return Math.max(0, totalCards - slidesVisible);
    }

    // Build dots
    function buildDots () {
      dotsContainer.innerHTML = '';
      var count = maxIndex() + 1;
      for (var i = 0; i < count; i++) {
        (function (idx) {
          var dot = document.createElement('button');
          dot.className = 'dot' + (idx === currentIdx ? ' active' : '');
          dot.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
          dot.addEventListener('click', function () { goTo(idx); });
          dotsContainer.appendChild(dot);
        })(i);
      }
    }

    function updateDots () {
      var dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === currentIdx);
      });
    }

    function goTo (idx) {
      currentIdx = Math.max(0, Math.min(idx, maxIndex()));
      var cardWidth = cards[0].offsetWidth + 24; // gap 24px
      track.style.transform = 'translateX(-' + (currentIdx * cardWidth) + 'px)';
      updateDots();
    }

    function next () { goTo(currentIdx >= maxIndex() ? 0 : currentIdx + 1); }
    function prev () { goTo(currentIdx <= 0 ? maxIndex() : currentIdx - 1); }

    nextBtn.addEventListener('click', function () { next(); resetAuto(); });
    prevBtn.addEventListener('click', function () { prev(); resetAuto(); });

    function startAuto ()  { autoTimer = setInterval(next, 5000); }
    function resetAuto ()  { clearInterval(autoTimer); startAuto(); }

    // Touch / swipe support
    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
        resetAuto();
      }
    }, { passive: true });

    // Keyboard support
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
      if (e.key === 'ArrowRight') { next(); resetAuto(); }
    });

    // Responsive resize
    window.addEventListener('resize', function () {
      slidesVisible = getSlidesVisible();
      if (currentIdx > maxIndex()) currentIdx = maxIndex();
      buildDots();
      goTo(currentIdx);
    });

    buildDots();
    goTo(0);
    startAuto();
  }

  /* ─────────────────────────────────────────
     CONTACT FORM — Validation & Submission
  ───────────────────────────────────────── */
  var form        = document.getElementById('contact-form');
  var formSuccess = document.getElementById('form-success');
  var submitBtn   = document.getElementById('form-submit');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple validation
      var valid = true;
      var required = form.querySelectorAll('[required]');

      required.forEach(function (field) {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = 'rgba(255,100,100,0.7)';
          valid = false;
        }
      });

      // Email format check
      var emailField = document.getElementById('email');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.style.borderColor = 'rgba(255,100,100,0.7)';
        valid = false;
      }

      if (!valid) {
        // Shake the button
        submitBtn.style.animation = 'none';
        submitBtn.offsetHeight; // reflow
        submitBtn.style.animation = 'shake 0.4s ease';
        return;
      }

      // Simulate sending
      submitBtn.textContent = 'Enviando…';
      submitBtn.disabled = true;

      setTimeout(function () {
        form.hidden = true;
        formSuccess.hidden = false;
        formSuccess.focus();
      }, 1200);
    });
  }

  // Add shake keyframes dynamically
  var shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  /* ─────────────────────────────────────────
     PARALLAX — Subtle Hero Image Parallax
  ───────────────────────────────────────── */
  var heroImg = document.getElementById('hero-img');

  if (heroImg && window.innerWidth > 768) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      heroImg.style.transform = 'scale(1.05) translateY(' + (scrollY * 0.25) + 'px)';
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     MAGNETIC BUTTONS — Premium hover effect
  ───────────────────────────────────────── */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width  / 2;
      var y = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.08) + 'px, ' + (y * 0.12) + 'px) translateY(-2px)';
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });

  /* ─────────────────────────────────────────
     SMOOTH ACTIVE NAV LINK — scroll spy
  ───────────────────────────────────────── */
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-link:not(.nav-cta-link)');

  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navAnchors.forEach(function (a) {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + id) {
            a.style.color = 'var(--color-gold)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(function (s) { spyObserver.observe(s); });

  /* ─────────────────────────────────────────
     BENTO CARD TILT EFFECT
  ───────────────────────────────────────── */
  document.querySelectorAll('.bento-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect  = card.getBoundingClientRect();
      var cx    = rect.left + rect.width  / 2;
      var cy    = rect.top  + rect.height / 2;
      var dx    = (e.clientX - cx) / (rect.width  / 2);
      var dy    = (e.clientY - cy) / (rect.height / 2);
      var tiltX = -(dy * 4);
      var tiltY =   dx * 4;
      card.style.transform = 'translateY(-6px) perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ─────────────────────────────────────────
     CURSOR GLOW — subtle ambient cursor
  ───────────────────────────────────────── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var glow = document.createElement('div');
    glow.style.cssText = [
      'position:fixed',
      'top:0', 'left:0',
      'width:400px', 'height:400px',
      'pointer-events:none',
      'z-index:9999',
      'border-radius:50%',
      'background:radial-gradient(circle, rgba(0,164,166,0.06) 0%, transparent 70%)',
      'transform:translate(-50%,-50%)',
      'transition:opacity 0.3s',
      'will-change:transform'
    ].join(';');
    document.body.appendChild(glow);

    document.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  console.log('%c✦ Weddings Monkey Trip', 'color:#ff3399;font-family:Georgia,serif;font-size:18px;font-style:italic;');
  console.log('%cBodas de Destino de Lujo — Creado con ♥', 'color:#1a365d;font-size:12px;');
})();
