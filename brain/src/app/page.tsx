'use client'

import { useEffect, useState, useCallback } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase, Task, Document } from '@/lib/supabase'

interface SystemStatus {
  disk: { total: string; used: string; free: string; percent: number }
  memory: { total: string; used: string }
  uptime: string
  context: { used: number; total: number; percent: number }
  lastHeartbeat: string
  state: string
}

interface Stats {
  totalTasks: number
  completedTasks: number
  totalDocuments: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    totalDocuments: 0,
  })
  const [tasks, setTasks] = useState<Task[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const loadData = useCallback(async () => {
    try {
      // Load ALL tasks (no user filter)
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .order('priority', { ascending: true })

      // Load documents count
      const { data: docs } = await supabase
        .from('documents')
        .select('id')

      // Load system status
      const { data: statusDoc } = await supabase
        .from('documents')
        .select('content, updated_at')
        .eq('slug', '_system_status')
        .single()

      const allTasks = tasksData || []

      setStats({
        totalTasks: allTasks.length,
        completedTasks: allTasks.filter(t => t.status === 'done').length,
        totalDocuments: docs?.length || 0,
      })

      setTasks(allTasks)

      if (statusDoc?.content) {
        try {
          const status = JSON.parse(statusDoc.content)
          setSystemStatus(status)
        } catch (e) {
          console.error('Failed to parse system status:', e)
        }
      }

      setLastUpdate(new Date())
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()

    // Set up realtime subscriptions
    const tasksChannel = supabase
      .channel('tasks_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        loadData()
      })
      .subscribe()

    const docsChannel = supabase
      .channel('docs_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'documents' }, () => {
        loadData()
      })
      .subscribe()

    // Poll for system status every 10 seconds (for live data)
    const pollInterval = setInterval(loadData, 10000)

    return () => {
      supabase.removeChannel(tasksChannel)
      supabase.removeChannel(docsChannel)
      clearInterval(pollInterval)
    }
  }, [loadData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'var(--accent-yellow)'
      case 'in_progress': return '#f59e0b'
      case 'done': return 'var(--accent-green)'
      case 'backlog': return 'var(--text-muted)'
      default: return 'var(--text-muted)'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  }

  const getDiskColor = (percent: number) => {
    if (percent >= 80) return '#ef4444'
    if (percent >= 60) return 'var(--accent-yellow)'
    return 'var(--accent-green)'
  }

  const getContextColor = (percent: number) => {
    if (percent >= 80) return '#ef4444'
    if (percent >= 60) return 'var(--accent-yellow)'
    return 'var(--accent-green)'
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="overview">
        <div style={{ 
          padding: isMobile ? '16px' : '24px', 
          maxWidth: '1400px', 
          margin: '0 auto',
        }}>
          {/* Header */}
          <div style={{ marginBottom: isMobile ? '20px' : '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <h1 style={{
                fontSize: isMobile ? '22px' : '28px',
                fontWeight: '700',
                color: 'var(--text-primary)',
              }}>
                Mission Control 🎯
              </h1>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '8px',
                fontSize: '12px',
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-green)',
                  animation: 'pulse 2s infinite',
                }} />
                <span style={{ color: 'var(--accent-green)' }}>
                  Live • {formatTime(lastUpdate)}
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px' }}>
              <div className="animate-pulse" style={{ fontSize: '48px', marginBottom: '16px' }}>🦊</div>
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {/* System Stats Row */}
              {systemStatus && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                  gap: isMobile ? '10px' : '16px',
                  marginBottom: '20px',
                }}>
                  {/* Disk Space */}
                  <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-card)',
                    padding: isMobile ? '12px' : '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '16px' }}>💾</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Disk Space</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontSize: '20px', fontWeight: '700', color: getDiskColor(systemStatus.disk.percent) }}>
                        {systemStatus.disk.percent}%
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        ({systemStatus.disk.free} free)
                      </span>
                    </div>
                    <div style={{
                      height: '4px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '2px',
                      marginTop: '8px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${systemStatus.disk.percent}%`,
                        background: getDiskColor(systemStatus.disk.percent),
                        borderRadius: '2px',
                      }} />
                    </div>
                  </div>

                  {/* Context Window */}
                  <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-card)',
                    padding: isMobile ? '12px' : '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '16px' }}>🧠</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Context</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontSize: '20px', fontWeight: '700', color: getContextColor(systemStatus.context.percent) }}>
                        {systemStatus.context.percent}%
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        ({Math.round(systemStatus.context.used/1000)}k/{Math.round(systemStatus.context.total/1000)}k)
                      </span>
                    </div>
                    <div style={{
                      height: '4px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '2px',
                      marginTop: '8px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${systemStatus.context.percent}%`,
                        background: getContextColor(systemStatus.context.percent),
                        borderRadius: '2px',
                      }} />
                    </div>
                  </div>

                  {/* Memory */}
                  <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-card)',
                    padding: isMobile ? '12px' : '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '16px' }}>📊</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Memory</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {systemStatus.memory.used}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        / {systemStatus.memory.total}
                      </span>
                    </div>
                  </div>

                  {/* Uptime */}
                  <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-card)',
                    padding: isMobile ? '12px' : '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '16px' }}>⏱️</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Uptime</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                      {systemStatus.uptime.replace('up ', '')}
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)',
                gap: isMobile ? '10px' : '16px',
                marginBottom: '20px',
              }}>
                <StatCard
                  icon="📋"
                  label="Tasks"
                  value={stats.totalTasks}
                  color="var(--accent-blue)"
                  compact={isMobile}
                />
                <StatCard
                  icon="✅"
                  label="Done"
                  value={stats.completedTasks}
                  color="var(--accent-green)"
                  compact={isMobile}
                />
                <StatCard
                  icon="📄"
                  label="Docs"
                  value={stats.totalDocuments}
                  color="#f59e0b"
                  compact={isMobile}
                />
              </div>

              {/* Tasks Section */}
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-card)',
                padding: isMobile ? '16px' : '20px',
                marginBottom: '20px',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}>
                  <h2 style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                  }}>
                    📋 Today&apos;s Tasks
                  </h2>
                  <span style={{
                    fontSize: '12px',
                    color: tasks.filter(t => t.status !== 'done').length > 0 ? 'var(--accent-yellow)' : 'var(--accent-green)',
                    background: 'var(--bg-secondary)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}>
                    {tasks.filter(t => t.status !== 'done').length} pending
                  </span>
                </div>

                {tasks.length === 0 ? (
                  <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
                    <p>No tasks yet</p>
                  </div>
                ) : (
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: '10px',
                  }}>
                    {tasks.map(task => (
                      <div
                        key={task.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px',
                          background: task.status === 'done' ? 'var(--bg-done)' : 'var(--bg-secondary)',
                          borderRadius: '10px',
                          borderLeft: `3px solid ${getStatusColor(task.status)}`,
                          opacity: task.status === 'done' ? 0.7 : 1,
                        }}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '6px',
                          border: task.status === 'done' ? 'none' : `2px solid ${getStatusColor(task.status)}`,
                          background: task.status === 'done' ? 'var(--accent-green)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {task.status === 'done' && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            color: task.status === 'done' ? 'var(--text-muted)' : 'var(--text-primary)',
                            fontSize: '13px',
                            fontWeight: '500',
                            textDecoration: task.status === 'done' ? 'line-through' : 'none',
                          }}>
                            {task.title}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions + Status */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '16px',
              }}>
                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-card)',
                  padding: isMobile ? '16px' : '20px',
                }}>
                  <h2 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '14px',
                  }}>
                    ⚡ Quick Actions
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <QuickAction href="/documents" icon="📄" label="Documents" />
                    <QuickAction href="/cron" icon="⏰" label="Cron Jobs" />
                    <QuickAction href="/agent" icon="🤖" label="Agent" />
                    <QuickAction href="/logs" icon="📝" label="Logs" />
                  </div>
                </div>

                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-card)',
                  padding: isMobile ? '16px' : '20px',
                }}>
                  <h2 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '14px',
                  }}>
                    🖥️ Services
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <StatusItem label="Jackal Agent" status="online" />
                    <StatusItem label="Supabase" status="online" />
                    <StatusItem label="GitHub Sync" status="online" />
                    <StatusItem label="Vercel" status="online" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function StatCard({ icon, label, value, color, compact }: {
  icon: string; label: string; value: number; color: string; compact?: boolean
}) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '12px',
      border: '1px solid var(--border-card)',
      padding: compact ? '12px' : '16px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: compact ? '20px' : '24px', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: compact ? '24px' : '28px', fontWeight: '700', color }}>{value}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</div>
    </div>
  )
}

function QuickAction({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a href={href} style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '12px', background: 'var(--bg-secondary)', borderRadius: '10px',
      color: 'var(--text-primary)', textDecoration: 'none', fontSize: '13px', fontWeight: '500',
    }}>
      <span style={{ fontSize: '14px' }}>{icon}</span>
      {label}
    </a>
  )
}

function StatusItem({ label, status }: { label: string; status: 'online' | 'offline' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px', background: 'var(--bg-secondary)', borderRadius: '8px',
    }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: status === 'online' ? 'var(--accent-green)' : '#ef4444',
        }} />
        <span style={{ color: status === 'online' ? 'var(--accent-green)' : '#ef4444', fontSize: '11px' }}>
          {status}
        </span>
      </div>
    </div>
  )
}
