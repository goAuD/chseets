# 🎯 chseets Developer Hub

Welcome to the **chseets** development environment! This folder contains comprehensive guides for working on the chseets project locally.

---

## 📖 Quick Navigation

### 🚀 Getting Started (Start Here!)

→ **[LOCAL_DEV_SETUP.md](./LOCAL_DEV_SETUP.md)**

- 5-minute quick start
- Full development workflow
- Troubleshooting common issues
- Git workflow and commit conventions

### ✅ Code Quality & Standards

→ **[QUALITY_CHECKLIST.md](./QUALITY_CHECKLIST.md)**

- Pre-development environment checklist
- Code quality standards
- Accessibility requirements
- Performance benchmarks
- Common mistakes to avoid
- Code review guidelines

### ⚡ Web Performance & Deployment

→ **[WEB_OPTIMIZATION.md](./WEB_OPTIMIZATION.md)**

- Current performance baseline
- Optimization priorities (high/medium/low)
- Security hardening checklist
- Mobile optimization
- SEO best practices
- Deployment procedures
- Monitoring & maintenance

### 📋 Original Dev Notes

→ **[LOCAL_DEV.md](./LOCAL_DEV.md)** (Original, kept for reference)

---

## 🔨 Essential Commands

```bash
# Start local development server (port 8000)
npm start

# Validate all markdown files
npm run lint:md

# Auto-fix markdown issues
npm run lint:md:fix

# Run full validation (lint + schema check)
npm run validate

# Check all links for validity
npm run check-links
```

---

## 📁 Project Structure

```text
chseets/
├── web/                    # 🌐 Website files (served at /)
│   ├── index.html         # Homepage
│   ├── sheets/            # Sheet gallery
│   ├── profile/           # User account
│   ├── about/             # About page
│   ├── api/               # API documentation
│   ├── legal/             # Legal pages
│   ├── assets/
│   │   ├── css/           # Stylesheets (WASD design system)
│   │   ├── js/            # Client-side logic
│   │   └── icons/         # Logo & icons
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker
│
├── docs/                  # 📖 Documentation
│   ├── dev/               # Developer guides (THIS FOLDER)
│   ├── api/               # API specs
│   ├── product/           # Product policies
│   └── legal/             # Legal docs
│
├── tools/                 # 🛠️ Build scripts
├── templates/             # 📋 Contribution templates
├── package.json           # NPM config
└── README.md              # Project overview
```

---

## 🎯 Common Tasks

### Want to edit the website?

1. Read **[LOCAL_DEV_SETUP.md](./LOCAL_DEV_SETUP.md)** → Quick Start
2. Run `npm start`
3. Edit files in `/web/`
4. Follow **[QUALITY_CHECKLIST.md](./QUALITY_CHECKLIST.md)** before committing

### Want to optimize performance?

1. Start with **[WEB_OPTIMIZATION.md](./WEB_OPTIMIZATION.md)**
2. Use Chrome DevTools → Lighthouse audit
3. Follow priority order: high → medium → low

### Want to deploy to production?

1. Complete **[QUALITY_CHECKLIST.md](./QUALITY_CHECKLIST.md)** Pre-Deployment section
2. Follow **[WEB_OPTIMIZATION.md](./WEB_OPTIMIZATION.md)** Deployment Checklist
3. See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for server setup

### Want to add a new feature?

1. Create feature branch: `git checkout -b feat/your-feature`
2. Follow **[QUALITY_CHECKLIST.md](./QUALITY_CHECKLIST.md)**
3. Use design tokens from `/web/assets/css/wasd.css`
4. Test at: 375px (mobile), 768px (tablet), 1024px (desktop)
5. Commit following [Conventional Commits](https://www.conventionalcommits.org)

---

## 🎨 Design System

All colors, spacing, and typography are defined in one place:

**File**: `/web/assets/css/wasd.css` (lines 1-50)

**Key Tokens**:

```css
--bg: #0c0f13            /* Dark background */
--fg: #d5dde1            /* Light text */
--accent: #ffb020        /* Orange accent */
--pulse: #fd057d         /* Pink/neon accent */
--space-4: 16px          /* Base padding */
--bp-tab: 768px          /* Tablet breakpoint */
```

**Rule**: Always use CSS variables, never hardcode colors or sizes!

---

## 🔍 Development Environment

### Recommended Setup

**Editor**: VS Code with extensions:

- [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
- [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (optional)

**Browser DevTools**:

- Chrome DevTools (F12) - Built-in, excellent
- Firefox DevTools (F12) - Also excellent
- Safari DevTools - Good for iOS testing

### System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **Git**: 2.30 or higher
- **Disk space**: 500MB (includes node_modules)

---

## ✅ Before Every Commit

```bash
# 1. Check for errors
npm run lint:md
npm run check-links

# 2. Review changes
git status
git diff

# 3. Stage and commit
git add .
git commit -m "type(scope): description"

# 4. Push to GitHub
git push origin your-branch-name
```

**Commit message format**:

```text
feat(ui):    new feature
fix(js):     bug fix
docs:        documentation only
refactor:    code cleanup (no behavior change)
style(css):  styling changes
test:        add/update tests
```

---

## 🐛 Troubleshooting

### Port 8000 in use?

```bash
http-server web -p 3000 -c-1 --cors
```

### CSS not updating?

Press **Ctrl+Shift+R** (hard refresh to bypass cache)

### Service worker not updating?

1. F12 → Application → Service Workers → Unregister
2. Hard refresh (Ctrl+Shift+R)

### Link validation failing?

```bash
npm run check-links
```

Check the output for broken paths.

For more help, see **[LOCAL_DEV_SETUP.md - Troubleshooting](./LOCAL_DEV_SETUP.md#troubleshooting)** section.

---

## 🌐 Online Resources

- **[Project README](../../README.md)** - Project overview
- **[Contributing Guide](../../CONTRIBUTING.md)** - How to contribute
- **[Code of Conduct](../../CODE_OF_CONDUCT.md)** - Community standards
- **[Architecture](../../ARCHITECTURE.md)** - System design
- **[API Docs](../api/API_OVERVIEW.md)** - API endpoints

---

## 📞 Getting Help

1. **Check the docs** - Most answers are in the guides above
2. **Search GitHub Issues** - Your question might already be answered
3. **Read error messages** - They're usually very helpful!
4. **Try `npm run validate`** - Catches common problems

---

## 🚀 Next Steps

1. **First time?** Start with [LOCAL_DEV_SETUP.md](./LOCAL_DEV_SETUP.md)
2. **Want to contribute?** Read [CONTRIBUTING.md](../../CONTRIBUTING.md)
3. **Building a feature?** Check [QUALITY_CHECKLIST.md](./QUALITY_CHECKLIST.md)
4. **Performance focused?** See [WEB_OPTIMIZATION.md](./WEB_OPTIMIZATION.md)

---

_Happy coding! Questions? Check the guides above or open an issue on GitHub._

**Last updated**: December 2025  
**Maintained by**: chseets team
