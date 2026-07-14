/* ============================================================
   SentinelCore — script.js
   Nav, scroll reveal, counters, FAQ, mobile menu, contact form
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky navbar shadow on scroll ---------- */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 8) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile hamburger menu ---------- */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close the menu after tapping a link
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Scroll reveal via IntersectionObserver ---------- */
  var faders = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    faders.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: show everything
    faders.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    if (el.hasAttribute('data-static')) return; // e.g. "24/7"
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var duration = 1600;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.stat-num');
  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var answer = item.querySelector('.faq-a');

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close all others for a clean single-open accordion
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-a').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Contact form (client-side validation only) ---------- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name;
      var email = form.email;
      var message = form.message;
      var valid = true;

      [name, email, message].forEach(function (f) { f.classList.remove('invalid'); });

      if (!name.value.trim()) { name.classList.add('invalid'); valid = false; }
      if (!isEmail(email.value.trim())) { email.classList.add('invalid'); valid = false; }
      if (!message.value.trim()) { message.classList.add('invalid'); valid = false; }

      if (!valid) {
        note.textContent = 'Please complete the required fields with a valid email.';
        note.className = 'form-note err';
        return;
      }

      note.textContent = 'Thanks — your message has been received. A specialist will reply within one business day.';
      note.className = 'form-note ok';
      form.reset();
    });
  }
})();
