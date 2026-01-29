---
name: n8n
description: Build and manage n8n workflows using the n8n-mcp server via mcporter.
metadata: {"clawdbot":{"emoji":"🔄","requires":{"bins":["mcporter"]}}}
---

# n8n Workflow Automation

Use `mcporter` to interact with n8n via the n8n-mcp server.

## Quick Reference

### Search for nodes
```bash
mcporter call n8n-mcp.search_nodes query="webhook"
mcporter call n8n-mcp.search_nodes query="slack" includeExamples=true
mcporter call n8n-mcp.search_nodes query="AI" source=core
```

### Get node details
```bash
mcporter call n8n-mcp.get_node nodeType="n8n-nodes-base.httpRequest"
mcporter call n8n-mcp.get_node nodeType="n8n-nodes-base.slack" mode=docs
mcporter call n8n-mcp.get_node nodeType="n8n-nodes-base.webhook" detail=full
```

### Search templates
```bash
mcporter call n8n-mcp.search_templates query="chatbot"
mcporter call n8n-mcp.search_templates searchMode=by_task task=ai_automation
mcporter call n8n-mcp.search_templates searchMode=by_nodes 'nodeTypes=["n8n-nodes-base.slack"]'
```

### Get template
```bash
mcporter call n8n-mcp.get_template templateId=1234 mode=structure
```

### Validate node config
```bash
mcporter call n8n-mcp.validate_node nodeType="n8n-nodes-base.slack" 'config={"resource":"channel","operation":"create"}'
```

### Get documentation
```bash
mcporter call n8n-mcp.tools_documentation
mcporter call n8n-mcp.tools_documentation topic="search_nodes" depth=full
```

## Current Setup

**Mode**: ✅ Full workflow management
**Instance**: synlixa2.app.n8n.cloud
**Active workflows**: ~40 (many GHL integrations)

## Common Patterns

### Find the right node for a task
1. Search: `mcporter call n8n-mcp.search_nodes query="send email"`
2. Get details: `mcporter call n8n-mcp.get_node nodeType="n8n-nodes-base.emailSend" mode=docs`

### Build from a template
1. Search: `mcporter call n8n-mcp.search_templates searchMode=by_task task=slack_integration`
2. Get it: `mcporter call n8n-mcp.get_template templateId=<id> mode=full`
3. Customize for Noel's use case

### Validate before deploying
```bash
mcporter call n8n-mcp.validate_workflow 'workflow={"nodes":[...],"connections":{...}}'
```
