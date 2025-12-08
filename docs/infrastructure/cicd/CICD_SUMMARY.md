# 🚀 CI/CD Configuration Summary

## ✅ สรุป CI/CD Workflow ที่ตั้งค่าแล้ว

### 📦 Applications (4 apps)

1. **api** - Backend API service
2. **web** - Main web application
3. **admin** - Admin panel & documentation UI
4. **landing** - Marketing website for aegisx-cli

### 🌐 Domain Structure

#### Production

| App     | Domain               | Purpose             |
| ------- | -------------------- | ------------------- |
| landing | `aegisx.dev`         | Main marketing site |
| landing | `cli.aegisx.dev`     | CLI product page    |
| web     | `app.aegisx.dev`     | Main web app        |
| web     | `app.aegisx.dev/api` | API via proxy       |
| api     | `api.aegisx.dev`     | Direct API access   |
| admin   | `ui.aegisx.dev`      | Admin panel & docs  |

#### Staging

| App     | Domain                       | Purpose           |
| ------- | ---------------------------- | ----------------- |
| landing | `staging.aegisx.dev`         | Staging marketing |
| landing | `staging-cli.aegisx.dev`     | Staging CLI page  |
| web     | `staging-app.aegisx.dev`     | Staging web app   |
| web     | `staging-app.aegisx.dev/api` | API via proxy     |
| api     | `staging-api.aegisx.dev`     | Staging API       |
| admin   | `staging-ui.aegisx.dev`      | Staging admin     |

## 🔄 Workflow Files

### 1. build-staging.yml.example

**Trigger:** Push to `develop` branch

**Process:**

1. Build 4 apps in parallel (api, web, admin, landing)
2. Tag images:
   - `staging`
   - `{version}-staging`
   - `staging-{sha}`
3. Auto deploy to staging K8s cluster (dixon-dev)
4. Run comprehensive smoke tests on all 5 URLs
5. Show deployment summary

**Smoke Tests:**

- ✅ `staging-api.aegisx.dev/health`
- ✅ `staging-app.aegisx.dev`
- ✅ `staging-ui.aegisx.dev`
- ✅ `staging.aegisx.dev`
- ✅ `staging-cli.aegisx.dev`

### 2. build-production.yml.example

**Trigger:** Push to `main` branch

**Process:**

1. Semantic release (version bump)
2. Build 4 apps in parallel
3. Tag images:
   - `latest`
   - `production`
   - `v{version}`
4. **⏸️ WAIT FOR MANUAL APPROVAL**
5. Deploy to production K8s cluster (a-prod)
6. Run comprehensive smoke tests on all 5 URLs
7. Auto rollback on failure
8. Show deployment summary

**Smoke Tests:**

- ✅ `api.aegisx.dev/health`
- ✅ `app.aegisx.dev`
- ✅ `ui.aegisx.dev`
- ✅ `aegisx.dev`
- ✅ `cli.aegisx.dev`

## 🌐 DNS Requirements

### ต้องเพิ่ม 11 DNS Records ใน Cloudflare

#### 1. Infrastructure (1 record)

```
A record: cluster → 43.228.125.9 (Proxy: ON)
```

#### 2. Production (5 records)

```
CNAME: @ (root) → cluster.aegisx.dev (Proxy: ON)
CNAME: app → cluster.aegisx.dev (Proxy: ON)
CNAME: api → cluster.aegisx.dev (Proxy: ON)
CNAME: ui → cluster.aegisx.dev (Proxy: ON)
CNAME: cli → cluster.aegisx.dev (Proxy: ON)
```

#### 3. Staging (5 records)

```
CNAME: staging → cluster.aegisx.dev (Proxy: ON)
CNAME: staging-app → cluster.aegisx.dev (Proxy: ON)
CNAME: staging-api → cluster.aegisx.dev (Proxy: ON)
CNAME: staging-ui → cluster.aegisx.dev (Proxy: ON)
CNAME: staging-cli → cluster.aegisx.dev (Proxy: ON)
```

**ดู step-by-step ได้ที่:** [DNS_SETUP_GUIDE.md](./DNS_SETUP_GUIDE.md)

## 📋 Deployment Flow

### Staging Flow (Auto)

```
1. Developer pushes to develop
   ↓
2. Build 4 apps with staging tags
   ↓
3. Deploy to staging cluster (auto)
   ↓
4. Test 5 URLs
   ↓
5. ✅ Ready at staging.aegisx.dev
```

### Production Flow (Manual Approval)

```
1. Merge to main (via PR)
   ↓
2. Semantic release (version bump)
   ↓
3. Build 4 apps with production tags
   ↓
4. ⏸️ WAIT FOR APPROVAL ⏸️
   ↓
5. Deploy to production cluster
   ↓
6. Test 5 URLs
   ↓
7. ✅ Live at aegisx.dev
```

## 🎯 Docker Tags Strategy

### Staging

```yaml
ghcr.io/aegisx-platform/aegisx-starter-{app}:staging           # Latest staging
ghcr.io/aegisx-platform/aegisx-starter-{app}:1.2.3-staging     # Versioned
ghcr.io/aegisx-platform/aegisx-starter-{app}:staging-abc1234   # SHA-specific
```

### Production

```yaml
ghcr.io/aegisx-platform/aegisx-starter-{app}:latest      # Latest production
ghcr.io/aegisx-platform/aegisx-starter-{app}:production  # Production marker
ghcr.io/aegisx-platform/aegisx-starter-{app}:v1.2.3      # Specific version
```

## 📁 Files Created/Updated

### CI/CD Workflows

- ✅ `build-staging.yml.example` - Staging workflow (all 4 apps)
- ✅ `build-production.yml.example` - Production workflow (all 4 apps)

### Documentation

- ✅ `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- ✅ `MIGRATION_COMPARISON.md` - Current vs New comparison
- ✅ `QUICK_START.md` - Quick start guide
- ✅ `DNS_SETUP_GUIDE.md` - DNS setup checklist
- ✅ `CICD_SUMMARY.md` - This file

## 🚀 Next Steps

### 1. Setup GitHub Environments (Required)

```bash
# Go to: Settings → Environments → New environment

Environment 1: production-approval
- Name: production-approval
- ✅ Required reviewers: [your-username]

Environment 2: production
- Name: production
- Deployment branch: main only
```

### 2. Add Required Secrets (Required)

```bash
# Go to: Settings → Secrets and variables → Actions

Secret: INFRA_REPO_TOKEN
- Personal Access Token with repo access
- For pushing to aegisx-infra repo
```

### 3. Setup DNS (Required)

```bash
# Follow: DNS_SETUP_GUIDE.md
# Add 11 DNS records in Cloudflare
```

### 4. Activate Workflows (Ready to use)

```bash
cd .github/workflows

# Rename example files to activate
mv build-staging.yml.example build-staging.yml
mv build-production.yml.example build-production.yml

# Optional: Backup old workflow
mv release.yml release.yml.backup
```

### 5. Test Staging

```bash
git checkout develop
echo "test" >> README.md
git add README.md
git commit -m "test: staging workflow"
git push

# Check Actions tab in GitHub
```

### 6. Test Production

```bash
git checkout main
git merge develop
git push

# Check Actions tab
# Approve when prompted
```

## ✅ Verification Checklist

### Before Going Live:

- [ ] GitHub environments created (production-approval, production)
- [ ] Required secrets added (INFRA_REPO_TOKEN)
- [ ] DNS records added (11 records)
- [ ] Workflows activated (.yml files renamed)
- [ ] Staging workflow tested successfully
- [ ] Production workflow tested with approval
- [ ] All 4 apps accessible on staging URLs
- [ ] All 4 apps accessible on production URLs
- [ ] Smoke tests passing
- [ ] Rollback tested

## 🔍 Quick Commands

### Check Deployments

```bash
# Staging
kubectl --context=dixon-dev get pods,svc,ingress -n staging

# Production
kubectl --context=a-prod get pods,svc,ingress -n production
```

### View Workflow Logs

```bash
gh run list
gh run view <run-id>
gh run watch
```

### Test URLs

```bash
# Staging
curl -I https://staging.aegisx.dev
curl -I https://staging-app.aegisx.dev
curl -I https://staging-api.aegisx.dev/health
curl -I https://staging-ui.aegisx.dev
curl -I https://staging-cli.aegisx.dev

# Production
curl -I https://aegisx.dev
curl -I https://app.aegisx.dev
curl -I https://api.aegisx.dev/health
curl -I https://ui.aegisx.dev
curl -I https://cli.aegisx.dev
```

## 📊 Monitoring

### GitHub Actions Dashboard

- Go to **Actions** tab
- View workflow runs
- Check deployment status

### Deployment Notifications

You'll receive notifications for:

- ⏸️ Production approval needed
- ✅ Staging deployment success
- ✅ Production deployment success
- ❌ Any deployment failures

## 🆘 Troubleshooting

### Issue: Workflow not triggering

**Solution:** Check branch name matches trigger (develop/main)

### Issue: Approval not showing

**Solution:** Verify environment name is `production-approval`

### Issue: Image pull error

**Solution:** Check GITHUB_TOKEN and ghcr-secret in cluster

### Issue: Smoke tests failing

**Solution:**

1. Check DNS propagation
2. Verify ingress configuration
3. Check pod status
4. Review service configuration

## 📚 Related Documentation

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [DNS_SETUP_GUIDE.md](./DNS_SETUP_GUIDE.md) - DNS configuration
- [QUICK_START.md](./QUICK_START.md) - Quick start guide
- [MIGRATION_COMPARISON.md](./MIGRATION_COMPARISON.md) - Feature comparison

---

**Configuration Complete!** ✅
**Total Apps:** 4 (api, web, admin, landing)
**Total Environments:** 2 (staging, production)
**Total URLs:** 10 (5 staging + 5 production)
**Total DNS Records:** 11 (1 cluster + 5 production + 5 staging)
