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

const TYPE_COLORS: Record<string, string> = {
  journal: 'var(--accent-blue)',
  concept: 'var(--accent-purple)',
  note: 'var(--accent-green)',
  project: 'var(--accent-yellow)',
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showViewer, setShowViewer] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      }
    } catch (err) {
      console.error('Failed to load documents:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectDoc = (doc: Document) => {
    setSelectedDoc(doc)
    if (isMobile) {
      setShowViewer(true)
    }
  }

  const handleBackToList = () => {
    setShowViewer(false)
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

  const getCounts = () => {
    const counts: Record<string, number> = { all: documents.length }
    documents.forEach(doc => {
      counts[doc.type] = (counts[doc.type] || 0) + 1
    })
    return counts
  }

  const counts = getCounts()

  // Mobile: show either list or viewer
  if (isMobile) {
    return (
      <ProtectedRoute>
        <DashboardLayout activeTab="documents">
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {!showViewer ? (
              // Document List (Mobile)
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Search & Filters */}
                <div style={{
                  padding: '16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'var(--bg-secondary)',
                }}>
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '16px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      marginBottom: '12px',
                    }}
                  />
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    flexWrap: 'wrap',
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    paddingBottom: '4px',
                  }}>
                    {['all', 'journal', 'concept', 'note', 'project'].map(type => (
                      <button
                        key={type}
                        onClick={() => setFilter(type)}
                        style={{
                          padding: '10px 14px',
                          fontSize: '13px',
                          background: filter === type ? TYPE_COLORS[type] || 'var(--accent-blue)' : 'var(--bg-primary)',
                          border: filter === type ? 'none' : '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          color: filter === type ? 'white' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                          whiteSpace: 'nowrap',
                          fontWeight: filter === type ? '600' : '400',
                        }}
                      >
                        {type === 'all' ? `📚 All (${counts.all || 0})` : `${TYPE_ICONS[type]} ${counts[type] || 0}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Document List */}
                <div style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  padding: '12px',
                  WebkitOverflowScrolling: 'touch',
                }}>
                  {loading ? (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                      <div className="animate-pulse" style={{ fontSize: '32px' }}>🦊</div>
                      <p style={{ marginTop: '12px' }}>Loading documents...</p>
                    </div>
                  ) : filteredDocs.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                      <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                      <p>No documents found</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {filteredDocs.map(doc => (
                        <div
                          key={doc.id}
                          onClick={() => handleSelectDoc(doc)}
                          style={{
                            padding: '16px',
                            background: 'var(--bg-card)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            border: '1px solid var(--border-card)',
                            transition: 'all 0.2s',
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '6px',
                          }}>
                            <span style={{ fontSize: '18px' }}>{TYPE_ICONS[doc.type]}</span>
                            <span style={{
                              color: 'var(--text-primary)',
                              fontSize: '15px',
                              fontWeight: '500',
                              flex: 1,
                            }}>
                              {doc.title}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>→</span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'var(--text-muted)',
                            fontSize: '12px',
                          }}>
                            <span>{formatDate(doc.updated_at)}</span>
                            {doc.tags.length > 0 && (
                              <>
                                <span>•</span>
                                <span>#{doc.tags[0]}</span>
                                {doc.tags.length > 1 && <span>+{doc.tags.length - 1}</span>}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Document Viewer (Mobile)
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Back Button */}
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'var(--bg-secondary)',
                }}>
                  <button
                    onClick={handleBackToList}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                    }}
                  >
                    ← Back to Documents
                  </button>
                </div>

                {selectedDoc && (
                  <>
                    {/* Document Header */}
                    <div style={{
                      padding: '16px',
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
                          fontSize: '18px',
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                        }}>
                          {selectedDoc.title}
                        </h1>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '8px',
                        color: 'var(--text-muted)',
                        fontSize: '12px',
                      }}>
                        <span>{formatDate(selectedDoc.updated_at)}</span>
                        <span>•</span>
                        <span style={{ 
                          textTransform: 'capitalize',
                          color: TYPE_COLORS[selectedDoc.type],
                          fontWeight: '500',
                        }}>
                          {selectedDoc.type}
                        </span>
                      </div>
                      {selectedDoc.tags.length > 0 && (
                        <div style={{ 
                          display: 'flex', 
                          gap: '6px', 
                          marginTop: '10px',
                          flexWrap: 'wrap',
                        }}>
                          {selectedDoc.tags.map(tag => (
                            <span
                              key={tag}
                              style={{
                                padding: '4px 10px',
                                background: 'var(--bg-secondary)',
                                borderRadius: '6px',
                                fontSize: '12px',
                                color: 'var(--text-muted)',
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Document Content */}
                    <div style={{
                      flex: 1,
                      padding: '16px',
                      overflowY: 'auto',
                      WebkitOverflowScrolling: 'touch',
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
                )}
              </div>
            )}
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  // Desktop Layout
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
                      background: filter === type ? TYPE_COLORS[type] || 'var(--accent-blue)' : 'var(--bg-secondary)',
                      border: filter === type ? 'none' : '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: filter === type ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {type === 'all' ? `📚 All (${counts.all || 0})` : `${TYPE_ICONS[type]} ${counts[type] || 0}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Document List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {loading ? (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                  <div className="animate-pulse" style={{ fontSize: '32px' }}>🦊</div>
                  <p style={{ marginTop: '8px' }}>Loading...</p>
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
                    <span style={{ 
                      textTransform: 'capitalize',
                      color: TYPE_COLORS[selectedDoc.type],
                      fontWeight: '500',
                    }}>
                      {selectedDoc.type}
                    </span>
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
