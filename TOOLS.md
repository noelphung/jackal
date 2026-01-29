# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## Brain 2 (Backup Supabase)

**Status**: ✅ Full backup destination
**Project**: azxkbejpckpwvwoyljpg
**URL**: https://azxkbejpckpwvwoyljpg.supabase.co
**Dashboard**: https://jackal-brain.vercel.app

**Tables**: documents, tasks, projects, settings, activity_log, api_keys

**Document types**: journal, concept, project, note

**How to sync** (key passed via Telegram, not stored):
```bash
curl -X POST "$URL/rest/v1/documents" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d '{"slug":"...", "title":"...", "type":"...", "content":"...", "tags":[...]}'
```

---

## Supabase (Direct API)

**Status**: ✅ Full access via service role key
**Project**: hjupxiwngsxxwvbnwjxx
**URL**: https://hjupxiwngsxxwvbnwjxx.supabase.co

**How to query**:
```bash
curl "https://hjupxiwngsxxwvbnwjxx.supabase.co/rest/v1/TABLE_NAME" \
  -H "apikey: SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer SERVICE_ROLE_KEY"
```

**Key tables**: leads, workspaces, call_sessions, session_stats, user_profiles, ghl_integration_settings, call_kpis, workspace_members, user_twilio_credentials, caller_phone_numbers

**RPC functions**: bulk_import_leads, get_user_context, get_performance_metrics, get_or_create_active_session

---

## Vercel MCP

**Status**: ✅ Full access configured (150 tools)
**Project**: nextdial
**URL**: https://nextdial.vercel.app

Access via: `mcporter call vercel.<tool_name>`

---

## n8n MCP

**Status**: ✅ Full access configured (20 tools)
**Instance**: synlixa2.app.n8n.cloud
**Workflows**: 88 total (many GHL integrations)

**Tools available**:
- `search_nodes` - Find n8n nodes by keyword
- `get_node` - Get node details, docs, properties
- `search_templates` - Find workflow templates
- `get_template` - Get full workflow template
- `validate_node` - Validate node config
- `validate_workflow` - Validate complete workflow
- `n8n_create_workflow` - Create new workflows
- `n8n_get_workflow` - Get workflow details
- `n8n_update_full_workflow` - Full workflow update
- `n8n_update_partial_workflow` - Partial updates
- `n8n_delete_workflow` - Delete workflows
- `n8n_list_workflows` - List all workflows
- `n8n_test_workflow` - Test workflow execution
- `n8n_executions` - View execution history
- `n8n_deploy_template` - Deploy from template library
- `n8n_workflow_versions` - Version history/rollback

**Jackal Workflows (all verified working ✅)**:
| Action | Method | Endpoint | Body |
|--------|--------|----------|------|
| View Calendar | GET | `/webhook/jackal-calendar` | - |
| Create Event | POST | `/webhook/jackal-calendar-create` | `{title, start, end}` |
| Edit Event | POST | `/webhook/jackal-calendar-edit` | `{eventId, title?, start?, end?}` |
| Delete Event | POST | `/webhook/jackal-calendar-delete` | `{eventId}` |
| View Gmail | GET | `/webhook/jackal-gmail` | - (returns 25 recent emails) |

**Base URL**: `https://synlixa2.app.n8n.cloud`

**Key config** (see `memory/n8n-building-guide.md`):
- Calendar: `contact@synlixa.com`
- Gmail: `hung.d.phung1@gmail.com` (credential: `wblZcTHvkgkySzfJ`)
- Calendar Credential ID: `ldpoEmLmlkmQv7yj` (has read+write)
- Webhook body data is at `$json.body.fieldName` not `$json.fieldName`

---

## GitHub (gh CLI)

**Status**: ✅ Authenticated as noelphung
**Repos**: nextdial (Synlixa cold calling platform)

Commands: `gh repo`, `gh issue`, `gh pr`, `gh run`, `gh api`

---

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

---

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
