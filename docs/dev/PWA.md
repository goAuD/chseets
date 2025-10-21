# chseets - Progressive Web App (PWA) Overview

Explains how the chseets website functions as an installable offline web app.

---

## 1. Features

- **Installable:** users can add to Home Screen (desktop/mobile).  
- **Offline caching:** service worker caches visited sheets.  
- **Fast loading:** pre-cached static assets and manifest hints.  
- **Print-friendly:** offline printing fully supported.

---

## 2. Key files

| File | Description |
|------|--------------|
| `/manifest.json` | defines app name, icons, theme color |
| `/sw.js` | service worker handling caching & offline |
| `/index.html` | registers service worker and loads base layout |

---

## 3. Manifest example

```json
{
  "name": "chseets",
  "short_name": "chseets",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1A1A1A",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 4. Offline strategy

- Cache first for static assets `(.css, .js, .svg)`
- Network first for dynamic data `(/api/*)`
- Versioned cache names to allow safe updates

---

## 5. Testing

1. Open <https://chseets.com> in Chrome
2. Open DevTools → Application → Manifest
3. Click “Add to Home Screen”
4. Disable network → pages still render from cache

_Last updated: 2025-10-21_
