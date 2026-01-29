# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## n8n MCP

**Status**: ✅ Full access configured
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

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
