// Hunt Logic AI - Main JavaScript
// Navigation, mobile menu, scroll effects

document.addEventListener('DOMContentLoaded', function() {

  // Mobile Navigation Toggle
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

  // Dropdown Toggle for Desktop
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

  // Header Scroll Effect
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

  // Contact Form Handling (basic validation)
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

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#main') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Add loading state to buttons
  document.querySelectorAll('button[type="submit"], .btn').forEach(button => {
    button.addEventListener('click', function() {
      if (this.form && !this.form.checkValidity()) {
        return;
      }

      // Add loading class (can be styled with CSS)
      this.classList.add('loading');

      // Remove loading state after 2 seconds
      setTimeout(() => {
        this.classList.remove('loading');
      }, 2000);
    });
  });

  // Lazy Load Images (if needed)
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Print debug info in development
  console.log('Hunt Logic AI - Site Loaded');
  console.log('Environment: Production');
});
