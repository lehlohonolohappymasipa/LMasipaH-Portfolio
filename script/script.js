/**
 * LEHLOHONOLO MASIPA — Portfolio Script
 * Features:
 *  - Custom cursor
 *  - Navbar: scroll shrink, active link, progress bar
 *  - Hamburger / mobile menu
 *  - Dark / Light theme toggle
 *  - Scroll reveal animations (IntersectionObserver)
 *  - Skill bar animations
 *  - About section tabs (jQuery)
 *  - Project filter (jQuery)
 *  - Contact form validation (jQuery)
 *  - Reveal delay support
 */

/* ========================================================
   DOCUMENT READY — jQuery entry point
   ======================================================== */
$(function () {

  /* ---- CUSTOM CURSOR ---- */
  const $dot     = $('.cursor-dot');
  const $outline = $('.cursor-outline');

  $(document).on('mousemove', function (e) {
    $dot.css({ left: e.clientX, top: e.clientY });
    // Slight lag on outline for smooth feel
    setTimeout(function () {
      $outline.css({ left: e.clientX, top: e.clientY });
    }, 60);
  });

  // Enlarge outline on hoverable elements
  $(document).on('mouseenter', 'a, button, .service-card, .project-card, .skill-item, input, select, textarea', function () {
    $outline.addClass('hover');
  }).on('mouseleave', 'a, button, .service-card, .project-card, .skill-item, input, select, textarea', function () {
    $outline.removeClass('hover');
  });

  // Hide cursor when it leaves the window
  $(document).on('mouseleave', function () {
    $dot.css('opacity', 0);
    $outline.css('opacity', 0);
  }).on('mouseenter', function () {
    $dot.css('opacity', 1);
    $outline.css('opacity', 1);
  });

  /* ---- PAGE SCROLL PROGRESS BAR ---- */
  // Inject progress bar
  $('body').prepend('<div class="progress-bar" id="progressBar"></div>');

  $(window).on('scroll.progress', function () {
    const scrollTop  = $(window).scrollTop();
    const docHeight  = $(document).height() - $(window).height();
    const pct        = (scrollTop / docHeight) * 100;
    $('#progressBar').css('width', pct + '%');
  });

  /* ---- NAVBAR: SCROLL SHRINK + ACTIVE LINK ---- */
  const $navbar  = $('#navbar');
  const $navLinks = $('.nav-link');

  $(window).on('scroll.nav', function () {
    const scrollY = $(window).scrollTop();

    // Add scrolled class
    if (scrollY > 40) {
      $navbar.addClass('scrolled');
    } else {
      $navbar.removeClass('scrolled');
    }

    // Highlight active section link
    let currentSection = '';
    $('section[id]').each(function () {
      const sectionTop    = $(this).offset().top - 120;
      const sectionBottom = sectionTop + $(this).outerHeight();
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        currentSection = $(this).attr('id');
      }
    });

    $navLinks.each(function () {
      $(this).toggleClass('active', $(this).attr('href') === '#' + currentSection);
    });
  });

  /* ---- HAMBURGER / MOBILE MENU ---- */
  const $hamburger   = $('#hamburger');
  const $mobileMenu  = $('#mobileMenu');

  $hamburger.on('click', function () {
    const isOpen = $mobileMenu.hasClass('open');
    $mobileMenu.toggleClass('open');
    $hamburger.toggleClass('open');
    $hamburger.attr('aria-expanded', !isOpen);
    $('body').toggleClass('menu-open');
  });

  // Close on mobile link click
  $('.mob-link').on('click', function () {
    $mobileMenu.removeClass('open');
    $hamburger.removeClass('open').attr('aria-expanded', 'false');
    $('body').removeClass('menu-open');
  });

  // Close on ESC
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $mobileMenu.hasClass('open')) {
      $mobileMenu.removeClass('open');
      $hamburger.removeClass('open').attr('aria-expanded', 'false');
      $('body').removeClass('menu-open');
    }
  });

  // Close on click outside
  $(document).on('click', function (e) {
    if ($mobileMenu.hasClass('open') && !$(e.target).closest($mobileMenu).length && !$(e.target).closest($hamburger).length) {
      $mobileMenu.removeClass('open');
      $hamburger.removeClass('open').attr('aria-expanded', 'false');
      $('body').removeClass('menu-open');
    }
  });

  /* ---- THEME TOGGLE (Dark / Light) ---- */
  const $themeToggle = $('#themeToggle');
  const $themeIcon   = $('#themeIcon');
  const $html        = $('html');

  // Load saved theme
  const savedTheme = localStorage.getItem('lm-theme') || 'dark';
  $html.attr('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  $themeToggle.on('click', function () {
    const current = $html.attr('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    $html.attr('data-theme', next);
    localStorage.setItem('lm-theme', next);
    updateThemeIcon(next);
    updateFooterLogo(next);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      $themeIcon.removeClass('fa-sun').addClass('fa-moon');
    } else {
      $themeIcon.removeClass('fa-moon').addClass('fa-sun');
    }
  }

  // Update footer logo based on theme
  function updateFooterLogo(theme) {
    const footerLogo = $('#footerLogo');
    const logoSrc = theme === 'dark' ? 'images/lmasipah-white.png' : 'images/lmasipah-black.png';
    footerLogo.attr('src', logoSrc);
  }

  updateFooterLogo(savedTheme);

  /* ---- ABOUT: TAB SWITCHER ---- */
  $('.tab-btn').on('click', function () {
    const tab = $(this).data('tab');

    // Update buttons
    $('.tab-btn').removeClass('active');
    $(this).addClass('active');

    // Animate out
    $('.tab-content.active').fadeOut(180, function () {
      $(this).removeClass('active');
      // Animate in
      $('#tab-' + tab).addClass('active').hide().fadeIn(260);
    });
  });

  /* ---- PROJECT FILTER ---- */
  $('.filter-btn').on('click', function () {
    const filter = $(this).data('filter');

    // Update buttons
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    // Show/hide cards
    if (filter === 'all') {
      $('.project-card').each(function (i) {
        const $card = $(this);
        const delay = i * 80;
        setTimeout(function () {
          $card.removeClass('hidden').hide().fadeIn(300);
        }, delay);
      });
    } else {
      $('.project-card').each(function (i) {
        const $card = $(this);
        if ($card.data('cat') === filter) {
          const delay = i * 60;
          setTimeout(function () {
            $card.removeClass('hidden').hide().fadeIn(300);
          }, delay);
        } else {
          $card.addClass('hidden').hide();
        }
      });
    }
  });

  /* ---- CONTACT FORM VALIDATION ---- */
  const $form        = $('#contactForm');
  const $submitBtn   = $('#submitBtn');
  const $feedback    = $('#formFeedback');
  const $submitLabel = $submitBtn.find('.btn-label');
  const submitLabelText = $submitLabel.text();

  // Real-time field validation
  $('#name').on('blur input', function () { validateName(); });
  $('#email').on('blur input', function () { validateEmail(); });
  $('#service').on('change', function () { validateService(); });
  $('#message').on('blur input', function () { validateMessage(); });

  function validateName() {
    const val = $('#name').val().trim();
    if (!val) {
      showError('name', 'Please enter your full name.');
      return false;
    }
    if (val.length < 2) {
      showError('name', 'Name must be at least 2 characters.');
      return false;
    }
    clearError('name');
    return true;
  }

  function validateEmail() {
    const val = $('#email').val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      showError('email', 'Please enter your email address.');
      return false;
    }
    if (!emailRegex.test(val)) {
      showError('email', 'Please enter a valid email address.');
      return false;
    }
    clearError('email');
    return true;
  }

  function validateService() {
    const val = $('#service').val();
    if (!val) {
      showError('service', 'Please select a service.');
      return false;
    }
    clearError('service');
    return true;
  }

  function validateMessage() {
    const val = $('#message').val().trim();
    if (!val) {
      showError('message', 'Please enter a message.');
      return false;
    }
    if (val.length < 15) {
      showError('message', 'Please write a little more (at least 15 characters).');
      return false;
    }
    clearError('message');
    return true;
  }

  function showError(field, msg) {
    $('#' + field).addClass('error');
    $('#' + field + 'Error').text(msg).addClass('visible');
  }

  function clearError(field) {
    $('#' + field).removeClass('error');
    $('#' + field + 'Error').text('').removeClass('visible');
  }

  $form.on('submit', function (e) {
    e.preventDefault();

    const nameOk    = validateName();
    const emailOk   = validateEmail();
    const serviceOk = validateService();
    const msgOk     = validateMessage();

    if (!nameOk || !emailOk || !serviceOk || !msgOk) {
      $form.addClass('shake');
      setTimeout(function () { $form.removeClass('shake'); }, 500);
      return;
    }

    setFormFeedback('Sending message...', 'success');
    disableSubmit(true);
    toggleLoading(true);

    const formData = new FormData(this);
    const encoded  = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      encoded.append(key, value);
    }

    const actionUrl = $form.attr('action') || window.location.pathname || '/';

    fetch(actionUrl, {
      method: 'POST',
      body: encoded,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(function (response) {
        if (response.ok) {
          setFormFeedback('Message sent successfully! I will get back to you shortly.', 'success');
          $form[0].reset();
          clearError('name');
          clearError('email');
          clearError('service');
          clearError('message');
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch(function () {
        const message = window.location.protocol === 'file:' || window.location.hostname === 'localhost'
          ? 'The form submission only works on a deployed site with a backend. Local preview cannot send messages.'
          : 'Oops! Something went wrong. Please try again or email me directly.';
        setFormFeedback(message, 'error');
      })
      .finally(function () {
        disableSubmit(false);
        toggleLoading(false);
      });
  });

  function setFormFeedback(message, type) {
    $feedback.removeClass('success error').addClass(type).text(message).show();
  }

  function disableSubmit(state) {
    $submitBtn.prop('disabled', state);
    if (state) {
      $submitBtn.addClass('disabled');
    } else {
      $submitBtn.removeClass('disabled');
    }
  }

  function toggleLoading(state) {
    $submitBtn.toggleClass('loading', state);
    if (state) {
      $submitLabel.text('Sending...');
    } else {
      $submitLabel.text(submitLabelText);
    }
  }

  /* ---- SMOOTH SCROLL for anchor links ---- */
  $('a[href^="#"]').on('click', function (e) {
    const target = $($(this).attr('href'));
    if (target.length) {
      e.preventDefault();
      const offset = target.offset().top - 68;
      $('html, body').animate({ scrollTop: offset }, 700, 'swing');
    }
  });

}); // end document ready


/* ========================================================
   VANILLA JS — IntersectionObserver (Scroll Reveal)
   ======================================================== */
document.addEventListener('DOMContentLoaded', function () {

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(function () {
          el.classList.add('visible');
        }, delay);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---- SKILL BAR ANIMATION ---- */
  const skillSection = document.querySelector('.skills');
  let barsAnimated   = false;

  const skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !barsAnimated) {
        barsAnimated = true;
        document.querySelectorAll('.skill-fill').forEach(function (bar, i) {
          const pct = bar.dataset.pct || 0;
          setTimeout(function () {
            bar.style.width = pct + '%';
          }, i * 100);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (skillSection) skillObserver.observe(skillSection);

  /* ---- NAVBAR PLACEHOLDER IMAGE fallbacks ---- */
  // Replace broken images with colored placeholder divs
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      // Create SVG placeholder
      const w = img.offsetWidth || 400;
      const h = img.offsetHeight || 300;
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0d1120"/>
              <stop offset="100%" stop-color="#0a1628"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)"/>
          <text x="50%" y="50%" font-family="Syne, sans-serif" font-size="14"
                fill="rgba(0,198,255,0.6)" text-anchor="middle" dominant-baseline="middle">
            ${img.alt || 'Image'}
          </text>
        </svg>`;
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  });

  /* ---- TYPED TEXT EFFECT (hero tagline subtle loop) ---- */
  const taglines = [
    '"Building software solutions for real-world problems."',
    '"Turning ideas into digital reality."',
    '"Code. Create. Connect."'
  ];
  const taglineEl = document.querySelector('.hero-tagline');
  let currentTagline = 0;

  if (taglineEl) {
    setInterval(function () {
      currentTagline = (currentTagline + 1) % taglines.length;
      taglineEl.style.opacity = '0';
      taglineEl.style.transform = 'translateY(6px)';
      setTimeout(function () {
        taglineEl.textContent = taglines[currentTagline];
        taglineEl.style.opacity = '1';
        taglineEl.style.transform = 'translateY(0)';
      }, 350);
    }, 4500);

    // Add transition style
    taglineEl.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
  }

  /* ---- GLOWING CARD on mouse move (parallax tilt) ---- */
  document.querySelectorAll('.service-card, .project-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -6;
      const rotY   = ((x - cx) / cx) *  6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ---- STAT COUNTER animation ---- */
  const statSection = document.querySelector('.stat-chips');
  let statsAnimated  = false;

  if (statSection) {
    const statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          document.querySelectorAll('.stat-num').forEach(function (numEl) {
            const endVal  = parseInt(numEl.textContent, 10);
            const isPlus  = numEl.textContent.includes('+');
            let current   = 0;
            const step    = Math.ceil(endVal / 40);
            const timer   = setInterval(function () {
              current += step;
              if (current >= endVal) {
                current = endVal;
                clearInterval(timer);
              }
              numEl.textContent = current + (isPlus ? '+' : '');
            }, 30);
          });
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statObserver.observe(statSection);
  }

}); // end DOMContentLoaded