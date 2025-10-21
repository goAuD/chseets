# chseets - Sheet-Template

```ini
title: "Example Title"
summary: "One-line summary of what this sheet covers."
tags: ["topic", "category"]
language: "en"             # ISO 639-1: en | de | hu | ...
level: "beginner"          # beginner | intermediate | advanced
slug: "example-title"      # lowercase, hyphen-separated
version: "1.0.0"           # semver
created_at: "2025-10-21"   # YYYY-MM-DD
updated_at: "2025-10-21"   # YYYY-MM-DD
print:
  columns: 2               # 1 or 2
  margin: standard         # standard | narrow | none
  scale: 1.0               # 1.0 = 100%
references:
  - "[Primary Source](https://example.com)"
  - "[Secondary Source](https://example.org)"
```

---

## Example Title

### Overview

Röviden foglald össze, mit tartalmaz a lap és kinek szól (1–3 mondat).

### Key Concepts

- Pontos, tömör felsorolások
- Egységes terminológia
- Nyomtatásra optimalizált szerkezet

### Cheats / Commands / Tables

- Használj táblázatot, ha jól áttekinthető:
  
| Command | Meaning |
|---|---|
| `sample --help` | show help |
| `sample run`    | run task |

### Examples

```bash
# példa parancs
sample --option value
```

### Notes

- Legyen 1–2 A4 oldal
- Ne használj felesleges díszítést
- Hivatkozásokat a “References” részbe tedd

### References

<https://example.com>

<https://example.org>

_Last updated: 2025-10-21_
