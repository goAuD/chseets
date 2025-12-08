# chseets TODO Lista

## Prioritás: Magas

### Lighthouse optimalizáció

- [x] Font preload hozzáadása
- [x] HTML/CSS tömörítés (gzip/zstd a Caddy serveren)
- [ ] Supabase import optimalizálás (dynamic import)
- [ ] Képek WebP formátum

## Prioritás: Közepes

### Print CSS

- [x] A4 page kitöltés nyomtatáskor (cache fix)

### Security

- [x] CSP headers (Caddyfile)
- [x] HSTS headers (Caddyfile)
- [x] Supabase keys → Nem kell env var, anon key publikus és biztonságos (RLS védi)

### Kód minőség

- [x] Console.log debug üzenetek eltávolítása
- [ ] CSS refaktor (duplikáció csökkentés, :root változók)

## Befejezve (2025.12.08)

- [x] PWA navigáció fix (SW v12 network-first stratégia)
- [x] iOS sheets oldal betöltés fix (cache)
- [x] Desktop install banner fix (cache)
- [x] CSP + HSTS headers (Caddyfile)
- [x] Self-hosted runner setup (Debian)
- [x] CI/CD workflow: push → CI → Deploy (rsync)
- [x] Workflow mappa tisztítás
- [x] Dependabot kikapcsolva
- [x] PWA banner redesign (szögletes, Zen Dots, neon-frame)
- [x] Firefox PWA link javítás
- [x] Cyberpunk modal system (CyberModal API)
- [x] Neon-frame animált border (PWA, modal, sheet cards)
- [x] Modal wrapper fix (sötét belső háttér megmaradt)
- [x] Danger modal piros szín (#ff003c)
- [x] Gombok balról beúszó háttér animáció
- [x] Footer hover: fehér szín, no glow
- [x] API oldal iOS zoom fix
- [x] SW verzió bump (v10 → v12)
- [x] Account törlés gomb (Danger Zone)

## Lighthouse eredmények (2025.12.06)

- Performance: ~75%
- Accessibility: 94%
- Best Practices: 100%
