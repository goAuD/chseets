# Contributing to chseets

Thanks for your interest in improving **chseets**. This document explains how to
propose changes, with a focus on **content contributions** (cheat sheets).
Please also read our **CODE_OF_CONDUCT.md**.

---

## Ways to contribute

- Add a new cheat sheet
- Improve an existing sheet (accuracy, clarity, layout)
- Fix links, typos, formatting
- Add tests/validators for sheet metadata and links
- Improve build/dev tooling or documentation

---

## Ground rules

- Keep sheets **concise** (ideally 1–2 pages A4), **accurate**, and **neutral**.
- Use simple language and consistent terminology.
- Prefer **standards** and primary sources; add references at the end.
- Avoid sensitive, illegal, or harmful content. See **docs/product/MODERATION_POLICY.md**.
- Respect **privacy**: do not include personal data, secrets, or tracking.
- Follow the **licenses**: code vs content have different licenses (see README).

---

## Authoring a new sheet

1. **Create file**

   - Copy the template: `/templates/sheet-template.md`
   - Place it under: `/sheets/<topic>/<slug>.md`
   - Slug: lowercase, hyphenated, ASCII only (e.g., `qbasic-basics.md`)

2. **Fill required front matter** (YAML at the top)

```yaml
title: "QBasic Basics"
summary: "Core syntax and I/O patterns for QBasic."
tags: ["programming", "basic", "qbasic"]
language: "en"
level: "beginner"            # beginner | intermediate | advanced
slug: "qbasic-basics"
version: "1.0.0"
created_at: "2025-10-21"
updated_at: "2025-10-21"
print:
    columns: 2                 # 1 | 2
    margin: standard           # standard | none | narrow
    scale: 1.0                 # 1.0 = 100%

references:
    - "Official docs or canonical source URL"
```

---

## **Write the content**

- Structure with clear headings and short lists/tables.
- Avoid long paragraphs; optimize for print readability.
- Keep line length sensible; avoid hard-wrapping tables.

**Validate locally (if tools are available)**

- Run schema check: node tools/validate-sheets.mjs
- Run link check: node tools/linkcheck.mjs
- Ensure the sheet renders cleanly in print preview (A4, 100%)

**Open a Pull Request**

- Fill the PR template and link related issues
- Provide a brief rationale and sources
- Attach a screenshot of print preview (optional but helpful)

---

## Improving an existing sheet

- Keep the original structure where possible.
- Explain what changed and why in the PR description.
- Increment the version and update updated_at in the front matter.

---

## Style guide (content)

- Headings: use #, ##, ### with meaningful, short titles.
- Lists: prefer bullet points for quick scanning.
- Tables: keep to essential columns; ensure they fit A4 width.
- Code blocks: annotate with language (bash, sql, etc.).
- Emphasis: use sparingly; avoid ALL CAPS.
- Units & notation: be consistent and SI-first where applicable.
- References: primary sources first; include short permalinks.

---

## Commit & PR conventions

- Use Conventional Commits where possible:
  - feat(sheet): add qbasic-basics
  - fix(sheet): correct PRINT USING examples
  - docs: update authoring rules
- Keep PRs focused and small.
- CI must pass (lint, schema, link checks) before merge.

---

## Legal

- By contributing, you agree that:
- Code contributions are licensed under LICENSE-CODE.
- Content contributions (cheat sheets) are licensed under LICENSE-CONTENT and may be edited for clarity, consistency, and formatting.

- You have the right to submit the content and it does not infringe others’ rights. Include attribution where required.

---

## Recognition

We credit contributors in the sheet’s front matter (optional authors: list)
and the repository contributors list.

---

## Questions?

- Open a Discussion or an issue in this repository.
- For sensitive topics (security/privacy), follow SECURITY.md.

---

_Last updated: 2025-10-21_
