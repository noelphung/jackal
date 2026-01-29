# 2nd Brain — Project Specification

## Overview
Personal knowledge base that grows as Jackal and Noel work together. Clean UI (Obsidian meets Linear), auto-updated with insights, concepts, and daily journals.

## Architecture
- **Frontend:** Next.js 14 (App Router)
- **Database:** Supabase (NEW project — separate from NextDial)
- **Hosting:** Vercel (NEW project)
- **Repo:** `noelphung/jackal`
- **Content folder:** `/home/ubuntu/clawd/brain/`

## Supabase Setup (WAITING)
- Project URL: TBD
- Anon Key: TBD

## Database Schema

```sql
-- Documents table
create table documents (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content text not null,
  type text not null check (type in ('journal', 'concept', 'project', 'note')),
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table documents enable row level security;

-- Public read (or add auth later)
create policy "Documents are viewable by everyone" 
  on documents for select using (true);
```

## Folder Structure

```
/home/ubuntu/clawd/brain/
├── journals/
│   └── 2026-01-29.md
├── concepts/
│   └── example-concept.md
├── projects/
│   └── second-brain.md
└── notes/
    └── misc.md
```

## Document Frontmatter Format

```markdown
---
title: "Document Title"
type: journal | concept | project | note
tags: [tag1, tag2]
created: 2026-01-29
---

# Content here
```

## UI Components

### Sidebar
- Logo/title
- Search bar
- Navigation by type (Journals, Concepts, Projects, Notes)
- Recent documents
- Tags cloud

### Document Viewer
- Clean typography (Inter/Geist font)
- Markdown rendering
- Table of contents for long docs
- Backlinks section
- Created/updated timestamps

### Dashboard
- Recent documents
- Stats (total docs, by type)
- Tag distribution
- Activity heatmap (optional)

## Jackal Automation

### Daily Journal (end of each day)
1. Create `brain/journals/YYYY-MM-DD.md`
2. Summarize key discussions
3. Link to any concepts created
4. Commit and push to repo
5. Vercel auto-deploys

### Concept Creation (when relevant)
1. Identify important concept from discussion
2. Create `brain/concepts/concept-slug.md`
3. Cross-link to related docs
4. Commit and push

## Styling (Obsidian + Linear)
- Dark mode default, light mode available
- Muted colors, high contrast text
- Subtle animations
- Keyboard navigation
- Command palette (Cmd+K)

## Deployment
- Push to `noelphung/jackal` repo
- Vercel auto-deploys on push
- Custom domain optional: `brain.synlixa.com` or similar
