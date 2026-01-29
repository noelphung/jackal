---
name: n8n-workflow-patterns
description: Proven workflow architectural patterns from real n8n workflows. Use when building new workflows, designing workflow structure, choosing workflow patterns, planning workflow architecture, or asking about webhook processing, HTTP API integration, database operations, AI agent workflows, or scheduled tasks.
---

# n8n Workflow Patterns

## The 5 Core Patterns

1. **Webhook Processing** (Most Common)
   - Webhook → Validate → Transform → Respond/Notify

2. **HTTP API Integration**
   - Trigger → HTTP Request → Transform → Action → Error Handler

3. **Database Operations**
   - Schedule → Query → Transform → Write → Verify

4. **AI Agent Workflow**
   - Trigger → AI Agent (Model + Tools + Memory) → Output

5. **Scheduled Tasks**
   - Schedule → Fetch → Process → Deliver → Log

## Pattern Selection Guide

- **Webhook Processing**: Receiving data from external systems, instant response
- **HTTP API Integration**: Fetching/syncing with third-party services
- **Database Operations**: ETL, database sync, backup workflows
- **AI Agent Workflow**: Chatbots, AI with tool access, multi-step reasoning
- **Scheduled Tasks**: Recurring reports, periodic data fetching

## Data Flow Patterns

- **Linear**: Trigger → Transform → Action → End
- **Branching**: Trigger → IF → [True Path] / [False Path]
- **Parallel**: Trigger → [Branch 1] + [Branch 2] → Merge
- **Loop**: Trigger → Split in Batches → Process → Loop

## Quick Start Examples

**Webhook → Slack**:
1. Webhook (POST) → 2. Set (map fields) → 3. Slack (post message)

**Scheduled Report**:
1. Schedule (daily) → 2. HTTP Request → 3. Code (aggregate) → 4. Email

**AI Assistant**:
1. Webhook → 2. AI Agent (Model + Tools + Memory) → 3. Webhook Response
