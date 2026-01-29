#!/bin/bash
# Secrets Audit - Find exposed secrets
# Run regularly to ensure no secrets are exposed

echo "🔍 Secrets Audit - $(date)"
echo "=================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

WORKSPACE="/home/ubuntu/clawd"
FOUND_SECRETS=0

echo -e "\n${YELLOW}Scanning for exposed secrets...${NC}"

# Patterns to search for
PATTERNS=(
    "sk-ant-"
    "sk-proj-"
    "eyJhbGciOi"
    "xoxb-"
    "xoxp-"
    "ghp_"
    "gho_"
    "-----BEGIN"
)

for pattern in "${PATTERNS[@]}"; do
    MATCHES=$(grep -r "$pattern" "$WORKSPACE" --include="*.md" --include="*.json" --include="*.txt" --include="*.js" --include="*.yaml" --include="*.yml" 2>/dev/null | grep -v node_modules | grep -v ".git" | grep -v "secrets-audit.sh")
    if [ -n "$MATCHES" ]; then
        echo -e "${RED}⚠️ Found potential secret ($pattern):${NC}"
        echo "$MATCHES" | head -5
        FOUND_SECRETS=$((FOUND_SECRETS + 1))
        echo ""
    fi
done

# Check for common secret file names
echo -e "\n${YELLOW}Checking for sensitive files...${NC}"
SENSITIVE_FILES=$(find "$WORKSPACE" -name "*.env" -o -name "*secret*" -o -name "*password*" -o -name "*credential*" -o -name "*.pem" -o -name "*.key" 2>/dev/null | grep -v node_modules | grep -v ".git")
if [ -n "$SENSITIVE_FILES" ]; then
    echo -e "${YELLOW}Sensitive files found:${NC}"
    echo "$SENSITIVE_FILES"
fi

# Check file permissions
echo -e "\n${YELLOW}Checking sensitive file permissions...${NC}"
AUTH_FILE="/home/ubuntu/.clawdbot/agents/main/agent/auth-profiles.json"
if [ -f "$AUTH_FILE" ]; then
    PERMS=$(stat -c %a "$AUTH_FILE")
    if [ "$PERMS" != "600" ]; then
        echo -e "${RED}⚠️ auth-profiles.json has wrong permissions: $PERMS (should be 600)${NC}"
        FOUND_SECRETS=$((FOUND_SECRETS + 1))
    else
        echo -e "${GREEN}✓ auth-profiles.json permissions OK${NC}"
    fi
fi

# Summary
echo -e "\n=================================="
if [ "$FOUND_SECRETS" -eq 0 ]; then
    echo -e "${GREEN}✅ No exposed secrets found${NC}"
else
    echo -e "${RED}⚠️ Found $FOUND_SECRETS potential issues - review above${NC}"
fi
