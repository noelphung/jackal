---
name: n8n-mcp-tools-expert
description: Expert guide for using n8n-mcp MCP tools effectively. Use when searching for nodes, validating configurations, accessing templates, managing workflows, or using any n8n-mcp tool. Provides tool selection guidance, parameter formats, and common patterns.
---

# n8n MCP Tools Expert

Master guide for using n8n-mcp MCP server tools to build workflows.

## Quick Reference - Most Used Tools

| Tool | Use When | Speed |
|------|----------|-------|
| `search_nodes` | Finding nodes by keyword | <20ms |
| `get_node` | Understanding node operations (detail="standard") | <10ms |
| `validate_node` | Checking configurations (mode="full") | <100ms |
| `n8n_create_workflow` | Creating workflows | 100-500ms |
| `n8n_update_partial_workflow` | Editing workflows (MOST USED!) | 50-200ms |
| `validate_workflow` | Checking complete workflow | 100-500ms |

## Critical: nodeType Formats

**Two different formats for different tools!**

### Search/Validate Tools
```javascript
"nodes-base.slack"
"nodes-base.httpRequest"
"nodes-base.webhook"
```

### Workflow Tools
```javascript
"n8n-nodes-base.slack"
"n8n-nodes-base.httpRequest"
"n8n-nodes-base.webhook"
```

## Common Workflow Pattern

1. search_nodes → find node
2. get_node → understand config
3. validate_node → check config
4. n8n_create_workflow → build
5. n8n_validate_workflow → verify
6. n8n_update_partial_workflow → iterate
7. activateWorkflow → go live!

## Best Practices

- Use `get_node({detail: "standard"})` for most use cases (default)
- Specify validation profiles (`profile: "runtime"` recommended)
- Use smart parameters (`branch`, `case`) for clarity
- Include `intent` parameter in workflow updates
- Workflows are built iteratively (56s avg between edits)
