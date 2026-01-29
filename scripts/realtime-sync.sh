#!/bin/bash
# Real-time sync for dashboard - runs after every Jackal response
# Updates: system status, tasks, sessions, projects, activity

source /home/ubuntu/clawd/secrets.env 2>/dev/null || exit 0
URL="$BRAIN2_URL/rest/v1"

# === 1. SYSTEM STATUS ===
CONTEXT_INFO=$(timeout 2 clawdbot status 2>/dev/null | grep "Context:" || echo "")
if [ -n "$CONTEXT_INFO" ]; then
    CONTEXT_USED=$(echo "$CONTEXT_INFO" | grep -oP '\d+k' | head -1 | tr -d 'k')
    CONTEXT_USED=$((CONTEXT_USED * 1000))
    CONTEXT_PCT=$(echo "$CONTEXT_INFO" | grep -oP '\d+%' | head -1 | tr -d '%')
else
    CONTEXT_USED=0
    CONTEXT_PCT=0
fi

DISK_PCT=$(df / | tail -1 | awk '{print $5}' | tr -d '%')
DISK_FREE=$(df -h / | tail -1 | awk '{print $4}')
DISK_USED=$(df -h / | tail -1 | awk '{print $3}')
MEM_USED=$(free -h | grep Mem | awk '{print $3}')
MEM_TOTAL=$(free -h | grep Mem | awk '{print $2}')

STATUS=$(jq -n \
    --arg disk_total "38G" \
    --arg disk_used "$DISK_USED" \
    --arg disk_free "$DISK_FREE" \
    --argjson disk_pct "$DISK_PCT" \
    --arg mem_total "$MEM_TOTAL" \
    --arg mem_used "$MEM_USED" \
    --arg uptime "$(uptime -p)" \
    --argjson ctx_used "$CONTEXT_USED" \
    --argjson ctx_pct "$CONTEXT_PCT" \
    --arg ts "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    '{disk:{total:$disk_total,used:$disk_used,free:$disk_free,percent:$disk_pct},memory:{total:$mem_total,used:$mem_used},uptime:$uptime,context:{used:$ctx_used,total:200000,percent:$ctx_pct},lastHeartbeat:$ts,state:"online"}')

curl -s -m 3 -X PATCH "$URL/documents?slug=eq._system_status" \
    -H "apikey: $BRAIN2_KEY" -H "Authorization: Bearer $BRAIN2_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"content\":$(echo "$STATUS" | jq -Rs .),\"updated_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" &

# === 2. SESSIONS ===
SESSIONS_JSON=$(timeout 3 clawdbot sessions list --json 2>/dev/null || echo "[]")
if [ "$SESSIONS_JSON" != "[]" ] && [ -n "$SESSIONS_JSON" ]; then
    curl -s -m 3 -X PATCH "$URL/documents?slug=eq._sessions" \
        -H "apikey: $BRAIN2_KEY" -H "Authorization: Bearer $BRAIN2_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"content\":$(echo "$SESSIONS_JSON" | jq -Rs .),\"updated_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" &
fi

# === 3. CRON JOBS ===
CRON_JSON=$(timeout 3 clawdbot cron list --json 2>/dev/null || echo "[]")
if [ "$CRON_JSON" != "[]" ] && [ -n "$CRON_JSON" ]; then
    curl -s -m 3 -X PATCH "$URL/documents?slug=eq._cron_jobs" \
        -H "apikey: $BRAIN2_KEY" -H "Authorization: Bearer $BRAIN2_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"content\":$(echo "$CRON_JSON" | jq -Rs .),\"updated_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" &
fi

# === 4. CHANNELS ===
CHANNELS=$(jq -n '[
    {name:"telegram",type:"messaging",status:"connected",icon:"📱"},
    {name:"github",type:"code",status:"connected",icon:"🐙"}
]')
curl -s -m 3 -X PATCH "$URL/documents?slug=eq._channels" \
    -H "apikey: $BRAIN2_KEY" -H "Authorization: Bearer $BRAIN2_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"content\":$(echo "$CHANNELS" | jq -Rs .),\"updated_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" &

# === 5. PROJECTS ===
PROJECTS=$(jq -n '[
    {name:"NextDial",slug:"nextdial",status:"active",color:"#6366f1",description:"AI cold calling platform"},
    {name:"Synlixa",slug:"synlixa",status:"active",color:"#22c55e",description:"AI automation business"},
    {name:"Jackal Brain",slug:"jackal-brain",status:"active",color:"#f59e0b",description:"Personal AI dashboard"}
]')
curl -s -m 3 -X PATCH "$URL/documents?slug=eq._projects" \
    -H "apikey: $BRAIN2_KEY" -H "Authorization: Bearer $BRAIN2_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"content\":$(echo "$PROJECTS" | jq -Rs .),\"updated_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" &

# === 6. SYNC TASKS (if changed) ===
if [ -f /home/ubuntu/clawd/tasks.md ]; then
    TASKS_MOD=$(stat -c %Y /home/ubuntu/clawd/tasks.md 2>/dev/null || echo 0)
    NOW=$(date +%s)
    if [ $((NOW - TASKS_MOD)) -lt 120 ]; then
        /home/ubuntu/clawd/scripts/sync-tasks.sh >/dev/null 2>&1 &
    fi
fi

wait 2>/dev/null
echo "$(date +%H:%M:%S) synced"
