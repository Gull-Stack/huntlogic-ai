# GullStack Site Schema & Framework Template
## For Bogey (UXUI & Schema Agent)

_Distilled from our top 5 builds: Osborne Electric, Monterey Bay Door, Capital Wealth Federal, Precision Pro Courts, D One Builders_

---

## 1. Tech Stack (Non-Negotiable)

| Layer | Tool |
|---|---|
| **SSG** | 11ty (Eleventy) |
| **Templating** | Nunjucks (`.njk`) |
| **Hosting** | Vercel |
| **Analytics** | GA4 |
| **Fonts** | Google Fonts (Inter is default body; add 1 display font max) |
| **CSS** | Single stylesheet, CSS custom properties, no frameworks |
| **JS** | Vanilla only. No React, no jQuery, no build tools. |
| **Images** | WebP preferred, lazy-loaded, `alt` tags on everything |

---

## 2. Project Structure

```
project-root/
├── .eleventy.js              # Config
├── package.json
├── vercel.json               # Rewrites, headers, redirects
├── src/
│   ├── _data/
│   │   └── site.json         # Global site data (name, url, phone, email, address, serviceAreas, gaId)
│   ├── _includes/
│   │   ├── base.njk          # Master layout (or layouts/base.njk)
│   │   ├── header.njk        # (or partials/header.njk)
│   │   └── footer.njk        # (or partials/footer.njk)
│   ├── css/
│   │   └── styles.css        # Single master stylesheet
│   ├── js/
│   │   ├── main.js           # Nav toggle, scroll effects, form handling
│   │   └── ga4-events.js     # Phone clicks, form submissions, email clicks
│   ├── images/               # (or assets/images/)
│   ├── index.njk             # Homepage
│   ├── about.njk
│   ├── contact.njk
│   ├── services.njk          # Services hub
│   ├── services/             # Individual service pages
│   │   └── [service-name].njk
│   ├── areas/                # Service area pages (city/county SEO)
│   │   ├── index.njk
│   │   └── [city-state].njk
│   ├── guides/               # AEO Answer Hub pages
│   │   └── [topic]/index.njk
│   ├── brand-facts/          # AEO brand-facts.json endpoint
│   │   └── index.njk
│   ├── privacy-policy.njk
│   ├── terms-of-service.njk
│   └── sitemap.njk           # Dynamic XML sitemap
```

---

## 3. `site.json` — Global Data Schema

```json
{
  "name": "Business Name",
  "tagline": "Short tagline",
  "description": "Full meta description (150-160 chars)",
  "url": "https://www.domain.com",
  "email": "info@domain.com",
  "phone": "(801) 555-1234",
  "address": {
    "street": "123 Main St",
    "city": "Salt Lake City",
    "state": "UT",
    "zip": "84101"
  },
  "gaId": "G-XXXXXXXXXX",
  "serviceAreas": ["Utah County", "Salt Lake County", "Davis County"],
  "socials": {
    "facebook": "https://facebook.com/...",
    "instagram": "https://instagram.com/..."
  }
}
```

---

## 4. Base Layout Template (`base.njk`)

Every page extends this. This is the DNA.

```njk
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }} | {{ site.name }}</title>
  <meta name="description" content="{{ description or site.description }}">
  <meta name="robots" content="index, follow">
  <meta name="author" content="{{ site.name }}">

  <!-- Canonical -->
  <link rel="canonical" href="{{ site.url }}{{ page.url }}">

  <!-- Open Graph -->
  <meta property="og:title" content="{{ title }} | {{ site.name }}">
  <meta property="og:description" content="{{ description or site.description }}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{{ site.url }}{{ page.url }}">
  <meta property="og:image" content="{{ site.url }}/images/og-default.jpg">
  <meta property="og:locale" content="en_US">
  <meta property="og:site_name" content="{{ site.name }}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{ title }} | {{ site.name }}">
  <meta name="twitter:description" content="{{ description or site.description }}">

  <!-- GA4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={{ site.gaId }}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '{{ site.gaId }}');
  </script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css">

  <!-- Page-specific schema (injected by each page) -->
  {% block schema %}{% endblock %}

  <!-- Organization Schema (global — every page) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "{{ schemaType or 'LocalBusiness' }}",
    "@id": "{{ site.url }}/#organization",
    "name": "{{ site.name }}",
    "url": "{{ site.url }}",
    "telephone": "{{ site.phone }}",
    "email": "{{ site.email }}",
    "description": "{{ site.description }}",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "{{ site.address.street }}",
      "addressLocality": "{{ site.address.city }}",
      "addressRegion": "{{ site.address.state }}",
      "postalCode": "{{ site.address.zip }}",
      "addressCountry": "US"
    },
    "areaServed": [
      {% for area in site.serviceAreas %}
      { "@type": "AdministrativeArea", "name": "{{ area }}" }{% if not loop.last %},{% endif %}
      {% endfor %}
    ]
  }
  </script>

  <!-- BreadcrumbList (if breadcrumbs defined in frontmatter) -->
  {% if breadcrumbs %}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "{{ site.url }}" }
      {% for crumb in breadcrumbs %},
      { "@type": "ListItem", "position": {{ loop.index + 1 }}, "name": "{{ crumb.name }}", "item": "{{ site.url }}{{ crumb.url }}" }
      {% endfor %}
    ]
  }
  </script>
  {% endif %}
</head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  {% include "header.njk" %}
  <main id="main">
    {% block content %}{% endblock %}
  </main>
  {% include "footer.njk" %}
  <script src="/js/main.js"></script>
  <script src="/js/ga4-events.js"></script>
</body>
</html>
```

---

## 5. Page Types & Their Schema

### 5A. Homepage (`index.njk`)

**Frontmatter:**
```yaml
---
title: "Primary Keyword | Business Name"
description: "150-160 char meta description with location + service + CTA"
---
```

**Required Schema:**
- `Organization` or industry-specific type (`ElectricalContractor`, `FinancialService`, `SportsActivityLocation`, etc.)
- `hasOfferCatalog` listing all services
- `founder` with name + title
- `aggregateRating` if reviews exist
- `sameAs` array (social links)
- `areaServed` array
- `priceRange`

**Required Sections (in order):**
1. **Hero** — H1, tagline paragraph, primary CTA button, secondary CTA button
2. **How It Works / 3-Step Plan** — Numbered steps (01, 02, 03), reduce cognitive load
3. **Services Grid** — Card layout with SVG icons (NO emojis), H3 + description
4. **Social Proof** — Reviews, ratings, trust badges, certifications
5. **Service Areas** — Grid or list of areas served
6. **Final CTA** — Bold ask. "Get Your Free Quote" not "Learn More"

### 5B. Service Page (`services/[name].njk`)

**Required Schema:**
- `Service` type with `provider` referencing org
- `BreadcrumbList` (Home → Services → This Service)
- `FAQPage` with 3-5 real questions people search

**Required Sections:**
1. **Hero** — Service name H1, description, CTA
2. **Problem/Pain** — What happens if they DON'T get this service
3. **What We Do** — Detailed service description, bullet points
4. **Process** — How the service works (3-4 steps)
5. **FAQ** — Structured Q&A with `<details>/<summary>` or JS accordion
6. **CTA** — Service-specific call to action

### 5C. Service Area / City Page (`areas/[city].njk`)

**Required Schema:**
- `LocalBusiness` or industry type with `areaServed` = specific city
- `BreadcrumbList` (Home → Service Areas → County → City)
- `FAQPage` with 2-3 city-specific questions

**Required Sections:**
1. **Hero** — "[Service] in [City], [State]"
2. **Local Context** — 2-3 paragraphs mentioning neighborhoods, landmarks, local details
3. **Services Available** — List/grid of services offered in this area
4. **FAQ** — City-specific questions
5. **CTA** — "Serving [City] and surrounding areas"

### 5D. About Page (`about.njk`)

**Required Schema:**
- `Organization` with `founder`, `foundingDate`, `numberOfEmployees`
- `Person` for each team member (name, jobTitle, description)

**Required Sections:**
1. **Hero** — Company story headline
2. **Origin Story** — How/why the company started
3. **Team** — Photos + bios (if available)
4. **Values / Differentiators** — What makes them different
5. **Certifications / Licenses** — Trust signals
6. **CTA**

### 5E. Contact Page (`contact.njk`)

**Required Schema:**
- `ContactPoint` with telephone, email, contactType
- `LocalBusiness` with full address + hours

**Required Sections:**
1. **Hero** — "Get in Touch" / "Request a Quote"
2. **Contact Form** — Name, email, phone, message, service dropdown (optional)
3. **Direct Contact** — Phone (clickable `tel:`), email (clickable `mailto:`), address
4. **Map** — Embedded or static (optional)

### 5F. Guide / Answer Hub (`guides/[topic]/index.njk`)

**Required Schema:**
- `Article` with author, datePublished, dateModified
- `FAQPage` with 5-10 questions
- `BreadcrumbList`

**Purpose:** AEO (Answer Engine Optimization) — these pages exist to be cited by AI search engines.

---

## 6. CSS Design System (Custom Properties)

Every site gets its own color scheme but follows this structure:

```css
:root {
  /* Brand Colors — CHANGE PER CLIENT */
  --primary: #1a1a1a;        /* Main brand color */
  --primary-hover: #333333;
  --accent: #F4B223;         /* CTA / highlight color */
  --accent-hover: #E5A31D;
  --accent-light: rgba(244, 178, 35, 0.08);

  /* Neutrals — Mostly stable across sites */
  --white: #ffffff;
  --off-white: #fafafa;
  --light-gray: #f5f6fa;
  --border-gray: #e8e9ed;
  --medium-gray: #636e72;
  --dark-gray: #2d3436;
  --black: #1a1a1a;

  /* Typography */
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Layout */
  --container: 1200px;
  --section-pad: 6rem;
  --section-pad-mobile: 4rem;
  --radius: 8px;
  --radius-lg: 16px;
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.1);
  --shadow-xl: 0 16px 48px rgba(0,0,0,0.12);
}
```

### Typography Scale:
```css
h1 { font-size: clamp(2.25rem, 5.5vw, 3.75rem); letter-spacing: -0.02em; }
h2 { font-size: clamp(1.75rem, 3.5vw, 2.75rem); }
h3 { font-size: clamp(1.25rem, 2vw, 1.5rem); }
body { font-size: 1rem; line-height: 1.7; }
```

---

## 7. Header Pattern

```
┌─────────────────────────────────────────────────────────┐
│  [LOGO]    Home  Services▼  Areas▼  About  Contact  [CTA BUTTON]  │
└─────────────────────────────────────────────────────────┘
```

- Logo left, nav center-right, CTA button far right
- Dropdown menus for Services and Service Areas
- Mobile: hamburger toggle (☰) → slide-in or overlay nav
- Scroll effect: `header.scrolled` class adds background/shadow
- Active page highlighting via `page.url` check
- CTA button in header = same as primary CTA ("Free Quote", "Free Estimate", etc.)

---

## 8. Footer Pattern

```
┌─────────────────────────────────────────────────────────┐
│  [Brand Col]     [Services Col]    [Areas Col]    [Contact Col]    │
│  Description     Link list         Link list      Phone/Email      │
│  Social icons                                     Quote link       │
├─────────────────────────────────────────────────────────┤
│  © 2026 Business Name. All rights reserved.  Marketing by GullStack│
└─────────────────────────────────────────────────────────┘
```

- 4-column grid (collapses to stacked on mobile)
- **GullStack credit is MANDATORY** on every site
- Social icons as SVGs (not Font Awesome, not emojis)
- Privacy Policy + Terms of Service links

---

## 9. GA4 Event Tracking (Standard)

Every site tracks these events automatically via `ga4-events.js`:

```javascript
// Phone clicks → event: phone_click
// Email clicks → event: email_click
// Form submissions → event: form_submission
// CTA clicks → event: cta_click (with label = button text)
// Scroll depth → event: scroll_depth (25%, 50%, 75%, 100%)
```

---

## 10. SEO / AEO Checklist (Every Page)

- [ ] Unique `<title>` with primary keyword + brand (60 chars max)
- [ ] Unique `<meta description>` (150-160 chars, includes CTA)
- [ ] `<link rel="canonical">` pointing to self
- [ ] Open Graph tags (title, description, image, url)
- [ ] Twitter Card tags
- [ ] Organization/LocalBusiness schema in `<head>`
- [ ] BreadcrumbList schema on all pages except homepage
- [ ] FAQPage schema on every service + area page
- [ ] Semantic HTML (`<main>`, `<section>`, `<article>`, `<nav>`)
- [ ] Skip-to-content link for accessibility
- [ ] All images have descriptive `alt` text
- [ ] All `tel:` and `mailto:` links are clickable
- [ ] Dynamic sitemap via `collections.all`
- [ ] `robots.txt` allowing all crawlers
- [ ] No orphan pages (everything linked from nav or footer)

---

## 11. Dynamic Sitemap Template

```njk
---
permalink: /sitemap.xml
eleventyExcludeFromCollections: true
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {%- for page in collections.all %}
  {%- if not page.data.excludeFromSitemap %}
  <url>
    <loc>{{ site.url }}{{ page.url }}</loc>
    <lastmod>{{ page.date | dateToISO }}</lastmod>
  </url>
  {%- endif %}
  {%- endfor %}
</urlset>
```

---

## 12. Design Rules (Hard Rules)

1. **NO emojis on websites** — use SVG icons or nothing
2. **NO stock photo vibes** — real photos or clean illustrations
3. **NO framework CSS** (Bootstrap, Tailwind) — hand-written CSS custom properties
4. **NO jQuery** — vanilla JS only
5. **Inter is the default body font** — add ONE display font max
6. **Mobile-first** — design for 375px, scale up
7. **Section padding: 6rem desktop, 4rem mobile** — consistent rhythm
8. **Max container width: 1200px** — centered with auto margins
9. **Buttons: bold CTA copy** — "Get Your Free Quote" not "Submit" or "Learn More"
10. **GullStack footer credit on EVERY site** — non-negotiable

---

## 13. StoryBrand Page Flow (Content Structure)

Every page should follow this narrative arc:

1. **Hero = The Promise** — What the customer gets (they're the hero)
2. **Problem = The Pain** — External, internal, and philosophical problem
3. **Guide = We Understand** — Empathy + authority (credentials, reviews)
4. **Plan = Simple Steps** — 3 steps max, reduce cognitive load
5. **CTA = Bold Ask** — Direct CTA + transitional CTA
6. **Success = The Outcome** — What life looks like after they hire you
7. **Failure = The Stakes** — What happens if they don't act (subtle)

---

## 14. New Site Kickoff Checklist

When starting a new client site, Bogey should:

1. [ ] Create repo in `Gull-Stack` org
2. [ ] Scaffold project structure (Section 2)
3. [ ] Populate `site.json` with client data
4. [ ] Build `base.njk` with all meta/schema
5. [ ] Design CSS custom properties (colors from client brand)
6. [ ] Build header + footer + mobile nav
7. [ ] Build homepage following Section 5A
8. [ ] Build service pages following Section 5B
9. [ ] Build area pages following Section 5C
10. [ ] Build about + contact pages
11. [ ] Add privacy policy + terms of service
12. [ ] Create dynamic sitemap + robots.txt
13. [ ] Wire up GA4 + event tracking
14. [ ] Test mobile responsiveness
15. [ ] Deploy to Vercel
16. [ ] Verify all schema with Google Rich Results Test

---

*Generated from live analysis of: Osborne Electric, Capital Wealth Federal, Precision Pro Courts, Monterey Bay Door, D One Builders*
*Last updated: July 2026*
