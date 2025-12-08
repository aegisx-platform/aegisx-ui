# 🚀 Quick Start: New Deployment Workflow

## 📁 Files Created

```
.github/workflows/
├── build-staging.yml.example        ← Staging workflow (develop branch)
├── build-production.yml.example     ← Production workflow (main branch)
├── DEPLOYMENT_GUIDE.md              ← Complete deployment guide
├── MIGRATION_COMPARISON.md          ← Current vs New comparison
└── QUICK_START.md                   ← This file

Current files (keep as reference):
├── release.yml                      ← Current workflow
├── deploy-admin-docs.yml            ← GitHub Pages deploy
└── deploy-docs.yml                  ← Docs deploy
```

## 🎯 Quick Implementation (5 Minutes)

### Step 1: Setup GitHub Environments (2 min)

1. Go to **Settings** → **Environments**
2. Click **New environment** → Name: `production-approval`
3. Check ✅ **Required reviewers** → Add your username
4. Click **Save**

### Step 2: Activate Workflows (1 min)

```bash
cd /Users/sathitseethaphon/projects/aegisx-platform/aegisx-starter-1/.github/workflows

# Rename example files to activate
mv build-staging.yml.example build-staging.yml
mv build-production.yml.example build-production.yml

# Optional: Backup old workflow
mv release.yml release.yml.backup
```

### Step 3: Add Required Secret (1 min)

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `INFRA_REPO_TOKEN`
4. Value: Your GitHub Personal Access Token
5. Click **Add secret**

### Step 4: Test Staging (1 min)

```bash
cd /Users/sathitseethaphon/projects/aegisx-platform/aegisx-starter-1

# Make a test change
git checkout develop
echo "# Test" >> README.md
git add README.md
git commit -m "test: staging workflow"
git push

# Go to Actions tab and watch the magic! 🎉
```

## 📊 Workflow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        Developer Workflow                         │
└──────────────────────────────────────────────────────────────────┘

1. FEATURE DEVELOPMENT
   ┌──────────────┐
   │ feature/xyz  │
   └──────┬───────┘
          │ PR
          ↓
   ┌──────────────┐
   │   develop    │ ← Merge feature here
   └──────┬───────┘
          │ Auto trigger
          ↓

2. STAGING BUILD & DEPLOY (build-staging.yml)
   ┌─────────────────────────────────────────┐
   │ 1. Build images                         │
   │    - staging                            │
   │    - 1.2.3-staging                      │
   │    - staging-abc1234                    │
   ├─────────────────────────────────────────┤
   │ 2. Deploy to staging cluster            │
   │    - kubectl apply to dixon-dev         │
   ├─────────────────────────────────────────┤
   │ 3. Run smoke tests                      │
   │    - Health checks                      │
   │    - Basic functionality                │
   └─────────────────────────────────────────┘
          │
          ↓
   🧪 TEST at https://staging.aegisx.dev
          │
          │ If OK, create PR
          ↓
   ┌──────────────┐
   │     main     │ ← Merge develop here
   └──────┬───────┘
          │ Auto trigger
          ↓

3. PRODUCTION BUILD (build-production.yml)
   ┌─────────────────────────────────────────┐
   │ 1. Semantic Release                     │
   │    - Analyze commits                    │
   │    - Bump version: 1.2.3 → 1.3.0        │
   │    - Create git tag: v1.3.0             │
   ├─────────────────────────────────────────┤
   │ 2. Build images                         │
   │    - latest                             │
   │    - production                         │
   │    - v1.3.0                             │
   └─────────────────────────────────────────┘
          │
          ↓
   ┌─────────────────────────────────────────┐
   │ ⏸️  MANUAL APPROVAL REQUIRED            │
   │                                         │
   │ 👤 Reviewer gets notification           │
   │ ✅ Review staging environment           │
   │ ✅ Check version changes                │
   │ ✅ Approve or Reject                    │
   └─────────────────────────────────────────┘
          │ Approved
          ↓

4. PRODUCTION DEPLOY (build-production.yml)
   ┌─────────────────────────────────────────┐
   │ 1. Update infra repo                    │
   │    - Set image tag: v1.3.0              │
   │    - Commit to aegisx-infra             │
   ├─────────────────────────────────────────┤
   │ 2. Deploy to production cluster         │
   │    - kubectl apply to a-prod            │
   ├─────────────────────────────────────────┤
   │ 3. Run smoke tests                      │
   │    - Health checks                      │
   │    - Critical functionality             │
   ├─────────────────────────────────────────┤
   │ 4. Rollback on failure                  │
   │    - Auto rollback if tests fail        │
   └─────────────────────────────────────────┘
          │
          ↓
   🚀 LIVE at https://aegisx.dev (main) / https://ui.aegisx.dev (UI/Admin)
```

## 🏷️ Docker Tag Examples

### Staging Build (from develop branch)

```bash
Commit: abc1234 "feat: add user profile"
Package.json version: 1.2.3

Docker tags created:
✅ ghcr.io/aegisx-platform/aegisx-starter-api:staging
✅ ghcr.io/aegisx-platform/aegisx-starter-api:1.2.3-staging
✅ ghcr.io/aegisx-platform/aegisx-starter-api:staging-abc1234
```

### Production Build (from main branch)

```bash
Semantic Release analyzes commits:
- feat: add user profile → Minor bump
- fix: login bug → Patch bump

New version: 1.2.3 → 1.3.0

Docker tags created:
✅ ghcr.io/aegisx-platform/aegisx-starter-api:latest
✅ ghcr.io/aegisx-platform/aegisx-starter-api:production
✅ ghcr.io/aegisx-platform/aegisx-starter-api:v1.3.0
```

## 💡 Common Commands

### Check Deployment Status

**Staging:**

```bash
# View pods
kubectl --context=dixon-dev get pods -n staging

# View logs
kubectl --context=dixon-dev logs -f deployment/aegisx-api -n staging

# Check ingress
kubectl --context=dixon-dev get ingress -n staging
```

**Production:**

```bash
# View pods
kubectl --context=a-prod get pods -n production

# View logs
kubectl --context=a-prod logs -f deployment/aegisx-api -n production

# Check ingress
kubectl --context=a-prod get ingress -n production
```

### Manual Rollback

```bash
# Rollback staging
kubectl --context=dixon-dev rollout undo deployment/aegisx-api -n staging

# Rollback production
kubectl --context=a-prod rollout undo deployment/aegisx-api -n production
```

### Check Workflow Status

```bash
# View GitHub Actions from CLI (requires gh CLI)
gh run list
gh run view <run-id>
gh run watch
```

## 🎨 Workflow States

### GitHub Actions UI

**Staging Workflow:**

```
✅ Build staging (api)      ← 2 min
✅ Build staging (web)      ← 2 min
✅ Build staging (admin)    ← 3 min
✅ Build staging (landing)  ← 2 min
✅ Deploy to staging        ← 1 min
✅ Staging summary          ← 10 sec
```

**Production Workflow:**

```
✅ Semantic Release         ← 30 sec
✅ Build production (api)   ← 3 min
✅ Build production (web)   ← 3 min
✅ Build production (admin) ← 4 min
✅ Build production (landing) ← 3 min
⏸️  Approval Required       ← Waiting for you...
   (Once approved)
✅ Deploy to production     ← 2 min
✅ Production summary       ← 10 sec
```

## 🔔 Notifications

You'll receive notifications when:

- ✉️ Production deployment needs approval
- ✅ Staging deployment successful
- ✅ Production deployment successful
- ❌ Any deployment fails

## 🎯 Success Criteria

After implementation, you should see:

**Staging (develop push):**

1. ✅ Auto build 4 apps
2. ✅ Auto deploy to dixon-dev cluster
3. ✅ Accessible at https://staging.aegisx.dev (or https://staging-ui.aegisx.dev for UI)
4. ✅ No manual intervention needed

**Production (main push):**

1. ✅ Auto build 4 apps
2. ✅ Version bump in package.json
3. ✅ Git tag created (v1.x.x)
4. ⏸️ Waiting for your approval
5. ✅ Deploy after approval
6. ✅ Accessible at https://aegisx.dev (main) / https://ui.aegisx.dev (UI/Admin)

## 📚 Documentation Links

- [Complete Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Migration Comparison](./MIGRATION_COMPARISON.md)
- [Current Workflow](./release.yml)

## ❓ Need Help?

1. Check workflow logs in **Actions** tab
2. Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. Ask the team in #devops channel

---

**Ready to deploy? Let's go! 🚀**
