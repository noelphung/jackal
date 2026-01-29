#!/bin/bash
# Parse tasks.md and sync to Supabase tasks table
# Usage: ./sync-tasks.sh (uses secrets.env)

set -e
cd /home/ubuntu/clawd

# Load secrets
source /home/ubuntu/clawd/secrets.env

URL="$BRAIN2_URL/rest/v1/tasks"
TASKS_FILE="tasks.md"

if [ ! -f "$TASKS_FILE" ]; then
    echo "No tasks.md found"
    exit 1
fi

echo "🦊 Syncing tasks to Supabase..."

# Clear existing tasks first (full sync approach)
curl -s -X DELETE "$URL?id=gt.0" \
    -H "apikey: $BRAIN2_KEY" \
    -H "Authorization: Bearer $BRAIN2_KEY" > /dev/null

# Parse tasks.md and insert each task
# Format: - [ ] Task title or - [x] Completed task
PRIORITY=1
SECTION="today"

while IFS= read -r line; do
    # Detect sections
    if echo "$line" | grep -qi "## Today"; then
        SECTION="today"
        PRIORITY=1
    elif echo "$line" | grep -qi "## In Progress"; then
        SECTION="in_progress"
    elif echo "$line" | grep -qi "## Upcoming"; then
        SECTION="upcoming"
    elif echo "$line" | grep -qi "## Backlog"; then
        SECTION="backlog"
    fi
    
    # Parse checkbox items
    if echo "$line" | grep -qE '^\s*-\s*\[.\]'; then
        # Extract task title (remove checkbox and leading dash)
        TITLE=$(echo "$line" | sed -E 's/^\s*-\s*\[.\]\s*//' | sed 's/"/\\"/g')
        
        # Check if completed
        if echo "$line" | grep -qE '^\s*-\s*\[x\]'; then
            STATUS="done"
        else
            STATUS="todo"
        fi
        
        # Set status based on section
        if [ "$SECTION" = "in_progress" ] && [ "$STATUS" != "done" ]; then
            STATUS="in_progress"
        elif [ "$SECTION" = "backlog" ] && [ "$STATUS" != "done" ]; then
            STATUS="backlog"
        fi
        
        # Insert task
        if [ -n "$TITLE" ]; then
            curl -s -X POST "$URL" \
                -H "apikey: $BRAIN2_KEY" \
                -H "Authorization: Bearer $BRAIN2_KEY" \
                -H "Content-Type: application/json" \
                -d "{\"title\":\"$TITLE\",\"status\":\"$STATUS\",\"priority\":$PRIORITY}" > /dev/null
            echo "   + $TITLE ($STATUS)"
            PRIORITY=$((PRIORITY + 1))
        fi
    fi
done < "$TASKS_FILE"

echo "✅ Tasks synced!"
