#!/bin/bash

# Feature Development Toolkit
# Quick commands for feature management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper function for colored output
print_status() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function: Start new feature
feature_start() {
    local feature_name=$1
    local priority=${2:-medium}
    
    if [[ -z "$feature_name" ]]; then
        print_error "Usage: ./scripts/feature-toolkit.sh start [feature-name] [priority]"
        print_error "Example: ./scripts/feature-toolkit.sh start password-change high"
        exit 1
    fi
    
    print_status "🚀 Starting new feature: $feature_name (priority: $priority)"
    
    # Check if already on develop
    current_branch=$(git branch --show-current)
    if [[ "$current_branch" != "develop" ]]; then
        print_warning "Switching to develop branch first"
        git checkout develop
        git pull origin develop
    fi
    
    # Create feature branch
    print_status "📝 Creating feature branch: feature/$feature_name"
    git checkout -b "feature/$feature_name"
    
    # Create feature documentation directory
    print_status "📁 Creating feature documentation"
    mkdir -p "docs/features/$feature_name"
    
    # Copy templates and customize
    cp docs/features/templates/* "docs/features/$feature_name/"
    
    # Replace placeholders in templates
    display_name=$(echo "$feature_name" | sed 's/-/ /g' | sed 's/\b\w/\U&/g')
    
    # Update FEATURE.md
    sed -i.bak "s/\[Feature Name\]/$display_name/g" "docs/features/$feature_name/FEATURE.md"
    sed -i.bak "s/\[feature-name\]/$feature_name/g" "docs/features/$feature_name/FEATURE.md"
    sed -i.bak "s/Priority: High \/ Medium \/ Low/Priority: $(echo $priority | sed 's/\b\w/\U&/g')/g" "docs/features/$feature_name/FEATURE.md"
    sed -i.bak "s/YYYY-MM-DD/$(date '+%Y-%m-%d')/g" "docs/features/$feature_name/FEATURE.md"
    
    # Update TASKS.md
    sed -i.bak "s/\[Feature Name\]/$display_name/g" "docs/features/$feature_name/TASKS.md"
    
    # Update PROGRESS.md
    sed -i.bak "s/\[Feature Name\]/$display_name/g" "docs/features/$feature_name/PROGRESS.md"
    sed -i.bak "s/\[feature-name\]/$feature_name/g" "docs/features/$feature_name/PROGRESS.md"
    sed -i.bak "s/YYYY-MM-DD HH:MM/$(date '+%Y-%m-%d %H:%M')/g" "docs/features/$feature_name/PROGRESS.md"
    
    # Update API_CONTRACTS.md
    sed -i.bak "s/\[Feature Name\]/$display_name/g" "docs/features/$feature_name/API_CONTRACTS.md"
    
    # Remove backup files
    rm -f "docs/features/$feature_name/"*.bak
    
    # Initial commit
    print_status "💾 Creating initial commit"
    git add "docs/features/$feature_name/"
    git commit -m "feat: initialize $feature_name feature planning

- Create feature documentation structure
- Add requirements template (FEATURE.md)  
- Add task breakdown template (TASKS.md)
- Add progress tracking template (PROGRESS.md)
- Add API contracts template (API_CONTRACTS.md)
- Set priority: $priority

Next steps:
1. Reserve resources in docs/features/RESOURCE_REGISTRY.md
2. Complete requirements in docs/features/$feature_name/FEATURE.md
3. Update docs/features/README.md to add to active features"

    git push -u origin "feature/$feature_name"
    
    print_success "Feature '$feature_name' initialized successfully!"
    echo
    print_status "📋 Next steps:"
    echo "1. Edit docs/features/RESOURCE_REGISTRY.md to reserve resources"
    echo "2. Complete docs/features/$feature_name/FEATURE.md with requirements"  
    echo "3. Update docs/features/README.md to add to active features"
    echo "4. Follow the 5-phase Feature Development Standard"
    echo
    print_status "📖 Documentation created at: docs/features/$feature_name/"
}

# Function: Show feature status
feature_status() {
    local feature_name=$1
    
    if [[ -z "$feature_name" ]]; then
        print_error "Usage: ./scripts/feature-toolkit.sh status [feature-name]"
        print_error "Example: ./scripts/feature-toolkit.sh status password-change"
        exit 1
    fi
    
    if [[ ! -d "docs/features/$feature_name" ]]; then
        print_error "Feature '$feature_name' not found"
        exit 1
    fi
    
    print_status "📊 Feature Status: $feature_name"
    echo "=================================="
    echo
    
    # Show basic info from FEATURE.md
    print_status "📋 Basic Information:"
    grep -A 1 "Status:" "docs/features/$feature_name/FEATURE.md" | head -2
    grep -A 1 "Priority:" "docs/features/$feature_name/FEATURE.md" | head -2
    grep -A 1 "Branch:" "docs/features/$feature_name/FEATURE.md" | head -2
    echo
    
    # Show progress from PROGRESS.md
    if [[ -f "docs/features/$feature_name/PROGRESS.md" ]]; then
        print_status "📊 Progress Overview:"
        grep -A 6 "Progress Overview" "docs/features/$feature_name/PROGRESS.md" 2>/dev/null || echo "No progress data yet"
        echo
        
        print_status "🔄 Current Task:"
        grep -A 5 "## 🔄 In Progress" "docs/features/$feature_name/PROGRESS.md" 2>/dev/null || echo "No current task set"
        echo
        
        print_status "⏳ Next Up:"
        grep -A 8 "## ⏳ Next Up" "docs/features/$feature_name/PROGRESS.md" 2>/dev/null | head -8 || echo "No next tasks defined"
    fi
}

# Function: Update progress
feature_progress() {
    local feature_name=$1
    local task_description=$2
    local percentage=$3
    
    if [[ -z "$feature_name" || -z "$task_description" ]]; then
        print_error "Usage: ./scripts/feature-toolkit.sh progress [feature-name] \"[task-description]\" [percentage]"
        print_error "Example: ./scripts/feature-toolkit.sh progress password-change \"Completed API endpoints\" 75"
        exit 1
    fi
    
    if [[ ! -d "docs/features/$feature_name" ]]; then
        print_error "Feature '$feature_name' not found"
        exit 1
    fi
    
    # Update timestamp
    current_time=$(date '+%Y-%m-%d %H:%M')
    sed -i.bak "s/Last Updated.*:/Last Updated**: $current_time/" "docs/features/$feature_name/PROGRESS.md"
    
    if [[ -n "$percentage" ]]; then
        # Update overall progress percentage if provided
        sed -i.bak "s/Overall Progress.*:/Overall Progress**: $percentage% (updated)/" "docs/features/$feature_name/PROGRESS.md"
    fi
    
    # Add session log entry
    cat >> "docs/features/$feature_name/PROGRESS.md" << EOF

### $current_time - Progress Update
- **Completed**: $task_description
- **Status**: Updated via feature-toolkit
EOF
    
    if [[ -n "$percentage" ]]; then
        echo "- **Progress**: $percentage% complete" >> "docs/features/$feature_name/PROGRESS.md"
    fi
    
    cat >> "docs/features/$feature_name/PROGRESS.md" << EOF
- **Files Modified**: [Add files that were changed]
- **Next**: [Add next immediate task]
EOF
    
    # Remove backup file
    rm -f "docs/features/$feature_name/PROGRESS.md.bak"
    
    print_success "Progress updated for '$feature_name'"
    if [[ -n "$percentage" ]]; then
        print_success "Progress: $percentage%"
    fi
    print_success "Task: $task_description"
    echo
    print_status "📝 Edit docs/features/$feature_name/PROGRESS.md to add more details"
}

# Function: Check conflicts
feature_conflicts() {
    local feature_name=${1:-all}
    
    print_status "🔍 Checking conflicts for: $feature_name"
    echo "========================================="
    echo
    
    print_status "📊 Resource Registry Status:"
    if [[ -f "docs/features/RESOURCE_REGISTRY.md" ]]; then
        echo "Database Resources:"
        grep -A 10 "Database Resources (Reserved)" docs/features/RESOURCE_REGISTRY.md | grep -E "^\|.*\|" | head -5
        echo
        echo "API Endpoints:"
        grep -A 10 "API Endpoints (Reserved)" docs/features/RESOURCE_REGISTRY.md | grep -E "^\|.*\|" | head -5
        echo
        echo "Frontend Routes:"
        grep -A 10 "Frontend Routes (Reserved)" docs/features/RESOURCE_REGISTRY.md | grep -E "^\|.*\|" | head -5
    else
        print_warning "Resource registry not found"
    fi
    echo
    
    print_status "🛣️ API Endpoint Analysis:"
    if [[ -d "apps/api/src/modules" ]]; then
        echo "Current API endpoints:"
        find apps/api/src/modules -name "*.routes.ts" -exec grep -l "fastify\." {} \; 2>/dev/null | head -5 || echo "No route files found"
    fi
    echo
    
    print_status "🎨 Frontend Route Analysis:"
    if [[ -d "apps/web/src/app" ]]; then
        echo "Current frontend routes:"
        find apps/web/src/app -name "*.routes.ts" -o -name "*routing*" 2>/dev/null | head -5 || echo "No route files found"
    fi
}

# Function: Complete feature
feature_complete() {
    local feature_name=$1
    
    if [[ -z "$feature_name" ]]; then
        print_error "Usage: ./scripts/feature-toolkit.sh complete [feature-name]"
        print_error "Example: ./scripts/feature-toolkit.sh complete password-change"
        exit 1
    fi
    
    if [[ ! -d "docs/features/$feature_name" ]]; then
        print_error "Feature '$feature_name' not found"
        exit 1
    fi
    
    print_status "🎯 Pre-completion checklist for: $feature_name"
    echo "=============================================="
    echo
    echo "Please verify the following before marking complete:"
    echo
    echo "📋 Code Quality:"
    echo "  - [ ] All tasks in TASKS.md completed"
    echo "  - [ ] All tests passing (>90% coverage)"
    echo "  - [ ] Linting passes without warnings"
    echo "  - [ ] TypeScript compilation successful"
    echo "  - [ ] No console errors or warnings"
    echo
    echo "📚 Documentation:"
    echo "  - [ ] Feature documentation complete"
    echo "  - [ ] API documentation updated"
    echo "  - [ ] PROGRESS.md shows 100% completion"
    echo
    echo "🔄 Integration:"
    echo "  - [ ] No merge conflicts with develop"
    echo "  - [ ] Database migrations tested"
    echo "  - [ ] Frontend-backend integration working"
    echo "  - [ ] E2E tests passing"
    echo
    read -p "All items checked? (y/n): " ready
    
    if [[ $ready == "y" || $ready == "Y" ]]; then
        current_date=$(date '+%Y-%m-%d')
        
        print_success "Feature '$feature_name' marked as ready for completion!"
        echo
        print_status "🚀 Next steps:"
        echo "1. Update docs/features/README.md:"
        echo "   - Move '$feature_name' from Active to Completed"
        echo "   - Set completion date: $current_date"
        echo
        echo "2. Update docs/features/RESOURCE_REGISTRY.md:"
        echo "   - Remove '$feature_name' resource reservations"
        echo "   - Mark resources as Available"
        echo
        echo "3. Create Pull Request:"
        echo "   - git checkout develop"
        echo "   - git pull origin develop"
        echo "   - git checkout feature/$feature_name"
        echo "   - git rebase develop"
        echo "   - Create PR via GitHub"
        echo
        echo "4. After merge:"
        echo "   - Update CHANGELOG.md"
        echo "   - Delete feature branch"
        echo "   - Archive feature documentation"
        
    else
        print_warning "Feature not ready for completion yet"
        echo
        print_status "💡 Use these commands to check status:"
        echo "  - ./scripts/feature-toolkit.sh status $feature_name"
        echo "  - ./scripts/feature-toolkit.sh conflicts $feature_name"
    fi
}

# Function: Show dashboard
feature_dashboard() {
    print_status "📊 Feature Development Dashboard"
    echo "================================"
    echo "Last Updated: $(date '+%Y-%m-%d %H:%M')"
    echo
    
    if [[ -f "docs/features/README.md" ]]; then
        print_status "🚀 Active Features:"
        grep -A 10 "## 🚀 Active Features" docs/features/README.md | grep -E "^\|" | head -5
        echo
        
        print_status "✅ Recently Completed:"
        grep -A 5 "## ✅ Completed Features" docs/features/README.md | grep -E "^\|" | head -3
        echo
        
        print_status "📈 Resource Utilization:"
        grep -A 5 "### Resource Utilization" docs/features/README.md | grep -E "^-.*:" | head -4
    else
        print_warning "Feature dashboard not found at docs/features/README.md"
    fi
    echo
    
    print_status "🛠️ Available Features:"
    if [[ -d "docs/features" ]]; then
        ls -1 docs/features/ | grep -v README.md | grep -v RESOURCE_REGISTRY.md | grep -v templates | head -5
    fi
}

# Function: Show help
show_help() {
    print_status "🛠️ Feature Development Toolkit"
    echo "==============================="
    echo
    echo "Available commands:"
    echo "  start [name] [priority]     - Initialize new feature"
    echo "  status [name]               - Show feature status"
    echo "  progress [name] [task] [%]  - Update progress"
    echo "  conflicts [name]            - Check for conflicts"
    echo "  complete [name]             - Complete feature checklist"
    echo "  dashboard                   - Show all features overview"
    echo "  help                        - Show this help"
    echo
    echo "Examples:"
    echo "  ./scripts/feature-toolkit.sh start password-change high"
    echo "  ./scripts/feature-toolkit.sh status password-change"
    echo "  ./scripts/feature-toolkit.sh progress password-change \"API done\" 60"
    echo "  ./scripts/feature-toolkit.sh dashboard"
    echo
    echo "📚 Documentation:"
    echo "  - docs/development/feature-development-standard.md"
    echo "  - docs/development/multi-feature-workflow.md"
    echo "  - docs/features/README.md"
}

# Main script logic
case "$1" in
    "start")
        feature_start "$2" "$3"
        ;;
    "status")
        feature_status "$2"
        ;;
    "progress")
        feature_progress "$2" "$3" "$4"
        ;;
    "conflicts")
        feature_conflicts "$2"
        ;;
    "complete")
        feature_complete "$2"
        ;;
    "dashboard")
        feature_dashboard
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo
        show_help
        exit 1
        ;;
esac