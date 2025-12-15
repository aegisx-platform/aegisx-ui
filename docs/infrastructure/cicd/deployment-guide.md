# 🚀 Deployment Workflow Guide

## Overview

This guide explains the new CI/CD workflow structure with staging and production environments.

## 🏗️ Architecture

```
┌─────────────┐
│   develop   │ → Auto Build → Auto Deploy Staging
└─────────────┘
      ↓
   PR Review
      ↓
┌─────────────┐
│    main     │ → Auto Build → Manual Approval → Deploy Production
└─────────────┘
```

## 📋 Workflow Files

### 1. **build-staging.yml** - Staging Environment

- **Trigger:** Push to `develop` branch
- **Docker Tags:**
  - `staging` (latest staging build)
  - `{version}-staging` (versioned staging)
  - `staging-{sha}` (commit-specific)
- **Deployment:** Auto deploy to staging cluster
- **URL:** https://staging.aegisx.dev (all apps) / https://staging-ui.aegisx.dev (UI only)

### 2. **build-production.yml** - Production Environment

- **Trigger:** Push to `main` branch
- **Docker Tags:**
  - `latest` (latest production)
  - `production` (production marker)
  - `v{version}` (semantic version)
- **Deployment:** Requires manual approval
- **URL:** https://aegisx.dev (main) / https://ui.aegisx.dev (UI/Admin) / https://api.aegisx.dev (API)

## 🔧 Setup Manual Approval

### Step 1: Create Production Environment

1. Go to **Settings** → **Environments**
2. Click **New environment**
3. Name: `production-approval`
4. Check ✅ **Required reviewers**
5. Add yourself and team members who can approve
6. Click **Save protection rules**

### Step 2: Create Production Environment (Deploy)

1. Create another environment: `production`
2. Add protection rules if needed (optional)
3. Set **Deployment branches:** `main` only

### Step 3: Test the Workflow

```bash
# Push to develop (auto deploy)
git checkout develop
git commit -m "feat: new feature"
git push

# Merge to main (manual approval required)
git checkout main
git merge develop
git push
```

## 🔄 Deployment Flow

### **Staging Deployment**

```bash
1. Developer pushes to develop
   ↓
2. GitHub Actions builds Docker images
   - Tags: staging, v1.2.3-staging, staging-abc1234
   ↓
3. Auto deploy to staging K8s cluster (dixon-dev)
   ↓
4. Run smoke tests
   ↓
5. ✅ Ready for testing at https://staging.aegisx.dev (or https://staging-ui.aegisx.dev for UI)
```

### **Production Deployment**

```bash
1. Merge to main (via PR)
   ↓
2. Semantic Release creates version tag
   - Updates package.json version
   - Creates Git tag: v1.2.3
   ↓
3. Build Docker images
   - Tags: latest, production, v1.2.3
   ↓
4. ⏸️ WAIT FOR MANUAL APPROVAL
   - GitHub sends notification
   - Reviewer checks staging
   - Reviewer approves deployment
   ↓
5. Deploy to production K8s cluster (a-prod)
   ↓
6. Run production smoke tests
   ↓
7. ✅ Live at https://aegisx.dev (main) / https://ui.aegisx.dev (UI/Admin)
```

## 📊 Docker Tag Strategy

### Staging Tags

```yaml
ghcr.io/aegisx-platform/aegisx-starter-api:staging          # Latest staging
ghcr.io/aegisx-platform/aegisx-starter-api:1.2.3-staging    # Versioned staging
ghcr.io/aegisx-platform/aegisx-starter-api:staging-abc1234  # SHA-specific
```

### Production Tags

```yaml
ghcr.io/aegisx-platform/aegisx-starter-api:latest       # Latest production
ghcr.io/aegisx-platform/aegisx-starter-api:production   # Production marker
ghcr.io/aegisx-platform/aegisx-starter-api:v1.2.3       # Specific version
```

## 🎯 Best Practices

### 1. **Always Test in Staging First**

```bash
# Deploy to staging
git checkout develop
git commit -m "feat: new feature"
git push

# Wait for staging deployment
# Test at https://staging.aegisx.dev (or https://staging-ui.aegisx.dev)

# If OK, merge to main
git checkout main
git merge develop
git push
```

### 2. **Version Control**

- Use [Conventional Commits](https://www.conventionalcommits.org/)
- `feat:` → minor version bump (1.2.0 → 1.3.0)
- `fix:` → patch version bump (1.2.0 → 1.2.1)
- `BREAKING CHANGE:` → major version bump (1.2.0 → 2.0.0) **⚠️ USE CAREFULLY**

### 3. **Rollback Strategy**

If production deployment fails:

```bash
# Automatic rollback happens in workflow
# Or manual rollback:
kubectl config use-context a-prod
kubectl rollout undo deployment/aegisx-api -n production
kubectl rollout undo deployment/aegisx-web -n production
kubectl rollout undo deployment/aegisx-admin -n production
kubectl rollout undo deployment/aegisx-landing -n production
```

### 4. **Emergency Hotfix**

```bash
# Create hotfix branch from main
git checkout -b hotfix/critical-bug main

# Fix the bug
git commit -m "fix: critical bug"

# Merge to main and develop
git checkout main
git merge hotfix/critical-bug
git push

git checkout develop
git merge hotfix/critical-bug
git push

# Delete hotfix branch
git branch -d hotfix/critical-bug
```

## 🔍 Monitoring Deployments

### Check Deployment Status

**Staging:**

```bash
kubectl config use-context dixon-dev
kubectl get pods -n staging
kubectl get deployments -n staging
kubectl logs -f deployment/aegisx-api -n staging
```

**Production:**

```bash
kubectl config use-context a-prod
kubectl get pods -n production
kubectl get deployments -n production
kubectl logs -f deployment/aegisx-api -n production
```

### View Workflow Logs

1. Go to **Actions** tab in GitHub
2. Click on the workflow run
3. View logs for each job

## 📝 Checklist Before Approval

When you receive approval request for production deployment:

- [ ] Staging deployment successful
- [ ] All smoke tests passed in staging
- [ ] Manual testing completed in staging
- [ ] No critical bugs found
- [ ] Database migrations tested (if any)
- [ ] Breaking changes communicated (if any)
- [ ] Rollback plan ready
- [ ] Team notified

## 🚨 Troubleshooting

### Issue: Approval not triggered

**Solution:** Check environment name matches in workflow (`production-approval`)

### Issue: Deployment hangs

**Solution:** Check cluster connectivity and kubectl context

### Issue: Image pull error

**Solution:** Verify GHCR credentials in cluster secrets

### Issue: Rollout fails

**Solution:** Check pod logs and resource limits

## 🔗 Related Documentation

- [Kubernetes Deployment Guide](../../docs/infrastructure/)
- [Git Flow Guide](../../docs/infrastructure/git-flow-release-guide.md)
- [Semantic Release](https://semantic-release.gitbook.io/)
