---
name: n8n-node-configuration
description: Operation-aware node configuration guidance. Use when configuring nodes, understanding property dependencies, determining required fields, or learning common configuration patterns by node type.
---

# n8n Node Configuration

## Configuration Philosophy

**Progressive disclosure**: Start minimal, add complexity as needed
- `get_node` with `detail: "standard"` covers 95% of use cases
- Different operations require different fields!

## Core Concepts

### Operation-Aware Configuration

Not all fields are always required - depends on operation!

```javascript
// Slack: operation='post'
{ resource: "message", operation: "post", channel: "#general", text: "Hello!" }

// Slack: operation='update' (different fields!)
{ resource: "message", operation: "update", messageId: "123", text: "Updated!" }
```

### Property Dependencies

Fields appear/disappear based on other values:
- POST/PUT/PATCH → sendBody available
- sendBody=true → body required

## get_node Detail Levels

1. **standard** (DEFAULT) - 1-2K tokens, 95% of needs
2. **search_properties** - Find specific fields
3. **full** - Complete schema, 3-8K tokens (use sparingly)

## Common Node Patterns

### Resource/Operation Nodes (Slack, Google Sheets)
```javascript
{ resource: "<entity>", operation: "<action>", ...fields }
```

### HTTP-Based Nodes
```javascript
{ method: "POST", url: "...", sendBody: true, body: {...} }
```

### Conditional Logic (IF, Switch)
```javascript
{ conditions: { string: [{ operation: "equals", value1: "...", value2: "..." }] } }
```

## Best Practices

✅ Start with get_node (standard detail)
✅ Validate iteratively
✅ Check requirements when changing operation
❌ Don't jump to detail="full" immediately
❌ Don't skip validation before deploying
