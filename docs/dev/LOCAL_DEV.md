# chseets - Local Development Workflow

This document shows how to make and preview changes locally before pushing to
GitHub.

---

## 1. Edit safely

- Create a new branch for every major change:

  ```bash
  git checkout -b feat/new-sheet
  ```

- Use the provided sheet-template.md under /templates/.
- Validate locally using the commands from SETUP.md.

## 2. Test Markdown rendering

> Any modern editor (VS Code, Typora, MarkText) can preview Markdown with styles
similar to print.
For browser preview:

```bash
npx serve .
```

Then open `http://localhost:3000` in your browser
<!-- Note: localhost link is for local development only, not validated in CI -->

---

## 3. Run schema checks

```bash
node tools/validate-sheets.mjs
```

> If you don’t have Node installed, use GitHub Actions to validate automatically
after push.

## 4. [Commit convention](https://www.conventionalcommits.org)

```makefile
feat(sheet): add linux-basics
fix(ci): adjust markdownlint rule
docs: update contributing guide
```

## 5. Sync with main

```bash
git pull origin main
git merge main
```

> Always resolve conflicts locally before pushing.

_Last updated: 2025-10-21_
