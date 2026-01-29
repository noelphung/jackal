#!/bin/bash
# Watch Jackal's brain files and auto-sync on changes
# Usage: ./watch-and-sync.sh <supabase_key>
# Run in background: nohup ./watch-and-sync.sh <key> &

KEY="$1"
WATCH_DIR="/home/ubuntu/clawd"
SYNC_SCRIPT="/home/ubuntu/clawd/scripts/sync-brain.sh"
DEBOUNCE_SECONDS=5
LAST_SYNC=0

if [ -z "$KEY" ]; then
    echo "Usage: $0 <supabase_service_role_key>"
    exit 1
fi

echo "🦊 Watching $WATCH_DIR for changes..."
echo "   Syncing to GitHub + Supabase"
echo "   Debounce: ${DEBOUNCE_SECONDS}s"
echo ""

# Watch for changes
inotifywait -m -r -e modify,create,delete,move \
    --exclude '(\.git|node_modules|\.next|__pycache__)' \
    "$WATCH_DIR" 2>/dev/null | while read -r directory event filename; do
    
    # Skip non-markdown files and hidden files
    if [[ ! "$filename" =~ \.md$ ]] && [[ ! "$filename" =~ \.json$ ]]; then
        continue
    fi
    
    # Skip if filename starts with .
    if [[ "$filename" =~ ^\. ]]; then
        continue
    fi
    
    NOW=$(date +%s)
    
    # Debounce - only sync if enough time has passed
    if (( NOW - LAST_SYNC >= DEBOUNCE_SECONDS )); then
        echo ""
        echo "[$(date +%H:%M:%S)] Change detected: $filename ($event)"
        
        # Run sync
        "$SYNC_SCRIPT" "$KEY" 2>&1 | sed 's/^/   /'
        
        LAST_SYNC=$(date +%s)
    fi
done
