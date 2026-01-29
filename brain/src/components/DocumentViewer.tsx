'use client'

import React from 'react'
import { Document } from '@/types/document'

interface DocumentViewerProps {
  document: Document | null
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
  if (!document) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: '14px',
        padding: '40px',
        textAlign: 'center',
      }}>
        <div>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px', opacity: 0.3 }}>📄</span>
          Select a document to view
        </div>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Simple markdown-ish rendering
  const renderContent = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let inList = false
    let listItems: string[] = []

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} style={{
            margin: '12px 0',
            paddingLeft: '24px',
            listStyle: 'disc',
          }}>
            {listItems.map((item, i) => (
              <li key={i} style={{
                marginBottom: '6px',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                lineHeight: '1.6',
              }}>
                {item}
              </li>
            ))}
          </ul>
        )
        listItems = []
      }
      inList = false
    }

    lines.forEach((line, i) => {
      const trimmed = line.trim()

      // Headers
      if (trimmed.startsWith('# ')) {
        flushList()
        elements.push(
          <h1 key={i} style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '16px',
            marginTop: elements.length > 0 ? '32px' : '0',
          }}>
            {trimmed.slice(2)}
          </h1>
        )
      } else if (trimmed.startsWith('## ')) {
        flushList()
        elements.push(
          <h2 key={i} style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '12px',
            marginTop: '24px',
            paddingBottom: '8px',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            {trimmed.slice(3)}
          </h2>
        )
      } else if (trimmed.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={i} style={{
            fontSize: '15px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '8px',
            marginTop: '20px',
          }}>
            {trimmed.slice(4)}
          </h3>
        )
      }
      // List items
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        inList = true
        let item = trimmed.slice(2)
        // Handle checkboxes
        if (item.startsWith('[ ] ')) {
          item = '☐ ' + item.slice(4)
        } else if (item.startsWith('[x] ') || item.startsWith('[X] ')) {
          item = '✅ ' + item.slice(4)
        }
        listItems.push(item)
      }
      // Empty line
      else if (trimmed === '') {
        flushList()
      }
      // Regular paragraph
      else if (trimmed) {
        flushList()
        elements.push(
          <p key={i} style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: '1.7',
            marginBottom: '12px',
          }}>
            {trimmed}
          </p>
        )
      }
    })

    flushList()
    return elements
  }

  const typeColors: Record<string, string> = {
    journal: '#3b82f6',
    concept: '#fbbf24',
    note: '#22c55e',
    project: '#a855f7',
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}>
          <span style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: typeColors[document.type] || 'var(--accent-blue)',
            background: `${typeColors[document.type] || 'var(--accent-blue)'}20`,
            padding: '2px 8px',
            borderRadius: '4px',
          }}>
            {document.type}
          </span>
          {document.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
            }}>
              #{tag}
            </span>
          ))}
        </div>
        <h1 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '4px',
        }}>
          {document.title}
        </h1>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {formatDate(document.createdAt)}
        </p>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
      }}>
        {renderContent(document.content)}
      </div>
    </div>
  )
}
