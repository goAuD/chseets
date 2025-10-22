# chseets - Local Setup Guide

This guide explains how to prepare a local environment for editing, validating,
and previewing chseets content.

---

## 1. Prerequisites

| Tool | Purpose | Notes |
|------|----------|--------|
| **Git** | version control | [https://git-scm.com](https://git-scm.com) |
| **Node.js 20+** | validation, lint, tooling | [https://nodejs.org](https://nodejs.org) |
| **jq** | JSON validation | Linux/macOS built-in; Windows via `choco install jq` |
| **VS Code** (optional) | editing Markdown | install Markdown All in One extension |

---

## 2. Clone the repository

```bash
git clone https://github.com/goAuD/chseets.git
cd chseets
npm install   # optional, only if you add tooling
```

---

## 3. Folder overview

```bash
/docs/         → architecture, API, and dev notes  
/sheets/       → printable content  
/templates/    → authoring templates  
/.github/      → CI/CD workflows  
```

---

## 4. Validate before committing

```bash
# check JSON schema
jq . docs/specs/sheet.schema.json

# validate OpenAPI spec
npx swagger-cli validate docs/api/openapi.yaml
```

---

## 5. Run Markdown lint (optional)

```bash
npx markdownlint-cli2 "**/*.md" --config .markdownlint.json
```

_Last updated: 2025-10-21_
