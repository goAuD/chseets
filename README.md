# chseets - Printable cheat sheets for all

**chseets** is a clean, distraction-free collection of printable, A4-friendly
cheat sheets. It’s privacy-respecting, lightweight, and installable as a PWA.

- **Fast to use:** open → print → done.
- **Readable on paper:** consistent A4 layout and margins.
- **Works offline:** install the PWA and keep your favorites.
- **Open content:** community contributions are welcome.

> Live: [https://chseets.com/](https://chseets.com/)

---

## Quick start

### 1) Browse & print

- Go to **[https://chseets.com/sheets/](https://chseets.com/sheets/)**
- Open any sheet, then **Ctrl/Cmd+P**
- Print on **A4**, 100% scale, margins “Default” (or “None”), background graphics on

### 2) Install as PWA (optional)

- On desktop Chrome/Edge: address bar → **Install**
- On iOS Safari: **Share** → **Add to Home Screen**
- Works offline after first open

### 3) API (preview)

- Overview: [https://chseets.com/api/](https://chseets.com/api/)
- Typical endpoints:
  - `GET /api/sheets` - list metadata
  - `GET /api/sheets/{slug}` - fetch one
  - `POST /api/search` - simple search

> The public API is evolving. Stability is not guaranteed yet.

---

## Repository layout

```ini
/docs/ # architecture, API, product & dev guides
/sheets/ # community-maintained cheat sheets (Markdown)
/templates/ # authoring templates
/tools/ # schema & link validation (CI helpers)
/.github/ # issue/PR templates, CI workflows
README.md
CONTRIBUTING.md
LICENSE-CODE # code license (Apache-2.0 suggested)
LICENSE-CONTENT # content license (CC BY 4.0 suggested)
TRADEMARKS.md # brand usage policy
BRAND_GUIDE.md # logo, typography, color, spacing
```

---

## Contributing

Contributions are welcome — especially new or improved sheets.

- Read **CONTRIBUTING.md** for authoring rules and PR flow
- Follow the **SHEET SPEC** (fields, naming, print hints)
- Run the local validators (if available) before opening a PR

---

## Security

If you discover a vulnerability or a data-privacy issue, please **do not** open
a public issue. Follow the responsible disclosure process in **SECURITY.md**.

---

## Licensing

- **Code** is licensed under the terms in **LICENSE-CODE** (Apache-2.0 recommended).
- **Content** (cheat sheets, examples, screenshots) is licensed under
  **LICENSE-CONTENT** (Creative Commons **CC BY 4.0** recommended).

You must preserve attribution when reusing content and must not imply our
endorsement.

---

## Trademarks

**chseets** and associated brand assets are protected by trademark law. See
**TRADEMARKS.md** for permitted uses, naming, and visual guidelines.

---

## Links

- Sheets: [https://chseets.com/sheets/](https://chseets.com/sheets/)
- About:  [https://chseets.com/about/](https://chseets.com/about/)
- API:    [https://chseets.com/api/](https://chseets.com/api/)

_Last updated: 2025-10-21_
