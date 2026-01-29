# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

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

**Jackal Workflows (callable via webhook)**:
| Action | Method | Endpoint |
|--------|--------|----------|
| View Calendar | GET | `/webhook/jackal-calendar` |
| Create Event | POST | `/webhook/jackal-calendar-create` |
| Edit Event | POST | `/webhook/jackal-calendar-edit` |
| Delete Event | POST | `/webhook/jackal-calendar-delete` |
| View Gmail | GET | `/webhook/jackal-gmail` |

**Key learnings** (see `memory/n8n-building-guide.md`):
- Webhook body data is at `$json.body.fieldName` not `$json.fieldName`
- Calendar: `contact@synlixa.com`
- Credential ID: `ldpoEmLmlkmQv7yj` (has read+write)

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
