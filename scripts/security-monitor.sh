#!/bin/bash
# Automated Security Monitor for Jackal
# Run via cron: 0 */4 * * * /home/ubuntu/clawd/scripts/security-monitor.sh

set -e
ALERT_FILE="/tmp/security-alerts.json"
LOG_FILE="/home/ubuntu/clawd/logs/security-$(date +%Y-%m-%d).log"
mkdir -p /home/ubuntu/clawd/logs

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

alert() {
  log "⚠️ ALERT: $1"
  # Write to alert file for dashboard to read
  echo "{\"time\":\"$(date -Iseconds)\",\"alert\":\"$1\",\"severity\":\"$2\"}" >> "$ALERT_FILE"
}

log "=== Security Monitor Starting ==="

# 1. Check for unexpected open ports
log "Checking exposed ports..."
EXPOSED=$(sudo ss -tlnp 2>/dev/null | grep -E "0\.0\.0\.0:[^2][0-9]*|0\.0\.0\.0:[0-9]{3,}" | grep -v ":22 " || true)
if [ -n "$EXPOSED" ]; then
  alert "Unexpected ports exposed to internet: $EXPOSED" "high"
else
  log "✅ No unexpected ports exposed"
fi

# 2. Check for new listening services
log "Checking listening services..."
LISTENERS=$(sudo ss -tlnp 2>/dev/null | wc -l)
if [ "$LISTENERS" -gt 15 ]; then
  alert "Unusual number of listening services: $LISTENERS" "medium"
else
  log "✅ Service count normal: $LISTENERS"
fi

# 3. Check SSH auth failures (last hour)
log "Checking SSH failures..."
SSH_FAILS=$(sudo journalctl -u ssh --since "1 hour ago" 2>/dev/null | grep -c "Failed password\|Invalid user" 2>/dev/null || echo "0")
SSH_FAILS=$(echo "$SSH_FAILS" | tr -d '\n' | head -c 10)
if [ "${SSH_FAILS:-0}" -gt 50 ]; then
  alert "High SSH failure rate: $SSH_FAILS in last hour" "high"
elif [ "$SSH_FAILS" -gt 10 ]; then
  log "⚠️ Elevated SSH failures: $SSH_FAILS"
else
  log "✅ SSH failures normal: $SSH_FAILS"
fi

# 4. Check fail2ban status
log "Checking fail2ban..."
if systemctl is-active --quiet fail2ban 2>/dev/null; then
  BANNED=$(sudo fail2ban-client status sshd 2>/dev/null | grep "Currently banned" | awk '{print $NF}' || echo "0")
  log "✅ fail2ban active, $BANNED IPs banned"
else
  alert "fail2ban not running!" "high"
fi

# 5. Check for unauthorized sudo attempts
log "Checking sudo attempts..."
SUDO_FAILS=$(sudo journalctl --since "1 hour ago" 2>/dev/null | grep -c "sudo.*authentication failure" 2>/dev/null || echo "0")
SUDO_FAILS=$(echo "$SUDO_FAILS" | tr -d '\n' | head -c 10)
if [ "${SUDO_FAILS:-0}" -gt 5 ]; then
  alert "Suspicious sudo failures: $SUDO_FAILS" "high"
else
  log "✅ Sudo attempts normal"
fi

# 6. Check UFW status
log "Checking firewall..."
if sudo ufw status | grep -q "Status: active"; then
  log "✅ UFW firewall active"
else
  alert "UFW firewall not active!" "critical"
fi

# 7. Check for nginx/caddy/apache (should not be running)
log "Checking for reverse proxies..."
for svc in nginx caddy apache2 httpd; do
  if systemctl is-active --quiet $svc 2>/dev/null; then
    alert "Reverse proxy $svc is running - should be disabled!" "high"
  fi
done
log "✅ No reverse proxies running"

# 8. Check Clawdbot gateway binding
log "Checking gateway binding..."
GATEWAY_BIND=$(ss -tlnp 2>/dev/null | grep 18789 | grep -v "127.0.0.1\|::1" || true)
if [ -n "$GATEWAY_BIND" ]; then
  alert "Gateway exposed to public! $GATEWAY_BIND" "critical"
else
  log "✅ Gateway localhost-only"
fi

# 9. Check disk space
log "Checking disk space..."
DISK_USED=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USED" -gt 90 ]; then
  alert "Disk space critical: ${DISK_USED}%" "high"
elif [ "$DISK_USED" -gt 80 ]; then
  log "⚠️ Disk space elevated: ${DISK_USED}%"
else
  log "✅ Disk space OK: ${DISK_USED}%"
fi

# 10. Check for processes running as root (unusual)
log "Checking root processes..."
ROOT_PROCS=$(ps aux | awk '$1=="root"' | wc -l)
if [ "$ROOT_PROCS" -gt 200 ]; then
  alert "Unusual number of root processes: $ROOT_PROCS" "medium"
else
  log "✅ Root processes normal: $ROOT_PROCS"
fi

# 11. Check .env files not committed
log "Checking for exposed secrets..."
cd /home/ubuntu/jackal/brain 2>/dev/null && {
  if git ls-files | grep -qE "\.env"; then
    alert ".env files in git repository!" "critical"
  else
    log "✅ No .env files in git"
  fi
}

# 12. Check Supabase RLS (quick check)
log "Testing Supabase RLS..."
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6eGtiZWpwY2twd3Z3b3lsanBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTkxMzIsImV4cCI6MjA4NTEzNTEzMn0.yYhdv8wWAzVORvea1kF5ld1fTV5afQDvHNEWpzSpjSs"
DOCS_TEST=$(curl -s "https://azxkbejpckpwvwoyljpg.supabase.co/rest/v1/documents?limit=1" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" 2>/dev/null)
if echo "$DOCS_TEST" | grep -q "permission denied\|42501"; then
  log "✅ Supabase RLS active"
elif [ "$DOCS_TEST" == "[]" ]; then
  log "✅ Supabase RLS active (empty)"
else
  alert "Supabase documents may be exposed!" "critical"
fi

log "=== Security Monitor Complete ==="

# Clean old alerts (keep last 100)
if [ -f "$ALERT_FILE" ]; then
  tail -100 "$ALERT_FILE" > "${ALERT_FILE}.tmp" && mv "${ALERT_FILE}.tmp" "$ALERT_FILE"
fi

# Output summary
ALERT_COUNT=$(cat "$ALERT_FILE" 2>/dev/null | wc -l || echo "0")
log "Total alerts in file: $ALERT_COUNT"
