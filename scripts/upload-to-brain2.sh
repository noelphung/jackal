#!/bin/bash
# Upload brain docs to Brain 2 Supabase
# IMPORTANT: Key is passed as argument, never stored in file

SUPABASE_URL="https://azxkbejpckpwvwoyljpg.supabase.co"
KEY="$1"

if [ -z "$KEY" ]; then
  echo "Usage: $0 <service_role_key>"
  exit 1
fi

upload_doc() {
  local slug="$1"
  local title="$2"
  local type="$3"
  local content="$4"
  local tags="$5"
  
  # Escape content for JSON
  local escaped_content=$(echo "$content" | jq -Rs .)
  
  curl -s -X POST "${SUPABASE_URL}/rest/v1/documents" \
    -H "apikey: ${KEY}" \
    -H "Authorization: Bearer ${KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: resolution=merge-duplicates" \
    -d "{
      \"slug\": \"${slug}\",
      \"title\": \"${title}\",
      \"type\": \"${type}\",
      \"content\": ${escaped_content},
      \"tags\": ${tags}
    }"
  
  echo " -> ${slug}"
}

echo "Uploading brain documents to Brain 2..."
