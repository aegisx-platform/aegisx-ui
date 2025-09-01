#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[DEPLOY]${NC} $1"
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

# Function to show usage
usage() {
    echo "Usage: $0 [environment] [options]"
    echo ""
    echo "Environments:"
    echo "  staging     Deploy to staging environment"
    echo "  production  Deploy to production environment"
    echo "  local       Deploy locally for testing"
    echo ""
    echo "Options:"
    echo "  --build     Force rebuild of Docker images"
    echo "  --migrate   Run database migrations"
    echo "  --seed      Run database seeds"
    echo "  --rollback  Rollback to previous version"
    echo "  --help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 staging --build --migrate"
    echo "  $0 production --rollback"
    echo "  $0 local --build --seed"
}

# Default values
ENVIRONMENT=""
FORCE_BUILD=false
RUN_MIGRATIONS=false
RUN_SEEDS=false
ROLLBACK=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        staging|production|local)
            ENVIRONMENT="$1"
            shift
            ;;
        --build)
            FORCE_BUILD=true
            shift
            ;;
        --migrate)
            RUN_MIGRATIONS=true
            shift
            ;;
        --seed)
            RUN_SEEDS=true
            shift
            ;;
        --rollback)
            ROLLBACK=true
            shift
            ;;
        --help)
            usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Validate environment
if [ -z "$ENVIRONMENT" ]; then
    print_error "Environment must be specified"
    usage
    exit 1
fi

# Set environment-specific variables
case $ENVIRONMENT in
    staging)
        COMPOSE_FILE="docker-compose.yml -f docker-compose.staging.yml"
        ENV_FILE=".env.staging"
        ;;
    production)
        COMPOSE_FILE="docker-compose.prod.yml"
        ENV_FILE=".env.production"
        ;;
    local)
        COMPOSE_FILE="docker-compose.yml"
        ENV_FILE=".env"
        ;;
esac

print_status "Deploying to $ENVIRONMENT environment..."

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
    print_warning "Environment file $ENV_FILE not found. Using defaults."
fi

# Function to check service health
check_service_health() {
    local service=$1
    local max_attempts=30
    local attempt=1
    
    print_status "Checking health of $service..."
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose -f $COMPOSE_FILE ps $service | grep -q "healthy\|Up"; then
            print_success "$service is healthy"
            return 0
        fi
        
        print_status "Waiting for $service to be healthy (attempt $attempt/$max_attempts)..."
        sleep 10
        attempt=$((attempt + 1))
    done
    
    print_error "$service failed to become healthy"
    return 1
}

# Function to rollback deployment
rollback_deployment() {
    print_status "Rolling back deployment..."
    
    # Stop current containers
    docker-compose -f $COMPOSE_FILE down
    
    # Pull and deploy previous images
    if [ "$ENVIRONMENT" = "production" ]; then
        # In production, you might want to specify a specific tag
        print_status "Rolling back to previous production images..."
        # docker-compose -f $COMPOSE_FILE pull --ignore-pull-failures
    fi
    
    # Start services
    docker-compose -f $COMPOSE_FILE up -d
    
    print_success "Rollback completed"
}

# Main deployment logic
if [ "$ROLLBACK" = true ]; then
    rollback_deployment
    exit 0
fi

# Build images if requested or if they don't exist
if [ "$FORCE_BUILD" = true ]; then
    print_status "Building Docker images..."
    docker-compose -f $COMPOSE_FILE build --no-cache
elif [ "$ENVIRONMENT" = "local" ]; then
    print_status "Building Docker images for local deployment..."
    docker-compose -f $COMPOSE_FILE build
fi

# Start infrastructure services first
print_status "Starting infrastructure services..."
docker-compose -f $COMPOSE_FILE up -d postgres redis

# Wait for database to be ready
check_service_health "postgres"
check_service_health "redis"

# Run migrations if requested
if [ "$RUN_MIGRATIONS" = true ]; then
    print_status "Running database migrations..."
    if [ -f "$ENV_FILE" ]; then
        export $(cat $ENV_FILE | grep -v '^#' | xargs)
    fi
    yarn db:migrate
fi

# Run seeds if requested
if [ "$RUN_SEEDS" = true ]; then
    print_status "Running database seeds..."
    if [ -f "$ENV_FILE" ]; then
        export $(cat $ENV_FILE | grep -v '^#' | xargs)
    fi
    yarn db:seed
fi

# Start application services
print_status "Starting application services..."
docker-compose -f $COMPOSE_FILE up -d

# Check health of all services
services=("api" "web" "admin")
for service in "${services[@]}"; do
    if docker-compose -f $COMPOSE_FILE ps | grep -q $service; then
        check_service_health $service
    fi
done

# Display deployment summary
print_success "Deployment to $ENVIRONMENT completed successfully!"

print_status "Service URLs:"
case $ENVIRONMENT in
    staging)
        echo "  API:   http://localhost:3001"
        echo "  Web:   http://localhost:3002"
        echo "  Admin: http://localhost:3003"
        ;;
    production)
        echo "  API:   http://localhost:3000"
        echo "  Web:   http://localhost:80"
        echo "  Admin: http://localhost:8080"
        ;;
    local)
        echo "  API:   http://localhost:3000"
        echo "  Web:   http://localhost:4200"
        echo "  Admin: http://localhost:4201"
        ;;
esac

print_status "Use 'docker-compose -f $COMPOSE_FILE logs -f' to view logs"
print_status "Use 'docker-compose -f $COMPOSE_FILE ps' to check service status"