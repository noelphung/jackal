#!/bin/bash
# Security Hardening Script for Clawdbot Server
# Run with: sudo bash scripts/security-hardening.sh

set -e

echo "🔒 Starting security hardening..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run with sudo${NC}"
    exit 1
fi

echo -e "\n${YELLOW}1. Configuring UFW Firewall...${NC}"
apt-get update -qq
apt-get install -y ufw

# Default deny incoming, allow outgoing
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (critical - don't lock yourself out!)
ufw allow 22/tcp comment 'SSH'

# Allow HTTP/HTTPS if needed for webhooks
# ufw allow 80/tcp comment 'HTTP'
# ufw allow 443/tcp comment 'HTTPS'

# Enable firewall
echo "y" | ufw enable
ufw status verbose
echo -e "${GREEN}✓ Firewall configured${NC}"

echo -e "\n${YELLOW}2. Installing Fail2ban...${NC}"
apt-get install -y fail2ban

# Create custom config
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5
ignoreip = 127.0.0.1/8

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 24h
EOF

systemctl enable fail2ban
systemctl restart fail2ban
echo -e "${GREEN}✓ Fail2ban installed and configured${NC}"

echo -e "\n${YELLOW}3. Hardening SSH...${NC}"
# Backup original config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Apply hardening (only if not already set)
sed -i 's/#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/#PubkeyAuthentication.*/PubkeyAuthentication yes/' /etc/ssh/sshd_config

# Test config before restarting
sshd -t && systemctl restart sshd
echo -e "${GREEN}✓ SSH hardened (root login disabled, password auth disabled)${NC}"

echo -e "\n${YELLOW}4. Setting up automatic security updates...${NC}"
apt-get install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
echo -e "${GREEN}✓ Automatic security updates enabled${NC}"

echo -e "\n${YELLOW}5. Securing sensitive files...${NC}"
# Ensure proper permissions on sensitive directories
chmod 700 /home/ubuntu/.clawdbot 2>/dev/null || true
chmod 600 /home/ubuntu/.clawdbot/agents/main/agent/auth-profiles.json 2>/dev/null || true
find /home/ubuntu -name "*.env" -exec chmod 600 {} \; 2>/dev/null || true
echo -e "${GREEN}✓ File permissions secured${NC}"

echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}🔒 Security hardening complete!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo "Summary:"
echo "  ✓ UFW firewall enabled (SSH only)"
echo "  ✓ Fail2ban protecting SSH (3 attempts = 24h ban)"
echo "  ✓ SSH hardened (key-only, no root)"
echo "  ✓ Auto security updates enabled"
echo "  ✓ Sensitive file permissions secured"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Make sure you have SSH key access before disconnecting!${NC}"
echo ""
echo "Next steps:"
echo "  1. Test SSH login in a new terminal before closing this one"
echo "  2. Review /etc/fail2ban/jail.local for custom rules"
echo "  3. Run 'sudo ufw status' to see firewall rules"
