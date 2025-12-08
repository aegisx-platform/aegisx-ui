# 🏷️ Container Image Naming Standard

## 🔍 ปัญหาที่พบ (Current Issues)

### Inconsistency ระหว่าง GitHub Actions และ Kubernetes

**GitHub Actions workflow สร้าง:**

```yaml
ghcr.io/aegisx-platform/aegisx-starter-1-api:latest
ghcr.io/aegisx-platform/aegisx-starter-1-web:latest
ghcr.io/aegisx-platform/aegisx-starter-1-admin:latest
ghcr.io/aegisx-platform/aegisx-starter-1-landing:latest
```

❌ มี `-1` (repo number) ซึ่งไม่ควรอยู่ใน image name

**Kubernetes deployment ใช้:**

```yaml
ghcr.io/aegisx-platform/aegisx-starter-admin:latest
```

✅ ไม่มี repo number (ถูกต้อง)

**ปัญหา:** Image ที่ build ไม่ตรงกับ image ที่ deploy ใช้!

## ✅ มาตรฐานที่ถูกต้อง (Proposed Standard)

### Image Naming Convention

```
ghcr.io/{organization}/{project}-{app}:{tag}
```

**Template:**

```
ghcr.io/aegisx-platform/aegisx-starter-{app}:{tag}
```

### ตัวอย่าง Image Names

#### Production Images

```yaml
# API
ghcr.io/aegisx-platform/aegisx-starter-api:latest
ghcr.io/aegisx-platform/aegisx-starter-api:production
ghcr.io/aegisx-platform/aegisx-starter-api:v1.2.3

# Web
ghcr.io/aegisx-platform/aegisx-starter-web:latest
ghcr.io/aegisx-platform/aegisx-starter-web:production
ghcr.io/aegisx-platform/aegisx-starter-web:v1.2.3

# Admin
ghcr.io/aegisx-platform/aegisx-starter-admin:latest
ghcr.io/aegisx-platform/aegisx-starter-admin:production
ghcr.io/aegisx-platform/aegisx-starter-admin:v1.2.3

# Landing
ghcr.io/aegisx-platform/aegisx-starter-landing:latest
ghcr.io/aegisx-platform/aegisx-starter-landing:production
ghcr.io/aegisx-platform/aegisx-starter-landing:v1.2.3
```

#### Staging Images

```yaml
# API
ghcr.io/aegisx-platform/aegisx-starter-api:staging
ghcr.io/aegisx-platform/aegisx-starter-api:1.2.3-staging
ghcr.io/aegisx-platform/aegisx-starter-api:staging-abc1234

# Web
ghcr.io/aegisx-platform/aegisx-starter-web:staging
ghcr.io/aegisx-platform/aegisx-starter-web:1.2.3-staging
ghcr.io/aegisx-platform/aegisx-starter-web:staging-abc1234

# Admin
ghcr.io/aegisx-platform/aegisx-starter-admin:staging
ghcr.io/aegisx-platform/aegisx-starter-admin:1.2.3-staging
ghcr.io/aegisx-platform/aegisx-starter-admin:staging-abc1234

# Landing
ghcr.io/aegisx-platform/aegisx-starter-landing:staging
ghcr.io/aegisx-platform/aegisx-starter-landing:1.2.3-staging
ghcr.io/aegisx-platform/aegisx-starter-landing:staging-abc1234
```

## 📊 Tag Strategy

### Production Tags (3 tags per build)

| Tag          | Purpose                    | Example      | When to use            |
| ------------ | -------------------------- | ------------ | ---------------------- |
| `latest`     | Latest production build    | `latest`     | Development/testing    |
| `production` | Current production version | `production` | Production deployments |
| `v{semver}`  | Specific version           | `v1.2.3`     | Version pinning        |

### Staging Tags (3 tags per build)

| Tag                | Purpose              | Example           | When to use               |
| ------------------ | -------------------- | ----------------- | ------------------------- |
| `staging`          | Latest staging build | `staging`         | Staging deployments       |
| `{semver}-staging` | Versioned staging    | `1.2.3-staging`   | Testing specific versions |
| `staging-{sha}`    | Commit-specific      | `staging-abc1234` | Debugging/rollback        |

## 🔧 การแก้ไขที่ต้องทำ

### 1. GitHub Actions Workflows

**ปัจจุบัน (Wrong):**

```yaml
steps:
  - name: Get repository name
    id: repo
    run: echo "REPO_NAME=$(echo '${{ github.repository }}' | tr '[:upper:]' '[:lower:]')" >> $GITHUB_OUTPUT
    # Output: aegisx-platform/aegisx-starter-1 ❌
```

**ที่ถูกต้อง (Correct):**

```yaml
steps:
  - name: Set image name
    id: image
    run: |
      # Remove repo number, use project name only
      echo "REPO_NAME=aegisx-platform/aegisx-starter" >> $GITHUB_OUTPUT
      # Output: aegisx-platform/aegisx-starter ✅
```

**หรือใช้:**

```yaml
env:
  IMAGE_REGISTRY: ghcr.io
  IMAGE_ORG: aegisx-platform
  IMAGE_PROJECT: aegisx-starter

steps:
  - name: Build and push
    uses: docker/build-push-action@v5
    with:
      tags: |
        ${{ env.IMAGE_REGISTRY }}/${{ env.IMAGE_ORG }}/${{ env.IMAGE_PROJECT }}-${{ matrix.app }}:latest
```

### 2. Kustomize Images

**base/\*/deployment.yaml:**

```yaml
# ต้องใช้ชื่อเดียวกันทุกที่
image: ghcr.io/aegisx-platform/aegisx-starter-{app}:latest
```

**overlays/\*/kustomization.yaml:**

```yaml
images:
  - name: ghcr.io/aegisx-platform/aegisx-starter-api
    newTag: v1.2.3
  - name: ghcr.io/aegisx-platform/aegisx-starter-web
    newTag: v1.2.3
  - name: ghcr.io/aegisx-platform/aegisx-starter-admin
    newTag: v1.2.3
  - name: ghcr.io/aegisx-platform/aegisx-starter-landing
    newTag: v1.2.3
```

## 📋 Checklist การแก้ไข

### GitHub Actions (.github/workflows/)

- [ ] `build-staging.yml.example` - แก้ image naming
- [ ] `build-production.yml.example` - แก้ image naming
- [ ] `release.yml` - แก้ image naming (current workflow)

### Kubernetes Configs (aegisx-infra/)

- [ ] `base/api/deployment.yaml` - verify image name
- [ ] `base/web/deployment.yaml` - verify image name
- [ ] `base/admin/deployment.yaml` - verify image name (already correct)
- [ ] `base/landing/deployment.yaml` - verify image name
- [ ] `overlays/*/kustomization.yaml` - update image references

## 🎯 ตัวอย่างการแก้ไข

### Before (Wrong)

```yaml
# GitHub Actions
tags: |
  ghcr.io/${{ steps.repo.outputs.REPO_NAME }}-${{ matrix.app }}:latest
  # Result: ghcr.io/aegisx-platform/aegisx-starter-1-api:latest ❌
```

### After (Correct)

```yaml
# GitHub Actions
tags: |
  ghcr.io/aegisx-platform/aegisx-starter-${{ matrix.app }}:latest
  # Result: ghcr.io/aegisx-platform/aegisx-starter-api:latest ✅
```

## ✅ ประโยชน์ของมาตรฐานนี้

1. **Consistency** - ชื่อเหมือนกันทุกที่ (CI/CD, K8s, Docs)
2. **Simplicity** - ไม่มี repo number ที่ไม่จำเป็น
3. **Clarity** - เห็นชื่อแล้วรู้เลยว่าเป็น app อะไร
4. **Maintainability** - ง่ายต่อการจัดการและ debug
5. **Standard Compliance** - ตาม Docker/OCI image naming best practices

## 🔗 Related Standards

- [OCI Image Spec](https://github.com/opencontainers/image-spec)
- [Docker Image Naming](https://docs.docker.com/engine/reference/commandline/tag/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

---

**สรุป:** ต้องแก้ให้ image name เป็น `ghcr.io/aegisx-platform/aegisx-starter-{app}:{tag}` ทุกที่!
