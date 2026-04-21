#!/bin/bash

# Sync libs/aegisx-ui to separate repository + create version tag
# Usage: ./sync-to-repo.sh [branch]
#
# What this does:
#   1. git subtree push → pushes libs/aegisx-ui as its own branch to
#      github.com/aegisx-platform/aegisx-ui
#   2. Reads the current libs/aegisx-ui/package.json version (e.g. 0.5.1)
#      and creates a matching v<version> tag on the pushed HEAD commit via
#      the GitHub API (gh CLI), unless that tag already exists.
#   3. Skips tag creation if `gh` is not installed / not authenticated.

set -e

BRANCH=${1:-main}
REMOTE_REPO="git@github.com:aegisx-platform/aegisx-ui.git"
REMOTE_SLUG="aegisx-platform/aegisx-ui"

echo "Syncing @aegisx/ui to separate repository..."
echo "Branch: $BRANCH"
echo "Remote: $REMOTE_REPO"
echo ""

# Navigate to project root
cd "$(git rev-parse --show-toplevel)"

# ── Push subtree ────────────────────────────────────────────────────────
echo "Pushing subtree..."
git subtree push --prefix=libs/aegisx-ui "$REMOTE_REPO" "$BRANCH"

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Failed to sync"
  exit 1
fi

echo ""
echo "✅ Successfully synced to $REMOTE_REPO"
echo "View at: https://github.com/$REMOTE_SLUG"

# ── Auto-tag with current version ───────────────────────────────────────
VERSION=$(node -p "require('./libs/aegisx-ui/package.json').version" 2>/dev/null || echo "")

if [ -z "$VERSION" ]; then
  echo ""
  echo "⚠️  Could not read version from package.json — skipping tag creation"
  exit 0
fi

TAG="v$VERSION"

if ! command -v gh >/dev/null 2>&1; then
  echo ""
  echo "⚠️  'gh' CLI not installed — skipping tag $TAG"
  echo "    Create manually: gh api repos/$REMOTE_SLUG/git/refs \\"
  echo "      -f ref=refs/tags/$TAG -f sha=<commit-sha>"
  exit 0
fi

echo ""
echo "🏷️  Checking tag $TAG on $REMOTE_SLUG..."

if gh api "repos/$REMOTE_SLUG/git/refs/tags/$TAG" >/dev/null 2>&1; then
  echo "   Tag $TAG already exists — skipping"
  exit 0
fi

# Latest commit on remote branch = the commit we just pushed
HEAD_SHA=$(gh api "repos/$REMOTE_SLUG/commits/$BRANCH" --jq '.sha' 2>/dev/null)

if [ -z "$HEAD_SHA" ]; then
  echo "   ❌ Could not resolve HEAD sha on remote $BRANCH — skipping tag"
  exit 0
fi

echo "   Creating $TAG → ${HEAD_SHA:0:10}..."
gh api "repos/$REMOTE_SLUG/git/refs" \
  -f ref="refs/tags/$TAG" \
  -f sha="$HEAD_SHA" >/dev/null && \
  echo "   ✅ Tag $TAG created" || \
  echo "   ⚠️  Failed to create tag (may already exist)"

echo ""
echo "💡 Next: create a GitHub release with changelog:"
echo "   gh release create $TAG --repo $REMOTE_SLUG --title \"$TAG\" --notes-file CHANGELOG.md"
