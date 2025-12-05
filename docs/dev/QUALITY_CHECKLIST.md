# chseets - Development Checklist & Optimization

A comprehensive guide for maintaining code quality, performance, and consistency across the chseets project.

---

## 📋 Pre-Development Checklist

Before starting work, ensure your environment is ready:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Git configured (`git config --global user.name "Your Name"`)
- [ ] Project cloned and dependencies installed (`npm install`)
- [ ] Local server runs without errors (`npm start`)
- [ ] You can access http://localhost:8000 in browser
- [ ] VS Code (or editor) extensions installed for Markdown & HTML
- [ ] Created feature branch (`git checkout -b feat/...`)

---

## 🎯 Quality Checklist (Before Committing)

### Code Quality

- [ ] No console errors in DevTools (F12)
- [ ] No console warnings (except expected Supabase auth messages)
- [ ] All links are internal or absolute URLs (no broken relative links)
- [ ] HTML validates against DOCTYPE (run through W3C validator)
- [ ] CSS doesn't break responsive layout (test at 480px, 768px, 1024px)

### Accessibility

- [ ] All images have `alt` text
- [ ] Form inputs have associated `<label>` elements
- [ ] Color contrast meets WCAG AA standards (use WebAIM contrast checker)
- [ ] Keyboard navigation works (Tab through interactive elements)
- [ ] Page structure is semantic (proper heading hierarchy h1→h2→h3)

### Performance

- [ ] CSS is under 50KB (currently wasd.css + print.css combined)
- [ ] JavaScript is under 100KB (currently app.js)
- [ ] Images are optimized (use SVG for icons, compressed PNG/WebP)
- [ ] No render-blocking resources in `<head>` critical path
- [ ] Service worker caches key assets for offline use

### Testing

- [ ] `npm run lint:md` passes (0 errors)
- [ ] `npm run check-links` passes (all links valid)
- [ ] Print preview looks correct on A4 (Ctrl+P → set to A4)
- [ ] Works offline after first load (PWA service worker active)
- [ ] Works on mobile (iOS Safari, Android Chrome)

### Commit & Push

- [ ] Commit message follows Conventional Commits format
- [ ] No sensitive data in commit (API keys, passwords)
- [ ] Related files are grouped in single commit (don't mix unrelated changes)
- [ ] Branch is up to date with main (`git pull origin main`)

---

## 🚀 Performance Optimization

### CSS Optimization

**Current state**: `wasd.css` is consolidated with design tokens (GOOD)

To keep CSS lean:

- ✅ Use CSS custom properties (variables) for repeated values
- ✅ Group related selectors
- ✅ Remove unused styles before committing
- ❌ Avoid inline styles in HTML (use CSS classes)
- ❌ Avoid !important (use specificity instead)

### JavaScript Optimization

**Current state**: `app.js` imports Supabase client + utilities

To optimize:

- ✅ Lazy load PDF.js library (only loaded when needed)
- ✅ Use dynamic imports for non-critical features
- ✅ Minimize DOM queries (cache selectors with `const`)
- ❌ Avoid global variables (namespace under modules)
- ❌ Don't load third-party scripts synchronously

### Asset Optimization

**Icon Strategy**:

- Use SVG for logos and UI icons (scalable, small)
- Use PNG for screenshots/previews (compressed)
- Use WebP with PNG fallback for photos

**Font Strategy**:

- Load only necessary font weights
- Use `font-display: swap` for custom fonts
- Consider system fonts for body text (faster load)

### Caching Strategy

**Service Worker** (`sw.js`):

- Caches: `index.html`, `wasd.css`, `app.js`, `manifest.json`
- Add any static assets that should work offline
- Version cache with `CACHE = 'chseets-v7'` when making breaking changes

---

## 🎨 Design System Consistency

### Using the WASD Design System

All design decisions are in `/web/assets/css/wasd.css` at the top:

```css
:root {
  /* Colors */
  --bg: #0c0f13;           /* Dark background */
  --fg: #d5dde1;           /* Light text */
  --accent: #ffb020;       /* Orange highlight */
  --pulse: #fd057d;        /* Pink/neon accent */
  
  /* Spacing (4px base) */
  --space-1: 4px;
  --space-4: 16px;         /* Standard padding */
  --space-6: 24px;         /* Section spacing */
  
  /* Breakpoints */
  --bp-sm: 480px;          /* Mobile */
  --bp-tab: 768px;         /* Tablet */
  --bp-desk: 1024px;       /* Desktop */
}
```

### When Adding New Elements

1. **Use existing tokens** (don't create new colors/sizes)
2. **Follow spacing scale** (multiples of 4px: 4, 8, 12, 16, 20, 24, 32, 40)
3. **Use semantic HTML** (`<button>`, `<nav>`, `<main>`, `<header>`, `<footer>`)
4. **Apply .card class** for contained content blocks
5. **Use .container** for horizontal centering on desktop

Example:

```html
<!-- ✅ Good -->
<section class="card">
  <h2>Title</h2>
  <p>Content</p>
</section>

<!-- ❌ Avoid -->
<div style="background: #0c0f13; padding: 20px; border-radius: 8px;">
  <h2>Title</h2>
  <p>Content</p>
</div>
```

---

## 🔍 Code Review Checklist

When reviewing a pull request, check:

### Functionality

- [ ] Feature works as described
- [ ] No regressions in other pages
- [ ] Error handling is present (try/catch blocks)
- [ ] Edge cases are handled (empty states, loading states)

### Code Quality Standards

- [ ] Code is readable and well-commented
- [ ] No duplicate code (DRY principle)
- [ ] No console.log() left in production code
- [ ] Functions have single responsibility

### Security

- [ ] No hardcoded secrets or API keys
- [ ] Inputs are validated/sanitized
- [ ] Links are safe (target="_blank" has rel="noopener")
- [ ] CORS headers are appropriate

### Testing Standards

- [ ] All lints pass (`npm run lint:md`)
- [ ] Links are valid (`npm run check-links`)
- [ ] Print layout is correct (A4 format)
- [ ] Mobile layout is correct (480px width)

---

## 📱 Responsive Design Testing

Test at these breakpoints:

```text
Mobile (--bp-sm: 480px)
├─ Portrait: 375px
├─ Landscape: 667px
└─ Tablet portrait: 480px

Tablet (--bp-tab: 768px)
├─ iPad: 768x1024
└─ iPad landscape: 1024x768

Desktop (--bp-desk: 1024px+)
├─ 1024px
├─ 1440px
└─ 1920px (widescreen)
```

**Tools**:

- Chrome DevTools: F12 → Toggle device toolbar (Ctrl+Shift+M)
- Firefox DevTools: F12 → Responsive Design Mode (Ctrl+Shift+M)
- Physical devices for accurate testing

---

## 🌐 Browser Support

Target browsers:

- Chrome/Edge 90+ (Chromium-based)
- Firefox 88+
- Safari 14+ (mobile & desktop)
- Mobile browsers: Chrome for Android, Safari iOS 14+

**Modern web features used**:

- CSS Grid & Flexbox
- CSS Custom Properties
- Service Workers (PWA)
- Dynamic imports (modules)
- Fetch API

**Not supported**:

- IE 11 (intentionally dropped; PWA requires modern features)
- Old Android browsers (<5.0)

---

## 🔗 Link Validation

Run before every commit:

```bash
npm run check-links
```

This validates:

- [ ] All `href=""` attributes
- [ ] All `src=""` attributes
- [ ] External URLs (if checker is configured to do so)
- [ ] Anchor links (#sections)

---

## 📚 Documentation Updates

When adding a feature, also update:

1. **README.md** — If it's user-facing
2. **docs/dev/LOCAL_DEV_SETUP.md** — If it affects development
3. **CONTRIBUTING.md** — If it changes contribution process
4. **docs/api/API_OVERVIEW.md** — If it's a new API endpoint
5. **templates/pull-request.md** — If it affects PR template

---

## 🚨 Common Mistakes to Avoid

| Mistake | Impact | Fix |
|---------|--------|-----|
| Hardcoding colors instead of using CSS vars | Design inconsistency | Use `var(--accent)` etc. |
| Missing alt text on images | Accessibility failure | Add `alt="description"` |
| Inline styles in HTML | Harder to maintain | Move to CSS classes |
| No error handling | Broken features | Use try/catch, .catch() |
| Broken relative links | 404 errors | Use absolute paths from `/` |
| Not testing on mobile | Mobile UI broken | Test at --bp-sm (480px) |
| Leaving console.log() | Polluted console | Remove before commit |
| Committing node_modules/ | Huge repo size | Add to `.gitignore` |

---

## 🔄 Maintenance Schedule

### Daily

- Run `npm run lint:md` before pushing
- Check for console errors (F12)

### Weekly

- Run `npm run validate` (full test suite)
- Review open PRs for issues

### Monthly

- Update dependencies (`npm update`)
- Review and close stale issues
- Check for security updates

### Quarterly

- Audit third-party libraries (Supabase, PDF.js)
- Review performance metrics
- Update browser compatibility matrix

---

## Resources

- **WASD Design System**: `/web/assets/css/wasd.css`
- **HTML Standards**: https://html.spec.whatwg.org/
- **Web Accessibility**: https://www.w3.org/WAI/ARIA/apg/
- **Performance Best Practices**: https://web.dev/performance/
- **PWA Guide**: https://web.dev/progressive-web-apps/

---

_Last updated: December 2025_
_Maintained by: chseets contributors_
