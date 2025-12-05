# 🤖 GitHub Actions - CI/CD Pipeline

Complete guide to the chseets CI/CD pipeline and automated workflows.

---

## 📋 Overview

The chseets project uses GitHub Actions to automate:
- ✅ **Linting & Validation** - Code quality checks
- ✅ **Testing** - Unit, integration, and performance tests
- ✅ **Security** - Dependency and vulnerability scanning
- ✅ **Documentation** - Markdown and link validation
- ✅ **Deployment** - Automated deployment to production
- ✅ **Maintenance** - Scheduled security and validation checks

---

## 🔄 Workflows

### 1. **CI/CD Pipeline** (`ci.yml`)

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
1. **Validate** - JSON & OpenAPI validation
2. **Lint** - Markdown linting & link checking
3. **Security** - npm audit & dependency check
4. **Build** - Asset verification & build process
5. **Status Check** - Overall pipeline status

**Example Output:**
```
✓ Validate: JSON schema valid
✓ Lint: 0 errors found
✓ Security: All dependencies OK
✓ Build: All assets verified
✓ Status Check: All checks passed!
```

---

### 2. **Tests** (`tests.yml`)

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
1. **Unit Tests** - JavaScript unit tests
2. **Integration Tests** - Web structure validation
3. **Link Tests** - Documentation link checking
4. **Performance Tests** - Asset size analysis
5. **Test Report** - Summary of all tests

**What's Tested:**
- Web directory structure
- HTML files integrity
- CSS/JS asset sizes
- Documentation links
- File format validation

---

### 3. **Documentation** (`docs.yml`)

Validates documentation on changes.

**Trigger:**
```yaml
on:
  push:
    branches: [ "main", "develop" ]
    paths:
      - "docs/**"
      - "README.md"
  pull_request:
    branches: [ "main", "develop" ]
    paths:
      - "docs/**"
      - "README.md"
```

**Jobs:**
1. **Validate Docs** - Structure and metadata check
2. **Validate Links** - All documentation links
3. **Docs Summary** - Comprehensive documentation report

**Checks:**
- All required markdown files exist
- Markdown syntax is valid
- All internal/external links work
- Documentation metadata is complete

---

### 4. **Deploy** (`deploy.yml`)

Handles production deployment after successful CI.

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
1. **Pre-Deploy Check** - Validation before deployment
2. **Build Artifacts** - Create build package
3. **Static Analysis** - File size & security check
4. **Deploy** - Deployment execution
5. **Post-Deploy** - Verification & summary

**Deployment Process:**
1. Pre-deployment validation
2. Build artifacts collection
3. Static analysis (Lighthouse, etc.)
4. Package creation (tar.gz)
5. Artifact upload to GitHub
6. Post-deployment verification

---

### 5. **Maintenance** (`maintenance.yml`)

Scheduled security and validation checks.

**Trigger:**
```yaml
schedule:
  - cron: '0 2 * * *'   # Daily at 02:00 UTC
  - cron: '0 3 * * 1'   # Weekly Monday at 03:00 UTC
```

**Jobs:**
1. **Daily Security** - npm audit & outdated packages
2. **Weekly Validation** - Full validation suite
3. **Maintenance Report** - Summary report

**What It Checks:**
- Security vulnerabilities
- Outdated dependencies
- Markdown linting
- Link validation
- JSON/YAML syntax
- Web assets inventory

---

## 📊 Workflow Execution Diagram

```
Push to main/develop
        ↓
[CI/CD Pipeline] ────────────────┬─→ [Tests]
        ↓                        │
    Validate                     ├─→ [Documentation]
    Lint                         │
    Security                     └─→ Auto-merge (if PR)
    Build                           
    Status Check            
        ↓
      SUCCESS
        ↓
   [Deploy] (main only)
        ↓
Pre-Deploy → Build → Analysis → Deploy → Post-Deploy
        ↓
    COMPLETE
```

---

## 🚀 How to Trigger Workflows

### Automatic (on push/PR)
```bash
git push origin main
# → CI/CD, Tests, and Docs workflows run automatically
```

### Manual Trigger
```bash
# Go to GitHub → Actions → Select workflow → Run workflow
```

### Via GitHub CLI
```bash
gh workflow run ci.yml -r main
gh workflow run tests.yml -r main
gh workflow run deploy.yml -r main
```

---

## 📈 Monitoring Workflows

### View Workflow Status
1. Go to GitHub repo → **Actions** tab
2. See all workflow runs
3. Click on run to view details

### View Workflow Logs
1. Click on workflow run
2. Click on job
3. View step-by-step logs

### Download Artifacts
1. Go to workflow run
2. Scroll to "Artifacts" section
3. Download build/reports

---

## 🔐 Environment Variables

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

## 🚨 Troubleshooting

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

## 📝 Adding New Workflows

To add a new workflow:

1. Create file: `.github/workflows/your-workflow.yml`
2. Define trigger conditions
3. Add jobs and steps
4. Test locally with `act` tool (optional)
5. Commit and push
6. Verify it runs in GitHub Actions

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
      - uses: actions/checkout@v6
      - run: echo "Hello, CI/CD!"
```

---

## 🔍 Best Practices

### For Developers
- Always make PRs to trigger CI tests before merging
- Fix any CI failures before requesting review
- Don't force-push to main (breaks workflow history)
- Review workflow logs to understand failures

### For DevOps
- Regularly update action versions (e.g., `actions/checkout@v6`)
- Monitor workflow execution times
- Archive old artifacts to save space
- Update cron schedules as needed

### For Security
- Keep `NODE_VERSION` updated
- Run `npm audit` regularly
- Review security reports weekly
- Update dependencies for CVE fixes

---

## 📚 Resources

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Workflow Syntax:** https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- **Actions Marketplace:** https://github.com/marketplace?type=actions
- **Scheduled Workflows:** https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule

---

## ✅ Workflow Checklist

- [x] CI/CD Pipeline configured
- [x] Tests workflow created
- [x] Documentation workflow created
- [x] Deployment workflow created
- [x] Maintenance/scheduled workflow created
- [x] All workflows tested
- [x] Artifacts configured
- [x] Security checks enabled
- [x] Linting enabled
- [x] Auto-merge configured (via dependabot)

---

_Last updated: December 2025_
_Maintained by: chseets team_
