# Version Management Best Practices

> **📋 Complete guide for maintaining clean v1.x.x versioning strategy**

## 📋 Table of Contents

1. [🎯 Version Strategy](#-version-strategy)
2. [📝 Commit Message Guidelines](#-commit-message-guidelines)
3. [🔄 Release Workflow](#-release-workflow)
4. [🛡️ Protection Measures](#️-protection-measures)
5. [📊 Monitoring & Maintenance](#-monitoring--maintenance)

## 🎯 Version Strategy

### Project Versioning Policy

**AegisX Platform maintains strict v1.x.x versioning:**

- **Major version**: Always `1` (never increment to `2`)
- **Minor version**: For new features and enhancements
- **Patch version**: For bug fixes and small improvements

### Version Meaning

```
v1.minor.patch
   │    │     │
   │    │     └── Bug fixes, security patches, minor improvements
   │    └────────── New features, API additions, enhancements
   └─────────────── Fixed at 1 (backward compatibility maintained)
```

### Semantic Release Mapping

| Change Type   | Conventional Commit | Version Impact        | Example                                    |
| ------------- | ------------------- | --------------------- | ------------------------------------------ |
| Bug Fix       | `fix:`              | Patch (1.0.1 → 1.0.2) | `fix(auth): resolve token validation`      |
| New Feature   | `feat:`             | Minor (1.0.1 → 1.1.0) | `feat(dashboard): add user analytics`      |
| Documentation | `docs:`             | No release            | `docs(readme): update installation`        |
| Refactoring   | `refactor:`         | Patch                 | `refactor(api): optimize database queries` |
| Performance   | `perf:`             | Patch                 | `perf(frontend): reduce bundle size`       |
| Tests         | `test:`             | No release            | `test(auth): add integration tests`        |

## 📝 Commit Message Guidelines

### ✅ Approved Format

```bash
# Standard format
type(scope): description

# Examples
feat(auth): add two-factor authentication
fix(api): resolve user creation endpoint bug
docs(deployment): update Docker configuration guide
refactor(database): optimize user queries
perf(frontend): implement lazy loading for components
```

### ❌ Forbidden Patterns

**NEVER use these patterns (will trigger v2.x.x):**

```bash
# ❌ Forbidden - will create v2.0.0
feat(api): add new endpoint

BREAKING CHANGE: API endpoint changed

# ❌ Forbidden - will create v2.0.0
fix(auth): update authentication system

BREAKING CHANGES: Authentication flow modified

# ❌ Forbidden - will create v2.0.0
refactor(database): update schema

BREAKING: Database schema changed
```

### ✅ Safe Alternatives

```bash
# ✅ Safe - will create v1.x.x
feat(api): add new endpoint

IMPORTANT: API endpoint added with backward compatibility

# ✅ Safe - will create v1.x.x
fix(auth): update authentication system

MAJOR UPDATE: Authentication flow enhanced while maintaining compatibility

# ✅ Safe - will create v1.x.x
refactor(database): update schema

MIGRATION: Database schema updated with automatic migration support
```

### Alternative Keywords

| Instead of          | Use These Safe Alternatives                     |
| ------------------- | ----------------------------------------------- |
| `BREAKING CHANGE:`  | `IMPORTANT:`, `MAJOR UPDATE:`, `SIGNIFICANT:`   |
| `BREAKING CHANGES:` | `API CHANGE:`, `MIGRATION:`, `ENHANCEMENT:`     |
| `BREAKING:`         | `DEPRECATED:`, `MODERNIZATION:`, `IMPROVEMENT:` |

## 🔄 Release Workflow

### Automated Release Process

```bash
# 1. Development on feature branches
git checkout -b feature/user-dashboard
# ... make changes ...
git commit -m "feat(dashboard): add user analytics panel"

# 2. Merge to develop for testing
git checkout develop
git merge feature/user-dashboard

# 3. Merge to main for release
git checkout main
git merge develop

# 4. Semantic-release automatically:
# - Analyzes commits since last release
# - Determines version bump (patch/minor)
# - Generates CHANGELOG.md
# - Creates GitHub release
# - Updates package.json
```

### Manual Version Control

```bash
# For emergency releases or manual control
npm run version:patch   # 1.0.1 → 1.0.2
npm run version:minor   # 1.0.1 → 1.1.0

# Never use (major version forbidden)
# npm run version:major  # ❌ FORBIDDEN
```

### Pre-release Workflow (Develop Branch)

```bash
# Develop branch creates beta releases
git checkout develop
git commit -m "feat(feature): add new functionality"
git push origin develop

# Creates: v1.1.0-beta.1, v1.1.0-beta.2, etc.
```

## 🛡️ Protection Measures

### 1. Pre-commit Validation

```bash
# Install commit message validation
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Configure commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2, 'always',
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test']
    ],
    // Custom rule to prevent BREAKING CHANGE
    'body-max-line-length': [2, 'always', 100],
    'footer-max-line-length': [2, 'always', 100]
  },
  plugins: [
    {
      rules: {
        'no-breaking-change': (parsed) => {
          const message = parsed.raw;
          if (message.includes('BREAKING CHANGE') ||
              message.includes('BREAKING CHANGES') ||
              message.includes('BREAKING:')) {
            return [false, 'BREAKING CHANGE patterns are forbidden. Use IMPORTANT:, MAJOR UPDATE:, or SIGNIFICANT: instead.'];
          }
          return [true, ''];
        }
      }
    }
  ]
};
```

### 2. Git Hooks Setup

```bash
# .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check for forbidden patterns
if grep -iE "BREAKING CHANGE|BREAKING CHANGES|BREAKING:" "$1"; then
    echo "🚨 ERROR: Forbidden BREAKING CHANGE pattern detected!"
    echo "This will trigger v2.x.x release which is not allowed."
    echo ""
    echo "Use these safe alternatives:"
    echo "  IMPORTANT: for significant changes"
    echo "  MAJOR UPDATE: for substantial features"
    echo "  SIGNIFICANT: for notable modifications"
    echo "  API CHANGE: for API modifications"
    echo "  MIGRATION: for schema/config changes"
    echo "  DEPRECATED: for deprecation notices"
    exit 1
fi

# Run conventional commit validation
npx commitlint --edit "$1"
```

### 3. CI/CD Protection

```yaml
# .github/workflows/version-protection.yml
name: Version Protection

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  protect-versioning:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Check for forbidden BREAKING patterns
        run: |
          if git log --grep="BREAKING CHANGE" --grep="BREAKING CHANGES" --grep="BREAKING:" --oneline origin/main..HEAD | grep -q .; then
            echo "🚨 Forbidden BREAKING CHANGE pattern detected!"
            git log --grep="BREAKING CHANGE" --grep="BREAKING CHANGES" --grep="BREAKING:" --oneline origin/main..HEAD
            exit 1
          fi

      - name: Verify semantic-release version
        if: github.ref == 'refs/heads/main'
        run: |
          npm ci
          NEXT_VERSION=$(npx semantic-release --dry-run 2>&1 | grep -o "The next release version is [0-9]\+\.[0-9]\+\.[0-9]\+" | cut -d' ' -f6 || echo "none")
          if [[ $NEXT_VERSION == 2.* ]]; then
            echo "🚨 ERROR: Would create v2.x.x release: $NEXT_VERSION"
            exit 1
          fi
          echo "✅ Safe version: $NEXT_VERSION"
```

### 4. Repository Settings

```bash
# Branch protection rules for main branch
# - Require status checks: version-protection
# - Require pull request reviews
# - Dismiss stale PR approvals when new commits are pushed
# - Require review from code owners
# - Restrict pushes that create files matching .releaserc*
```

## 📊 Monitoring & Maintenance

### Daily Monitoring

```bash
# Check current version status
npm run status:version() {
  echo "=== Version Status ==="
  echo "Package.json: $(jq -r '.version' package.json)"
  echo "Latest Git Tag: $(git describe --tags --abbrev=0)"
  echo "Latest Release: $(gh release list --limit 1 | cut -f3)"
  echo ""

  echo "=== Recent Commits ==="
  git log --oneline -5
  echo ""

  echo "=== Next Release Preview ==="
  npx semantic-release --dry-run 2>/dev/null | grep -E "(next release|version)" || echo "No release needed"
}
```

### Weekly Maintenance

```bash
# Weekly version audit
npm run audit:version() {
  echo "=== Version Audit ==="

  # Check for any v2.x.x tags/releases
  V2_TAGS=$(git tag --list | grep "^v2\." | wc -l)
  V2_RELEASES=$(gh release list | grep "^v2\." | wc -l)

  if [ $V2_TAGS -gt 0 ] || [ $V2_RELEASES -gt 0 ]; then
    echo "🚨 WARNING: Found v2.x.x versions!"
    echo "Tags: $V2_TAGS, Releases: $V2_RELEASES"
    exit 1
  fi

  # Check semantic-release config
  if grep -q "breaking.*major" .releaserc.json; then
    echo "🚨 WARNING: .releaserc.json may allow major version bumps"
  fi

  echo "✅ Version audit passed"
}
```

### Monthly Review

```bash
# Monthly changelog review
npm run review:changelog() {
  echo "=== Changelog Review ==="

  # Check for v2.x.x entries in CHANGELOG.md
  if grep -q "## \[2\." CHANGELOG.md; then
    echo "🚨 WARNING: Found v2.x.x entries in CHANGELOG.md"
    grep -n "## \[2\." CHANGELOG.md
  fi

  # Verify version consistency
  PKG_VERSION=$(jq -r '.version' package.json)
  LATEST_TAG=$(git describe --tags --abbrev=0)

  if [ "v$PKG_VERSION" != "$LATEST_TAG" ]; then
    echo "⚠️  Version mismatch: package.json=$PKG_VERSION, git tag=$LATEST_TAG"
  fi

  echo "✅ Changelog review complete"
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Package.json version mismatch**

   ```bash
   # Reset to latest git tag
   LATEST_VERSION=$(git describe --tags --abbrev=0 | sed 's/^v//')
   jq ".version = \"$LATEST_VERSION\"" package.json > package.json.tmp
   mv package.json.tmp package.json
   ```

2. **Semantic-release dry-run shows v2.x.x**

   ```bash
   # Find problematic commit
   git log --grep="BREAKING" --oneline
   # Use recovery procedures from semantic-release-recovery.md
   ```

3. **Accidental v2.x.x release created**
   ```bash
   # Follow emergency recovery guide
   # See: docs/infrastructure/semantic-release-recovery.md
   ```

### Emergency Contacts

- **Project Owner**: [Contact information]
- **DevOps Team**: [Contact information]
- **Emergency Escalation**: [Contact information]

---

**📝 Remember: Always preview releases with `npx semantic-release --dry-run` before merging to main!**
