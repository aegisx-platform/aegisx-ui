# CI/CD Documentation

Complete documentation for AegisX CI/CD workflows using GitHub Actions.

## 📚 Documentation Files

### 🎯 Start Here

1. **[CICD_SUMMARY.md](./CICD_SUMMARY.md)** - Complete overview and summary
   - Application structure (4 apps)
   - Domain mapping (staging + production)
   - Workflow details
   - Verification checklist

### 🚀 Quick Guides

2. **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
   - Setup steps
   - Workflow diagrams
   - Quick commands

3. **[DNS_SETUP_GUIDE.md](./DNS_SETUP_GUIDE.md)** - DNS configuration
   - 11 DNS records needed
   - Cloudflare setup
   - Domain mapping

### 📖 Detailed Guides

4. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment guide
   - Workflow files explained
   - Manual approval setup
   - Monitoring and troubleshooting
   - Best practices

5. **[MIGRATION_COMPARISON.md](./MIGRATION_COMPARISON.md)** - Migration from current workflow
   - Current vs new comparison
   - Feature comparison table
   - Migration paths

## 🔄 Workflow Files Location

Actual workflow files are in:

```
.github/workflows/
├── build-staging.yml.example      ← Staging workflow
├── build-production.yml.example   ← Production workflow
├── release.yml                    ← Current workflow (backup)
├── deploy-admin-docs.yml
└── deploy-docs.yml
```

## 📦 Applications

| App         | Description          | Port |
| ----------- | -------------------- | ---- |
| **api**     | Backend API service  | 3000 |
| **web**     | Main web application | 80   |
| **admin**   | Admin panel & docs   | 80   |
| **landing** | Marketing website    | 80   |

## 🌐 URLs Overview

### Production

- `aegisx.dev` → landing
- `app.aegisx.dev` → web
- `api.aegisx.dev` → api
- `ui.aegisx.dev` → admin
- `cli.aegisx.dev` → landing

### Staging

- `staging.aegisx.dev` → landing
- `staging-app.aegisx.dev` → web
- `staging-api.aegisx.dev` → api
- `staging-ui.aegisx.dev` → admin
- `staging-cli.aegisx.dev` → landing

## 🎓 Learning Path

For beginners:

1. Read [QUICK_START.md](./QUICK_START.md)
2. Setup DNS using [DNS_SETUP_GUIDE.md](./DNS_SETUP_GUIDE.md)
3. Activate workflows

For detailed understanding:

1. Read [CICD_SUMMARY.md](./CICD_SUMMARY.md)
2. Study [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. Review [MIGRATION_COMPARISON.md](./MIGRATION_COMPARISON.md)

## 🔗 Related Documentation

- [Multi-Instance Setup](../multi-instance-setup.md)
- [Git Flow & Release](../git-flow-release-guide.md)
- [Git Subtree Guide](../git-subtree-guide.md)

---

**Last Updated:** 2024-12-08
