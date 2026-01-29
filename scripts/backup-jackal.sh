#!/bin/bash
# Jackal Backup Script
# Creates encrypted backup of critical files

set -e

BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="jackal_backup_$DATE"

echo "🦊 Jackal Backup - $DATE"
echo "========================"

mkdir -p "$BACKUP_DIR"

# Files to backup (NO secrets - those are separate)
BACKUP_FILES=(
    "/home/ubuntu/clawd/AGENTS.md"
    "/home/ubuntu/clawd/SOUL.md"
    "/home/ubuntu/clawd/USER.md"
    "/home/ubuntu/clawd/TOOLS.md"
    "/home/ubuntu/clawd/IDENTITY.md"
    "/home/ubuntu/clawd/SECURITY.md"
    "/home/ubuntu/clawd/HEARTBEAT.md"
    "/home/ubuntu/clawd/tasks.md"
    "/home/ubuntu/clawd/memory"
    "/home/ubuntu/clawd/skills"
    "/home/ubuntu/clawd/scripts"
    "/home/ubuntu/clawd/config"
)

# Create tar archive
ARCHIVE="$BACKUP_DIR/$BACKUP_NAME.tar.gz"
tar -czf "$ARCHIVE" "${BACKUP_FILES[@]}" 2>/dev/null

# Cleanup old backups (keep last 7)
ls -t "$BACKUP_DIR"/jackal_backup_*.tar.gz 2>/dev/null | tail -n +8 | xargs -r rm

echo "✅ Backup created: $ARCHIVE"
echo "   Size: $(du -h "$ARCHIVE" | cut -f1)"
echo "   Files: ${#BACKUP_FILES[@]} items"

# List recent backups
echo -e "\nRecent backups:"
ls -lh "$BACKUP_DIR"/jackal_backup_*.tar.gz 2>/dev/null | tail -5
