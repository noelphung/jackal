'use client'

import { useState } from 'react'
import { Document, DocumentMeta } from '@/types/document'

const typeIcons: Record<string, { icon: string; color: string }> = {
  journal: { icon: '📓', color: '#3b82f6' },
  concept: { icon: '💡', color: '#fbbf24' },
  note: { icon: '📝', color: '#22c55e' },
  project: { icon: '🚀', color: '#a855f7' },
}

interface DocumentListProps {
  documents: DocumentMeta[]
  selectedId?: string
  onSelect: (doc: DocumentMeta) => void
  filter?: string
}

export default function DocumentList({ documents, selectedId, onSelect, filter }: DocumentListProps) {
  const [typeFilter, setTypeFilter] = useState<string | null>(filter || null)

  const filtered = typeFilter 
    ? documents.filter(d => d.type === typeFilter)
    : documents

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Filter tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        overflowX: 'auto',
      }}>
        <button
          onClick={() => setTypeFilter(null)}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: 'none',
            background: !typeFilter ? 'var(--bg-card-hover)' : 'transparent',
            color: !typeFilter ? 'var(--text-primary)' : 'var(--text-muted)',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          All ({documents.length})
        </button>
        {Object.entries(typeIcons).map(([type, { icon }]) => {
          const count = documents.filter(d => d.type === type).length
          if (count === 0) return null
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: typeFilter === type ? 'var(--bg-card-hover)' : 'transparent',
                color: typeFilter === type ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s',
              }}
            >
              {icon} {count}
            </button>
          )
        })}
      </div>

      {/* Document list */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px',
      }}>
        {filtered.map((doc, index) => {
          const typeConfig = typeIcons[doc.type] || typeIcons.note
          const isSelected = doc.id === selectedId

          return (
            <div
              key={doc.id}
              onClick={() => onSelect(doc)}
              className="animate-slide-up"
              style={{
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '4px',
                cursor: 'pointer',
                background: isSelected ? 'var(--bg-card-hover)' : 'transparent',
                border: isSelected ? '1px solid var(--border-card)' : '1px solid transparent',
                transition: 'all 0.2s',
                animationDelay: `${index * 30}ms`,
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}>
                <span style={{
                  fontSize: '16px',
                  opacity: 0.8,
                }}>{typeConfig.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {doc.title}
                  </h4>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{
                      fontSize: '11px',
                      color: typeConfig.color,
                      textTransform: 'capitalize',
                    }}>
                      {doc.type}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                    }}>
                      {formatDate(doc.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '13px',
          }}>
            No documents yet
          </div>
        )}
      </div>
    </div>
  )
}
