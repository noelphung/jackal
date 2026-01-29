# n8n Workflow Building Guide

## Credentials

### Google Calendar OAuth2
- **Credential ID**: `ldpoEmLmlkmQv7yj`
- **Name**: `contact`
- **Calendar**: `contact@synlixa.com`
- **Permissions**: Read + Write (full CRUD)

### Key Lesson
The credential originally only had read access. Noel had to reconnect it in n8n UI with write permissions for create/edit/delete to work.

---

## Webhook Data Structure

**CRITICAL**: Webhook POST body data is nested under `$json.body`, NOT just `$json`

```javascript
// WRONG
$json.title
$json.start

// CORRECT  
$json.body.title
$json.body.start
```

---

## Working Workflow Patterns

### 1. Fetch/Read Pattern (GET webhook)
```
Webhook (GET) → Google Calendar (getAll) → Respond to Webhook
```

**Webhook config:**
```json
{
  "httpMethod": "GET",
  "path": "jackal-calendar",
  "responseMode": "responseNode",
  "options": {}
}
```

**Respond config:**
```json
{
  "respondWith": "allIncomingItems",
  "options": {}
}
```

### 2. Create/Edit/Delete Pattern (POST webhook)
```
Webhook (POST) → Google Calendar (create/update/delete) → Respond to Webhook
```

**Webhook config:**
```json
{
  "httpMethod": "POST",
  "path": "jackal-calendar-create",
  "responseMode": "responseNode",
  "options": {}
}
```

---

## Google Calendar Node Configs

### Create Event
```json
{
  "resource": "event",
  "operation": "create",
  "calendar": {
    "__rl": true,
    "value": "contact@synlixa.com",
    "mode": "list",
    "cachedResultName": "contact@synlixa.com"
  },
  "start": "={{ $json.body.start }}",
  "end": "={{ $json.body.end }}",
  "additionalFields": {
    "summary": "={{ $json.body.title }}",
    "description": "={{ $json.body.description || '' }}"
  }
}
```

### Update Event
```json
{
  "resource": "event",
  "operation": "update",
  "calendar": { "__rl": true, "value": "contact@synlixa.com", "mode": "list" },
  "eventId": "={{ $json.body.eventId }}",
  "useDefaultReminders": true,
  "updateFields": {
    "summary": "={{ $json.body.title }}",
    "start": "={{ $json.body.start }}",
    "end": "={{ $json.body.end }}",
    "description": "={{ $json.body.description }}"
  }
}
```

### Delete Event
```json
{
  "resource": "event",
  "operation": "delete",
  "calendar": { "__rl": true, "value": "contact@synlixa.com", "mode": "list" },
  "eventId": "={{ $json.body.eventId }}"
}
```

### Get All Events
```json
{
  "operation": "getAll",
  "calendar": { "__rl": true, "value": "contact@synlixa.com", "mode": "list" },
  "returnAll": true,
  "options": {
    "timeMin": "={{ $now.toISO() }}",
    "timeMax": "={{ $now.plus({days: 7}).toISO() }}"
  }
}
```

---

## Active Jackal Workflows

| Workflow | ID | Method | Endpoint |
|----------|-----|--------|----------|
| Jackal - Fetch Calendar | `n6Q0pZSN6ZzdhLg4` | GET | `/webhook/jackal-calendar` |
| Jackal - Calendar Create | `mE3S7ZQmkKJjkcK0` | POST | `/webhook/jackal-calendar-create` |
| Jackal - Calendar Edit | `KJRaj2URJqMCjNlF` | POST | `/webhook/jackal-calendar-edit` |
| Jackal - Calendar Delete | `qGtIlW2fqYwK1mgI` | POST | `/webhook/jackal-calendar-delete` |
| Jackal - Fetch Gmail | `OwB8tcniHD1uOKI8` | GET | `/webhook/jackal-gmail` |

---

## API Call Examples

### Create Event
```bash
curl -X POST "https://synlixa2.app.n8n.cloud/webhook/jackal-calendar-create" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meeting Title",
    "start": "2026-01-30T10:00:00-05:00",
    "end": "2026-01-30T11:00:00-05:00",
    "description": "Optional description"
  }'
```

### Edit Event
```bash
curl -X POST "https://synlixa2.app.n8n.cloud/webhook/jackal-calendar-edit" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "event_id_from_google",
    "title": "Updated Title",
    "start": "2026-01-30T11:00:00-05:00",
    "end": "2026-01-30T12:00:00-05:00",
    "description": "Updated description"
  }'
```

### Delete Event
```bash
curl -X POST "https://synlixa2.app.n8n.cloud/webhook/jackal-calendar-delete" \
  -H "Content-Type: application/json" \
  -d '{"eventId": "event_id_from_google"}'
```

### Fetch Calendar
```bash
curl "https://synlixa2.app.n8n.cloud/webhook/jackal-calendar"
```

---

## Common Gotchas

1. **Webhook not registered (404)**: Add `webhookId` to webhook node, then deactivate/reactivate workflow

2. **Credential permissions**: Read-only credentials will fail on create/edit/delete - need to reconnect with full permissions in n8n UI

3. **Response mode**: Use `responseMode: "responseNode"` with a Respond to Webhook node, OR use `responseMode: "lastNode"` without one - don't mix

4. **Calendar selector**: Always use the `__rl` format with mode "list" for calendar selection

5. **DateTime format**: Use ISO 8601 with timezone: `2026-01-30T10:00:00-05:00`

---

## n8n MCP Tools Reference

Key tools for workflow management:
- `n8n_create_workflow` - Create new workflow
- `n8n_get_workflow` - Get workflow details
- `n8n_update_partial_workflow` - Update with operations (addNode, updateNode, addConnection, activateWorkflow, etc.)
- `n8n_delete_workflow` - Delete workflow
- `n8n_list_workflows` - List all workflows
- `n8n_executions` - View execution history
- `n8n_test_workflow` - Test workflow execution

### Activation
```bash
mcporter call n8n-mcp.n8n_update_partial_workflow id="workflow_id" 'operations=[{"type":"activateWorkflow"}]'
```

### Add Node + Connection
```bash
mcporter call n8n-mcp.n8n_update_partial_workflow id="workflow_id" 'operations=[
  {"type":"addNode","node":{...}},
  {"type":"addConnection","source":"Node A","target":"Node B"}
]'
```
