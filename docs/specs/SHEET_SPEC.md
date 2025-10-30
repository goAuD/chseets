# chseets - Sheet Specification

Defines the **metadata schema** and **content structure** for all cheat sheets
under `/sheets/`.

All sheets must:

- be written in **Markdown**
- include valid **YAML front matter**
- follow this document and the schema in `sheet.schema.json`

---

## 1. File location & naming

/sheets/<topic>/<slug>.md

- `<topic>` — a logical folder, e.g. `programming`, `networking`, `design`
- `<slug>` — lowercase, hyphen-separated ASCII (e.g. `qbasic-basics`)
- Each file represents one self-contained printable sheet.

---

## 2. Front matter fields

All fields are validated by the schema.

| Field | Type | Required | Description |
|-------|------|-----------|-------------|
| `title` | string | ✅ | Human-readable title displayed on site and print |
| `summary` | string | ✅ | 1–2 sentence overview |
| `tags` | array[string] | ✅ | Keywords for search and grouping |
| `language` | string | ✅ | ISO 639-1 code (e.g. `en`, `de`, `hu`) |
| `level` | string | ✅ | One of: `beginner`, `intermediate`, `advanced` |
| `slug` | string | ✅ | Unique slug (used in URL & filename) |
| `version` | string | ✅ | Semantic version, e.g. `1.0.0` |
| `created_at` | string | ✅ | ISO 8601 date (`YYYY-MM-DD`) |
| `updated_at` | string | ✅ | ISO 8601 date |
| `authors` | array[string] | ❌ | Optional list of contributors |
| `print.columns` | integer | ❌ | Default: 2. Allowed: 1–2 |
| `print.margin` | string | ❌ | `standard`, `narrow`, or `none` |
| `print.scale` | number | ❌ | Print zoom factor (default: 1.0) |
| `references` | array[string] | ❌ | URLs or citations |
| `license` | string | ❌ | Defaults to global content license |
| `status` | string | ❌ | `draft` or `published` |

---

## 3. Markdown content structure

Below the YAML front matter:

```markdown

Section Title

Short introduction (1–3 sentences).

Key Concepts
- Bullet points
- Code snippets
- Tables (fit within A4 width)

Examples
```bash
echo "Hello, World!"
```

Notes

Use brief hints or gotchas.

## References

[https://example.com/](https://example.com/)
[https://example.org/](https://example.org/)

- Top-level title `#` is optional if `title` is already in metadata.
- Keep hierarchy shallow: at most `###`.
- Limit page length to two printed A4 pages.
- Avoid inline HTML.

---

## 4. Content rules

- Use **plain Markdown**, no custom syntax or scripts.
- Images must be local (no hotlinking), under `/assets/sheets/<slug>/`.
- External links: HTTPS only.
- Tables must fit within print width (80–100 chars per line).
- No personal data, offensive, or copyrighted material.

---

## 5. Versioning

Each change that modifies content meaningfully must bump `version` following
[Semantic Versioning][https://semver.org/](https://semver.org/):

| Change type | Example | Description |
|--------------|----------|-------------|
| Patch | 1.0.1 | Minor fixes, typos |
| Minor | 1.1.0 | Added sections, improved clarity |
| Major | 2.0.0 | Substantial rewrite or reformat |

---

## 6. Validation

Run the local tools before committing:

```bash
node tools/validate-sheets.mjs
node tools/linkcheck.mjs
```

> If validation fails, fix errors until schema passes.

---

## 7. Example (minimal valid)

```yaml
title: "QBasic Basics"
summary: "Core syntax and I/O patterns for QBasic."
tags: ["programming", "basic", "qbasic"]
language: "en"
level: "beginner"
slug: "qbasic-basics"
version: "1.0.0"
created_at: "2025-10-21"
updated_at: "2025-10-21"
print:
  columns: 2
  margin: standard
  scale: 1.0
references:
  - "https://learn.microsoft.com/en-us/previous-versions/qbasic/"
```

---

## 8. Future extensions

- translations: link to other language variants
- related: cross-references between sheets
- badge: mark official or verified sheets
- contributors: GitHub usernames for display
- thumbnail: preview image for gallery

---

```json
## FILE: docs/specs/sheet.schema.json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "chseets Sheet Schema",
  "description": "Validation schema for chseets Markdown front matter.",
  "type": "object",
  "required": [
    "title",
    "summary",
    "tags",
    "language",
    "level",
    "slug",
    "version",
    "created_at",
    "updated_at"
  ],
  "properties": {
    "title": {
      "type": "string",
      "minLength": 3,
      "maxLength": 100
    },
    "summary": {
      "type": "string",
      "minLength": 10,
      "maxLength": 300
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 1
    },
    "language": {
      "type": "string",
      "pattern": "^[a-z]{2}$"
    },
    "level": {
      "type": "string",
      "enum": ["beginner", "intermediate", "advanced"]
    },
    "slug": {
      "type": "string",
      "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$"
    },
    "version": {
      "type": "string",
      "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$"
    },
    "created_at": {
      "type": "string",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
    },
    "updated_at": {
      "type": "string",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
    },
    "authors": {
      "type": "array",
      "items": { "type": "string" }
    },
    "print": {
      "type": "object",
      "properties": {
        "columns": { "type": "integer", "enum": [1, 2] },
        "margin": {
          "type": "string",
          "enum": ["standard", "narrow", "none"]
        },
        "scale": { "type": "number", "minimum": 0.5, "maximum": 2.0 }
      },
      "required": []
    },
    "references": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "uri"
      }
    },
    "license": { "type": "string" },
    "status": {
      "type": "string",
      "enum": ["draft", "published"]
    }
  },
  "additionalProperties": false
}
```
