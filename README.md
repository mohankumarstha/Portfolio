# Portfolio — Mohan Kumar Shrestha

WordPress Developer & Bricks Builder Specialist portfolio.
Plain **HTML + CSS + JavaScript** — no build tools, no frameworks, no dependencies.

```
mohankumarstha/
├── index.html      → all page content
├── css/style.css   → design tokens, layout, dark mode, responsive, print
├── js/main.js      → menu, reveals, hover preview, copy email, print
└── README.md
```

## Kholne tarika (how to open)

`index.html` ma double-click garnus — browser ma khulcha.
Fonts Google Fonts bata aucha, so internet chahinchha (offline ma pani site chalcha,
system fallback font use hunchha).

Local server chahiyeko kholna:

```bash
# VS Code → Live Server extension, or:
python -m http.server 8000
```

## Edit garna parne thau (important)

`index.html` bhitra `<!-- EDIT: ... -->` comment le mark gareko chha:

1. **Email** — `your.email@example.com` (3 thau: menu bhitra, contact section ko email link,
   ra copy button ko `data-copy`)
2. **Phone** — `+977 98XX-XXXXXX` ra `tel:+9779800000000`
3. **GitHub** — `github.com/yourusername` (menu ra contact section, duitai thau)
4. **LinkedIn** — `linkedin.com/in/yourusername` (menu ra contact section, duitai thau)
5. **KisanCare, Himalayan Food Bank, Himalayan Ventures** — live URL aaye pachi
   `<div class="project-link is-soon">` lai
   `<a class="project-link" href="LIVE-URL" target="_blank" rel="noopener">` ma badalnus,
   `<span class="p-soon">` hataunus, ra `data-url` value update garnus.

### Naya project thapna

`project-list` bhitra kunai existing `<article class="project-row">` copy garera
yo structure use garnus:

```html
<article class="project-row reveal" data-art="7" data-name="Project Name" data-url="example.com">
  <a class="project-link" href="https://example.com" target="_blank" rel="noopener">
    <span class="p-thumb art-7" aria-hidden="true"><span>07</span></span>
    <div class="p-info">
      <h3 class="p-title">Project Name</h3>
      <p class="p-desc">One or two lines about the build.</p>
      <p class="p-meta"><span class="p-cat">Category</span> WordPress · Bricks Builder</p>
    </div>
    <span class="p-arrow" aria-hidden="true">↗</span>
  </a>
</article>
```

- `data-art`, `data-name`, `data-url` le desktop hover preview ma dekhine detail dinchha.
- Naya color chahiyeko khanda ma `css/style.css` ma
  `.art-7 { --a: #123456; --b: #abcdef; }` thapnus (thumbnail ra preview duitai
  ma use hunchha).

### Theme ra colors

Site dark theme ma matra chha (light/dark toggle chhaina).

- Accent (periwinkle blue) badalna: `css/style.css` ko `:root` ma
  `--accent` (ra `--accent-ink`) value badalnus.
- Highlight (lime) badalna: `--lime` ra `--lime-ink`.
- Background / text: `--bg`, `--bg-elev`, `--bg-soft`, `--ink`, `--muted`.

### CV / PDF

Contact section ko **Print / Save as PDF** button le print-optimized layout kholcha —
tyaha bata "Save as PDF" garnus. Print styles `style.css` ko `@media print` ma chhan.

## Design

- **Palette:** near-black ink background, periwinkle blue accent, lime highlight
- **Type:** Bricolage Grotesque (display), Inter (body), JetBrains Mono (labels)
- **Layout:** big type hero, rotated ticker band, bento about grid, index-style
  project list with cursor-following preview
- **Header:** lime `MOHAN` wordmark + a full-screen menu overlay (same on mobile
  and desktop) with big numbered links, email and socials
- **Theme:** dark only, high contrast

## Features

- Responsive (mobile → desktop), full-screen menu at every screen size
- Dark, high-contrast theme
- Scroll progress bar, sticky header, active nav link
- Motion: masked hero headline, drifting gradient orbs, scroll reveal,
  rotating role text, count-up stats, magnetic buttons, infinite ticker,
  animated section rules, floating project preview that follows the cursor
- Menu overlay: staggered links, blue/lime glows, live email + socials
- Copy-email button with toast feedback
- Accessible: skip link, focus styles, aria labels, semantic headings,
  label/name matching
- Print stylesheet for a clean CV/PDF export
- Respects `prefers-reduced-motion` (decorative motion and hover preview turn off)

## Deploy

Static site ho — yesari host garna sakinchha:

- **GitHub Pages** — repo ma push garera Settings → Pages
- **Netlify / Vercel** — folder drag-and-drop
- **cPanel** — `index.html`, `css/`, `js/` public_html ma upload

Deploy agadi README ko "EDIT" list sabai replace gareko confirm garnus.
