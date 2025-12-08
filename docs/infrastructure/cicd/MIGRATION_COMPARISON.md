# 📊 Workflow Comparison: Current vs Recommended

## Overview

This document compares your current workflow with the recommended best practice workflow.

## 🔄 Current Workflow (release.yml)

### Structure

```yaml
release.yml (Single file)
├── Job: release (main branch only)
├── Job: build_images (main branch only)
├── Job: build_staging_images (develop branch only)
├── Job: deployment_ready (main)
└── Job: staging_ready (develop)
```

### Issues

1. ❌ No actual deployment steps (only builds images)
2. ❌ No manual approval for production
3. ❌ Production and staging mixed in one file
4. ❌ Version tag only on production, not staging
5. ❌ No smoke tests after build
6. ❌ No rollback strategy
7. ⚠️ Manual deployment needed outside CI/CD

### Docker Tags

**Staging (develop):**

```yaml
- staging
- staging-{sha}
```

**Production (main):**

```yaml
- latest
- { version } # e.g., 1.2.3
```

---

## ✅ Recommended Workflow

### Structure

```yaml
build-staging.yml (Separate file for staging)
├── Job: build-staging
├── Job: deploy-staging (Auto)
└── Job: staging-summary

build-production.yml (Separate file for production)
├── Job: release
├── Job: build-production
├── Job: approval (Manual - NEW!)
├── Job: deploy-production
└── Job: production-summary
```

### Improvements

1. ✅ Complete CI/CD with deployment
2. ✅ Manual approval for production
3. ✅ Separated staging and production
4. ✅ Version tags for both environments
5. ✅ Smoke tests after deployment
6. ✅ Automatic rollback on failure
7. ✅ GitOps with infra repo update

### Docker Tags

**Staging (develop):**

```yaml
- staging                    # Latest staging (NEW: easier to reference)
- {version}-staging          # NEW: e.g., 1.2.3-staging
- staging-{sha}              # Same as current
```

**Production (main):**

```yaml
- latest # Same as current
- production # NEW: explicit production marker
- v{version} # Same as current (with 'v' prefix)
```

---

## 📋 Feature Comparison Table

| Feature                    | Current            | Recommended   |
| -------------------------- | ------------------ | ------------- |
| **Builds Docker images**   | ✅ Yes             | ✅ Yes        |
| **Semantic versioning**    | ✅ Yes (prod only) | ✅ Yes (both) |
| **Staging auto-deploy**    | ❌ No              | ✅ Yes        |
| **Production auto-deploy** | ❌ No              | ✅ Yes        |
| **Manual approval**        | ❌ No              | ✅ Yes        |
| **Smoke tests**            | ❌ No              | ✅ Yes        |
| **Rollback on failure**    | ❌ No              | ✅ Yes        |
| **GitOps (infra sync)**    | ❌ No              | ✅ Yes        |
| **Deployment summary**     | ⚠️ Basic           | ✅ Detailed   |
| **Workflow separation**    | ❌ Mixed           | ✅ Separated  |

---

## 🔀 Migration Path

### Option 1: Gradual Migration (Recommended)

**Step 1:** Add staging workflow alongside current

```bash
# Keep: release.yml (for now)
# Add: build-staging.yml (new)
```

**Step 2:** Test staging workflow

```bash
git checkout develop
git commit -m "feat: test new staging workflow"
git push
# Verify staging deployment works
```

**Step 3:** Add production workflow

```bash
# Add: build-production.yml (new)
# Keep: release.yml (for now, as backup)
```

**Step 4:** Test production workflow

```bash
git checkout main
git merge develop
git push
# Test manual approval
```

**Step 5:** Remove old workflow

```bash
# Delete: release.yml (old)
# Keep: build-staging.yml, build-production.yml (new)
```

### Option 2: Full Migration (Faster)

**Step 1:** Backup current workflow

```bash
cp .github/workflows/release.yml .github/workflows/release.yml.backup
```

**Step 2:** Replace with new workflows

```bash
# Rename examples to active
mv build-staging.yml.example build-staging.yml
mv build-production.yml.example build-production.yml

# Keep old as backup
# Keep: release.yml.backup
```

**Step 3:** Setup GitHub environments

1. Settings → Environments
2. Create `production-approval` with reviewers
3. Create `production` environment

**Step 4:** Update secrets
Ensure these secrets exist:

- `GITHUB_TOKEN` (automatic)
- `INFRA_REPO_TOKEN` (for aegisx-infra)

**Step 5:** Test both workflows

```bash
# Test staging
git checkout develop
git push

# Test production
git checkout main
git push
```

---

## 🔧 Required Changes

### 1. GitHub Repository Settings

**Environments to create:**

```
Settings → Environments → New environment

Environment 1: production-approval
- ✅ Required reviewers: [your-username, team-members]
- ✅ Wait timer: 0 minutes (or set delay)

Environment 2: production
- ✅ Deployment branch: main only
```

### 2. Secrets to Add

```
Settings → Secrets and variables → Actions

Required:
- INFRA_REPO_TOKEN: Personal access token with repo access
  (for pushing to aegisx-infra repo)

Optional:
- SLACK_WEBHOOK: For notifications
- DISCORD_WEBHOOK: For notifications
```

### 3. Kubernetes Setup

**Staging cluster (dixon-dev):**

```bash
# Verify context exists
kubectl config get-contexts dixon-dev

# Verify namespace exists
kubectl get namespace staging
# If not, create it:
kubectl create namespace staging
```

**Production cluster (a-prod):**

```bash
# Verify context exists
kubectl config get-contexts a-prod

# Verify namespace exists
kubectl get namespace production
# If not, create it:
kubectl create namespace production
```

### 4. Infrastructure Repo Structure

Ensure `aegisx-infra` repo has:

```
aegisx-infra/
├── overlays/
│   ├── staging/
│   │   ├── kustomization.yaml
│   │   └── *.yaml
│   └── production/
│       ├── kustomization.yaml
│       └── *.yaml
└── base/
    └── *.yaml
```

---

## 📈 Benefits of Migration

### 1. **Complete Automation**

- **Before:** Build → Manual kubectl commands
- **After:** Build → Auto deploy → Smoke tests

### 2. **Safety & Control**

- **Before:** No approval, immediate production changes
- **After:** Manual approval gate, review before deploy

### 3. **Better Visibility**

- **Before:** Check logs manually in cluster
- **After:** GitHub Actions summary, automatic notifications

### 4. **Faster Rollback**

- **Before:** Manual kubectl rollout undo
- **After:** Automatic rollback on failure

### 5. **GitOps Compliance**

- **Before:** Direct kubectl apply (no audit trail)
- **After:** Git commits in infra repo (full history)

### 6. **Staging Parity**

- **Before:** Staging tags don't have versions
- **After:** Both staging and prod have proper versioning

---

## 🎯 Recommended Actions

### Immediate (Today)

1. ✅ Review example workflows
2. ✅ Setup GitHub environments
3. ✅ Create INFRA_REPO_TOKEN secret

### Short-term (This Week)

1. ⚠️ Test staging workflow on develop branch
2. ⚠️ Verify staging deployment works
3. ⚠️ Test manual approval flow

### Long-term (Next Sprint)

1. 🔄 Migrate to new workflows completely
2. 🔄 Remove old release.yml
3. 🔄 Update team documentation

---

## ❓ FAQ

### Q: Can I keep both old and new workflows?

**A:** Yes, temporarily. But they might conflict if triggered together. Use different branch names or disable old workflow.

### Q: What if approval is not available?

**A:** Deployment waits indefinitely. Approver receives email notification.

### Q: Can I skip approval in emergency?

**A:** Yes, use `workflow_dispatch` and skip approval job, or temporarily remove environment protection.

### Q: What happens if production deployment fails?

**A:** Automatic rollback to previous version, team notification.

### Q: Do I need to update anything in apps?

**A:** No, only CI/CD workflow changes. Apps code remains the same.

### Q: How do I rollback manually?

**A:** Run previous workflow, or kubectl rollout undo (see guide).

---

## 📚 Next Steps

1. Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Setup GitHub environments
3. Test staging workflow
4. Test production workflow with approval
5. Update team documentation

---

**Questions?** Open an issue or contact the DevOps team.
