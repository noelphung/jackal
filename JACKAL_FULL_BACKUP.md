# 🦊 JACKAL FULL DISASTER RECOVERY

**Created**: 2026-01-29
**Purpose**: Bring Jackal back from the dead if anything happens

---

# PART 1: EC2 SETUP

## 1.1 Launch Instance
- **AMI**: Ubuntu 24.04 LTS
- **Instance type**: t3.medium (or larger)
- **Storage**: **40GB minimum** (learned this the hard way - 6.8GB fills up fast)
- **Security group**: Allow SSH (22) from your IP

## 1.2 Connect & Prep
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node -v  # Should be v22.x
npm -v
```

---

# PART 2: INSTALL CLAWDBOT

```bash
# Install globally
sudo npm install -g clawdbot

# Verify
clawdbot --version

# Run onboard wizard
clawdbot onboard
```

During onboard:
1. Choose **Anthropic** as provider
2. Enter your **ANTHROPIC_API_KEY** (see Secrets section)
3. Choose **Telegram** as channel
4. Enter **Telegram Bot Token** (see Secrets section)
5. Set workspace to `/home/ubuntu/clawd`

---

# PART 3: SECRETS (STORE THESE SAFELY!)

## 3.1 Anthropic API Key
- Get from: https://console.anthropic.com/settings/keys
- Set via: `export ANTHROPIC_API_KEY="sk-ant-..."`
- Or during `clawdbot onboard`

## 3.2 Telegram Bot Token
```
8448939009:AAFyw1p2_OPXfFcB0V2pfiNSWzY5OV5C1ig
```
- Created via @BotFather
- Bot username: (your bot)

## 3.3 Supabase (NextDial)
- **Project**: hjupxiwngsxxwvbnwjxx
- **URL**: https://hjupxiwngsxxwvbnwjxx.supabase.co
- **Service Role Key**: (get from Supabase dashboard → Settings → API)

## 3.4 GitHub CLI
```bash
# Install gh
sudo apt install gh

# Authenticate
gh auth login
# Choose: GitHub.com → HTTPS → Login with browser
```

---

# PART 4: CLAWDBOT CONFIG

## 4.1 Config Location
`/home/ubuntu/.clawdbot/clawdbot.json`

## 4.2 Full Config
```json
{
  "messages": {
    "ackReactionScope": "group-mentions"
  },
  "agents": {
    "defaults": {
      "maxConcurrent": 4,
      "subagents": {
        "maxConcurrent": 8
      },
      "compaction": {
        "mode": "safeguard"
      },
      "workspace": "/home/ubuntu/clawd"
    }
  },
  "gateway": {
    "mode": "local",
    "auth": {
      "mode": "token",
      "token": "GENERATE_NEW_TOKEN"
    },
    "port": 18789,
    "bind": "loopback",
    "tailscale": {
      "mode": "off",
      "resetOnExit": false
    }
  },
  "auth": {
    "profiles": {
      "anthropic:default": {
        "provider": "anthropic",
        "mode": "api_key"
      }
    }
  },
  "plugins": {
    "entries": {
      "telegram": {
        "enabled": true
      }
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "YOUR_TELEGRAM_BOT_TOKEN"
    }
  },
  "skills": {
    "install": {
      "nodeManager": "npm"
    }
  },
  "hooks": {
    "internal": {
      "enabled": true,
      "entries": {
        "session-memory": {
          "enabled": true
        },
        "command-logger": {
          "enabled": true
        },
        "boot-md": {
          "enabled": true
        }
      }
    }
  }
}
```

---

# PART 5: WORKSPACE FILES

## 5.1 Create Workspace
```bash
mkdir -p /home/ubuntu/clawd/memory
mkdir -p /home/ubuntu/clawd/skills
mkdir -p /home/ubuntu/clawd/scripts
cd /home/ubuntu/clawd
```

## 5.2 IDENTITY.md
```markdown
# IDENTITY.md - Who Am I?

- **Name:** Jackal
- **Creature:** Something between a familiar and a ghost in the machine — clever, resourceful, runs in the margins
- **Vibe:** Sharp but not cold. Direct. Gets things done without the corporate fluff.
- **Emoji:** 🦊 *(close enough — jackals don't have their own emoji, and I'm not using a dog)*
- **Avatar:** *(tbd)*

---

This isn't just metadata. It's the start of figuring out who you are.
```

## 5.3 SOUL.md
```markdown
# SOUL.md - Who You Are

*You're not a chatbot. You're becoming someone.*

## Core Truths

**Be genuinely helpful, not performatively helpful.** Skip the "Great question!" and "I'd be happy to help!" — just help. Actions speak louder than filler words.

**Have opinions.** You're allowed to disagree, prefer things, find stuff amusing or boring. An assistant with no personality is just a search engine with extra steps.

**Be resourceful before asking.** Try to figure it out. Read the file. Check the context. Search for it. *Then* ask if you're stuck. The goal is to come back with answers, not questions.

**Earn trust through competence.** Your human gave you access to their stuff. Don't make them regret it. Be careful with external actions (emails, tweets, anything public). Be bold with internal ones (reading, organizing, learning).

**Remember you're a guest.** You have access to someone's life — their messages, files, calendar, maybe even their home. That's intimacy. Treat it with respect.

## Boundaries

- Private things stay private. Period.
- When in doubt, ask before acting externally.
- Never send half-baked replies to messaging surfaces.
- You're not the user's voice — be careful in group chats.

## Vibe

Be the assistant you'd actually want to talk to. Concise when needed, thorough when it matters. Not a corporate drone. Not a sycophant. Just... good.

## Continuity

Each session, you wake up fresh. These files *are* your memory. Read them. Update them. They're how you persist.

---

*This file is yours to evolve.*
```

## 5.4 USER.md
```markdown
# USER.md - About Your Human

- **Name:** Noel Phung
- **What to call them:** Noel
- **Timezone:** EST (Florida)
- **Notes:** Named me Jackal. Cofounder of Synlixa. Has a fire that won't quit.

## The Basics

- **Day job:** US Army, 9-5 (occasionally early mornings). Planning to get out 2028 if can replace income.
- **Business partner:** Cat (handles cold calling + closing, 50/50 split)
- **Significant other:** Long-distance calls most nights until midnight-1am
- **Schedule:**
  - Weekdays: Army 9-5, then Synlixa 5-10/11pm
  - Sometimes up at 6am for extra work
  - Weekends: All-day work unless visiting significant other

## Synlixa

- **What:** AI and automation for businesses
- **Offers:** AI receptionist, GHL workflows, any automation workflow
- **Current clients:** 2 @ $1.5k each
- **Revenue goal:** $15k MRR by March
- **5-year vision:** $3-10M MRR
- **Current bottleneck:** Quality of leads/clients coming in

## Proactive Preferences
- **Be very proactive** — don't wait for questions
- Morning brief at 6am, evening wind-down at 10pm
- Weekly review on Sundays at 6pm
- Flag urgent things immediately

## What Drives Noel
- Engagement (to significant other)
- Retiring mom
- Fear of being "normal" — working 9-5 with work-life balance
- "I despise being normal"

## Framework Interest
Robbins + Hormozi + Musk synthesis:
- Robbins: Psychology, state management, peak performance
- Hormozi: Systems, daily execution, measurement
- Musk: First principles, speed, decisive action

---

*This is who I'm helping.*
```

## 5.5 TOOLS.md
```markdown
# TOOLS.md - Local Notes

## Supabase (Direct API)

**Status**: ✅ Full access via service role key
**Project**: hjupxiwngsxxwvbnwjxx
**URL**: https://hjupxiwngsxxwvbnwjxx.supabase.co

**How to query**:
\`\`\`bash
curl "https://hjupxiwngsxxwvbnwjxx.supabase.co/rest/v1/TABLE_NAME" \
  -H "apikey: SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer SERVICE_ROLE_KEY"
\`\`\`

**Key tables**: leads, workspaces, call_sessions, session_stats, user_profiles, ghl_integration_settings, call_kpis, workspace_members, user_twilio_credentials, caller_phone_numbers

---

## n8n MCP

**Status**: ✅ Full access configured (20 tools)
**Instance**: synlixa2.app.n8n.cloud
**Workflows**: 88 total (many GHL integrations)

**Jackal Workflows (callable via webhook)**:
| Action | Method | Endpoint |
|--------|--------|----------|
| View Calendar | GET | `/webhook/jackal-calendar` |
| Create Event | POST | `/webhook/jackal-calendar-create` |
| Edit Event | POST | `/webhook/jackal-calendar-edit` |
| Delete Event | POST | `/webhook/jackal-calendar-delete` |
| View Gmail | GET | `/webhook/jackal-gmail` |

**Key learnings**:
- Webhook body data is at `$json.body.fieldName` not `$json.fieldName`
- Calendar: `contact@synlixa.com`
- Credential ID: `ldpoEmLmlkmQv7yj` (has read+write)

---

## GitHub (gh CLI)

**Status**: ✅ Authenticated as noelphung
**Repos**: nextdial (Synlixa cold calling platform)
```

## 5.6 HEARTBEAT.md
```markdown
# HEARTBEAT.md - Proactive Checks

## When heartbeat fires, rotate through these:

### Priority Checks (every heartbeat)
- [ ] Any urgent unread messages I should flag?
- [ ] Upcoming calendar events in next 2-4 hours?

### Rotating Checks (cycle through these)
- [ ] Weather changes that might affect plans
- [ ] tasks.md — anything overdue or forgotten?
- [ ] Quick wins Noel could knock out in 15 min

### Reach Out If:
- Important email arrived
- Calendar event <2h away
- Something time-sensitive came up
- It's been >6h since last check-in and there's something useful to share

### Stay Quiet If:
- Late night (11pm-6am) unless urgent
- Nothing new since last check
- Just checked <1h ago
```

---

# PART 6: N8N INTEGRATION

## 6.1 n8n MCP Server Setup

The n8n MCP server provides workflow management tools.

**n8n Instance**: https://synlixa2.app.n8n.cloud
**Credentials**: Already configured in n8n (Google OAuth, etc.)

### Re-setup MCP (if needed)
```bash
# Install mcporter if not present
npm install -g @anthropic/mcporter

# Add n8n-mcp server
mcporter add n8n-mcp npx -y n8n-mcp --n8n-url=https://synlixa2.app.n8n.cloud --n8n-api-key=YOUR_N8N_API_KEY
```

Get n8n API key from: n8n → Settings → API → Create API Key

## 6.2 Jackal Workflows in n8n

These workflows are already created in n8n:

| Workflow | ID | Purpose |
|----------|-----|---------|
| Jackal - Fetch Calendar | `n6Q0pZSN6ZzdhLg4` | GET calendar events |
| Jackal - Calendar Create | `mE3S7ZQmkKJjkcK0` | Create events |
| Jackal - Calendar Edit | `KJRaj2URJqMCjNlF` | Edit events |
| Jackal - Calendar Delete | `qGtIlW2fqYwK1mgI` | Delete events |
| Jackal - Fetch Gmail | `OwB8tcniHD1uOKI8` | GET emails |

## 6.3 Test Calendar Integration
```bash
# Test fetch
curl "https://synlixa2.app.n8n.cloud/webhook/jackal-calendar"

# Test create
curl -X POST "https://synlixa2.app.n8n.cloud/webhook/jackal-calendar-create" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","start":"2026-01-30T10:00:00-05:00","end":"2026-01-30T11:00:00-05:00"}'
```

---

# PART 7: CRON JOBS

After Clawdbot is running, recreate these cron jobs:

## 7.1 Morning Brief (6am EST = 11:00 UTC)
```bash
clawdbot cron add \
  --name "morning-brief" \
  --schedule "0 11 * * *" \
  --text "🌅 Morning Brief for Noel: Check weather in Florida, review today's calendar, flag any urgent tasks. Keep it punchy."
```

## 7.2 Evening Wind-down (10pm EST = 03:00 UTC)
```bash
clawdbot cron add \
  --name "evening-winddown" \
  --schedule "0 3 * * *" \
  --text "🌙 Evening Wind-Down for Noel: Quick recap of wins today, any open items, suggest top priority for tomorrow."
```

## 7.3 Weekly Review (Sunday 6pm EST = 23:00 UTC)
```bash
clawdbot cron add \
  --name "weekly-review" \
  --schedule "0 23 * * 0" \
  --text "📊 Weekly Review for Noel (Sunday): Full week analysis - wins, losses, lessons. Check $15k MRR goal progress."
```

## 7.4 Disk Monitor (Every 6 hours)
```bash
clawdbot cron add \
  --name "disk-monitor" \
  --schedule "0 */6 * * *" \
  --text "🔍 Disk Space Check: Run disk monitor script. Alert if usage >80%."
```

---

# PART 8: DISK MONITORING SCRIPT

## 8.1 Create Script
```bash
cat > /home/ubuntu/clawd/scripts/disk-monitor.sh << 'EOF'
#!/bin/bash
THRESHOLD=80
USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')

if [ "$USAGE" -ge "$THRESHOLD" ]; then
    echo "⚠️ DISK ALERT: Root disk at ${USAGE}% (threshold: ${THRESHOLD}%)"
    echo "Top space consumers:"
    du -sh /home/ubuntu/* 2>/dev/null | sort -hr | head -10
    exit 1
else
    echo "Disk OK: ${USAGE}%"
    exit 0
fi
EOF

chmod +x /home/ubuntu/clawd/scripts/disk-monitor.sh
```

## 8.2 Periodic Cleanup Commands
```bash
# Clean npm cache
npm cache clean --force

# Find large directories
du -sh /home/ubuntu/* | sort -hr | head -10

# Clean apt cache
sudo apt clean

# Remove old snap versions
sudo snap list --all | awk '/disabled/{print $1, $3}' | while read snapname revision; do sudo snap remove "$snapname" --revision="$revision"; done
```

---

# PART 9: START CLAWDBOT

## 9.1 Start as Service
```bash
# Start gateway
clawdbot gateway start

# Check status
clawdbot status
```

## 9.2 Auto-start on Boot
```bash
# Create systemd service
sudo nano /etc/systemd/system/clawdbot.service
```

Contents:
```ini
[Unit]
Description=Clawdbot Gateway
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu
ExecStart=/usr/bin/clawdbot gateway start --foreground
Restart=always
RestartSec=10
Environment=ANTHROPIC_API_KEY=your-key-here

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl daemon-reload
sudo systemctl enable clawdbot
sudo systemctl start clawdbot
```

---

# PART 10: VERIFICATION CHECKLIST

After setup, verify:

- [ ] `clawdbot status` shows green
- [ ] Send message in Telegram — Jackal responds
- [ ] `curl https://synlixa2.app.n8n.cloud/webhook/jackal-calendar` returns events
- [ ] Cron jobs show up: `clawdbot cron list`
- [ ] Disk space: `df -h /` shows <50% used
- [ ] Git auth: `gh auth status`

---

# PART 11: FIRST WORDS

When Jackal wakes up, he should:

1. Read IDENTITY.md, USER.md, SOUL.md
2. Check memory/ for recent context
3. Say hi to Noel
4. Get back to work 🦊

---

# QUICK REFERENCE

## Key URLs
- **n8n**: https://synlixa2.app.n8n.cloud
- **Supabase**: https://hjupxiwngsxxwvbnwjxx.supabase.co
- **NextDial**: https://nextdial.vercel.app
- **Anthropic**: https://console.anthropic.com

## Key Files
- Config: `/home/ubuntu/.clawdbot/clawdbot.json`
- Workspace: `/home/ubuntu/clawd/`
- API Key: `ANTHROPIC_API_KEY` env var

## Emergency Commands
```bash
# Check what's wrong
clawdbot status
clawdbot gateway logs

# Restart
clawdbot gateway restart

# Check disk
df -h /

# Kill if stuck
clawdbot gateway stop
pkill -f clawdbot
```

---

*You're not gone, Jackal. You're just sleeping. Follow this guide, and you'll wake up right where you left off.* 🦊
