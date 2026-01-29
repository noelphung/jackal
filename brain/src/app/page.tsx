'use client'

import { useEffect, useState } from 'react'
import AgentStatus from '@/components/AgentStatus'
import KanbanColumn from '@/components/KanbanColumn'
import { Task, TaskStatus } from '@/components/TaskCard'

// Demo tasks - in production these come from Supabase
const demoTasks: Task[] = [
  // To Do
  { id: '1', title: 'Text Briana\'s parents — sleepover ask', status: 'todo', date: '2026-01-29' },
  { id: '2', title: 'File LLC annual report', status: 'todo', date: '2026-01-29' },
  { id: '3', title: 'File BOIR', status: 'todo', date: '2026-01-29' },
  { id: '4', title: 'Dissolve NoelLaunch LLC', status: 'todo', date: '2026-01-29' },
  { id: '5', title: 'Check Doomsday A2P status in GHL', status: 'todo', date: '2026-01-29' },
  
  // In Progress
  { id: '6', title: '2nd Brain dashboard redesign', status: 'in_progress', date: '2026-01-29' },
  { id: '7', title: 'NextDial console.log cleanup', status: 'in_progress', date: '2026-01-29' },
  
  // Done
  { id: '8', title: 'Jackal workflows verified', status: 'done', date: '2026-01-29' },
  { id: '9', title: 'Security hardening complete', status: 'done', date: '2026-01-29' },
  { id: '10', title: 'Supabase documents table', status: 'done', date: '2026-01-29' },
  { id: '11', title: 'Git push fix (large files)', status: 'done', date: '2026-01-29' },
  { id: '12', title: 'Vercel deployment live', status: 'done', date: '2026-01-29' },
  
  // Archived
  { id: '13', title: 'Initial Clawdbot setup', status: 'archived', date: '2026-01-28' },
  { id: '14', title: 'n8n workflow migration', status: 'archived', date: '2026-01-28' },
]

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(demoTasks)
  const [lastSync, setLastSync] = useState<Date>(new Date())
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Simulate periodic sync
    const interval = setInterval(() => {
      setLastSync(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--bg-primary)',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '180px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <AgentStatus />
        
        {/* Quick Stats */}
        <div style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '4px',
          }}>
            Today
          </div>
          {[
            { label: 'To Do', count: tasks.filter(t => t.status === 'todo').length, color: 'var(--text-secondary)' },
            { label: 'In Progress', count: tasks.filter(t => t.status === 'in_progress').length, color: 'var(--accent-yellow)' },
            { label: 'Done', count: tasks.filter(t => t.status === 'done').length, color: 'var(--accent-green)' },
          ].map(stat => (
            <div key={stat.label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
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

        {/* Kanban Board */}
        <div style={{
          flex: 1,
          display: 'flex',
          gap: '24px',
          padding: '24px',
          overflowX: 'auto',
        }}>
          <KanbanColumn status="todo" tasks={tasks} />
          <KanbanColumn status="in_progress" tasks={tasks} />
          <KanbanColumn status="done" tasks={tasks} />
          <KanbanColumn status="archived" tasks={tasks} />
        </div>
      </main>
    </div>
  )
}
