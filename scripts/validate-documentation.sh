#!/bin/bash

# Documentation Validation Script
# Validates all documentation links, code examples, and alignment with codebase

set -e

PROJECT_ROOT="/Users/sathitseethaphon/projects/aegisx-platform/aegisx-starter-1"
REPORT_FILE="$PROJECT_ROOT/docs-validation-report.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Documentation Validation Report"
echo "=========================================="
echo ""

# Initialize report
cat > "$REPORT_FILE" << EOF
# Documentation Validation Report
Generated: $(date)

## Summary

EOF

# Counter variables
TOTAL_DOCS=0
TOTAL_LINKS=0
BROKEN_LINKS=0
TOTAL_CODE_EXAMPLES=0
SYNTAX_ERRORS=0

# 1. Link Validation
echo "## 1. Link Validation"
echo ""

echo "Checking internal links in all markdown files..."
echo ""

# Find all markdown files
DOCS_FILES=$(find "$PROJECT_ROOT/docs" -name "*.md" 2>/dev/null)
UI_DOCS_FILES=$(find "$PROJECT_ROOT/libs/aegisx-ui/docs" -name "*.md" 2>/dev/null)
ALL_FILES="$DOCS_FILES $UI_DOCS_FILES"

TOTAL_DOCS=$(echo "$ALL_FILES" | wc -w | tr -d ' ')

echo "Total documentation files: $TOTAL_DOCS"
echo ""

# Create temporary file for markdown-link-check results
LINK_CHECK_RESULTS="$PROJECT_ROOT/link-check-results.txt"
> "$LINK_CHECK_RESULTS"

# Check links in each file
for file in $ALL_FILES; do
    if [ -f "$file" ]; then
        echo "Checking: $file"
        # Run markdown-link-check with config to only check internal links
        npx markdown-link-check "$file" --quiet 2>&1 | tee -a "$LINK_CHECK_RESULTS" || true
    fi
done

# Count broken links
BROKEN_LINKS=$(grep -c "✖" "$LINK_CHECK_RESULTS" || echo "0")
TOTAL_LINKS=$(grep -c "\[" "$LINK_CHECK_RESULTS" || echo "0")

echo ""
echo -e "${GREEN}Total links checked: $TOTAL_LINKS${NC}"
if [ "$BROKEN_LINKS" -gt 0 ]; then
    echo -e "${RED}Broken links found: $BROKEN_LINKS${NC}"
else
    echo -e "${GREEN}Broken links found: 0${NC}"
fi
echo ""

# 2. Code Example Validation
echo "## 2. Code Example Validation"
echo ""

# Extract TypeScript code blocks and validate syntax
TEMP_TS_DIR="$PROJECT_ROOT/.temp-ts-validation"
mkdir -p "$TEMP_TS_DIR"

echo "Extracting and validating TypeScript code examples..."
TOTAL_CODE_EXAMPLES=0
SYNTAX_ERRORS=0

for file in $ALL_FILES; do
    if [ -f "$file" ]; then
        # Extract TypeScript code blocks
        awk '/```typescript|```ts/{flag=1;count++;next}/```/{flag=0}flag' "$file" > "$TEMP_TS_DIR/$(basename "$file").ts" 2>/dev/null || true

        if [ -s "$TEMP_TS_DIR/$(basename "$file").ts" ]; then
            TOTAL_CODE_EXAMPLES=$((TOTAL_CODE_EXAMPLES + 1))

            # Try to compile the TypeScript code
            if ! npx tsc --noEmit --skipLibCheck "$TEMP_TS_DIR/$(basename "$file").ts" 2>/dev/null; then
                SYNTAX_ERRORS=$((SYNTAX_ERRORS + 1))
                echo "  - Syntax error in: $file"
            fi
        fi
    fi
done

# Clean up temp directory
rm -rf "$TEMP_TS_DIR"

echo ""
echo -e "${GREEN}Total code examples: $TOTAL_CODE_EXAMPLES${NC}"
if [ "$SYNTAX_ERRORS" -gt 0 ]; then
    echo -e "${YELLOW}Code examples with potential issues: $SYNTAX_ERRORS${NC}"
else
    echo -e "${GREEN}Code examples with syntax errors: 0${NC}"
fi
echo ""

# 3. Alignment Verification
echo "## 3. Alignment Verification"
echo ""

# Count documented files vs actual implementation
DOCUMENTED_COMPONENTS=$(grep -r "ax-" "$PROJECT_ROOT/libs/aegisx-ui/docs/components" 2>/dev/null | grep -E "^#|selector:" | wc -l || echo "0")
ACTUAL_COMPONENTS=$(find "$PROJECT_ROOT/libs/aegisx-ui/src/lib/components" -name "*.component.ts" 2>/dev/null | wc -l || echo "0")

DOCUMENTED_ENDPOINTS=$(grep -r "GET\|POST\|PUT\|DELETE\|PATCH" "$PROJECT_ROOT/docs" 2>/dev/null | grep -i "endpoint\|route\|api" | wc -l || echo "0")
ACTUAL_ENDPOINTS=$(find "$PROJECT_ROOT/apps/api/src" -name "*.routes.ts" -o -name "*.controller.ts" 2>/dev/null | wc -l || echo "0")

# Calculate alignment score
# Alignment = (Documented / Actual) * 100
COMPONENT_ALIGNMENT=0
if [ "$ACTUAL_COMPONENTS" -gt 0 ]; then
    COMPONENT_ALIGNMENT=$(echo "scale=2; ($DOCUMENTED_COMPONENTS / $ACTUAL_COMPONENTS) * 100" | bc)
fi

echo "Component Documentation:"
echo "  - Documented components: $DOCUMENTED_COMPONENTS"
echo "  - Actual components: $ACTUAL_COMPONENTS"
echo "  - Alignment: ${COMPONENT_ALIGNMENT}%"
echo ""

echo "API Documentation:"
echo "  - Documented endpoints: $DOCUMENTED_ENDPOINTS"
echo "  - Actual endpoints: $ACTUAL_ENDPOINTS"
echo ""

# Overall alignment calculation (simplified)
OVERALL_ALIGNMENT=$(echo "scale=2; (($TOTAL_DOCS - $BROKEN_LINKS - $SYNTAX_ERRORS) / $TOTAL_DOCS) * 100" | bc)

echo -e "${GREEN}Overall Documentation Alignment: ${OVERALL_ALIGNMENT}%${NC}"
echo ""

# 4. Generate Report
cat >> "$REPORT_FILE" << EOF
- **Total Documentation Files**: $TOTAL_DOCS
- **Total Links Checked**: $TOTAL_LINKS
- **Broken Links**: $BROKEN_LINKS
- **Code Examples Validated**: $TOTAL_CODE_EXAMPLES
- **Syntax Errors**: $SYNTAX_ERRORS
- **Overall Alignment Score**: ${OVERALL_ALIGNMENT}%

## 1. Link Validation Results

- Total links checked: $TOTAL_LINKS
- Broken links: $BROKEN_LINKS
- Success rate: $(echo "scale=2; (($TOTAL_LINKS - $BROKEN_LINKS) / $TOTAL_LINKS) * 100" | bc 2>/dev/null || echo "100")%

EOF

if [ "$BROKEN_LINKS" -gt 0 ]; then
    cat >> "$REPORT_FILE" << EOF
### Broken Links

\`\`\`
$(grep "✖" "$LINK_CHECK_RESULTS" || echo "None")
\`\`\`

EOF
fi

cat >> "$REPORT_FILE" << EOF
## 2. Code Example Validation Results

- Total code examples: $TOTAL_CODE_EXAMPLES
- Syntax errors: $SYNTAX_ERRORS
- Success rate: $(echo "scale=2; (($TOTAL_CODE_EXAMPLES - $SYNTAX_ERRORS) / $TOTAL_CODE_EXAMPLES) * 100" | bc 2>/dev/null || echo "100")%

## 3. Alignment Verification Results

### Component Documentation Alignment

- Documented components: $DOCUMENTED_COMPONENTS
- Actual components: $ACTUAL_COMPONENTS
- Alignment score: ${COMPONENT_ALIGNMENT}%

### API Documentation Alignment

- Documented endpoints: $DOCUMENTED_ENDPOINTS
- Actual endpoints: $ACTUAL_ENDPOINTS

### Overall Alignment Score: ${OVERALL_ALIGNMENT}%

## Recommendations

EOF

if [ "$BROKEN_LINKS" -gt 0 ]; then
    echo "- Fix $BROKEN_LINKS broken links" >> "$REPORT_FILE"
fi

if [ "$SYNTAX_ERRORS" -gt 0 ]; then
    echo "- Review and fix $SYNTAX_ERRORS code examples with syntax issues" >> "$REPORT_FILE"
fi

if (( $(echo "$OVERALL_ALIGNMENT < 98" | bc -l) )); then
    echo "- Improve documentation coverage to reach 98%+ alignment target" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << EOF

## Conclusion

$(if [ "$BROKEN_LINKS" -eq 0 ] && [ "$SYNTAX_ERRORS" -eq 0 ] && (( $(echo "$OVERALL_ALIGNMENT >= 98" | bc -l) )); then
    echo "✅ All validation checks passed! Documentation is high quality and well-aligned with codebase."
else
    echo "⚠️ Some issues found. See recommendations above for improvements."
fi)

---
*Report generated by: scripts/validate-documentation.sh*
*Date: $(date)*
EOF

# Clean up
rm -f "$LINK_CHECK_RESULTS"

echo "=========================================="
echo "Validation Complete!"
echo "Report saved to: $REPORT_FILE"
echo "=========================================="
echo ""

# Exit with error if critical issues found
if [ "$BROKEN_LINKS" -gt 0 ] || (( $(echo "$OVERALL_ALIGNMENT < 98" | bc -l) )); then
    exit 1
fi

exit 0
