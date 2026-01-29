---
name: n8n-code-python
description: Write Python code in n8n Code nodes. Use when writing Python in n8n, using _input/_json/_node syntax, working with standard library, or need to understand Python limitations in n8n Code nodes.
---

# Python Code Node (Beta)

## ⚠️ Important: JavaScript First

Use **JavaScript for 95% of use cases**. Only use Python when:
- You need specific Python standard library functions
- You're significantly more comfortable with Python

## Quick Start

```python
items = _input.all()

processed = []
for item in items:
    processed.append({
        "json": {
            **item["json"],
            "processed": True
        }
    })

return processed
```

## Essential Rules

1. **Data access**: `_input.all()`, `_input.first()`, `_input.item`
2. **MUST return**: `[{"json": {...}}]` format
3. **Webhook data**: Under `_json["body"]`
4. **CRITICAL**: No external libraries (no requests, pandas, numpy)

## Available Standard Library

```python
import json, datetime, re, base64, hashlib
import urllib.parse, math, random, statistics
```

## NOT Available

```python
import requests  # ❌
import pandas    # ❌
import numpy     # ❌
```

**Workaround**: Use HTTP Request node before Code node, or switch to JavaScript.

## Critical: Webhook Data

```python
❌ WRONG: name = _json["name"]
✅ CORRECT: name = _json["body"]["name"]
✅ SAFER: name = _json.get("body", {}).get("name")
```

## Return Format

```python
# ✅ Correct
return [{"json": {"result": "success"}}]
return [{"json": item["json"]} for item in items]

# ❌ Wrong
return {"json": {"result": "success"}}  # Missing list
```

## Best Practices

- Always use `.get()` for dictionary access
- Handle None/null values explicitly
- Use list comprehensions for filtering
