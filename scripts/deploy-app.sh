#!/bin/bash

# Deploy specific app to environment
# Usage: ./scripts/deploy-app.sh <environment> <app> [options]
# Example: ./scripts/deploy-app.sh production api --version=v1.2.3

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Default values
ENVIRONMENT=""
APP=""
VERSION="latest"
ROLLBACK=false
SCALE=1

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        staging|production)
            ENVIRONMENT=$1
            shift
            ;;
        api|web|admin)
            APP=$1
            shift
            ;;
        --version=*)
            VERSION="${1#*=}"
            shift
            ;;
        --rollback)
            ROLLBACK=true
            shift
            ;;
        --scale=*)
            SCALE="${1#*=}"
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Validate inputs
if [ -z "$ENVIRONMENT" ] || [ -z "$APP" ]; then
    echo -e "${RED}Usage: $0 <environment> <app> [options]${NC}"
    echo -e "Environments: staging, production"
    echo -e "Apps: api, web, admin"
    echo -e "Options:"
    echo -e "  --version=v1.2.3  Specific version to deploy"
    echo -e "  --rollback        Rollback to previous version"
    echo -e "  --scale=3         Number of replicas"
    exit 1
fi

# Load environment configuration
ENV_FILE=".env.$ENVIRONMENT"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: Environment file $ENV_FILE not found${NC}"
    exit 1
fi

source $ENV_FILE

echo -e "${BLUE}🚀 Deploying $APP to $ENVIRONMENT${NC}"

# Get current version if rolling back
if [ "$ROLLBACK" = true ]; then
    echo -e "${YELLOW}🔄 Getting previous version...${NC}"
    CURRENT_VERSION=$(docker ps --filter "name=${APP}" --format "table {{.Image}}" | tail -n 1 | cut -d: -f2)
    # TODO: Get previous version from deployment history
    VERSION="$CURRENT_VERSION"
    echo -e "${YELLOW}Rolling back to previous version${NC}"
fi

# Health check function
health_check() {
    local app=$1
    local url=$2
    local max_attempts=30
    local attempt=0
    
    echo -e "${YELLOW}🏥 Running health check for $app...${NC}"
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f -s "$url/health" > /dev/null; then
            echo -e "${GREEN}✅ $app is healthy${NC}"
            return 0
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    echo -e "${RED}❌ Health check failed for $app${NC}"
    return 1
}

# Deploy based on app type
case $APP in
    api)
        IMAGE="ghcr.io/$GITHUB_REPOSITORY/api:$VERSION"
        PORT=3333
        HEALTH_URL="http://localhost:$PORT"
        
        # Stop existing container
        docker stop aegisx-$APP-$ENVIRONMENT 2>/dev/null || true
        docker rm aegisx-$APP-$ENVIRONMENT 2>/dev/null || true
        
        # Run new container
        echo -e "${YELLOW}🐳 Starting $APP container...${NC}"
        docker run -d \
            --name aegisx-$APP-$ENVIRONMENT \
            --restart unless-stopped \
            -p $PORT:3333 \
            -e NODE_ENV=$ENVIRONMENT \
            -e DATABASE_URL=$DATABASE_URL \
            -e JWT_SECRET=$JWT_SECRET \
            -e REDIS_URL=$REDIS_URL \
            --network aegisx-network \
            $IMAGE
        
        # Run migrations if needed
        if [ "$ENVIRONMENT" = "production" ]; then
            echo -e "${YELLOW}🗄️ Running database migrations...${NC}"
            docker exec aegisx-$APP-$ENVIRONMENT yarn knex migrate:latest
        fi
        ;;
        
    web|admin)
        IMAGE="ghcr.io/$GITHUB_REPOSITORY/$APP:$VERSION"
        PORT=$([[ "$APP" == "web" ]] && echo "4200" || echo "4201")
        HEALTH_URL="http://localhost:$PORT"
        
        # Stop existing container
        docker stop aegisx-$APP-$ENVIRONMENT 2>/dev/null || true
        docker rm aegisx-$APP-$ENVIRONMENT 2>/dev/null || true
        
        # Run new container
        echo -e "${YELLOW}🐳 Starting $APP container...${NC}"
        docker run -d \
            --name aegisx-$APP-$ENVIRONMENT \
            --restart unless-stopped \
            -p $PORT:80 \
            -e API_URL=$API_URL \
            --network aegisx-network \
            $IMAGE
        ;;
esac

# Wait for health check
if health_check $APP $HEALTH_URL; then
    echo -e "${GREEN}✅ $APP deployed successfully to $ENVIRONMENT${NC}"
    
    # Scale if requested
    if [ $SCALE -gt 1 ]; then
        echo -e "${YELLOW}📈 Scaling $APP to $SCALE replicas...${NC}"
        # TODO: Implement scaling with docker swarm or k8s
    fi
else
    echo -e "${RED}❌ Deployment failed, rolling back...${NC}"
    
    # Rollback logic
    docker stop aegisx-$APP-$ENVIRONMENT 2>/dev/null || true
    docker rm aegisx-$APP-$ENVIRONMENT 2>/dev/null || true
    
    # TODO: Restore previous version
    
    exit 1
fi

# Log deployment
echo -e "${BLUE}📝 Logging deployment...${NC}"
echo "[$(date)] Deployed $APP:$VERSION to $ENVIRONMENT" >> deployments.log

# Send notification
if [ "$ENVIRONMENT" = "production" ]; then
    # TODO: Send Slack/Discord notification
    echo -e "${BLUE}📢 Sending deployment notification...${NC}"
fi

echo -e "${GREEN}🎉 Deployment complete!${NC}"