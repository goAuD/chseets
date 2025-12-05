# chseets - Web Optimization & Deployment Guide

Production-ready optimization checklist and deployment procedures for the chseets website.

---

## 📊 Current Performance Baseline

| Metric | Target | Current |
|--------|--------|---------|
| **CSS Bundle** | < 60KB | ~35KB (wasd.css) |
| **JavaScript** | < 150KB | ~17KB (app.js) |
| **Total HTML** | < 50KB per page | ~8-15KB |
| **First Contentful Paint** | < 1.5s | < 0.8s |
| **Lighthouse Score** | > 90 | ~95+ |
| **Offline Ready** | 100% | ✅ Yes |

---

## 🎯 Optimization Priorities

### High Priority (Do First)

#### 1. Image Optimization

- [ ] Convert PNG icons to SVG (smaller, scalable, cacheable)
- [ ] Compress PNG/WebP images: use ImageOptim or TinyPNG
- [ ] Create responsive images with `srcset` for mobile
- [ ] Lazy load below-fold images with `loading="lazy"`

**Current state**: Icons are PNG. Converting to SVG would save ~30KB.

#### 2. CSS Delivery

- [ ] ✅ CSS is inline critical styles (already good)
- [ ] Remove unused CSS with PurgeCSS (if adding CSS)
- [ ] Don't load print.css on all pages (only when printing)

**Current state**: Good! wasd.css is lean and consolidated.

#### 3. Font Optimization

- [ ] Check if custom fonts are actually used
- [ ] Use `font-display: swap` to prevent FOIT (Flash of Invisible Text)
- [ ] Consider system fonts for faster load: `-apple-system, BlinkMacSystemFont, "Segoe UI"`

**Current state**: Check `/web/assets/fonts/` for actual usage.

#### 4. JavaScript Delivery

- [ ] Load app.js as module (already done ✅)
- [ ] Defer non-critical scripts with `defer` attribute
- [ ] Lazy load PDF.js only when sheets page is visited

**Current state**: Good! app.js is modular and deferred.

### Medium Priority (Do Next)

#### 5. Service Worker & Caching

- [ ] Version cache (`CACHE = 'chseets-v7'`) when updating assets
- [ ] Implement stale-while-revalidate for API calls
- [ ] Add cache expiration logic (optional)

#### 6. Security Headers

- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: SAMEORIGIN`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Content-Security-Policy` (if using Caddy)

#### 7. Analytics & Monitoring (Optional)

- [ ] Consider privacy-respecting analytics (Plausible, Fathom)
- [ ] Monitor Lighthouse scores monthly
- [ ] Set up error tracking (Sentry, error.js)

### Low Priority (Nice to Have)

- [ ] HTTP/2 Server Push for critical resources
- [ ] Preload fonts with `<link rel="preload">`
- [ ] Implement Critical CSS inlining
- [ ] CDN for asset distribution (Cloudflare, Bunny CDN)

---

## 🚀 Performance Checklist

### Before Deploying

- [ ] Run Lighthouse audit (Chrome DevTools → Lighthouse tab)
- [ ] Test all pages load in < 2 seconds (use WebPageTest.org)
- [ ] Verify print.css only loads when printing (not by default)
- [ ] Check Core Web Vitals (https://web.dev/vitals/)
- [ ] Test on slow network (Chrome DevTools → Throttling)
- [ ] Verify service worker caches correctly
- [ ] Test offline mode (disable internet, refresh page)

### Lighthouse Targets

```text
Performance:    > 90
Accessibility:  > 95
Best Practices: > 90
SEO:           > 95
```

### Core Web Vitals

| Metric | Goal | Tool |
|--------|------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Chrome DevTools |
| **FID** (First Input Delay) | < 100ms | Web Vitals JS |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Chrome DevTools |

---

## 🔒 Security Hardening

### Content Security Policy (CSP)

If using Caddy as reverse proxy, add these headers:

```caddy
header {
  X-Content-Type-Options "nosniff"
  X-Frame-Options "SAMEORIGIN"
  Referrer-Policy "strict-origin-when-cross-origin"
  Permissions-Policy "geolocation=(), microphone=(), camera=()"
}
```

### HTTPS & TLS

- [ ] Enable HSTS (HTTP Strict Transport Security)
- [ ] Use TLS 1.2+ only
- [ ] Obtain certificate from Let's Encrypt (free, auto-renew)

### Input Validation

- [ ] All form inputs are sanitized
- [ ] API responses are validated before rendering
- [ ] No `innerHTML` used with user content (use `textContent`)

---

## 📱 Mobile Optimization

### Viewport & Touch

- ✅ Viewport meta tag set correctly
- ✅ Touch-friendly buttons (min 48x48px)
- ✅ Responsive images with srcset

### Mobile Testing

Test on actual devices:

- [ ] iPhone 12/13 (Safari)
- [ ] Samsung Galaxy S21 (Chrome)
- [ ] Pixel 6 (Chrome)

Use Chrome DevTools Device Mode:

- [ ] Test at 375px (mobile portrait)
- [ ] Test at 667px (mobile landscape)
- [ ] Test at 768px (tablet portrait)

### PWA Features

- [ ] Manifest.json present and valid
- [ ] Service worker registered
- [ ] "Install" prompt works on compatible browsers
- [ ] App runs offline (first load required)

---

## 🌍 SEO Optimization

### Page Meta Tags (✅ Already Done)

All pages have:

- [ ] Unique `<title>` tags
- [ ] Descriptive `<meta name="description">`
- [ ] Proper `<meta property="og:*">` tags (Open Graph)
- [ ] Canonical URLs (`<link rel="canonical">`)
- [ ] Structured data (schema.org JSON-LD for pages)

### Sitemap & Robots

- [ ] robots.txt present (block noindex pages like /profile/)
- [ ] sitemap.xml generated (list all public pages)
- [ ] Internal links use clear anchor text (not "click here")

### Heading Hierarchy

- [ ] h1: Page title (only one per page)
- [ ] h2, h3: Section headings (in order, no skips)
- [ ] No styling with semantic headings (use CSS classes)

---

## 📦 Deployment Checklist

### Pre-Deployment

```bash
# 1. Run full test suite
npm run lint:md
npm run validate
npm run check-links

# 2. Build check
npm run serve  # Verify local server works

# 3. Performance check
# Open http://localhost:8000 → Press F12 → Lighthouse → Audit

# 4. Final git check
git status           # No uncommitted changes
git log --oneline -5 # Recent commits look good
```

### Deployment Steps

1. **Update version** in package.json if major change
2. **Tag release**: `git tag v1.0.0`
3. **Push code**: `git push origin main && git push --tags`
4. **Verify CI/CD**: Check GitHub Actions pass
5. **Update production** (depends on your deployment method)

### Post-Deployment Verification

- [ ] Site loads at https://chseets.com
- [ ] All pages are accessible
- [ ] Service worker is registered and caching
- [ ] Links are working (run `npm run check-links`)
- [ ] Mobile version displays correctly
- [ ] Print layout works (Ctrl+P → A4 format)
- [ ] Lighthouse score is maintained (> 90)
- [ ] No console errors (F12)

---

## 🔄 Monitoring & Maintenance

### Weekly Checks

```bash
# 1. Check for broken links
npm run check-links

# 2. Review console for errors
# Open https://chseets.com in Chrome → F12 → Console
```

### Monthly Tasks

```bash
# 1. Update dependencies
npm update
npm audit

# 2. Lighthouse audit
# https://pagespeed.web.dev/ → Enter https://chseets.com

# 3. Verify PWA install prompt works
# Visit site on mobile → Check for "Install" banner
```

### Quarterly Tasks

- [ ] Review access logs for 404/5xx errors
- [ ] Update OS & server software
- [ ] Audit third-party scripts (Supabase, CDN libraries)
- [ ] Test backup/recovery procedures
- [ ] Update CSP headers if adding new features

---

## 🐛 Debugging Performance Issues

### Symptom: Slow First Load

**Diagnosis**:

1. Open DevTools → Network tab
2. Disable cache (check "Disable cache" box)
3. Throttle to Slow 3G (Network → Throttling)
4. Reload page, note timings

**Common causes**:

- Large images not optimized
- CSS/JS bundles too big
- External scripts (analytics, ads) blocking render
- DNS lookups slow

**Fix**:

- Optimize images (see above)
- Split large JS bundles
- Load external scripts with `async` or `defer`
- Use DNS prefetch: `<link rel="dns-prefetch" href="https://example.com">`

### Symptom: Print Layout Broken

**Diagnosis**:

1. Press Ctrl+P (or Cmd+P)
2. Preview page in print mode
3. Check margins, page breaks

**Common causes**:

- CSS media query `@media print` not applied
- Images overflow A4 bounds
- Text too small or large

**Fix**:

- Check `/web/assets/css/print.css` is linked in `<head>`
- Test print layout in DevTools: F12 → More tools → Rendering → Emulate CSS media → print
- Ensure content fits 100% A4 with default margins

### Symptom: Service Worker Not Caching

**Diagnosis**:

1. Open DevTools → Application tab
2. Go to Service Workers section
3. Check if registered and active

**Common causes**:

- SW script has errors (check console)
- Cache version changed (browser re-fetches)
- Offline mode not enabled

**Fix**:

1. Unregister old SW: Click "Unregister"
2. Hard refresh: Ctrl+Shift+R
3. Check cache in Storage → Cache Storage
4. Test offline: Throttling → Offline

---

## 📚 Additional Resources

### Performance Tools

- **Lighthouse**: Chrome DevTools built-in
- **WebPageTest**: https://www.webpagetest.org/
- **GTmetrix**: https://gtmetrix.com/
- **Pagespeed Insights**: https://pagespeed.web.dev/

### Optimization Guides

- **Web Vitals**: https://web.dev/vitals/
- **Image Optimization**: https://web.dev/image-optimization/
- **CSS Optimization**: https://web.dev/optimize-css/
- **JavaScript Optimization**: https://web.dev/optimize-javascript/

### Security Resources

- **OWASP Top 10**: https://owasp.org/Top10/
- **Content Security Policy**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- **HTTP Security Headers**: https://securityheaders.com/

### Deployment & CI/CD

- **GitHub Actions**: https://github.com/features/actions
- **Caddy Web Server**: https://caddyserver.com/
- **Let's Encrypt**: https://letsencrypt.org/

---

## 🎯 Summary

| Area | Status | Next Steps |
|------|--------|-----------|
| **CSS** | ✅ Good | Keep consolidated, remove duplication |
| **JavaScript** | ✅ Good | Monitor bundle size as features grow |
| **Images** | ⚠️ Convert to SVG | Move PNG icons to SVG format |
| **PWA** | ✅ Ready | Test offline mode monthly |
| **SEO** | ✅ Good | Monitor rankings, update content |
| **Security** | ✅ Basic | Add CSP headers if adding features |
| **Performance** | ✅ Good | Maintain >90 Lighthouse score |

---

_Last updated: December 2025_
_Maintained by: chseets team_
