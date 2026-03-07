// Hunt Logic AI - Main JavaScript
// Navigation, mobile menu, scroll effects, and animations

document.addEventListener('DOMContentLoaded', function() {

  // ===========================================
  // Mobile Navigation Toggle
  // ===========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('nav');

  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
  }

  // ===========================================
  // Dropdown Toggle for Desktop
  // ===========================================
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      // Close all other dropdowns
      dropdownToggles.forEach(other => {
        if (other !== this) {
          other.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle this dropdown
      this.setAttribute('aria-expanded', !isExpanded);
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.has-dropdown')) {
      dropdownToggles.forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // ===========================================
  // Header Scroll Effect
  // ===========================================
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    // Add scrolled class after 50px
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // ===========================================
  // Scroll-Triggered Animations
  // ===========================================
  const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right, .scale-in');

  if ('IntersectionObserver' in window && animatedElements.length > 0) {
    const animationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
      animationObserver.observe(element);
    });
  } else {
    // Fallback: show all elements immediately
    animatedElements.forEach(element => {
      element.classList.add('visible');
    });
  }

  // ===========================================
  // FAQ Accordion
  // ===========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function() {
        // Close other items
        faqItems.forEach(other => {
          if (other !== item && other.classList.contains('open')) {
            other.classList.remove('open');
          }
        });

        // Toggle this item
        item.classList.toggle('open');
      });
    }
  });

  // ===========================================
  // Stats Counter Animation
  // ===========================================
  const statNumbers = document.querySelectorAll('.stat-number');

  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const finalValue = element.textContent;

          // Only animate if not already animated
          if (!element.classList.contains('animated')) {
            element.classList.add('animated');
            animateValue(element, finalValue);
          }

          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.5
    });

    statNumbers.forEach(stat => {
      statsObserver.observe(stat);
    });
  }

  function animateValue(element, finalValue) {
    // Extract numeric value and suffix
    const match = finalValue.match(/^([\d.]+)(\D*)$/);
    if (!match) return;

    const targetNumber = parseFloat(match[1]);
    const suffix = match[2] || '';
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (targetNumber - startValue) * easeOut;

      if (Number.isInteger(targetNumber)) {
        element.textContent = Math.floor(currentValue) + suffix;
      } else {
        element.textContent = currentValue.toFixed(1) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = finalValue;
      }
    }

    requestAnimationFrame(updateNumber);
  }

  // ===========================================
  // Contact Form Handling
  // ===========================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Basic validation
      if (!data.name || !data.email || !data.message) {
        alert('Please fill in all required fields.');
        return;
      }

      // In production, this would send to a backend
      console.log('Form submitted:', data);

      // Show success message
      alert('Thank you for contacting Hunt Logic AI! We will respond within 24 hours.');
      this.reset();

      // Track form submission
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', {
          'event_category': 'Contact',
          'event_label': data.subject || 'Contact Form'
        });
      }
    });
  }

  // ===========================================
  // Smooth Scroll for Anchor Links
  // ===========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#main') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ===========================================
  // Button Loading States
  // ===========================================
  document.querySelectorAll('button[type="submit"]').forEach(button => {
    button.addEventListener('click', function() {
      if (this.form && !this.form.checkValidity()) {
        return;
      }

      // Add loading class
      this.classList.add('loading');

      // Remove loading state after 3 seconds (or when form submission completes)
      setTimeout(() => {
        this.classList.remove('loading');
      }, 3000);
    });
  });

  // ===========================================
  // Lazy Load Images
  // ===========================================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '100px 0px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ===========================================
  // Parallax Effect for Hero Background
  // ===========================================
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const heroHeight = document.querySelector('.hero').offsetHeight;

      if (scrolled < heroHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    });
  }

  // ===========================================
  // Card Hover Effects Enhancement
  // ===========================================
  const cards = document.querySelectorAll('.feature-card, .service-card, .pricing-card, .testimonial-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });

  // ===========================================
  // Print debug info in development
  // ===========================================
  console.log('Hunt Logic AI - Tier-S Site Loaded');
  console.log('Environment: Production');
});
