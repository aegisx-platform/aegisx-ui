#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[SECRETS]${NC} $1"
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

print_header() {
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} AegisX GitHub Secrets Setup${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

# Check if GitHub CLI is installed
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI (gh) is not installed."
        echo "Please install it from: https://cli.github.com/"
        exit 1
    fi
    
    # Check if user is authenticated
    if ! gh auth status &> /dev/null; then
        print_error "Not authenticated with GitHub CLI."
        echo "Please run: gh auth login"
        exit 1
    fi
    
    print_success "GitHub CLI is installed and authenticated"
}

# Generate secure random strings
generate_secret() {
    local length=${1:-32}
    openssl rand -base64 $length | tr -d "=+/" | cut -c1-$length
}

# Function to set GitHub secret
set_github_secret() {
    local secret_name=$1
    local secret_value=$2
    
    if [ -z "$secret_value" ]; then
        print_warning "Skipping empty secret: $secret_name"
        return
    fi
    
    if gh secret set "$secret_name" --body "$secret_value" &> /dev/null; then
        print_success "Set secret: $secret_name"
    else
        print_error "Failed to set secret: $secret_name"
    fi
}

# Main setup function
setup_secrets() {
    print_header
    
    check_gh_cli
    
    echo "This script will set up GitHub secrets for the AegisX platform."
    echo "You will be prompted to provide values for each secret."
    echo "Press Enter to skip optional secrets or to auto-generate secure values."
    echo ""
    
    # Database secrets
    print_status "Setting up database secrets..."
    read -p "PostgreSQL password (or press Enter to generate): " -s POSTGRES_PASSWORD
    echo ""
    if [ -z "$POSTGRES_PASSWORD" ]; then
        POSTGRES_PASSWORD=$(generate_secret 32)
        print_status "Generated secure PostgreSQL password"
    fi
    set_github_secret "POSTGRES_PASSWORD" "$POSTGRES_PASSWORD"
    
    read -p "Redis password (or press Enter to generate): " -s REDIS_PASSWORD
    echo ""
    if [ -z "$REDIS_PASSWORD" ]; then
        REDIS_PASSWORD=$(generate_secret 32)
        print_status "Generated secure Redis password"
    fi
    set_github_secret "REDIS_PASSWORD" "$REDIS_PASSWORD"
    
    # Application secrets
    print_status "Setting up application secrets..."
    read -p "JWT secret (or press Enter to generate): " -s JWT_SECRET
    echo ""
    if [ -z "$JWT_SECRET" ]; then
        JWT_SECRET=$(generate_secret 64)
        print_status "Generated secure JWT secret"
    fi
    set_github_secret "JWT_SECRET" "$JWT_SECRET"
    
    read -p "Session secret (or press Enter to generate): " -s SESSION_SECRET
    echo ""
    if [ -z "$SESSION_SECRET" ]; then
        SESSION_SECRET=$(generate_secret 64)
        print_status "Generated secure session secret"
    fi
    set_github_secret "SESSION_SECRET" "$SESSION_SECRET"
    
    # Email configuration
    print_status "Setting up email configuration..."
    read -p "SMTP username (email address): " SMTP_USER
    if [ -n "$SMTP_USER" ]; then
        set_github_secret "SMTP_USER" "$SMTP_USER"
        
        read -p "SMTP password (app password): " -s SMTP_PASSWORD
        echo ""
        set_github_secret "SMTP_PASSWORD" "$SMTP_PASSWORD"
        
        read -p "SMTP host (default: smtp.gmail.com): " SMTP_HOST
        SMTP_HOST=${SMTP_HOST:-smtp.gmail.com}
        set_github_secret "SMTP_HOST" "$SMTP_HOST"
    fi
    
    # Security scanning
    print_status "Setting up security scanning..."
    read -p "Snyk token (optional, get from snyk.io): " -s SNYK_TOKEN
    echo ""
    if [ -n "$SNYK_TOKEN" ]; then
        set_github_secret "SNYK_TOKEN" "$SNYK_TOKEN"
    fi
    
    # Deployment configuration
    print_status "Setting up deployment configuration..."
    read -p "Staging server hostname: " STAGING_HOST
    if [ -n "$STAGING_HOST" ]; then
        set_github_secret "STAGING_HOST" "$STAGING_HOST"
        
        read -p "Staging SSH username: " STAGING_USER
        set_github_secret "STAGING_USER" "$STAGING_USER"
        
        echo "Please paste your staging SSH private key (press Ctrl+D when done):"
        STAGING_SSH_KEY=$(cat)
        set_github_secret "STAGING_SSH_KEY" "$STAGING_SSH_KEY"
    fi
    
    read -p "Production server hostname: " PRODUCTION_HOST
    if [ -n "$PRODUCTION_HOST" ]; then
        set_github_secret "PRODUCTION_HOST" "$PRODUCTION_HOST"
        
        read -p "Production SSH username: " PRODUCTION_USER
        set_github_secret "PRODUCTION_USER" "$PRODUCTION_USER"
        
        echo "Please paste your production SSH private key (press Ctrl+D when done):"
        PRODUCTION_SSH_KEY=$(cat)
        set_github_secret "PRODUCTION_SSH_KEY" "$PRODUCTION_SSH_KEY"
    fi
    
    # Notification configuration
    print_status "Setting up notifications..."
    read -p "Slack webhook URL (optional): " SLACK_WEBHOOK_URL
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        set_github_secret "SLACK_WEBHOOK_URL" "$SLACK_WEBHOOK_URL"
    fi
    
    echo ""
    print_success "GitHub secrets setup completed!"
    
    echo ""
    echo "Next steps:"
    echo "1. Copy the generated environment file to .env.production"
    echo "2. Update your server configurations with the new passwords"
    echo "3. Test the CI/CD pipeline with a small commit"
    echo "4. Monitor the GitHub Actions for any issues"
    
    # Create environment file with generated secrets
    create_env_file
}

create_env_file() {
    local env_file=".env.generated"
    
    print_status "Creating environment file: $env_file"
    
    cat > "$env_file" << EOF
# Generated Environment Configuration
# Copy these values to your production environment

# Database
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
REDIS_PASSWORD=$REDIS_PASSWORD

# Application
JWT_SECRET=$JWT_SECRET
SESSION_SECRET=$SESSION_SECRET

# Email (if configured)
SMTP_HOST=${SMTP_HOST:-}
SMTP_USER=${SMTP_USER:-}
SMTP_PASSWORD=${SMTP_PASSWORD:-}

# Generated on: $(date)
EOF

    print_success "Environment file created: $env_file"
    print_warning "Keep this file secure and delete it after copying the values!"
}

# Run the setup
setup_secrets