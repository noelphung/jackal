'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

interface Document {
  id: string
  slug: string
  title: string
  type: 'journal' | 'concept' | 'note' | 'project'
  content: string
  tags: string[]
  created_at: string
  updated_at: string
}

const TYPE_ICONS: Record<string, string> = {
  journal: '📓',
  concept: '💡',
  note: '📝',
  project: '🚀',
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false })

      if (!error && data) {
        setDocuments(data)
        if (data.length > 0 && !selectedDoc) {
          setSelectedDoc(data[0])
        }
      }
    } catch (err) {
      console.error('Failed to load documents:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredDocs = documents.filter(doc => {
    if (filter !== 'all' && doc.type !== filter) return false
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="documents">
        <div style={{ display: 'flex', height: '100%' }}>
          {/* Sidebar */}
          <div style={{
            width: '320px',
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Search & Filters */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '13px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}
              />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['all', 'journal', 'concept', 'note', 'project'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      background: filter === type ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                      border: filter === type ? 'none' : '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: filter === type ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {type === 'all' ? '📚 All' : `${TYPE_ICONS[type]} ${type}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Document List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {loading ? (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                  Loading...
                </div>
              ) : filteredDocs.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
                  <p>No documents found</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredDocs.map(doc => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      style={{
                        padding: '14px',
                        background: selectedDoc?.id === doc.id ? 'var(--bg-card)' : 'transparent',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        border: selectedDoc?.id === doc.id ? '1px solid var(--border-card)' : '1px solid transparent',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}>
                        <span>{TYPE_ICONS[doc.type]}</span>
                        <span style={{
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}>
                          {doc.title}
                        </span>
                      </div>
                      <div style={{
                        color: 'var(--text-muted)',
                        fontSize: '11px',
                      }}>
                        {formatDate(doc.updated_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Document Viewer */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {selectedDoc ? (
              <>
                {/* Document Header */}
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid var(--border-subtle)',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '8px',
                  }}>
                    <span style={{ fontSize: '24px' }}>{TYPE_ICONS[selectedDoc.type]}</span>
                    <h1 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                    }}>
                      {selectedDoc.title}
                    </h1>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                  }}>
                    <span>Updated {formatDate(selectedDoc.updated_at)}</span>
                    <span>•</span>
                    <span style={{ textTransform: 'capitalize' }}>{selectedDoc.type}</span>
                    {selectedDoc.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {selectedDoc.tags.map(tag => (
                            <span
                              key={tag}
                              style={{
                                padding: '2px 8px',
                                background: 'var(--bg-secondary)',
                                borderRadius: '4px',
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Document Content */}
                <div style={{
                  flex: 1,
                  padding: '24px',
                  overflowY: 'auto',
                }}>
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      lineHeight: '1.8',
                      whiteSpace: 'pre-wrap',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {selectedDoc.content}
                  </div>
                </div>
              </>
            ) : (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                  <p>Select a document to view</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
