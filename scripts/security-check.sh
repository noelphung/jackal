#!/bin/bash
# Security Status Check
# Run with: bash scripts/security-check.sh

echo "🔒 Security Status Check - $(date)"
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "\n${YELLOW}1. Firewall Status${NC}"
if sudo ufw status | grep -q "active"; then
    echo -e "${GREEN}✓ UFW is active${NC}"
    sudo ufw status | grep -E "^[0-9]|ALLOW"
else
    echo -e "${RED}✗ UFW is NOT active${NC}"
fi

echo -e "\n${YELLOW}2. Fail2ban Status${NC}"
if systemctl is-active --quiet fail2ban; then
    echo -e "${GREEN}✓ Fail2ban is running${NC}"
    sudo fail2ban-client status sshd 2>/dev/null | grep -E "Currently|Total"
else
    echo -e "${RED}✗ Fail2ban is NOT running${NC}"
fi

echo -e "\n${YELLOW}3. SSH Configuration${NC}"
ROOT_LOGIN=$(grep "^PermitRootLogin" /etc/ssh/sshd_config 2>/dev/null | awk '{print $2}')
PASS_AUTH=$(grep "^PasswordAuthentication" /etc/ssh/sshd_config 2>/dev/null | awk '{print $2}')
[ "$ROOT_LOGIN" = "no" ] && echo -e "${GREEN}✓ Root login disabled${NC}" || echo -e "${RED}✗ Root login enabled${NC}"
[ "$PASS_AUTH" = "no" ] && echo -e "${GREEN}✓ Password auth disabled${NC}" || echo -e "${YELLOW}⚠ Password auth may be enabled${NC}"

echo -e "\n${YELLOW}4. Open Ports${NC}"
ss -tlnp 2>/dev/null | grep LISTEN | awk '{print $4}' | sort -u

echo -e "\n${YELLOW}5. Recent Failed Logins (last 24h)${NC}"
FAILED=$(sudo grep "Failed password" /var/log/auth.log 2>/dev/null | grep "$(date +%b\ %d)" | wc -l)
if [ "$FAILED" -gt 10 ]; then
    echo -e "${RED}⚠ $FAILED failed login attempts today${NC}"
else
    echo -e "${GREEN}✓ $FAILED failed login attempts today${NC}"
fi

echo -e "\n${YELLOW}6. Sensitive File Permissions${NC}"
AUTH_FILE="/home/ubuntu/.clawdbot/agents/main/agent/auth-profiles.json"
if [ -f "$AUTH_FILE" ]; then
    PERMS=$(stat -c %a "$AUTH_FILE")
    [ "$PERMS" = "600" ] && echo -e "${GREEN}✓ auth-profiles.json: $PERMS${NC}" || echo -e "${RED}✗ auth-profiles.json: $PERMS (should be 600)${NC}"
fi

echo -e "\n${YELLOW}7. Authorized SSH Keys${NC}"
KEY_COUNT=$(wc -l < ~/.ssh/authorized_keys 2>/dev/null || echo 0)
echo "  $KEY_COUNT authorized key(s)"

echo -e "\n=================================="
echo "Check complete."
