'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, ActivityLog } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

const ACTION_ICONS: Record<string, string> = {
  task_created: '➕',
  task_updated: '✏️',
  task_moved: '↔️',
  task_completed: '✅',
  task_deleted: '🗑️',
  project_created: '📁',
  project_updated: '📝',
  document_created: '📄',
  document_updated: '📝',
  api_key_added: '🔑',
  api_key_removed: '🔐',
  settings_updated: '⚙️',
  login: '🔓',
  default: '📌',
}

export default function LogsPage() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (user) {
      loadLogs()
    }
  }, [user])

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(100)

      if (!error && data) {
        setLogs(data)
      }
    } catch (err) {
      console.error('Failed to load logs:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (d.toDateString() === today.toDateString()) return 'Today'
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
    
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    })
  }

  const groupedLogs = logs.reduce((acc, log) => {
    const dateKey = formatDate(log.created_at)
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(log)
    return acc
  }, {} as Record<string, ActivityLog[]>)

  const filteredGroups = Object.entries(groupedLogs).reduce((acc, [date, dateLogs]) => {
    const filtered = dateLogs.filter(log => {
      if (filter === 'all') return true
      return log.entity_type === filter
    })
    if (filtered.length > 0) {
      acc[date] = filtered
    }
    return acc
  }, {} as Record<string, ActivityLog[]>)

  const getActionIcon = (action: string) => {
    return ACTION_ICONS[action] || ACTION_ICONS.default
  }

  const formatAction = (action: string) => {
    return action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  // Demo logs for when there's no real data yet
  const demoLogs = [
    { time: '15:42', action: 'Session started', detail: 'New conversation initiated' },
    { time: '15:35', action: 'Dashboard expanded', detail: 'Full command center requested' },
    { time: '14:42', action: 'Documents synced', detail: '3 new documents from Supabase' },
    { time: '14:25', action: 'Schema updated', detail: 'Added projects, tasks, api_keys tables' },
    { time: '14:15', action: 'Git push', detail: 'Resolved large file issue' },
    { time: '14:10', action: 'Vercel deploy', detail: 'Production deployment triggered' },
    { time: '14:05', action: 'Build success', detail: 'Next.js app compiled' },
    { time: '07:00', action: 'Workflows verified', detail: 'All 5 Jackal n8n workflows ✓' },
    { time: '06:45', action: 'Security hardened', detail: 'Firewall, SSH, fail2ban configured' },
    { time: '06:30', action: 'Cron configured', detail: '8 scheduled jobs active' },
    { time: '06:00', action: 'Morning brief', detail: 'Daily briefing delivered' },
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="logs">
        <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '4px',
              }}>
                📋 Activity Logs
              </h1>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
              }}>
                Track what Jackal has been doing
              </p>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: '13px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Activity</option>
              <option value="task">Tasks</option>
              <option value="project">Projects</option>
              <option value="document">Documents</option>
              <option value="api_key">API Keys</option>
            </select>
          </div>

          {loading ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
              Loading activity logs...
            </div>
          ) : logs.length === 0 ? (
            /* Show demo logs when no real data */
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-card)',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                }}>
                  Today — Session Activity
                </span>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
              }}>
                {demoLogs.map((log, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      padding: '14px 20px',
                      borderBottom: i < demoLogs.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', minWidth: '60px' }}>
                      [{log.time}]
                    </span>
                    <span style={{ color: 'var(--accent-blue)', minWidth: '140px' }}>
                      {log.action}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {log.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {Object.entries(filteredGroups).map(([date, dateLogs]) => (
                <div
                  key={date}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-card)',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'var(--bg-secondary)',
                  }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                    }}>
                      {date}
                    </span>
                  </div>

                  <div>
                    {dateLogs.map((log, i) => (
                      <div
                        key={log.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '14px',
                          padding: '14px 20px',
                          borderBottom: i < dateLogs.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>
                          {getActionIcon(log.action)}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                            fontWeight: '500',
                            marginBottom: '4px',
                          }}>
                            {formatAction(log.action)}
                          </div>
                          {log.details && Object.keys(log.details).length > 0 && (
                            <div style={{
                              color: 'var(--text-muted)',
                              fontSize: '12px',
                            }}>
                              {JSON.stringify(log.details)}
                            </div>
                          )}
                        </div>
                        <span style={{
                          color: 'var(--text-muted)',
                          fontSize: '12px',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>
                          {formatTime(log.created_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
