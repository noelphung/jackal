'use client'

import { useEffect, useState } from 'react'
import AgentStatus from '@/components/AgentStatus'
import KanbanColumn from '@/components/KanbanColumn'
import Overview from '@/components/Overview'
import DocumentList from '@/components/DocumentList'
import DocumentViewer from '@/components/DocumentViewer'
import { Task } from '@/components/TaskCard'
import { Document, DocumentMeta } from '@/types/document'
import { getAllDocuments, getDocumentBySlug } from '@/lib/mock-data'

type TabType = 'overview' | 'tasks' | 'documents' | 'logs'

// Demo tasks
const demoTasks: Task[] = [
  { id: '1', title: 'Text Briana\'s parents — sleepover ask', status: 'todo', date: '2026-01-29' },
  { id: '2', title: 'File LLC annual report', status: 'todo', date: '2026-01-29' },
  { id: '3', title: 'File BOIR', status: 'todo', date: '2026-01-29' },
  { id: '4', title: 'Dissolve NoelLaunch LLC', status: 'todo', date: '2026-01-29' },
  { id: '5', title: 'Check Doomsday A2P status in GHL', status: 'todo', date: '2026-01-29' },
  { id: '6', title: '2nd Brain dashboard expansion', status: 'in_progress', date: '2026-01-29' },
  { id: '7', title: 'Live status API integration', status: 'in_progress', date: '2026-01-29' },
  { id: '8', title: 'Jackal workflows verified', status: 'done', date: '2026-01-29' },
  { id: '9', title: 'Security hardening complete', status: 'done', date: '2026-01-29' },
  { id: '10', title: 'Supabase documents table', status: 'done', date: '2026-01-29' },
  { id: '11', title: 'Git push fix (large files)', status: 'done', date: '2026-01-29' },
  { id: '12', title: 'Vercel deployment live', status: 'done', date: '2026-01-29' },
  { id: '13', title: 'Initial Clawdbot setup', status: 'archived', date: '2026-01-28' },
  { id: '14', title: 'n8n workflow migration', status: 'archived', date: '2026-01-28' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [tasks] = useState<Task[]>(demoTasks)
  const [documents] = useState<DocumentMeta[]>(getAllDocuments())
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [lastSync, setLastSync] = useState<Date>(new Date())

  useEffect(() => {
    const interval = setInterval(() => setLastSync(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const handleSelectDoc = (meta: DocumentMeta) => {
    const fullDoc = getDocumentBySlug(meta.slug)
    setSelectedDoc(fullDoc)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const navItems = [
    { id: 'overview' as TabType, icon: '📊', label: 'Overview' },
    { id: 'tasks' as TabType, icon: '📋', label: 'Tasks' },
    { id: 'documents' as TabType, icon: '📄', label: 'Documents' },
    { id: 'logs' as TabType, icon: '📝', label: 'Logs' },
  ]

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--bg-primary)',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '200px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <AgentStatus />
        
        {/* Navigation */}
        <nav style={{ padding: '16px 0' }}>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            padding: '0 20px 8px',
          }}>
            Dashboard
          </div>
          {navItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 20px',
                color: activeTab === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
                background: activeTab === item.id ? 'var(--bg-card)' : 'transparent',
                borderLeft: activeTab === item.id ? '3px solid var(--accent-blue)' : '3px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        {/* Quick Stats */}
        <div style={{
          marginTop: 'auto',
          padding: '16px',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '12px',
          }}>
            Quick Stats
          </div>
          {[
            { label: 'To Do', count: tasks.filter(t => t.status === 'todo').length, color: 'var(--text-secondary)' },
            { label: 'In Progress', count: tasks.filter(t => t.status === 'in_progress').length, color: 'var(--accent-yellow)' },
            { label: 'Done', count: tasks.filter(t => t.status === 'done').length, color: 'var(--accent-green)' },
          ].map(stat => (
            <div key={stat.label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              marginBottom: '6px',
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
              <span style={{ color: stat.color, fontWeight: '600' }}>{stat.count}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🦊</span>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'var(--text-primary)',
            }}>
              Jackal Dashboard
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'rgba(34, 197, 94, 0.15)',
              borderRadius: '12px',
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent-green)',
              }} className="animate-pulse" />
              <span style={{
                fontSize: '12px',
                color: 'var(--accent-green)',
                fontWeight: '500',
              }}>
                Online
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <span style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              Last sync: {formatTime(lastSync)}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {activeTab === 'overview' && <Overview />}
          
          {activeTab === 'tasks' && (
            <div style={{
              display: 'flex',
              gap: '24px',
              padding: '24px',
              height: '100%',
              overflowX: 'auto',
            }}>
              <KanbanColumn status="todo" tasks={tasks} />
              <KanbanColumn status="in_progress" tasks={tasks} />
              <KanbanColumn status="done" tasks={tasks} />
              <KanbanColumn status="archived" tasks={tasks} />
            </div>
          )}

          {activeTab === 'documents' && (
            <div style={{
              display: 'flex',
              height: '100%',
            }}>
              <div style={{
                width: '300px',
                borderRight: '1px solid var(--border-subtle)',
              }}>
                <DocumentList 
                  documents={documents}
                  selectedId={selectedDoc?.id}
                  onSelect={handleSelectDoc}
                />
              </div>
              <div style={{ flex: 1 }}>
                <DocumentViewer document={selectedDoc} />
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div style={{
              padding: '24px',
              height: '100%',
              overflowY: 'auto',
            }}>
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border-card)',
                padding: '20px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
              }}>
                <h2 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  📋 Session Logs — Today
                </h2>
                <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>[14:42]</span> Noel requested full command center dashboard</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>[14:35]</span> Dashboard redesigned to kanban style ✓</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>[14:25]</span> Supabase documents table created ✓</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>[14:15]</span> Git large file issue resolved ✓</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>[14:10]</span> Vercel deployment triggered</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>[14:05]</span> Next.js app built successfully</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>[07:00]</span> All Jackal n8n workflows verified ✓</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>[06:45]</span> Security hardening completed ✓</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>[06:30]</span> Cron jobs configured</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>[06:00]</span> Morning brief delivered</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
