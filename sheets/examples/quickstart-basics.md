# chseets - Quickstart-Basics

```ini
title: "Quickstart Basics"
summary: "A minimal example showing how to structure and validate a chseets file."
tags: ["example", "template", "quickstart"]
language: "en"
level: "beginner"
slug: "quickstart-basics"
version: "1.0.0"
created_at: "2025-10-21"
updated_at: "2025-10-21"
print:
  columns: 2
  margin: standard
  scale: 1.0
references:
  - "[chseets.com](https://chseets.com)"
```

## Quickstart Basics

### 1. Purpose

This sheet demonstrates the required front matter and formatting rules for a
valid chseets entry.

### 2. Structure

Each sheet begins with a YAML block (as above), followed by Markdown content
with clear headings, lists, and examples.

#### Example List

- Follow consistent heading hierarchy (`#`, `##`, `###`)
- Use bullet lists for clarity
- Validate before committing

#### Example Code

```bash
echo "Hello, chseets!"
```

---

## 3. Validation

Run:

```bash
node tools/validate-sheets.mjs
```

> If successful, you’ll see:

```css
✔ All sheets validated
```

_Last updated: 2025-10-21_
