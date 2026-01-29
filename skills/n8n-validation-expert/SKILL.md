---
name: n8n-validation-expert
description: Interpret validation errors and guide fixing them. Use when encountering validation errors, validation warnings, false positives, operator structure issues, or need help understanding validation results.
---

# n8n Validation Expert

## Validation Philosophy

**Validate early, validate often** - Validation is iterative:
- Expect 2-3 validate → fix cycles
- Average: 23s thinking, 58s fixing

## Error Severity Levels

### Errors (Must Fix)
- `missing_required` - Required field not provided
- `invalid_value` - Value doesn't match allowed options
- `type_mismatch` - Wrong data type
- `invalid_expression` - Expression syntax error

### Warnings (Should Fix)
- `best_practice` - Recommended but not required
- `deprecated` - Using old API/feature

### Suggestions (Optional)
- `optimization` - Could be more efficient

## Validation Profiles

- **minimal**: Quick checks, most permissive
- **runtime**: Pre-deployment (RECOMMENDED)
- **ai-friendly**: Reduce false positives for AI configs
- **strict**: Maximum validation for production

## The Validation Loop

```
1. Configure node
2. validate_node (read errors)
3. Fix errors
4. Validate again
5. Repeat until valid (2-3 iterations normal)
```

## Auto-Sanitization

Automatically fixes on ANY workflow update:
- Binary operators (equals, contains) → removes singleValue
- Unary operators (isEmpty) → adds singleValue: true
- IF/Switch nodes → adds missing metadata

## Common Fixes

| Error | Fix |
|-------|-----|
| missing_required | Add the field with appropriate value |
| invalid_value | Check allowed options, use valid value |
| type_mismatch | Convert to correct type (number vs string) |
| invalid_expression | Add `{{}}` or fix syntax |
