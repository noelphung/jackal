#!/bin/bash
# Disk usage monitor - alerts when usage exceeds threshold

THRESHOLD=80
USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')

if [ "$USAGE" -ge "$THRESHOLD" ]; then
    echo "⚠️ DISK ALERT: Root disk at ${USAGE}% (threshold: ${THRESHOLD}%)"
    echo "Top space consumers:"
    du -sh /home/ubuntu/* 2>/dev/null | sort -hr | head -10
    echo ""
    echo "NPM cache: $(du -sh ~/.npm 2>/dev/null | cut -f1)"
    echo "Node modules: $(find /home/ubuntu -name 'node_modules' -type d -exec du -sh {} + 2>/dev/null | sort -hr | head -5)"
    exit 1
else
    echo "Disk OK: ${USAGE}%"
    exit 0
fi
