#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[CHANGELOG]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Get the current version
CURRENT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "0.0.0")
CHANGELOG_FILE="CHANGELOG.md"

# Get the last tag or use initial commit if no tags exist
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)

# Generate changelog header if file doesn't exist
if [ ! -f "$CHANGELOG_FILE" ]; then
    print_status "Creating new changelog file..."
    cat > "$CHANGELOG_FILE" << EOF
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

EOF
fi

# Function to extract commit type and description
parse_conventional_commit() {
    local commit_msg="$1"
    local commit_type=""
    local commit_scope=""
    local commit_description=""
    local is_breaking=false
    
    # Check for breaking changes
    if echo "$commit_msg" | grep -q "BREAKING CHANGE\|!:"; then
        is_breaking=true
    fi
    
    # Extract conventional commit format: type(scope): description
    if echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|perf|test|chore|build|ci)(\(.+\))?\!?:"; then
        commit_type=$(echo "$commit_msg" | sed -E 's/^([^(!:]+)(\(.+\))?\!?:.*/\1/')
        commit_scope=$(echo "$commit_msg" | sed -E 's/^[^(]*\(([^)]+)\).*/\1/' | grep -v ":" || echo "")
        commit_description=$(echo "$commit_msg" | sed -E 's/^[^:]+:\s*//')
    else
        # Fallback for non-conventional commits
        commit_type="other"
        commit_description="$commit_msg"
    fi
    
    echo "$commit_type|$commit_scope|$commit_description|$is_breaking"
}

# Get commits since last tag/release
if [ "$LAST_TAG" = "$(git rev-list --max-parents=0 HEAD)" ]; then
    # First release - get all commits
    COMMITS=$(git log --pretty=format:"%H|%s" --reverse)
    print_status "Generating changelog for initial release..."
else
    # Get commits since last tag
    COMMITS=$(git log --pretty=format:"%H|%s" ${LAST_TAG}..HEAD --reverse)
    print_status "Generating changelog since $LAST_TAG..."
fi

if [ -z "$COMMITS" ]; then
    print_status "No new commits found."
    exit 0
fi

# Prepare changelog sections
BREAKING_CHANGES=""
FEATURES=""
FIXES=""
PERFORMANCE=""
DOCUMENTATION=""
TESTS=""
CHORES=""
OTHER_CHANGES=""

# Process each commit
while IFS='|' read -r commit_hash commit_subject; do
    if [ -n "$commit_subject" ]; then
        # Parse the commit
        PARSED=$(parse_conventional_commit "$commit_subject")
        IFS='|' read -r type scope description breaking <<< "$PARSED"
        
        # Format the changelog entry
        if [ -n "$scope" ]; then
            ENTRY="- **${scope}**: ${description} ([${commit_hash:0:7}](../../commit/${commit_hash}))"
        else
            ENTRY="- ${description} ([${commit_hash:0:7}](../../commit/${commit_hash}))"
        fi
        
        # Categorize the change
        if [ "$breaking" = "true" ]; then
            BREAKING_CHANGES="$BREAKING_CHANGES$ENTRY\n"
        fi
        
        case "$type" in
            feat)
                FEATURES="$FEATURES$ENTRY\n"
                ;;
            fix)
                FIXES="$FIXES$ENTRY\n"
                ;;
            perf)
                PERFORMANCE="$PERFORMANCE$ENTRY\n"
                ;;
            docs)
                DOCUMENTATION="$DOCUMENTATION$ENTRY\n"
                ;;
            test)
                TESTS="$TESTS$ENTRY\n"
                ;;
            chore|build|ci)
                CHORES="$CHORES$ENTRY\n"
                ;;
            *)
                OTHER_CHANGES="$OTHER_CHANGES$ENTRY\n"
                ;;
        esac
    fi
done <<< "$COMMITS"

# Generate the new changelog entry
NEW_ENTRY="## [${CURRENT_VERSION}] - $(date +%Y-%m-%d)\n\n"

if [ -n "$BREAKING_CHANGES" ]; then
    NEW_ENTRY="$NEW_ENTRY### ⚠ BREAKING CHANGES\n\n$BREAKING_CHANGES\n"
fi

if [ -n "$FEATURES" ]; then
    NEW_ENTRY="$NEW_ENTRY### ✨ Features\n\n$FEATURES\n"
fi

if [ -n "$FIXES" ]; then
    NEW_ENTRY="$NEW_ENTRY### 🐛 Bug Fixes\n\n$FIXES\n"
fi

if [ -n "$PERFORMANCE" ]; then
    NEW_ENTRY="$NEW_ENTRY### ⚡ Performance Improvements\n\n$PERFORMANCE\n"
fi

if [ -n "$DOCUMENTATION" ]; then
    NEW_ENTRY="$NEW_ENTRY### 📚 Documentation\n\n$DOCUMENTATION\n"
fi

if [ -n "$TESTS" ]; then
    NEW_ENTRY="$NEW_ENTRY### 🧪 Tests\n\n$TESTS\n"
fi

if [ -n "$CHORES" ]; then
    NEW_ENTRY="$NEW_ENTRY### 🏗️ Build System & CI/CD\n\n$CHORES\n"
fi

if [ -n "$OTHER_CHANGES" ]; then
    NEW_ENTRY="$NEW_ENTRY### 🔧 Other Changes\n\n$OTHER_CHANGES\n"
fi

# Create a temporary file with the new content
TEMP_FILE=$(mktemp)

# Write the header
head -n 6 "$CHANGELOG_FILE" > "$TEMP_FILE"

# Add the new entry
echo -e "$NEW_ENTRY" >> "$TEMP_FILE"

# Add the rest of the existing content (skip the header)
tail -n +7 "$CHANGELOG_FILE" >> "$TEMP_FILE" 2>/dev/null || true

# Replace the original file
mv "$TEMP_FILE" "$CHANGELOG_FILE"

print_success "Changelog updated successfully!"
print_status "Added changelog entry for version $CURRENT_VERSION"