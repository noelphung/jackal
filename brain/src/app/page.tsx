'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase, Task, Project, Document, subscribeToTasks, subscribeToDocuments, unsubscribe, JACKAL_USER_ID } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

interface Stats {
  totalTasks: number
  completedTasks: number
  activeProjects: number
  totalDocuments: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    activeProjects: 0,
    totalDocuments: 0,
  })
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    loadDashboardData()

    // Set up realtime subscriptions
    const tasksChannel = subscribeToTasks((payload) => {
      console.log('Tasks changed:', payload.eventType)
      loadDashboardData() // Reload on any change
      setLastUpdate(new Date())
    })

    const docsChannel = subscribeToDocuments((payload) => {
      console.log('Documents changed:', payload.eventType)
      loadDashboardData()
      setLastUpdate(new Date())
    })

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribe(tasksChannel)
      unsubscribe(docsChannel)
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load tasks (all tasks, not filtered by user)
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .order('priority', { ascending: true })

      // Load projects
      const { data: projectsList } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')

      // Load documents count
      const { data: docs } = await supabase
        .from('documents')
        .select('id')

      const allTasks = tasks || []
      const allProjects = projectsList || []

      setStats({
        totalTasks: allTasks.length,
        completedTasks: allTasks.filter(t => t.status === 'done').length,
        activeProjects: allProjects.length,
        totalDocuments: docs?.length || 0,
      })

      setProjects(allProjects)
      setRecentTasks(allTasks.slice(0, 8)) // Show up to 8 tasks
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'var(--accent-yellow)'
      case 'in_progress': return '#f59e0b'
      case 'review': return 'var(--accent-blue)'
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

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="overview">
        <div style={{ 
          padding: isMobile ? '16px' : '24px', 
          maxWidth: '1400px', 
          margin: '0 auto',
        }}>
          {/* Welcome Header */}
          <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
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
                }} className="animate-pulse" />
                <span style={{ color: 'var(--accent-green)' }}>
                  Live • {formatTime(lastUpdate)}
                </span>
              </div>
            </div>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: isMobile ? '13px' : '14px',
              marginTop: '8px',
            }}>
              Realtime sync with Supabase • Changes appear instantly
            </p>
          </div>

          {loading ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px' }}>
              <div className="animate-pulse" style={{ fontSize: '48px', marginBottom: '16px' }}>🦊</div>
              <p>Loading dashboard...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: isMobile ? '12px' : '20px',
                marginBottom: isMobile ? '20px' : '32px',
              }}>
                <StatCard
                  icon="📋"
                  label="Total Tasks"
                  value={stats.totalTasks}
                  color="var(--accent-blue)"
                  compact={isMobile}
                />
                <StatCard
                  icon="✅"
                  label="Completed"
                  value={stats.completedTasks}
                  color="var(--accent-green)"
                  subtext={stats.totalTasks > 0 ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%` : ''}
                  compact={isMobile}
                />
                <StatCard
                  icon="🚀"
                  label="Projects"
                  value={stats.activeProjects}
                  color="#8b5cf6"
                  compact={isMobile}
                />
                <StatCard
                  icon="📄"
                  label="Documents"
                  value={stats.totalDocuments}
                  color="#f59e0b"
                  compact={isMobile}
                />
              </div>

              {/* Main Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: isMobile ? '16px' : '24px',
              }}>
                {/* Today's Tasks - Full Width on top */}
                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-card)',
                  padding: isMobile ? '16px' : '24px',
                  gridColumn: isMobile ? '1' : '1 / -1',
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
                      color: 'var(--text-muted)',
                      background: 'var(--bg-secondary)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                    }}>
                      {recentTasks.filter(t => t.status !== 'done').length} pending
                    </span>
                  </div>

                  {recentTasks.length === 0 ? (
                    <div style={{
                      padding: isMobile ? '24px 12px' : '40px 20px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
                      <p style={{ fontSize: '13px' }}>No tasks yet</p>
                    </div>
                  ) : (
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                      gap: '10px',
                    }}>
                      {recentTasks.map(task => (
                        <div
                          key={task.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: isMobile ? '12px' : '14px',
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
                            cursor: 'pointer',
                          }}>
                            {task.status === 'done' && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              color: task.status === 'done' ? 'var(--text-muted)' : 'var(--text-primary)',
                              fontSize: '13px',
                              fontWeight: '500',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              textDecoration: task.status === 'done' ? 'line-through' : 'none',
                            }}>
                              {task.title}
                            </div>
                            {task.tags && task.tags.length > 0 && (
                              <div style={{
                                display: 'flex',
                                gap: '4px',
                                marginTop: '4px',
                              }}>
                                {task.tags.slice(0, 2).map(tag => (
                                  <span key={tag} style={{
                                    fontSize: '10px',
                                    color: 'var(--text-muted)',
                                    background: 'var(--bg-primary)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                  }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-card)',
                  padding: isMobile ? '16px' : '24px',
                }}>
                  <h2 style={{
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '16px',
                  }}>
                    ⚡ Quick Actions
                  </h2>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                  }}>
                    <QuickAction href="/pipeline" icon="➕" label="New Task" compact={isMobile} />
                    <QuickAction href="/documents" icon="📄" label="Documents" compact={isMobile} />
                    <QuickAction href="/cron" icon="⏰" label="Cron Jobs" compact={isMobile} />
                    <QuickAction href="/agent" icon="🤖" label="Agent" compact={isMobile} />
                  </div>
                </div>

                {/* System Status */}
                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-card)',
                  padding: isMobile ? '16px' : '24px',
                }}>
                  <h2 style={{
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '16px',
                  }}>
                    🖥️ System Status
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <StatusItem label="Jackal Agent" status="online" compact={isMobile} />
                    <StatusItem label="Supabase Realtime" status="online" compact={isMobile} />
                    <StatusItem label="n8n Workflows" status="online" compact={isMobile} />
                    <StatusItem label="Vercel Deploy" status="online" compact={isMobile} />
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

function StatCard({ icon, label, value, color, subtext, compact }: {
  icon: string
  label: string
  value: number
  color: string
  subtext?: string
  compact?: boolean
}) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: compact ? '12px' : '16px',
      border: '1px solid var(--border-card)',
      padding: compact ? '14px' : '24px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: compact ? 'flex-start' : 'center',
        flexDirection: compact ? 'column' : 'row',
        gap: compact ? '8px' : '12px',
      }}>
        <div style={{
          width: compact ? '36px' : '44px',
          height: compact ? '36px' : '44px',
          borderRadius: compact ? '10px' : '12px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: compact ? '16px' : '20px',
        }}>
          {icon}
        </div>
        <div>
          <div style={{
            color: 'var(--text-muted)',
            fontSize: compact ? '11px' : '12px',
            marginBottom: '2px',
          }}>
            {label}
          </div>
          <div style={{
            color: 'var(--text-primary)',
            fontSize: compact ? '22px' : '28px',
            fontWeight: '700',
            lineHeight: '1',
          }}>
            {value}
          </div>
        </div>
      </div>
      {subtext && (
        <div style={{
          color: color,
          fontSize: '11px',
          fontWeight: '500',
          marginTop: compact ? '6px' : '8px',
        }}>
          {subtext} done
        </div>
      )}
    </div>
  )
}

function QuickAction({ href, icon, label, compact }: { href: string; icon: string; label: string; compact?: boolean }) {
  return (
    <a
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: compact ? '12px' : '14px',
        background: 'var(--bg-secondary)',
        borderRadius: '10px',
        color: 'var(--text-primary)',
        textDecoration: 'none',
        fontSize: compact ? '12px' : '13px',
        fontWeight: '500',
        transition: 'background 0.2s',
      }}
    >
      <span style={{ fontSize: compact ? '14px' : '16px' }}>{icon}</span>
      {label}
    </a>
  )
}

function StatusItem({ label, status, compact }: { label: string; status: 'online' | 'offline' | 'degraded'; compact?: boolean }) {
  const colors = {
    online: 'var(--accent-green)',
    offline: '#ef4444',
    degraded: 'var(--accent-yellow)',
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: compact ? '10px' : '12px',
      background: 'var(--bg-secondary)',
      borderRadius: '10px',
    }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: compact ? '12px' : '13px' }}>
        {label}
      </span>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: colors[status],
        }} className="animate-pulse" />
        <span style={{
          color: colors[status],
          fontSize: '11px',
          fontWeight: '500',
          textTransform: 'capitalize',
        }}>
          {status}
        </span>
      </div>
    </div>
  )
}
