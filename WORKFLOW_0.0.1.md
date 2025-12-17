# Chseets Workflow Guide v0.0.1

> **Utolsó frissítés:** 2024-12-17

---

## Branch Stratégia

| Branch | Cél | Deploy? | Ki pusholhat? |
|--------|-----|---------|---------------|
| `main` | Production kód | ✅ Igen | Csak PR merge |
| `dev` | Aktív fejlesztés | ❌ Nem | Közvetlen push OK |

---

## Workflow-k

### 1. chseets-ci.yml

| Tulajdonság | Érték |
|-------------|-------|
| **Trigger** | PR → main, push → dev |
| **Runner** | `ubuntu-latest` (GitHub-hosted) |
| **Cél** | Build validáció |

**Mit ellenőriz:**
- Kritikus fájlok létezése (index.html, manifest.json, stb.)
- JSON schema validáció
- Markdown linting

---

### 2. chseets-deploy.yml

| Tulajdonság | Érték |
|-------------|-------|
| **Trigger** | push → main, workflow_dispatch |
| **Runner** | `self-hosted` (Debian) |
| **Cél** | Production deployment |

**Mit csinál:**
- rsync web/ → /srv/www/chseets
- Caddy reload

---

## Törölt Workflow-k

| Fájl | Ok |
|------|-----|
| `ci.yml` | Duplikálta a CI funkcionalitást |
| `docs-lint.yml` | Beolvadt a chseets-ci.yml-be |
| `maintenance.yml` | Felesleges scheduled futások |
| `chseets-ci-deploy.yml` | Kettéválasztva CI és Deploy-ra |

---

## GitHub UI Beállítások

### Branch Protection: `main`

**Settings → Branches → Add rule**

| Beállítás | Érték |
|-----------|-------|
| Branch name pattern | `main` |
| ☑️ Require a pull request before merging | ✓ |
| ↳ Require approvals | 0-1 |
| ☑️ Require status checks to pass | ✓ |
| ↳ Status checks required | `Validate` |
| ☑️ Require branches to be up to date | ✓ |
| ☐ Allow force pushes | ✗ |
| ☐ Allow deletions | ✗ |

### Branch Protection: `dev` (Opcionális)

| Beállítás | Érték |
|-----------|-------|
| Branch name pattern | `dev` |
| ☐ Require a pull request | ✗ |
| ☐ Allow force pushes | ✗ |
| ☐ Allow deletions | ✗ |

---

## Dependabot

| Beállítás | Érték |
|-----------|-------|
| Ütemezés | Havi |
| PR limit | 1-2 |
| Csoportosítás | patch + minor együtt |
| Major frissítések | Manuálisan kezelve |

---

## Költség Összehasonlítás

| Előtt | Után |
|-------|------|
| 5 workflow fájl | 2 workflow fájl |
| 5+ job minden PR-on | 1 job minden PR-on |
| Napi/heti scheduled futások | Nincs scheduled |
| ~10+ perc CI/PR | ~2 perc CI/PR |
