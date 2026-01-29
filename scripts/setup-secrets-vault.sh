#!/bin/bash
# Secrets Vault Setup
# Moves all secrets to a secure, encrypted location

set -e

SECRETS_DIR="/home/ubuntu/.clawdbot"
SECRETS_FILE="$SECRETS_DIR/secrets.env"

echo "🔐 Setting up secrets vault..."

# Create secrets directory if not exists
mkdir -p "$SECRETS_DIR"
chmod 700 "$SECRETS_DIR"

# Create secrets.env template if not exists
if [ ! -f "$SECRETS_FILE" ]; then
    cat > "$SECRETS_FILE" << 'EOF'
# Clawdbot Secrets - DO NOT COMMIT THIS FILE
# Generated: $(date)

# Anthropic
ANTHROPIC_API_KEY=

# Telegram
TELEGRAM_BOT_TOKEN=

# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_KEY=

# n8n
N8N_API_KEY=

# Vercel
VERCEL_TOKEN=

# GitHub (use gh auth login instead)
# GITHUB_TOKEN=
EOF
    chmod 600 "$SECRETS_FILE"
    echo "✓ Created $SECRETS_FILE"
    echo "⚠️  Please edit this file and add your secrets!"
else
    echo "✓ Secrets file already exists"
fi

# Add to .gitignore
GITIGNORE="/home/ubuntu/clawd/.gitignore"
if [ -f "$GITIGNORE" ]; then
    if ! grep -q "secrets.env" "$GITIGNORE"; then
        echo -e "\n# Secrets\nsecrets.env\n*.secret\n*.key" >> "$GITIGNORE"
        echo "✓ Updated .gitignore"
    fi
fi

echo ""
echo "🔐 Secrets vault setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit $SECRETS_FILE with your actual keys"
echo "2. Remove any hardcoded secrets from config files"
echo "3. Reference secrets via environment variables"
