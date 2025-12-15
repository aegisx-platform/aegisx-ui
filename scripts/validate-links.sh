#!/usr/bin/env bash

###############################################################################
# Link Validation Script
#
# Validates all internal markdown links in documentation
# Detects broken links, generates health report, suggests corrections
#
# Usage:
#   ./scripts/validate-links.sh                    # Check all docs
#   ./scripts/validate-links.sh --dir docs/guides  # Check specific directory
#   ./scripts/validate-links.sh --report           # Generate detailed report
###############################################################################

set -e
set -u

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DOCS_DIR="${PROJECT_ROOT}/docs"
REPORT_FILE="$PROJECT_ROOT/.spec-workflow/specs/docs-restructure/link-validation-$(date +%Y%m%d-%H%M%S).md"

# Options
CHECK_DIR="$DOCS_DIR"
GENERATE_REPORT=false
VERBOSE=false
CHECK_EXTERNAL=false

# Counters
TOTAL_LINKS=0
VALID_LINKS=0
BROKEN_LINKS=0
EXTERNAL_LINKS=0
TOTAL_FILES=0

# Arrays
declare -a BROKEN_LINK_LIST
declare -a EXTERNAL_LINK_LIST

###############################################################################
# Helper Functions
###############################################################################

print_usage() {
    cat << EOF
Link Validation Script

Usage: $0 [OPTIONS]

Options:
    --dir DIR           Check specific directory (default: docs/)
    --report            Generate detailed markdown report
    --external          Also check external links (slower)
    --verbose, -v       Show all links checked
    --help, -h          Show this help message

Examples:
    # Validate all documentation links
    $0

    # Check specific directory
    $0 --dir docs/guides

    # Generate detailed report
    $0 --report

    # Check external links too (slow)
    $0 --external
EOF
}

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

is_external_link() {
    local link="$1"
    [[ "$link" =~ ^https?:// ]] || [[ "$link" =~ ^mailto: ]]
}

is_anchor_only() {
    local link="$1"
    [[ "$link" =~ ^# ]]
}

resolve_link_path() {
    local source_file="$1"
    local link="$2"

    # Get directory of source file
    local source_dir="$(dirname "$source_file")"

    # Resolve relative path
    local resolved=""
    if [[ "$link" == /* ]]; then
        # Absolute path from docs root
        resolved="${DOCS_DIR}${link}"
    else
        # Relative path
        resolved="${source_dir}/${link}"
    fi

    # Normalize path (remove ../ and ./)
    resolved="$(cd "$(dirname "$resolved")" 2>/dev/null && pwd)/$(basename "$resolved")" || echo "$resolved"

    # Remove anchor
    resolved="${resolved%%#*}"

    echo "$resolved"
}

check_internal_link() {
    local source_file="$1"
    local link="$2"
    local line_num="$3"

    ((TOTAL_LINKS++))

    # Extract just the file path (remove anchor)
    local file_path="${link%%#*}"
    local anchor="${link#*#}"

    # Resolve to absolute path
    local target_file=$(resolve_link_path "$source_file" "$file_path")

    # Check if target file exists
    if [[ -f "$target_file" ]]; then
        ((VALID_LINKS++))
        [[ "$VERBOSE" == true ]] && log_success "Valid: $link (in ${source_file#$PROJECT_ROOT/}:$line_num)"
        return 0
    else
        ((BROKEN_LINKS++))
        log_error "Broken: $link"
        log_error "  Source: ${source_file#$PROJECT_ROOT/}:$line_num"
        log_error "  Target: ${target_file#$PROJECT_ROOT/} (not found)"

        BROKEN_LINK_LIST+=("${source_file#$PROJECT_ROOT/}:$line_num | $link | Target not found: ${target_file#$PROJECT_ROOT/}")
        return 1
    fi
}

check_external_link() {
    local link="$1"
    local source_file="$2"
    local line_num="$3"

    ((EXTERNAL_LINKS++))

    if [[ "$CHECK_EXTERNAL" == true ]]; then
        # Try to fetch URL (HEAD request)
        if curl -s --head --request GET "$link" | head -n 1 | grep "HTTP/[12].[01] [23].." > /dev/null; then
            [[ "$VERBOSE" == true ]] && log_success "External OK: $link"
        else
            log_warning "External may be broken: $link"
            log_warning "  Source: ${source_file#$PROJECT_ROOT/}:$line_num"
            EXTERNAL_LINK_LIST+=("${source_file#$PROJECT_ROOT/}:$line_num | $link | HTTP check failed")
        fi
    fi
}

extract_links_from_file() {
    local file="$1"

    # Extract markdown links: [text](link)
    # Also extract: <link>
    while IFS=: read -r line_num match; do
        # Parse the match
        if [[ "$match" =~ ^\[.*\]\((.*)\)$ ]]; then
            # Standard markdown link
            local link="${BASH_REMATCH[1]}"
        elif [[ "$match" =~ ^\<(.*)\>$ ]]; then
            # Angle bracket link
            local link="${BASH_REMATCH[1]}"
        else
            continue
        fi

        # Skip empty links
        [[ -z "$link" ]] && continue

        # Skip mailto links
        [[ "$link" =~ ^mailto: ]] && continue

        # Check link type
        if is_anchor_only "$link"; then
            # Anchor-only link (skip for now)
            continue
        elif is_external_link "$link"; then
            check_external_link "$link" "$file" "$line_num"
        else
            check_internal_link "$file" "$link" "$line_num"
        fi
    done < <(grep -n -oE '\[([^\]]+)\]\(([^)]+)\)|<(https?://[^>]+)>' "$file" 2>/dev/null)
}

process_directory() {
    local dir="$1"

    log_info "Scanning for markdown files in: ${dir#$PROJECT_ROOT/}"

    # Find all markdown files (use process substitution to avoid subshell)
    while IFS= read -r file; do
        ((TOTAL_FILES++))
        [[ "$VERBOSE" == true ]] && log_info "Checking: ${file#$PROJECT_ROOT/}"
        extract_links_from_file "$file"
    done < <(find "$dir" -name "*.md" -type f)
}

generate_report() {
    log_info "Generating report: ${REPORT_FILE#$PROJECT_ROOT/}"

    cat > "$REPORT_FILE" << EOF
# Link Validation Report

**Generated:** $(date '+%Y-%m-%d %H:%M:%S')
**Directory:** ${CHECK_DIR#$PROJECT_ROOT/}

## Summary

| Metric | Count |
|--------|-------|
| Total Files Scanned | $TOTAL_FILES |
| Total Links Found | $TOTAL_LINKS |
| Valid Links | $VALID_LINKS |
| Broken Links | $BROKEN_LINKS |
| External Links | $EXTERNAL_LINKS |

## Health Score

\`\`\`
$([ $TOTAL_LINKS -gt 0 ] && echo "$(( VALID_LINKS * 100 / TOTAL_LINKS ))%" || echo "N/A") of links are valid
\`\`\`

EOF

    # Add broken links section
    if [[ $BROKEN_LINKS -gt 0 ]]; then
        cat >> "$REPORT_FILE" << EOF
## ❌ Broken Links ($BROKEN_LINKS)

| Source | Link | Issue |
|--------|------|-------|
EOF
        for entry in "${BROKEN_LINK_LIST[@]}"; do
            echo "| $(echo "$entry" | sed 's/ | / | /g') |" >> "$REPORT_FILE"
        done
        echo "" >> "$REPORT_FILE"
    fi

    # Add external links section
    if [[ "$CHECK_EXTERNAL" == true ]] && [[ ${#EXTERNAL_LINK_LIST[@]} -gt 0 ]]; then
        cat >> "$REPORT_FILE" << EOF
## ⚠️ External Link Issues (${#EXTERNAL_LINK_LIST[@]})

| Source | Link | Issue |
|--------|------|-------|
EOF
        for entry in "${EXTERNAL_LINK_LIST[@]}"; do
            echo "| $(echo "$entry" | sed 's/ | / | /g') |" >> "$REPORT_FILE"
        done
        echo "" >> "$REPORT_FILE"
    fi

    # Add recommendations
    cat >> "$REPORT_FILE" << EOF
## Recommendations

### Fixing Broken Links

1. Update relative paths after file migration
2. Use absolute paths from docs/ root: \`/guides/file.md\`
3. Verify target files exist before linking

### Link Best Practices

- **Prefer relative links** for internal documentation
- **Use absolute paths from docs/ root** for cross-section links
- **Test links** after restructuring
- **Run validation** before committing documentation changes

## Next Steps

\`\`\`bash
# Fix broken links
# Review this report and update source files

# Re-validate
./scripts/validate-links.sh

# Check specific directory
./scripts/validate-links.sh --dir docs/guides
\`\`\`
EOF

    log_success "Report generated: $REPORT_FILE"
}

print_summary() {
    echo ""
    echo "========================================="
    echo "      Link Validation Summary"
    echo "========================================="
    echo "Files scanned:         $TOTAL_FILES"
    echo "Total links found:     $TOTAL_LINKS"
    echo "Valid links:           $VALID_LINKS"
    echo "Broken links:          $BROKEN_LINKS"
    echo "External links:        $EXTERNAL_LINKS"
    echo "========================================="

    if [[ $TOTAL_LINKS -gt 0 ]]; then
        local health_pct=$(( VALID_LINKS * 100 / TOTAL_LINKS ))
        echo ""
        if [[ $health_pct -eq 100 ]]; then
            echo -e "${GREEN}✓ Link health: ${health_pct}% (Perfect!)${NC}"
        elif [[ $health_pct -ge 90 ]]; then
            echo -e "${GREEN}Link health: ${health_pct}% (Good)${NC}"
        elif [[ $health_pct -ge 70 ]]; then
            echo -e "${YELLOW}Link health: ${health_pct}% (Needs attention)${NC}"
        else
            echo -e "${RED}Link health: ${health_pct}% (Critical)${NC}"
        fi
    fi

    echo ""
    if [[ $BROKEN_LINKS -eq 0 ]]; then
        log_success "All links are valid!"
    else
        log_error "$BROKEN_LINKS broken links found"
        echo "Review issues above and fix source files"
    fi

    if [[ "$GENERATE_REPORT" == true ]]; then
        echo ""
        echo "Detailed report: $REPORT_FILE"
    fi
}

###############################################################################
# Main Execution
###############################################################################

main() {
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dir)
                CHECK_DIR="$2"
                shift 2
                ;;
            --report)
                GENERATE_REPORT=true
                shift
                ;;
            --external)
                CHECK_EXTERNAL=true
                shift
                ;;
            --verbose|-v)
                VERBOSE=true
                shift
                ;;
            --help|-h)
                print_usage
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                print_usage
                exit 1
                ;;
        esac
    done

    echo "========================================="
    echo "     Link Validation Script"
    echo "========================================="
    echo "Directory: ${CHECK_DIR#$PROJECT_ROOT/}"
    echo "External check: $([ "$CHECK_EXTERNAL" == true ] && echo "Enabled" || echo "Disabled")"
    echo "========================================="
    echo ""

    # Validate directory exists
    if [[ ! -d "$CHECK_DIR" ]]; then
        log_error "Directory not found: $CHECK_DIR"
        exit 1
    fi

    # Process files
    process_directory "$CHECK_DIR"

    # Generate report if requested
    if [[ "$GENERATE_REPORT" == true ]]; then
        generate_report
    fi

    # Print summary
    print_summary

    # Exit with error if broken links found
    [[ $BROKEN_LINKS -gt 0 ]] && exit 1 || exit 0
}

main "$@"
