# VERSIFX — Corporate Website (V1)

A static, dependency-free website for VERSIFX built with HTML5, CSS3, and vanilla JavaScript.

## Running locally

No build step or backend is required. From this folder, start any static file server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

You can also just double-click `index.html` to open it directly, though a local server is recommended so that relative paths and fonts behave exactly as they will in production.

## Project structure

```
VERSIFX/
├── index.html          Home
├── solutions.html       Solutions
├── industries.html      Industries
├── work.html             Work (concept projects)
├── about.html            About
├── contact.html          Contact
│
├── css/
│   ├── global.css        Design tokens, typography, base styles
│   ├── components.css    Nav, buttons, cards, footer, forms
│   └── responsive.css    Breakpoints (tablet / mobile / small mobile)
│
├── js/
│   └── main.js            Sticky nav, mobile menu, scroll reveal, contact form
│
├── assets/
│   ├── logo/               VERSIFX logo (primary, transparent, reverse, mark, favicon)
│   ├── images/              (empty — add real photography here as it's produced)
│   └── icons/                (empty — reserved for future use)
│
├── robots.txt
└── sitemap.xml
```

## Logo assets

- `versifx-logo-transparent.png` — primary navy/gold wordmark + mark, transparent background. Use on light (ivory/stone) backgrounds.
- `versifx-logo-reverse.png` — ivory/gold version. Use on navy or other dark backgrounds (footer, dark sections).
- `versifx-mark-transparent.png` / `versifx-mark-reverse.png` — the V/X symbol alone, for small spaces (mobile menu, favicon-adjacent use).
- `favicon-512.png` — square, padded version of the mark for favicons/app icons.

**Always pick the version that matches the background it sits on** — the primary (navy) logo is invisible on navy backgrounds, and vice versa.

## Design system

All brand tokens (colors, type scale, spacing, radii) live as CSS custom properties at the top of `css/global.css`. Update brand colors, fonts, or spacing there and they propagate everywhere.

- **Colors:** Navy `#101A2B`, Ivory `#F7F4EC`, Charcoal `#252A31`, Soft Stone `#DDD8CC`, Antique Gold `#B79A5B`
- **Display font:** Cormorant Garamond (headlines, editorial moments)
- **UI font:** Manrope (navigation, body, buttons, forms)

Fonts load from Google Fonts via a `<link>` in the `<head>` of every page. If you later want to self-host fonts (recommended for production performance/privacy), download the two families and swap the `<link>` for local `@font-face` declarations.

## Contact form

The form on `contact.html` is structurally complete (Name, Business, Email, Website, Help topic, Details) but **is not connected to a live backend or inbox**. See the `TODO` in `js/main.js` — wire it up to a real email service, serverless function, or CRM webhook before launch. Until then, submitting the form shows an inline note directing people to email `hello@versifx.com` directly.

## What's intentionally not built yet (V1 scope)

Per the brand spec, the following are out of scope for V1 and should be added later as the company grows:

- Client portal, CRM, or dashboard
- Dedicated industry landing pages (e.g. `/industries/dental`) — the Industries page is ready to link out to these once they exist
- Blog / resources section
- Careers page
- Payment or subscription systems
- Real client case studies (only labeled Concept Projects exist for now — do not replace these with fabricated client work)

## Before going live

- [ ] Buy the domain and update `<link rel="canonical">` / Open Graph URLs (currently placeholder `https://www.versifx.com/`)
- [ ] Connect the contact form to a real backend
- [ ] Replace placeholder social links in the footer with real URLs once accounts exist
- [ ] Consider self-hosting fonts for performance
- [ ] Add real photography per the imagery guidelines in the brand spec (no generic stock)
