#!/bin/bash
# Sync Jackal's brain to GitHub and Supabase
# Usage: ./sync-brain.sh [supabase_key]
# If key not provided, tries secrets.env, then GitHub only

set -e
cd /home/ubuntu/clawd

SUPABASE_URL="https://azxkbejpckpwvwoyljpg.supabase.co/rest/v1/documents"

# Try arg first, then secrets.env
KEY="$1"
if [ -z "$KEY" ] && [ -f /home/ubuntu/clawd/secrets.env ]; then
    source /home/ubuntu/clawd/secrets.env
    KEY="$BRAIN2_KEY"
fi

echo "🦊 Syncing Jackal's brain..."

# === GITHUB SYNC ===
echo ""
echo "📦 Syncing to GitHub..."

# Add all changes
git add -A

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "   No changes to commit"
else
    # Commit with timestamp
    git commit -m "Auto-sync: $(date -u +%Y-%m-%d\ %H:%M:%S\ UTC)"
    git push origin master 2>/dev/null || git push origin main 2>/dev/null
    echo "   ✅ Pushed to GitHub"
fi

# === SUPABASE SYNC ===
if [ -z "$KEY" ]; then
    echo ""
    echo "⚠️  No Supabase key provided - skipping Supabase sync"
    echo "   Run with: ./sync-brain.sh <service_role_key>"
    exit 0
fi

echo ""
echo "☁️  Syncing to Supabase..."

sync_file() {
    local file="$1"
    local slug="$2"
    local title="$3"
    local type="$4"
    local tags="$5"
    
    if [ ! -f "$file" ]; then
        return
    fi
    
    local content=$(cat "$file" | jq -Rs .)
    
    # Try PATCH first (update existing)
    local result=$(curl -s -X PATCH "$SUPABASE_URL?slug=eq.$slug" \
        -H "apikey: $KEY" \
        -H "Authorization: Bearer $KEY" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=representation" \
        -d "{\"content\":$content,\"updated_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}")
    
    # If no rows updated, INSERT
    if [ "$result" = "[]" ]; then
        curl -s -X POST "$SUPABASE_URL" \
            -H "apikey: $KEY" \
            -H "Authorization: Bearer $KEY" \
            -H "Content-Type: application/json" \
            -d "{\"slug\":\"$slug\",\"title\":\"$title\",\"type\":\"$type\",\"content\":$content,\"tags\":$tags}" > /dev/null
        echo "   + $slug (created)"
    else
        echo "   ✓ $slug (updated)"
    fi
}

# Core files
sync_file "IDENTITY.md" "identity" "Who Am I (Identity)" "concept" '["identity","core","jackal"]'
sync_file "SOUL.md" "soul" "Who You Are (Soul)" "concept" '["soul","core","philosophy"]'
sync_file "AGENTS.md" "agents" "Workspace Guide (Agents)" "note" '["agents","core","workspace"]'
sync_file "USER.md" "user" "About Noel (User)" "note" '["user","noel","core"]'
sync_file "TOOLS.md" "tools" "Local Notes (Tools)" "note" '["tools","core","config"]'
sync_file "HEARTBEAT.md" "heartbeat" "Proactive Checks (Heartbeat)" "note" '["heartbeat","core","automation"]'
sync_file "tasks.md" "tasks" "Mission Control (Tasks)" "note" '["tasks","todo","mission"]'

# Memory files (today)
TODAY=$(date +%Y-%m-%d)
sync_file "memory/$TODAY.md" "memory-$TODAY" "Session Log — $(date +%B\ %d,\ %Y)" "journal" '["memory","daily"]'

# Brain docs
for f in brain-docs/journals/*.md; do
    if [ -f "$f" ]; then
        name=$(basename "$f" .md)
        sync_file "$f" "journal-$name" "Daily Journal — $name" "journal" '["journal","daily"]'
    fi
done

for f in brain-docs/concepts/*.md; do
    if [ -f "$f" ]; then
        name=$(basename "$f" .md)
        sync_file "$f" "$name" "Concept: $name" "concept" '["concept"]'
    fi
done

echo ""
echo "✅ Sync complete!"
