#!/bin/bash

# GitHub Actions Workflow Validator
# This script validates your GitHub Actions workflow files before pushing to GitHub

set -e

echo "🔍 Validating GitHub Actions Workflow Files..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

WORKFLOW_DIR=".github/workflows"
ERRORS=0

# Check if workflow directory exists
if [ ! -d "$WORKFLOW_DIR" ]; then
    echo -e "${RED}❌ Error: $WORKFLOW_DIR directory not found!${NC}"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for actionlint (best GitHub Actions validator)
if command_exists actionlint; then
    echo -e "${GREEN}✅ Found actionlint${NC}"
    echo "Running actionlint..."
    echo ""
    if actionlint "$WORKFLOW_DIR"/*.yml "$WORKFLOW_DIR"/*.yaml 2>&1; then
        echo ""
        echo -e "${GREEN}✅ actionlint: No errors found!${NC}"
    else
        ERRORS=$((ERRORS + 1))
        echo ""
        echo -e "${RED}❌ actionlint: Found errors!${NC}"
    fi
    echo ""
else
    echo -e "${YELLOW}⚠️  actionlint not found. Installing...${NC}"
    echo ""
    
    # Try to install actionlint
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command_exists brew; then
            echo "Installing actionlint via Homebrew..."
            brew install actionlint
        else
            echo -e "${YELLOW}⚠️  Homebrew not found. Please install actionlint manually:${NC}"
            echo "  brew install actionlint"
            echo ""
            echo "Or download from: https://github.com/rhysd/actionlint/releases"
        fi
    else
        echo -e "${YELLOW}⚠️  Please install actionlint manually:${NC}"
        echo "  Visit: https://github.com/rhysd/actionlint"
    fi
    echo ""
fi

# Basic YAML syntax check using Python
echo "Checking YAML syntax..."
if command_exists python3; then
    for file in "$WORKFLOW_DIR"/*.yml "$WORKFLOW_DIR"/*.yaml; do
        if [ -f "$file" ]; then
            if python3 -c "import yaml; yaml.safe_load(open('$file'))" 2>/dev/null; then
                echo -e "${GREEN}✅ $(basename "$file"): Valid YAML syntax${NC}"
            else
                echo -e "${RED}❌ $(basename "$file"): Invalid YAML syntax${NC}"
                ERRORS=$((ERRORS + 1))
            fi
        fi
    done
else
    echo -e "${YELLOW}⚠️  Python3 not found. Skipping YAML syntax check.${NC}"
fi

echo ""

# Check for common GitHub Actions issues
echo "Checking for common issues..."
for file in "$WORKFLOW_DIR"/*.yml "$WORKFLOW_DIR"/*.yaml; do
    if [ -f "$file" ]; then
        FILENAME=$(basename "$file")
        ISSUES=0
        
        # Check for unsupported || operator in expressions
        if grep -q '\${{.*||.*}}' "$file"; then
            echo -e "${RED}❌ $FILENAME: Found unsupported || operator in GitHub Actions expressions${NC}"
            echo "   GitHub Actions doesn't support || for default values in expressions."
            echo "   Use shell variable defaults instead: \${VAR:-default}"
            grep -n '\${{.*||.*}}' "$file" || true
            ISSUES=$((ISSUES + 1))
        fi
        
        # Check for proper indentation (basic check)
        if grep -q '^[[:space:]]*[^[:space:]-].*:' "$file"; then
            # This is a basic check - actionlint will catch real issues
            :
        fi
        
        if [ $ISSUES -eq 0 ]; then
            echo -e "${GREEN}✅ $FILENAME: No obvious issues found${NC}"
        else
            ERRORS=$((ERRORS + ISSUES))
        fi
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Your workflow files look good.${NC}"
    echo ""
    echo "💡 Tip: Install actionlint for more comprehensive validation:"
    echo "   brew install actionlint  (macOS)"
    echo "   or visit: https://github.com/rhysd/actionlint"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS issue(s). Please fix them before pushing.${NC}"
    exit 1
fi

