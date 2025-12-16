# Semantic Release Emergency Recovery Guide

> **🚨 CRITICAL: สำหรับการแก้ไขปัญหา semantic-release ที่สร้าง v2.x.x โดยไม่ตั้งใจ**

## 📋 Table of Contents

1. [🚨 Emergency Response](#-emergency-response)
2. [🔍 Problem Identification](#-problem-identification)
3. [⚡ Quick Recovery Steps](#-quick-recovery-steps)
4. [🛠️ Detailed Recovery Procedures](#️-detailed-recovery-procedures)
5. [🔧 Prevention Measures](#-prevention-measures)
6. [📝 Post-Recovery Checklist](#-post-recovery-checklist)

## 🚨 Emergency Response

### Immediate Actions (Do First!)

```bash
# 1. STOP all development immediately
# 2. Check current version situation
git tag --list --sort=-version:refname | head -10
git log --oneline -5

# 3. Identify problematic commit with BREAKING CHANGE
git log --grep="BREAKING CHANGE" --oneline
git log --grep="BREAKING CHANGES" --oneline
git log --grep="BREAKING:" --oneline
```

### Critical Questions to Answer

1. **Has the unwanted v2.x.x release been published to GitHub?**
2. **Are there commits after the problematic BREAKING CHANGE commit?**
3. **Which branch contains the problem: main or develop?**
4. **What is the latest GOOD version (v1.x.x)?**

## 🔍 Problem Identification

### Check Release Status

```bash
# Check GitHub releases
gh release list --limit 10

# Check if v2.x.x tags exist
git tag | grep "^v2\."

# Find the problematic commit
git log --grep="BREAKING CHANGE" --pretty=format:"%h %s" --all
```

### Identify Root Cause

Common causes of accidental v2.x.x releases:

1. **BREAKING CHANGE in commit message** ← Most common
2. **BREAKING CHANGES in commit message**
3. **BREAKING: in commit message**
4. **Copied commit messages from other repos**
5. **Wrong semantic-release configuration**

## ⚡ Quick Recovery Steps

### Option 1: Git Reset (Recommended for Clean Recovery)

```bash
# 1. Backup current state
git branch backup-before-recovery

# 2. Find the last good commit (before BREAKING CHANGE)
git log --oneline | grep -v "BREAKING"
# Look for last commit before problematic one

# 3. Reset to last good commit
git reset --hard [LAST_GOOD_COMMIT_HASH]

# 4. Force push to restore clean state
git push origin main --force-with-lease
```

### Option 2: Commit Message Fix (If Recent and No Other Commits)

```bash
# Only if the BREAKING CHANGE commit is the latest commit
git commit --amend -m "fix: [your fixed message without BREAKING CHANGE]"
git push origin main --force-with-lease
```

## 🛠️ Detailed Recovery Procedures

### Step 1: Assess the Damage

```bash
# List all problematic releases
gh release list | grep "v2\."

# Check package.json version
cat package.json | grep '"version"'

# Check CHANGELOG.md for v2.x.x entries
grep -n "v2\." CHANGELOG.md
```

### Step 2: Clean Up GitHub Releases

```bash
# Delete unwanted v2.x.x releases
gh release delete v2.0.0 --cleanup-tag
gh release delete v2.0.1 --cleanup-tag
gh release delete v2.0.2 --cleanup-tag
# Repeat for all v2.x.x releases

# Verify cleanup
gh release list
git tag --list | grep "^v2\."
```

### Step 3: Fix Repository State

```bash
# Reset package.json to correct version
# Find last good v1.x.x version
LAST_GOOD_VERSION=$(git tag --list | grep "^v1\." | sort -V | tail -1)
echo "Last good version: $LAST_GOOD_VERSION"

# Update package.json manually or with jq
jq '.version = "1.0.11"' package.json > package.json.tmp && mv package.json.tmp package.json

# Clean up CHANGELOG.md
# Remove v2.x.x entries manually
```

### Step 4: Verify .releaserc.json Configuration

```bash
# Check current configuration
cat .releaserc.json

# Verify it matches the working configuration:
# - branches: ["main", {"name": "develop", "prerelease": "beta"}]
# - Standard plugins without custom breaking change rules
```

### Step 5: Test Semantic Release

```bash
# Test semantic-release in dry-run mode
npx semantic-release --dry-run

# Should show next version as v1.x.x, NOT v2.x.x
```

### Step 6: Restore Clean State

```bash
# Commit the fixes
git add package.json CHANGELOG.md
git commit -m "fix: restore clean v1.x.x versioning state"

# Push the corrected state
git push origin main

# Verify with semantic-release
npx semantic-release --dry-run
```

## 🔧 Prevention Measures

### 1. Pre-commit Hook Setup

```bash
# Create .husky/commit-msg hook
cat > .husky/commit-msg << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check for forbidden BREAKING CHANGE patterns
if grep -i "BREAKING CHANGE\|BREAKING CHANGES\|BREAKING:" "$1"; then
    echo "🚨 ERROR: Forbidden BREAKING CHANGE pattern detected!"
    echo "This will trigger v2.x.x release which is not allowed."
    echo "Use alternatives: IMPORTANT:, MAJOR UPDATE:, SIGNIFICANT:, API CHANGE:"
    exit 1
fi
EOF

chmod +x .husky/commit-msg
```

### 2. Commit Message Templates

```bash
# Create commit message template
cat > .gitmessage << 'EOF'
# Type: feat, fix, docs, style, refactor, test, chore
# Scope: Optional, component/module affected
# Description: Brief description

# Examples:
# feat(auth): add user authentication system
# fix(api): resolve user creation endpoint issue
# docs(readme): update installation instructions

# ❌ FORBIDDEN PATTERNS (will trigger v2.x.x):
# - BREAKING CHANGE:
# - BREAKING CHANGES:
# - BREAKING:

# ✅ SAFE ALTERNATIVES:
# - IMPORTANT:
# - MAJOR UPDATE:
# - SIGNIFICANT:
# - API CHANGE:
# - MIGRATION:
# - DEPRECATED:
EOF

# Set as global template
git config commit.template .gitmessage
```

### 3. GitHub Actions Protection

Create `.github/workflows/semantic-release-protection.yml`:

```yaml
name: Semantic Release Protection

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  check-breaking-changes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Check for forbidden BREAKING CHANGE patterns
        run: |
          # Check commit messages for forbidden patterns
          if git log --grep="BREAKING CHANGE" --grep="BREAKING CHANGES" --grep="BREAKING:" --oneline origin/main..HEAD | grep -q .; then
            echo "🚨 ERROR: Forbidden BREAKING CHANGE pattern detected!"
            echo "This will trigger v2.x.x release which is not allowed."
            echo "Commits with forbidden patterns:"
            git log --grep="BREAKING CHANGE" --grep="BREAKING CHANGES" --grep="BREAKING:" --oneline origin/main..HEAD
            exit 1
          fi

      - name: Verify semantic-release will create v1.x.x
        if: github.ref == 'refs/heads/main'
        run: |
          npm install
          NEXT_VERSION=$(npx semantic-release --dry-run | grep "The next release version is" | cut -d' ' -f6)
          if [[ $NEXT_VERSION == v2.* ]]; then
            echo "🚨 ERROR: Semantic-release will create v2.x.x release!"
            echo "Expected v1.x.x but got: $NEXT_VERSION"
            exit 1
          fi
```

## 📝 Post-Recovery Checklist

### Verification Steps

- [ ] **Git tags cleaned**: No v2.x.x tags exist
- [ ] **GitHub releases removed**: All v2.x.x releases deleted
- [ ] **package.json version**: Set to correct v1.x.x version
- [ ] **CHANGELOG.md clean**: No v2.x.x entries remain
- [ ] **Semantic-release test**: Dry-run shows v1.x.x next version
- [ ] **Main branch clean**: All commits verified safe
- [ ] **Develop branch sync**: If applicable, sync with main

### Prevention Verification

- [ ] **Pre-commit hooks**: Installed and working
- [ ] **GitHub Actions**: Protection workflow active
- [ ] **Team notification**: All developers informed about policy
- [ ] **CLAUDE.md updated**: Policy documented clearly
- [ ] **Commit templates**: Set up for team members

### Documentation Updates

- [ ] **Update CLAUDE.md**: Add prevention policy
- [ ] **Create team guidelines**: Share with all developers
- [ ] **Update CI/CD docs**: Include protection measures
- [ ] **Add to onboarding**: Include in new developer setup

## 🔄 Emergency Contact Procedure

If recovery attempts fail:

1. **Document current state**: Take screenshots, save git log output
2. **Contact project owner**: Immediately notify about the issue
3. **Preserve evidence**: Keep backup branches before any changes
4. **Follow escalation**: Use team communication channels
5. **Document lessons**: Record what went wrong for future prevention

## 📞 Quick Reference Commands

```bash
# Emergency assessment
git tag --list --sort=-version:refname | head -10
gh release list --limit 10
git log --grep="BREAKING" --oneline

# Quick cleanup
gh release delete v2.0.0 --cleanup-tag
git reset --hard [COMMIT_HASH]
git push origin main --force-with-lease

# Verification
npx semantic-release --dry-run
git log --oneline -5
cat package.json | grep version
```

---

**⚠️ Remember: Prevention is better than recovery. Always check commit messages before pushing!**
