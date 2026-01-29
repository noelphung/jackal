'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

interface Session {
  id: string
  kind: string
  agentId: string
  channelId?: string
  lastMessage: string
  lastActive: string
  messageCount: number
  status: 'active' | 'idle' | 'closed'
}

// Demo sessions - in production, fetch from gateway API
const DEMO_SESSIONS: Session[] = [
  {
    id: 'agent:main:main',
    kind: 'main',
    agentId: 'main',
    channelId: 'telegram',
    lastMessage: 'Working on dashboard security...',
    lastActive: 'Just now',
    messageCount: 156,
    status: 'active',
  },
  {
    id: 'agent:main:heartbeat',
    kind: 'heartbeat',
    agentId: 'main',
    lastMessage: 'HEARTBEAT_OK',
    lastActive: '5 min ago',
    messageCount: 48,
    status: 'idle',
  },
]

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>(DEMO_SESSIONS)
  const [loading, setLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--accent-green)'
      case 'idle': return 'var(--accent-yellow)'
      case 'closed': return 'var(--text-muted)'
      default: return 'var(--text-muted)'
    }
  }

  const getKindIcon = (kind: string) => {
    switch (kind) {
      case 'main': return '💬'
      case 'heartbeat': return '💓'
      case 'cron': return '⏰'
      case 'spawn': return '🔀'
      default: return '📋'
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="sessions">
        <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px',
          }}>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}>
                📋 Sessions
              </h1>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
              }}>
                Active and recent conversation sessions
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
            }}>
              <span style={{
                padding: '8px 16px',
                background: 'var(--bg-card)',
                borderRadius: '8px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
              }}>
                {sessions.filter(s => s.status === 'active').length} active
              </span>
            </div>
          </div>

          {/* Sessions List */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-card)',
            overflow: 'hidden',
          }}>
            {sessions.map((session, i) => (
              <div
                key={session.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px 24px',
                  borderBottom: i < sessions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}>
                  {getKindIcon(session.kind)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '4px',
                  }}>
                    <span style={{
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: '600',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {session.id}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      fontSize: '10px',
                      fontWeight: '600',
                      borderRadius: '4px',
                      background: `${getStatusColor(session.status)}20`,
                      color: getStatusColor(session.status),
                      textTransform: 'uppercase',
                    }}>
                      {session.status}
                    </span>
                  </div>
                  <div style={{
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                  }}>
                    {session.lastMessage}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    marginBottom: '4px',
                  }}>
                    {session.messageCount} messages
                  </div>
                  <div style={{
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                  }}>
                    {session.lastActive}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
