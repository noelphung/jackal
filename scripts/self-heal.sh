#!/bin/bash
# Clawdbot Self-Healing Monitor
# Run via cron every 5 minutes

LOG_FILE="/home/ubuntu/clawd/logs/self-heal.log"
mkdir -p /home/ubuntu/clawd/logs

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Check if Clawdbot gateway is running
if ! pgrep -f "clawdbot-gateway" > /dev/null; then
    log "⚠️ Clawdbot gateway not running - attempting restart"
    
    cd /home/ubuntu/clawd
    nohup clawdbot gateway start > /dev/null 2>&1 &
    
    sleep 5
    
    if pgrep -f "clawdbot-gateway" > /dev/null; then
        log "✅ Clawdbot gateway restarted successfully"
    else
        log "❌ Failed to restart Clawdbot gateway"
        # Could add alerting here (email, telegram, etc)
    fi
else
    # Only log every hour to avoid log spam
    MINUTE=$(date +%M)
    if [ "$MINUTE" = "00" ]; then
        log "✓ Clawdbot gateway running normally"
    fi
fi

# Check disk space
DISK_USAGE=$(df /home | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    log "⚠️ Disk usage critical: ${DISK_USAGE}%"
fi

# Check memory
MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
if [ "$MEM_USAGE" -gt 90 ]; then
    log "⚠️ Memory usage critical: ${MEM_USAGE}%"
fi

# Rotate log if too large (>10MB)
if [ -f "$LOG_FILE" ] && [ $(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE") -gt 10485760 ]; then
    mv "$LOG_FILE" "$LOG_FILE.old"
    log "Log rotated"
fi
