# GitHub Actions - CI/CD Pipeline

Complete guide to the chseets CI/CD pipeline and automated workflows.

---

## Overview

The chseets project uses GitHub Actions to automate:

- Linting & Validation - Code quality checks
- Testing - Unit, integration, and performance tests
- Security - Dependency and vulnerability scanning
- Documentation - Markdown and link validation
- Deployment - Automated deployment to production
- Maintenance - Scheduled security and validation checks

---

## Workflows

### CI/CD Pipeline (`ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**Trigger:**

```yaml
on:
  push:
    branches: [ "main", "develop" ]
  pull_request:
    branches: [ "main", "develop" ]
```

**Jobs:**

1. Validate - JSON & OpenAPI validation
1. Lint - Markdown linting & link checking
1. Security - npm audit & dependency check
1. Build - Asset verification & build process
1. Status Check - Overall pipeline status

---

### Tests (`tests.yml`)

Runs comprehensive test suites on code changes.

**Trigger:**

```yaml
on:
  push:
    branches: [ "main", "develop" ]
  pull_request:
    branches: [ "main", "develop" ]
```

**Jobs:**

1. Unit Tests - JavaScript test suite
1. Integration Tests - Web structure validation
1. Link Tests - Documentation link validation
1. Performance Tests - Asset size analysis
1. Test Report - Test results summary

---

### Deploy (`deploy.yml`)

Automated deployment after successful CI/CD pipeline.

**Trigger:**

```yaml
on:
  push:
    branches: [ "main" ]
  workflow_run:
    workflows: [ "CI/CD Pipeline" ]
    types: [ completed ]
    branches: [ "main" ]
```

**Jobs:**

1. Pre-Deploy Check - Validation & checks
1. Build Artifacts - Asset compilation
1. Static Analysis - Lighthouse & file size checks
1. Deploy - Package & deployment
1. Post-Deploy - Verification & summary

---

### Documentation (`docs.yml`)

Validates documentation files and structure.

**Trigger:**

```yaml
on:
  push:
    branches: [ "main", "develop" ]
    paths:
      - docs/**
      - README.md
  pull_request:
    branches: [ "main", "develop" ]
```

**Jobs:**

1. Validate Docs - Structure & metadata check
1. Validate Links - Link validation in documentation
1. Docs Summary - Documentation report generation

---

### Maintenance (`maintenance.yml`)

Scheduled security and validation checks.

**Trigger:**

```yaml
on:
  schedule:
    - cron: "0 2 * * *"
    - cron: "0 3 * * 1"
  workflow_dispatch:
```

**Jobs:**

1. Daily Security - npm audit (Daily 02:00 UTC)
1. Weekly Validation - Full validation (Weekly Monday 03:00 UTC)
1. Maintenance Report - Summary report

---

## Pipeline Execution Flow

```ini
PUSH/PR to main or develop
  ↓
┌──────────────────────────────────────┐
│ CI/CD Pipeline (Parallel Jobs)       │
├──────────────────────────────────────┤
│ • Validate (JSON, OpenAPI)           │
│ • Lint (Markdown, Links)             │
│ • Security (npm audit)               │
│ • Build (Asset verification)         │
│ • Status Check (Overall gate)        │
└──────────────────────────────────────┘
  ↓ (All SUCCESS)
┌─────────────┬──────────────┬────────────┐
│ Tests       │ Documentation│ Maintenance│
├─────────────┼──────────────┼────────────┤
│ • Unit      │ • Validate   │ • Security │
│ • Integr.   │ • Links      │ • Validation
│ • Perf.     │ • Summary    │ • Report   │
└─────────────┴──────────────┴────────────┘
  ↓ (Push to main only)
┌──────────────────────────────────────┐
│ Deploy (Conditional)                 │
├──────────────────────────────────────┤
│ • Pre-deploy check                   │
│ • Build artifacts                    │
│ • Static analysis                    │
│ • Deploy to production               │
│ • Post-deploy verification           │
└──────────────────────────────────────┘
```

---

## Automatic Triggers

| Event | Workflow | Runs |
|-------|----------|------|
| Push to main | CI/CD → Tests → Deploy | All jobs |
| Push to develop | CI/CD → Tests | Quality checks |
| Pull Request | CI/CD → Tests → Docs | PR validation |
| Daily 02:00 UTC | Maintenance (Security) | Security check |
| Monday 03:00 UTC | Maintenance (Validation) | Full validation |

---

## Artifacts

Each workflow produces artifacts for download and review.

### CI/CD Pipeline

- Build logs and validation reports
- Cached dependencies (npm)

### Deploy

- `deployment-package-*.tar.gz` (30 day retention)
- `deployment-summary` (90 day retention)

### Maintenance

- `security-report-*.txt` (90 day retention)
- `validation-report-*.txt` (90 day retention)

---

## GitHub Actions Interface

### View Workflow Status

1. Go to GitHub repo → **Actions** tab
1. See all workflow runs
1. Click on run to view details

### View Workflow Logs

1. Click on workflow run
1. Click on job
1. View step-by-step logs

### Download Artifacts

1. Go to workflow run
1. Scroll to "Artifacts" section
1. Download build/reports

---

## Environment Variables

**Available in all workflows:**

```yaml
NODE_VERSION: "20"
```

**GitHub context variables:**

```yaml
github.repository      # goAuD/chseets
github.ref_name       # main or develop
github.sha            # Commit SHA
github.event_name     # push, pull_request, schedule
```

---

## Troubleshooting

### Workflow Failed: "Validate"

**Issue:** JSON or OpenAPI validation failed

**Solution:** Check `docs/specs/sheet.schema.json` and `docs/api/openapi.yaml`

### Workflow Failed: "Lint"

**Issue:** Markdown linting failed

**Solution:** Run `npm run lint:md` locally, then `npm run lint:md:fix`

### Workflow Failed: "Security"

**Issue:** npm audit found vulnerabilities

**Solution:** Review and update dependencies, run `npm audit fix`

### Deploy Failed: "Pre-Deploy Check"

**Issue:** Pre-deployment validation failed

**Solution:** Ensure all files are present and markdown is valid

### Tests Failed: "Integration Tests"

**Issue:** Web structure validation failed

**Solution:** Check `web/` directory structure matches expected layout

---

## Adding New Workflows

To add a new workflow:

1. Create file: `.github/workflows/your-workflow.yml`
1. Define trigger conditions
1. Add jobs and steps
1. Test locally with `act` tool (optional)
1. Commit and push
1. Verify it runs in GitHub Actions

Example:

```yaml
name: My New Workflow

on:
  push:
    branches: [ "main" ]

jobs:
  my-job:
    name: My Job
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v6

      - name: Do something
        run: echo "Hello from GitHub Actions!"
```

---

## Status Badge

Add this to your README for workflow status:

```markdown
[![CI/CD Pipeline](https://github.com/goAuD/chseets/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/goAuD/chseets/actions/workflows/ci.yml)
```

---

## More Information

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [About Workflows](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)

---

Last updated: 2025-12-05
