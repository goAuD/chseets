# chseets TODO Lista

## Prioritás: Magas

### Account kezelés

- [ ] Account törlés gomb implementálása (GDPR kötelező!)

### Lighthouse optimalizáció

- [x] Font preload hozzáadása (kész)
- [ ] HTML/CSS tömörítés (gzip a serveren)
- [ ] Supabase import optimalizálás (dynamic import)
- [ ] Képek WebP formátum

## Prioritás: Közepes

### Print CSS

- [ ] A4 page kitöltés nyomtatáskor

### Security

- [ ] CSP headers
- [ ] HSTS headers

### Kód minőség

- [ ] Console.log debug üzenetek eltávolítása

## Befejezve (2025.12.06)

- [x] PWA manifest, SW, install prompt
- [x] API dokumentáció
- [x] /pwa/ telepítési oldal
- [x] Navigáció frissítése minden oldalon
- [x] Landing page szövegek
- [x] Legal oldalak DSGVO szerint
- [x] About oldal (turizmus + edukáció fókusz)
- [x] Font preload + async CSS (Lighthouse)

## Lighthouse eredmények (2025.12.06)

- Performance: ~75%
- Accessibility: 94%
- Best Practices: 100%
- Fő bottleneck: 3rd party Supabase scriptek
