#!/bin/bash
# Update system status in Supabase for dashboard
# Run via cron or heartbeat

KEY="$1"
if [ -z "$KEY" ]; then
    echo "Usage: $0 <supabase_key>"
    exit 1
fi

URL="https://azxkbejpckpwvwoyljpg.supabase.co/rest/v1/documents"

# Get system stats
DISK_TOTAL=$(df -h / | tail -1 | awk '{print $2}')
DISK_USED=$(df -h / | tail -1 | awk '{print $3}')
DISK_FREE=$(df -h / | tail -1 | awk '{print $4}')
DISK_PCT=$(df -h / | tail -1 | awk '{print $5}' | tr -d '%')
MEM_TOTAL=$(free -h | grep Mem | awk '{print $2}')
MEM_USED=$(free -h | grep Mem | awk '{print $3}')
UPTIME=$(uptime -p)

# Try to get context from clawdbot (if available)
CONTEXT_USED=0
CONTEXT_TOTAL=200000
CONTEXT_PCT=0

# Check for recent session status (this is a placeholder - you can enhance)
if command -v clawdbot &> /dev/null; then
    # Try to get session status
    STATUS=$(timeout 5 clawdbot status 2>/dev/null || echo "")
    if echo "$STATUS" | grep -q "Context:"; then
        CONTEXT_LINE=$(echo "$STATUS" | grep "Context:")
        CONTEXT_USED=$(echo "$CONTEXT_LINE" | grep -oP '\d+k' | head -1 | tr -d 'k')
        CONTEXT_USED=$((CONTEXT_USED * 1000))
        CONTEXT_PCT=$(echo "$CONTEXT_LINE" | grep -oP '\d+%' | head -1 | tr -d '%')
    fi
fi

# Build JSON
STATUS_JSON=$(cat <<EOF
{
  "disk": {
    "total": "$DISK_TOTAL",
    "used": "$DISK_USED",
    "free": "$DISK_FREE",
    "percent": $DISK_PCT
  },
  "memory": {
    "total": "$MEM_TOTAL",
    "used": "$MEM_USED"
  },
  "uptime": "$UPTIME",
  "context": {
    "used": $CONTEXT_USED,
    "total": $CONTEXT_TOTAL,
    "percent": $CONTEXT_PCT
  },
  "lastHeartbeat": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "state": "online"
}
EOF
)

CONTENT=$(echo "$STATUS_JSON" | jq -Rs .)

# Update in Supabase
curl -s -X PATCH "$URL?slug=eq._system_status" \
    -H "apikey: $KEY" \
    -H "Authorization: Bearer $KEY" \
    -H "Content-Type: application/json" \
    -d "{\"content\":$CONTENT,\"updated_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > /dev/null

echo "System status updated: $(date)"
