---
name: n8n-expression-syntax
description: Validate n8n expression syntax and fix common errors. Use when writing n8n expressions, using {{}} syntax, accessing $json/$node variables, troubleshooting expression errors, or working with webhook data in workflows.
---

# n8n Expression Syntax

## Expression Format

All dynamic content uses **double curly braces**: `{{expression}}`

```
✅ {{$json.email}}
✅ {{$json.body.name}}
✅ {{$node["HTTP Request"].json.data}}
❌ $json.email  (no braces)
```

## 🚨 CRITICAL: Webhook Data Structure

**Webhook data is NOT at the root!**

```javascript
❌ WRONG: {{$json.name}}
✅ CORRECT: {{$json.body.name}}
```

Webhook node wraps data under `.body` property.

## Core Variables

- `$json` - Current node output: `{{$json.fieldName}}`
- `$node` - Reference other nodes: `{{$node["Node Name"].json.field}}`
- `$now` - Current timestamp: `{{$now.toFormat('yyyy-MM-dd')}}`
- `$env` - Environment variables: `{{$env.API_KEY}}`

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `$json.field` | `{{$json.field}}` |
| `{{$json.name}}` (webhook) | `{{$json.body.name}}` |
| `{{$node.HTTP Request}}` | `{{$node["HTTP Request"]}}` |
| `'={{$json.email}}'` (Code node) | `$json.email` |

## When NOT to Use Expressions

- **Code nodes**: Use direct JavaScript (`$json.email` not `{{$json.email}}`)
- **Webhook paths**: Static paths only
- **Credential fields**: Use n8n credential system
