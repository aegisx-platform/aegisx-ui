#!/bin/bash

# Build and push specific app to container registry
# Usage: ./scripts/build-push.sh <app> <version>
# Example: ./scripts/build-push.sh api v1.2.3

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
REGISTRY="ghcr.io"
NAMESPACE="${GITHUB_REPOSITORY:-aegisx-platform/aegisx-starter}"

# Check arguments
if [ $# -lt 2 ]; then
    echo -e "${RED}Usage: $0 <app> <version>${NC}"
    echo -e "Apps: api, web, admin"
    echo -e "Example: $0 api v1.2.3"
    exit 1
fi

APP=$1
VERSION=$2

# Validate app name
if [[ ! "$APP" =~ ^(api|web|admin)$ ]]; then
    echo -e "${RED}Error: Invalid app name '$APP'${NC}"
    echo -e "Valid apps: api, web, admin"
    exit 1
fi

# Validate version format
if [[ ! "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}Error: Invalid version format '$VERSION'${NC}"
    echo -e "Version should be in format: v1.2.3"
    exit 1
fi

echo -e "${BLUE}🚀 Building and pushing $APP:$VERSION${NC}"

# Build the app
echo -e "${YELLOW}📦 Building $APP...${NC}"
yarn nx build $APP --prod

# Check if build was successful
if [ ! -d "dist/apps/$APP" ]; then
    echo -e "${RED}Error: Build failed for $APP${NC}"
    exit 1
fi

# Build Docker image
IMAGE_NAME="$REGISTRY/$NAMESPACE/$APP"
echo -e "${YELLOW}🐳 Building Docker image: $IMAGE_NAME:$VERSION${NC}"

docker build \
    -f apps/$APP/Dockerfile \
    -t $IMAGE_NAME:$VERSION \
    -t $IMAGE_NAME:latest \
    --build-arg VERSION=$VERSION \
    --build-arg BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
    --build-arg VCS_REF=$(git rev-parse --short HEAD) \
    .

# Login to GitHub Container Registry
echo -e "${YELLOW}🔐 Logging in to $REGISTRY...${NC}"
echo $GITHUB_TOKEN | docker login $REGISTRY -u $GITHUB_ACTOR --password-stdin

# Push images
echo -e "${YELLOW}📤 Pushing images...${NC}"
docker push $IMAGE_NAME:$VERSION
docker push $IMAGE_NAME:latest

# Tag and push additional tags based on branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" = "main" ]; then
    docker tag $IMAGE_NAME:$VERSION $IMAGE_NAME:production
    docker push $IMAGE_NAME:production
elif [ "$BRANCH" = "develop" ]; then
    docker tag $IMAGE_NAME:$VERSION $IMAGE_NAME:staging
    docker push $IMAGE_NAME:staging
fi

# Push commit SHA tag for tracking
COMMIT_SHA=$(git rev-parse --short HEAD)
docker tag $IMAGE_NAME:$VERSION $IMAGE_NAME:$COMMIT_SHA
docker push $IMAGE_NAME:$COMMIT_SHA

echo -e "${GREEN}✅ Successfully built and pushed $APP:$VERSION${NC}"
echo -e "${GREEN}Images pushed:${NC}"
echo -e "  - $IMAGE_NAME:$VERSION"
echo -e "  - $IMAGE_NAME:latest"
echo -e "  - $IMAGE_NAME:$COMMIT_SHA"
[ "$BRANCH" = "main" ] && echo -e "  - $IMAGE_NAME:production"
[ "$BRANCH" = "develop" ] && echo -e "  - $IMAGE_NAME:staging"

# Output for CI/CD
echo "::set-output name=image::$IMAGE_NAME:$VERSION"
echo "::set-output name=image-latest::$IMAGE_NAME:latest"