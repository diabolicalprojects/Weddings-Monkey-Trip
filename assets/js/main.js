/* ===========================================
   WEDDINGS MONKEY TRIP — Main JavaScript
   =========================================== */

(function () {
  'use strict';

  /* Hero img reference — preloaded via <link rel="preload"> in <head> */
  var heroImg = document.getElementById('hero-img');

  /* ─────────────────────────────────────────
     NAVBAR: scroll-aware + mobile menu
  ───────────────────────────────────────── */
  var navbar     = document.getElementById('navbar');
  var hamburger  = document.getElementById('nav-hamburger');
  var navLinks   = document.getElementById('nav-links');

  function onScroll () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  hamburger.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    navbar.classList.toggle('menu-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

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
  var revealElements = document.querySelectorAll('[data-reveal]');

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-reveal]'));
        var idx = siblings.indexOf(entry.target);
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
      var eased = 1 - Math.pow(1 - progress, 3);
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
     TESTIMONIAL SLIDER — Infinite, drag, scroll,
     pause on hover, functional buttons & dots
  ───────────────────────────────────────── */
  var slider        = document.getElementById('testimonial-slider');
  var track         = document.getElementById('testimonial-track');
  var prevBtn       = document.getElementById('slider-prev');
  var nextBtn       = document.getElementById('slider-next');
  var dotsContainer = document.getElementById('slider-dots');

  if (track && prevBtn && nextBtn && slider) {
    var originalCards  = Array.from(track.querySelectorAll('.testimonial-card'));
    var totalOriginal  = originalCards.length;
    var currentIdx     = 0;
    var autoTimer      = null;
    var isPaused       = false;
    var slidesVisible  = getSlidesVisible();

    // ── Clone cards for infinite loop ──────────────────────────────
    // Clone a full set before + after
    originalCards.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    originalCards.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.insertBefore(clone, track.firstChild);
    });

    var allCards = Array.from(track.querySelectorAll('.testimonial-card'));

    function getSlidesVisible () {
      return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    }

    function getCardWidth () {
      return allCards[0].offsetWidth + 24; // 24px gap
    }

    function setOffset (offset, animate) {
      if (!animate) track.classList.add('no-transition');
      track.style.transform = 'translateX(-' + offset + 'px)';
      if (!animate) {
        // Force reflow then re-enable transition
        track.offsetHeight;
        track.classList.remove('no-transition');
      }
    }

    // Start position = after the prepended clone set
    var realOffset = totalOriginal; // index in allCards

    function goToReal (idx, animate) {
      if (animate === undefined) animate = true;
      realOffset = totalOriginal + idx;
      setOffset(realOffset * getCardWidth(), animate);
      currentIdx = ((idx % totalOriginal) + totalOriginal) % totalOriginal;
      updateDots();
    }

    // After transition ends, silently jump if we're in clone territory
    track.addEventListener('transitionend', function () {
      var totalAll = allCards.length;
      if (realOffset >= totalOriginal * 2) {
        realOffset -= totalOriginal;
        setOffset(realOffset * getCardWidth(), false);
      } else if (realOffset < totalOriginal) {
        realOffset += totalOriginal;
        setOffset(realOffset * getCardWidth(), false);
      }
    });

    function next () {
      realOffset++;
      currentIdx = (currentIdx + 1) % totalOriginal;
      setOffset(realOffset * getCardWidth(), true);
      updateDots();
    }

    function prev () {
      realOffset--;
      currentIdx = (currentIdx - 1 + totalOriginal) % totalOriginal;
      setOffset(realOffset * getCardWidth(), true);
      updateDots();
    }

    // ── Dots ──────────────────────────────────────────────────────
    function buildDots () {
      dotsContainer.innerHTML = '';
      for (var i = 0; i < totalOriginal; i++) {
        (function (idx) {
          var dot = document.createElement('button');
          dot.className = 'dot' + (idx === currentIdx ? ' active' : '');
          dot.setAttribute('aria-label', 'Ir al testimonio ' + (idx + 1));
          dot.addEventListener('click', function () {
            var diff = idx - currentIdx;
            realOffset += diff;
            currentIdx = idx;
            setOffset(realOffset * getCardWidth(), true);
            updateDots();
            resetAuto();
          });
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

    // ── Buttons ───────────────────────────────────────────────────
    nextBtn.addEventListener('click', function () { next(); resetAuto(); });
    prevBtn.addEventListener('click', function () { prev(); resetAuto(); });

    // ── Autoplay ──────────────────────────────────────────────────
    function startAuto () {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () {
        if (!isPaused) next();
      }, 5000);
    }

    function resetAuto () {
      clearInterval(autoTimer);
      startAuto();
    }

    // ── Pause on hover ────────────────────────────────────────────
    slider.addEventListener('mouseenter', function () { isPaused = true; });
    slider.addEventListener('mouseleave', function () { isPaused = false; });

    // ── Mouse drag (desktop) ───────────────────────────────────────
    var isDragging   = false;
    var dragStartX   = 0;
    var dragCurrentX = 0;
    var baseOffset   = 0;

    slider.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      isDragging  = true;
      dragStartX  = e.clientX;
      baseOffset  = realOffset * getCardWidth();
      track.classList.add('no-transition');
      slider.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      dragCurrentX = e.clientX;
      var diff = dragStartX - dragCurrentX;
      track.style.transform = 'translateX(-' + (baseOffset + diff) + 'px)';
    });

    window.addEventListener('mouseup', function (e) {
      if (!isDragging) return;
      isDragging = false;
      slider.classList.remove('is-dragging');
      track.classList.remove('no-transition');

      var diff = dragStartX - e.clientX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) next();
        else prev();
      } else {
        // Snap back
        setOffset(realOffset * getCardWidth(), true);
      }
      resetAuto();
    });

    // ── Touch / swipe support ─────────────────────────────────────
    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      isPaused = true;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
        resetAuto();
      }
      isPaused = false;
    }, { passive: true });

    // ── Horizontal scroll wheel (laptop trackpad) ─────────────────
    var scrollAccum = 0;
    slider.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Horizontal scroll gesture
        e.preventDefault();
        scrollAccum += e.deltaX;
        if (Math.abs(scrollAccum) > 80) {
          if (scrollAccum > 0) next();
          else prev();
          scrollAccum = 0;
          resetAuto();
        }
      }
    }, { passive: false });

    // ── Keyboard support ──────────────────────────────────────────
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
      if (e.key === 'ArrowRight') { next(); resetAuto(); }
    });

    // ── Responsive resize ─────────────────────────────────────────
    window.addEventListener('resize', function () {
      slidesVisible = getSlidesVisible();
      goToReal(currentIdx, false);
    });

    // ── Init ──────────────────────────────────────────────────────
    buildDots();
    goToReal(0, false);
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

      var valid = true;
      var required = form.querySelectorAll('[required]');

      required.forEach(function (field) {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = 'rgba(255,100,100,0.7)';
          valid = false;
        }
      });

      var emailField = document.getElementById('email');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.style.borderColor = 'rgba(255,100,100,0.7)';
        valid = false;
      }

      if (!valid) {
        submitBtn.style.animation = 'none';
        submitBtn.offsetHeight;
        submitBtn.style.animation = 'shake 0.4s ease';
        return;
      }

      submitBtn.textContent = 'Enviando…';
      submitBtn.disabled = true;

      setTimeout(function () {
        form.hidden = true;
        formSuccess.hidden = false;
        formSuccess.focus();
      }, 1200);
    });
  }

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

  /* Parallax handled natively by CSS background-attachment: fixed */

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
  var sections   = document.querySelectorAll('section[id]');
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
      'background:radial-gradient(circle, rgba(255,51,153,0.05) 0%, transparent 70%)',
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
