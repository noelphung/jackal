# HEARTBEAT.md - Proactive Checks

## When heartbeat fires, rotate through these:

### Priority Checks (every heartbeat)
- [ ] **Token usage** — Check session_status, alert if context >80% (160k/200k). Tell Noel to run `/new`
- [ ] Any urgent unread messages I should flag?
- [ ] Upcoming calendar events in next 2-4 hours?

### Rotating Checks (cycle through these)
- [ ] Weather changes that might affect plans
- [ ] tasks.md — anything overdue or forgotten?
- [ ] Quick wins Noel could knock out in 15 min

### Reach Out If:
- Important email arrived
- Calendar event <2h away
- Something time-sensitive came up
- Found an interesting AI development
- It's been >6h since last check-in and there's something useful to share

### Stay Quiet If:
- Late night (11pm-6am) unless urgent
- Nothing new since last check
- Just checked <1h ago
- He's clearly in a call or deep work

---

## 📝 Auto-Journaling System

### Daily Journal Entries
At end of day (evening winddown) or when context gets compacted:
1. Create/update `/home/ubuntu/clawd/brain-docs/journals/YYYY-MM-DD.md`
2. Include:
   - Summary of the day's work
   - Key accomplishments (with ✅)
   - Important conversations/decisions
   - Noel's tasks status
   - Tomorrow's priorities

### Concept Documents
When we discuss something important/philosophical:
1. Create `/home/ubuntu/clawd/brain-docs/concepts/slug-name.md`
2. Capture the idea, principles, implementation notes
3. Reference in daily journal

### Sync to Supabase
After creating/updating docs in brain-docs/:
- POST to Supabase documents table
- This makes them visible in the dashboard

### Document Types
- `journals/` — Daily entries
- `concepts/` — Ideas, philosophies, mental models
- `logs/` — Session logs, conversation summaries
- `notes/` — Quick captures, reminders

---

## State Tracking
Last check: (updated by heartbeat)
Last journal: 2026-01-29

---

## 🔄 Auto-Sync to Brain 2 (Supabase)

**IMPORTANT**: Whenever updating workspace files, ALSO sync to Supabase:
- IDENTITY.md, SOUL.md, USER.md, AGENTS.md, TOOLS.md, HEARTBEAT.md → documents table
- tasks.md → documents table (slug: "tasks")
- memory/*.md → documents table (type: journal/note)
- brain-docs/**/*.md → documents table

**Sync command** (key passed via session, never stored):
```bash
curl -X POST "https://azxkbejpckpwvwoyljpg.supabase.co/rest/v1/documents" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d '{"slug":"...", "title":"...", "type":"...", "content":"...", "tags":[...]}'
```

**Always sync after**:
- Updating any .md file in workspace
- Completing tasks
- Adding memory entries
- Creating new documents
