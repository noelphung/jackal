import { Document, DocumentMeta } from '@/types/document';

export const mockDocuments: Document[] = [
  {
    id: '1',
    slug: '2026-01-29',
    title: 'January 29, 2026',
    type: 'journal',
    tags: ['daily', 'automation', 'nextdial'],
    content: `# January 29, 2026

## Morning Setup

Got all the Jackal workflows verified and working:
- Calendar integration ✅
- Gmail fetching ✅
- CRUD operations for events ✅

## Automated Systems

Set up comprehensive cron jobs for proactive assistance:
- Morning briefs at 6am
- Evening wind-down at 10pm
- Weekly reviews on Sundays

## Security Hardening

Completed full security audit:
- UFW firewall enabled
- Fail2ban running
- SSH hardened

## Notes

The 2nd brain project is taking shape. Building a knowledge base that grows with each conversation.`,
    createdAt: new Date('2026-01-29T00:00:00Z'),
    updatedAt: new Date('2026-01-29T14:00:00Z'),
  },
  {
    id: '2',
    slug: '2026-01-28',
    title: 'January 28, 2026',
    type: 'journal',
    tags: ['daily', 'setup', 'n8n'],
    content: `# January 28, 2026

## Workflow Setup Day

Spent the day setting up n8n workflows for calendar and email integration.

### What Worked
- Calendar read operations
- Event creation via webhook
- Gmail access

### Challenges
- Had to fix the Gmail response format
- Calendar credentials needed proper scoping

## Tomorrow's Focus
- Security hardening
- 2nd brain project kickoff`,
    createdAt: new Date('2026-01-28T00:00:00Z'),
    updatedAt: new Date('2026-01-28T23:00:00Z'),
  },
  {
    id: '3',
    slug: 'proactive-ai-assistant',
    title: 'Proactive AI Assistant',
    type: 'concept',
    tags: ['ai', 'automation', 'philosophy'],
    content: `# Proactive AI Assistant

The idea of an AI that doesn't just respond to questions, but actively monitors, learns, and helps without being asked.

## Core Principles

### 1. Anticipate, Don't Just React
Instead of waiting for "what's on my calendar?", the assistant should:
- Surface important upcoming events
- Warn about conflicts
- Suggest preparation time

### 2. Context Awareness
Understanding when to speak and when to stay silent:
- Late night? Don't disturb unless urgent
- In a meeting? Queue non-urgent items
- Deep work? Respect focus time

### 3. Memory and Learning
Building on past interactions:
- Remember preferences
- Learn communication styles
- Adapt to routines

## Implementation

Using heartbeat-based polling combined with smart triggers:
- Periodic checks for email, calendar, mentions
- Event-driven alerts for urgent items
- Time-based routines for briefs and summaries

## The Balance

Proactive ≠ annoying. The goal is to be helpful without being intrusive.`,
    createdAt: new Date('2026-01-15T00:00:00Z'),
    updatedAt: new Date('2026-01-29T10:00:00Z'),
  },
  {
    id: '4',
    slug: 'synlixa-overview',
    title: 'Synlixa Overview',
    type: 'project',
    tags: ['synlixa', 'business', 'ai'],
    content: `# Synlixa

AI and automation for businesses.

## What We Offer

### AI Receptionist
24/7 phone answering with natural conversation abilities.

### GHL Workflows
Custom automation workflows for Go High Level.

### Any Automation
If it can be automated, we can build it.

## Current Status

- **Clients:** 2 @ $1.5k each
- **Revenue Goal:** $15k MRR by March
- **Team:** Noel (tech) + Cat (sales/closing)

## Products in Development

### NextDial
Cold calling platform with:
- Twilio integration
- AI-powered call summaries
- Lead management
- Analytics dashboard

## Vision

$3-10M MRR in 5 years, evolving with AI technology.`,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-25T00:00:00Z'),
  },
  {
    id: '5',
    slug: 'second-brain-project',
    title: '2nd Brain Project',
    type: 'project',
    tags: ['project', 'knowledge-base', 'nextjs'],
    content: `# 2nd Brain Project

Personal knowledge base that grows as Jackal and Noel work together.

## Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Database:** Supabase
- **Hosting:** Vercel
- **Styling:** Tailwind CSS

## Features

### Document Types
- **Journals:** Daily logs
- **Concepts:** Ideas and philosophies
- **Projects:** Work in progress
- **Notes:** Quick captures

### UI Goals
- Clean, Linear-inspired design
- Dark mode first
- Keyboard navigation
- Fast search

## Status

🚧 In development

Built the scaffold, working on UI components.`,
    createdAt: new Date('2026-01-29T00:00:00Z'),
    updatedAt: new Date('2026-01-29T14:00:00Z'),
  },
  {
    id: '6',
    slug: 'quick-notes',
    title: 'Quick Notes',
    type: 'note',
    tags: ['misc', 'reminders'],
    content: `# Quick Notes

Random thoughts and reminders.

## To Remember

- Briana's parents - ask about sleepover
- LLC annual report due
- Check A2P status in GHL

## Ideas

- Build a voice-controlled dashboard for car
- Automate morning news digest
- Create weekly reflection template

## Links

- [NextDial Repo](https://github.com/noelphung/nextdial)
- [n8n Instance](https://synlixa2.app.n8n.cloud)`,
    createdAt: new Date('2026-01-20T00:00:00Z'),
    updatedAt: new Date('2026-01-29T08:00:00Z'),
  },
];

// Helper functions to simulate Supabase queries
export function getAllDocuments(): DocumentMeta[] {
  return mockDocuments.map(({ content, ...meta }) => meta);
}

export function getDocumentsByType(type: Document['type']): DocumentMeta[] {
  return mockDocuments
    .filter(doc => doc.type === type)
    .map(({ content, ...meta }) => meta);
}

export function getDocumentBySlug(slug: string): Document | null {
  return mockDocuments.find(doc => doc.slug === slug) || null;
}

export function getRecentDocuments(limit: number = 5): DocumentMeta[] {
  return [...mockDocuments]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, limit)
    .map(({ content, ...meta }) => meta);
}

export function getAllTags(): { tag: string; count: number }[] {
  const tagMap = new Map<string, number>();
  mockDocuments.forEach(doc => {
    doc.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getStats() {
  return {
    total: mockDocuments.length,
    journals: mockDocuments.filter(d => d.type === 'journal').length,
    concepts: mockDocuments.filter(d => d.type === 'concept').length,
    projects: mockDocuments.filter(d => d.type === 'project').length,
    notes: mockDocuments.filter(d => d.type === 'note').length,
  };
}
