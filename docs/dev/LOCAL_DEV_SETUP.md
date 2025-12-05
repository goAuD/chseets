# chseets - Local Development Guide

Complete setup and workflow guide for developing the chseets website locally.

---

## Prerequisites

- **Node.js 18+** (for build tools and local web server)
- **Git** (for version control)
- **VS Code or similar editor** (with Markdown preview)

---

## Quick Start (5 minutes)

### 1. Clone Repository & Install Dependencies

```bash
git clone https://github.com/goAuD/chseets.git
cd chseets
npm install
```

### 2. Start Local Development Server

```bash
npm start
```

This launches a web server on **http://localhost:8000** with:

- **Live reload** for CSS/JS changes
- **CORS enabled** for API testing
- **Cache disabled** (always fresh files)

### 3. Open in Browser

Visit these URLs to explore the local site:

- **Homepage**: http://localhost:8000/
- **Sheet Gallery**: http://localhost:8000/sheets/
- **Profile/Account**: http://localhost:8000/profile/
- **About Page**: http://localhost:8000/about/
- **API Docs**: http://localhost:8000/api/

---

## Development Workflow

### Creating a Feature Branch

Always create a new branch for changes:

```bash
git checkout -b feat/your-feature-name
```

Branch naming convention:

- `feat/` — new features
- `fix/` — bug fixes
- `docs/` — documentation updates
- `refactor/` — code improvements
- `style/` — CSS/styling changes

### Common Development Tasks

#### Editing HTML/CSS

1. Files are in `/web/` directory
2. CSS is in `/web/assets/css/wasd.css` (all design tokens defined there)
3. JavaScript is in `/web/assets/js/app.js`
4. Changes auto-reload (refresh browser if needed)

#### Testing Print Styles

Cheat sheets are optimized for A4 printing. To test:

```bash
# 1. Open a sheet page in your browser
# 2. Press Ctrl+P (Windows) or Cmd+P (Mac)
# 3. In print preview dialog, set:
#    - Paper size: A4
#    - Scale: 100%
#    - Margins: Default or None
#    - Background graphics: ON
```

#### Validating Markdown

Check all `.md` files for style issues:

```bash
npm run lint:md
```

Auto-fix common issues:

```bash
npm run lint:md:fix
```

#### Running Full Validation

```bash
npm run validate        # Lint markdown + validate sheet schema
npm run check-links     # Check all links for validity
```

#### Testing the Service Worker (PWA)

The service worker provides offline support. To test fresh versions:

1. Open DevTools (F12 or Cmd+Option+I)
2. Go to **Application** tab → **Service Workers**
3. Click **Unregister** to remove cached version
4. Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R)
5. Refresh again to re-register

---

## Project Structure

```text
chseets/
├── web/                    # 🌐 Website files (served at /)
│   ├── index.html         # Homepage
│   ├── sheets/
│   │   └── index.html     # Sheet gallery/browser
│   ├── profile/
│   │   └── index.html     # User account & uploads
│   ├── about/
│   │   └── index.html     # About page
│   ├── api/
│   │   └── index.html     # API documentation
│   ├── legal/             # Privacy, terms, imprint, etc.
│   ├── assets/
│   │   ├── css/
│   │   │   ├── wasd.css   # Main stylesheet (WASD design system)
│   │   │   └── print.css  # A4 print optimizations
│   │   ├── js/
│   │   │   └── app.js     # Main client-side logic
│   │   ├── icons/         # PWA icons & logo
│   │   └── fonts/         # Custom web fonts
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker (offline caching)
│
├── docs/                  # 📖 Documentation
│   ├── dev/
│   │   ├── LOCAL_DEV.md   # (Original dev notes)
│   │   ├── SETUP.md       # First-time setup
│   │   ├── DEPLOYMENT.md  # Deploy instructions
│   │   └── SEO_ACCESSIBILITY.md
│   ├── api/               # API specs & endpoints
│   └── product/           # Product policies
│
├── tools/                 # 🛠️ Build & validation scripts
│   ├── validate-sheets.mjs
│   └── linkcheck.mjs
│
├── templates/             # 📋 Contribution templates
│   ├── sheet-template.md
│   └── pull-request.md
│
├── .github/              # CI/CD workflows & issue templates
├── package.json          # npm config & scripts
├── README.md             # Project overview
└── CONTRIBUTING.md       # Contribution guidelines
```

---

## NPM Scripts

```bash
npm start              # Start local server with hot reload (port 8000)
npm run serve          # Alternative: serve without CORS
npm run lint:md        # Lint all markdown files
npm run lint:md:fix    # Auto-fix markdown issues
npm run validate       # Full validation (lint + schema check)
npm run check-links    # Verify all links work
```

---

## Troubleshooting

### Port 8000 Already in Use

```bash
# Either stop the process using port 8000, or use different port:
http-server web -p 3000 -c-1 --cors
```

### Service Worker Not Updating

- Service workers cache aggressively by design
- Solution: Open DevTools → Application → Service Workers → Unregister
- Then hard refresh (Ctrl+Shift+R)

### CSS/JS Changes Not Visible

- Browser cache might be interfering
- Press **Ctrl+Shift+R** (hard refresh) to bypass cache
- Or: Open DevTools → Network tab → check "Disable cache while DevTools is open"

### Supabase Connection Errors in Console

- This is expected in local development
- Supabase credentials may be expired or not configured
- Focus on frontend/CSS/HTML changes; backend integration is tested in CI/CD

---

## Git Workflow

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org):

```bash
# Feature
git commit -m "feat(sheet): add linux-basics cheat sheet"
git commit -m "feat(ui): add dark mode toggle"

# Bug fix
git commit -m "fix(css): improve mobile print layout"
git commit -m "fix(js): correct sheet loading race condition"

# Documentation
git commit -m "docs: update installation guide"
git commit -m "docs(api): add rate limiting section"

# Refactor/Style
git commit -m "refactor(css): consolidate color tokens"
git commit -m "style: organize print.css sections"
```

### Before Pushing

```bash
# 1. Review your changes
git status
git diff

# 2. Lint markdown
npm run lint:md

# 3. Check links (optional but recommended)
npm run check-links

# 4. Stage and commit
git add .
git commit -m "your clear commit message"

# 5. Push to your branch
git push origin feat/your-feature-name
```

Then open a **Pull Request** on GitHub!

---

## Design System Reference

All colors, spacing, and typography are defined in `/web/assets/css/wasd.css`:

### Color Tokens

- `--bg: #0c0f13` — dark background
- `--fg: #d5dde1` — light foreground
- `--accent: #ffb020` — orange accent
- `--pulse: #fd057d` — pink/neon accent
- `--neon: #00f7ff` — cyan glow

### Spacing Scale

- `--space-1: 4px`
- `--space-2: 8px`
- `--space-4: 16px` (base padding)
- `--space-6: 24px` (section spacing)

### Breakpoints

- `--bp-sm: 480px` (mobile)
- `--bp-md: 640px` (small tablet)
- `--bp-tab: 768px` (tablet)
- `--bp-desk: 1024px` (desktop)

See the full file for all available tokens.

---

## Resources

- **WASD Design System**: `/web/assets/css/wasd.css` (all design tokens)
- **Print Specifications**: `/docs/dev/PWA.md`
- **API Overview**: `/docs/api/API_OVERVIEW.md`
- **Supabase Docs**: https://supabase.com/docs
- **PWA Guide**: https://web.dev/progressive-web-apps/
- **A4 Print Standards**: ISO 216

---

## Getting Help

1. **README.md** — Project overview and quick links
2. **CONTRIBUTING.md** — How to contribute
3. **CODE_OF_CONDUCT.md** — Community guidelines
4. **GitHub Issues** — Report bugs or request features
5. **GitHub Discussions** — Ask questions (if enabled)

---

_Last updated: December 2025_
