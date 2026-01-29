---
name: n8n-code-javascript
description: Write JavaScript code in n8n Code nodes. Use when writing JavaScript in n8n, using $input/$json/$node syntax, making HTTP requests with $helpers, working with dates using DateTime, troubleshooting Code node errors.
---

# JavaScript Code Node

## Quick Start

```javascript
const items = $input.all();

const processed = items.map(item => ({
  json: {
    ...item.json,
    processed: true,
    timestamp: new Date().toISOString()
  }
}));

return processed;
```

## Essential Rules

1. **Mode**: Use "Run Once for All Items" (default, 95% of cases)
2. **Data access**: `$input.all()`, `$input.first()`, or `$input.item`
3. **MUST return**: `[{json: {...}}]` format
4. **Webhook data**: Under `$json.body` (not `$json` directly)

## Data Access Patterns

- `$input.all()` - All items (most common)
- `$input.first()` - First item only
- `$input.item` - Current item (Each Item mode)
- `$node["Node Name"].json` - Data from other nodes

## Critical: Webhook Data

```javascript
❌ WRONG: const email = $json.email;
✅ CORRECT: const email = $json.body.email;
```

## Return Format

```javascript
// ✅ Correct
return [{json: {result: "success"}}];
return items.map(item => ({json: item.json}));
return [];

// ❌ Wrong
return {json: {result: "success"}};  // Missing array
return [{result: "success"}];  // Missing json key
```

## Built-in Functions

- `$helpers.httpRequest({method, url, headers})` - HTTP requests
- `DateTime.now()`, `DateTime.fromISO()` - Date/time (Luxon)
- `$jmespath(data, query)` - Query JSON structures

## Common Mistakes

1. No return statement
2. Using `{{$json.field}}` instead of `$json.field`
3. Returning object instead of array
4. Missing null checks
5. Webhook body nesting
