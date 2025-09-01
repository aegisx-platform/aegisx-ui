#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[RELEASE]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're on the main branch
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    print_error "Release can only be created from the main branch. Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    print_error "Working directory is not clean. Please commit or stash changes first."
    git status --short
    exit 1
fi

# Pull latest changes
print_status "Pulling latest changes from origin/main..."
git pull origin main

# Check if there are any changes since last tag
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
if [ -n "$LAST_TAG" ]; then
    CHANGES=$(git log --oneline $LAST_TAG..HEAD)
    if [ -z "$CHANGES" ]; then
        print_warning "No changes since last release ($LAST_TAG)"
        exit 0
    fi
else
    print_status "No previous tags found. This will be the first release."
fi

# Determine version bump type
echo ""
echo "Select the type of release:"
echo "1) patch (bug fixes)"
echo "2) minor (new features, backward compatible)"
echo "3) major (breaking changes)"
echo -n "Enter choice (1-3): "
read -r VERSION_TYPE

case $VERSION_TYPE in
    1)
        BUMP_TYPE="patch"
        ;;
    2)
        BUMP_TYPE="minor"
        ;;
    3)
        BUMP_TYPE="major"
        ;;
    *)
        print_error "Invalid choice. Please select 1, 2, or 3."
        exit 1
        ;;
esac

print_status "Creating $BUMP_TYPE release..."

# Run tests before release
print_status "Running tests..."
npm run test:ci
if [ $? -ne 0 ]; then
    print_error "Tests failed. Please fix tests before creating a release."
    exit 1
fi

# Run linting
print_status "Running linting..."
npm run lint
if [ $? -ne 0 ]; then
    print_error "Linting failed. Please fix linting errors before creating a release."
    exit 1
fi

# Run security audit
print_status "Running security audit..."
npm run security:audit
if [ $? -ne 0 ]; then
    print_warning "Security audit found vulnerabilities. Consider fixing them before release."
    echo -n "Continue with release? (y/N): "
    read -r CONTINUE
    if [ "$CONTINUE" != "y" ] && [ "$CONTINUE" != "Y" ]; then
        print_status "Release cancelled."
        exit 0
    fi
fi

# Build the project
print_status "Building project..."
npm run build:prod
if [ $? -ne 0 ]; then
    print_error "Build failed. Please fix build errors before creating a release."
    exit 1
fi

# Generate changelog
print_status "Generating changelog..."
./scripts/generate-changelog.sh

# Commit changelog if it was updated
if [ -n "$(git status --porcelain CHANGELOG.md)" ]; then
    git add CHANGELOG.md
    git commit -m "docs: update changelog for release"
fi

# Create version bump and tag
print_status "Bumping version and creating tag..."
npm version $BUMP_TYPE --message "chore: release v%s"

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")
print_success "Created release v$NEW_VERSION"

# Push changes and tags
print_status "Pushing changes and tags to origin..."
git push origin main --tags

print_success "Release v$NEW_VERSION created successfully!"
print_status "GitHub Actions will now build and deploy the Docker images."

echo ""
echo "Next steps:"
echo "1. Monitor the GitHub Actions workflow"
echo "2. Create a GitHub release with release notes"
echo "3. Deploy to staging/production environments"