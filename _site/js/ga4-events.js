// Hunt Logic AI - GA4 Event Tracking
// Tracks phone clicks, email clicks, form submissions, CTA clicks, scroll depth

document.addEventListener('DOMContentLoaded', function() {

  // Only run if gtag is available
  if (typeof gtag === 'undefined') {
    console.log('GA4 not loaded - event tracking disabled');
    return;
  }

  // Track Phone Clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
      const phoneNumber = this.getAttribute('href').replace('tel:', '');
      gtag('event', 'phone_click', {
        'event_category': 'Contact',
        'event_label': phoneNumber,
        'value': 1
      });
      console.log('GA4 Event: phone_click', phoneNumber);
    });
  });

  // Track Email Clicks
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', function() {
      const email = this.getAttribute('href').replace('mailto:', '');
      gtag('event', 'email_click', {
        'event_category': 'Contact',
        'event_label': email,
        'value': 1
      });
      console.log('GA4 Event: email_click', email);
    });
  });

  // Track CTA Button Clicks
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function() {
      const buttonText = this.textContent.trim();
      const buttonHref = this.getAttribute('href') || 'button';

      gtag('event', 'cta_click', {
        'event_category': 'Engagement',
        'event_label': buttonText,
        'button_href': buttonHref
      });
      console.log('GA4 Event: cta_click', buttonText);
    });
  });

  // Track Form Submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      const formId = this.id || 'unknown_form';
      const formName = this.getAttribute('name') || formId;

      gtag('event', 'form_submission', {
        'event_category': 'Lead',
        'event_label': formName,
        'value': 10
      });
      console.log('GA4 Event: form_submission', formName);
    });
  });

  // Track Outbound Links
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    // Skip links to same domain
    const currentDomain = window.location.hostname;
    const linkDomain = new URL(link.href).hostname;

    if (linkDomain !== currentDomain) {
      link.addEventListener('click', function() {
        gtag('event', 'outbound_click', {
          'event_category': 'Navigation',
          'event_label': this.href,
          'transport_type': 'beacon'
        });
        console.log('GA4 Event: outbound_click', this.href);
      });
    }
  });

  // Track Scroll Depth
  let scrollDepthMarkers = [25, 50, 75, 100];
  let scrollDepthReached = [];

  window.addEventListener('scroll', function() {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    scrollDepthMarkers.forEach(marker => {
      if (scrollPercentage >= marker && !scrollDepthReached.includes(marker)) {
        scrollDepthReached.push(marker);

        gtag('event', 'scroll_depth', {
          'event_category': 'Engagement',
          'event_label': marker + '%',
          'value': marker
        });
        console.log('GA4 Event: scroll_depth', marker + '%');
      }
    });
  });

  // Track Video Plays (if any videos are added later)
  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', function() {
      const videoSrc = this.src || this.querySelector('source')?.src || 'unknown';

      gtag('event', 'video_play', {
        'event_category': 'Media',
        'event_label': videoSrc
      });
      console.log('GA4 Event: video_play', videoSrc);
    });
  });

  // Track File Downloads
  document.querySelectorAll('a[href$=".pdf"], a[href$=".zip"], a[href$=".doc"], a[href$=".docx"]').forEach(link => {
    link.addEventListener('click', function() {
      const fileName = this.href.split('/').pop();

      gtag('event', 'file_download', {
        'event_category': 'Download',
        'event_label': fileName
      });
      console.log('GA4 Event: file_download', fileName);
    });
  });

  // Track Social Media Clicks
  document.querySelectorAll('.social-link, .social-icons a').forEach(link => {
    link.addEventListener('click', function() {
      const socialPlatform = this.href.includes('facebook') ? 'Facebook' :
                            this.href.includes('instagram') ? 'Instagram' :
                            this.href.includes('youtube') ? 'YouTube' :
                            this.href.includes('twitter') ? 'Twitter' : 'Other';

      gtag('event', 'social_click', {
        'event_category': 'Social',
        'event_label': socialPlatform
      });
      console.log('GA4 Event: social_click', socialPlatform);
    });
  });

  // Track Time on Page (send event after 30 seconds)
  setTimeout(() => {
    gtag('event', 'engaged_user', {
      'event_category': 'Engagement',
      'event_label': '30_seconds',
      'value': 30
    });
    console.log('GA4 Event: engaged_user (30 seconds)');
  }, 30000);

  // Track Exit Intent (when user moves mouse to top of page)
  let exitIntentFired = false;
  document.addEventListener('mouseout', function(e) {
    if (!exitIntentFired && e.clientY < 10) {
      exitIntentFired = true;
      gtag('event', 'exit_intent', {
        'event_category': 'Engagement',
        'event_label': window.location.pathname
      });
      console.log('GA4 Event: exit_intent');
    }
  });

  console.log('GA4 Event Tracking Initialized');
});
