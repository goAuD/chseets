# chseets - System Architecture

The chseets platform is intentionally simple - a hybrid between static content
and dynamic metadata.

---

## 1. Overview diagram

```ini
User Browser (PWA)
│
├─► HTTPS (GET /sheets, /api/search)
│
Caddy Webserver (Debian)
│
├─► Static files (Markdown → HTML)
├─► JSON endpoints (API)
└─► Offline cache via Service Worker
```

---

## 2. Layers

| Layer | Purpose |
|-------|----------|
| **Presentation (Web/PWA)** | Renders sheets, handles print styling, offline cache. |
| **Content (Markdown)** | Structured by schema; stored under `/sheets/`. |
| **API** | Exposes sheet metadata and content (read-only). |
| **Validation & CI** | JSON schema + markdown-lint check in GitHub Actions. |
| **Infrastructure** | Debian + Caddy + Tailscale (optional VPN). |

---

## 3. Data flow

1. Contributor submits a Markdown sheet via PR.  
2. CI validates against `sheet.schema.json`.  
3. Once merged, the build process generates:
   - HTML/PDF view for `/sheets/{slug}`
   - Metadata entry in `/api/sheets`
4. Clients fetch via HTTPS or cache offline using PWA.

---

## 4. Technology stack

| Component | Tech |
|------------|------|
| Web Server | Caddy (static serving, HTTPS, caching) |
| Platform | Debian headless |
| Language | Markdown + YAML + JSON |
| Validation | Node.js + AJV (schema) |
| Versioning | Git + Semantic Versioning |
| Frontend | Vanilla JS + CSS (print-optimized) |
| Optional | Cloudflare / Dynadot DNS + DNSSEC |

---

## 5. Security & Privacy

- No user accounts or cookies  
- HTTPS enforced via Caddy + Let’s Encrypt  
- API limited to read-only and rate-limited  
- Minimal logs (rotated, no personal identifiers)  
- GDPR-friendly by design (no tracking)

---

## 6. Scalability

- Static-first model allows easy CDN caching  
- API endpoints lightweight (JSON-only)  
- Contributions scale via Git PR workflow  
- Server can be mirrored for redundancy (multi-node Debian)

---

## 7. Future extensions

- `/tags`, `/languages`, `/random` API endpoints  
- PDF export via on-demand renderer  
- Search index caching (SQLite)  
- Partner integration and embedded widgets

---

_Last updated: 2025-10-21_
