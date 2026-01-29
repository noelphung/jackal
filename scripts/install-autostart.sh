#!/bin/bash
# Install Clawdbot auto-start and self-healing
# Run with: sudo bash scripts/install-autostart.sh

set -e

echo "🤖 Installing Clawdbot auto-start and self-healing..."

# Make scripts executable
chmod +x /home/ubuntu/clawd/scripts/self-heal.sh

# Add self-heal to crontab (every 5 minutes)
CRON_LINE="*/5 * * * * /home/ubuntu/clawd/scripts/self-heal.sh"
(crontab -l 2>/dev/null | grep -v "self-heal.sh"; echo "$CRON_LINE") | crontab -
echo "✓ Self-healing cron installed (every 5 minutes)"

# Add startup to crontab
STARTUP_LINE="@reboot cd /home/ubuntu/clawd && sleep 30 && /home/ubuntu/.npm-global/bin/clawdbot gateway start"
(crontab -l 2>/dev/null | grep -v "@reboot.*clawdbot"; echo "$STARTUP_LINE") | crontab -
echo "✓ Auto-start on reboot installed"

# Verify crontab
echo -e "\nCurrent crontab:"
crontab -l

echo -e "\n✅ Installation complete!"
echo ""
echo "Clawdbot will now:"
echo "  • Auto-start on system reboot"
echo "  • Self-heal every 5 minutes if crashed"
echo "  • Log status to /home/ubuntu/clawd/logs/self-heal.log"
