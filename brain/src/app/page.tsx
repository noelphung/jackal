'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase, Task, Project, ActivityLog } from '@/lib/supabase'

interface Stats {
  totalTasks: number
  completedTasks: number
  activeProjects: number
  totalDocuments: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    activeProjects: 0,
    totalDocuments: 0,
  })
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([])
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      const [tasksRes, projectsRes, docsRes, activityRes] = await Promise.all([
        supabase.from('tasks').select('*').eq('user_id', user?.id),
        supabase.from('projects').select('*').eq('user_id', user?.id).eq('status', 'active'),
        supabase.from('documents').select('id'),
        supabase.from('activity_log').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(10),
      ])

      const tasks = tasksRes.data || []
      const projectsList = projectsRes.data || []

      setStats({
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'done').length,
        activeProjects: projectsList.length,
        totalDocuments: docsRes.data?.length || 0,
      })

      setProjects(projectsList)
      setRecentTasks(tasks.slice(0, 5))
      setRecentActivity(activityRes.data || [])
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
      default: return 'var(--text-muted)'
    }
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
            <h1 style={{
              fontSize: isMobile ? '22px' : '28px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}>
              Welcome back 👋
            </h1>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: isMobile ? '13px' : '14px',
            }}>
              Here&apos;s what&apos;s happening with your projects today.
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
                {/* Recent Tasks */}
                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-card)',
                  padding: isMobile ? '16px' : '24px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}>
                    <h2 style={{
                      fontSize: isMobile ? '14px' : '16px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                    }}>
                      📋 Recent Tasks
                    </h2>
                    <a href="/pipeline" style={{
                      fontSize: '13px',
                      color: 'var(--accent-blue)',
                      textDecoration: 'none',
                    }}>
                      View all →
                    </a>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {recentTasks.map(task => (
                        <div
                          key={task.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: isMobile ? '10px' : '12px',
                            background: 'var(--bg-secondary)',
                            borderRadius: '10px',
                          }}
                        >
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: getStatusColor(task.status),
                            flexShrink: 0,
                          }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                              fontWeight: '500',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {task.title}
                            </div>
                          </div>
                          <span style={{
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            textTransform: 'capitalize',
                            flexShrink: 0,
                          }}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Projects */}
                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-card)',
                  padding: isMobile ? '16px' : '24px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}>
                    <h2 style={{
                      fontSize: isMobile ? '14px' : '16px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                    }}>
                      🚀 Active Projects
                    </h2>
                    <a href="/pipeline" style={{
                      fontSize: '13px',
                      color: 'var(--accent-blue)',
                      textDecoration: 'none',
                    }}>
                      Manage →
                    </a>
                  </div>

                  {projects.length === 0 ? (
                    <div style={{
                      padding: isMobile ? '24px 12px' : '40px 20px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>📁</div>
                      <p style={{ fontSize: '13px' }}>No projects yet</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {projects.map(project => (
                        <div
                          key={project.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: isMobile ? '12px' : '14px',
                            background: 'var(--bg-secondary)',
                            borderRadius: '10px',
                          }}
                        >
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: `${project.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '4px',
                              background: project.color,
                            }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              color: 'var(--text-primary)',
                              fontSize: '14px',
                              fontWeight: '500',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {project.name}
                            </div>
                            {project.description && (
                              <div style={{
                                color: 'var(--text-muted)',
                                fontSize: '12px',
                                marginTop: '2px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}>
                                {project.description}
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
                    <QuickAction href="/pipeline" icon="📁" label="New Project" compact={isMobile} />
                    <QuickAction href="/documents" icon="📄" label="View Docs" compact={isMobile} />
                    <QuickAction href="/api-keys" icon="🔑" label="API Keys" compact={isMobile} />
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
                    <StatusItem label="Supabase" status="online" compact={isMobile} />
                    <StatusItem label="n8n Workflows" status="online" compact={isMobile} />
                    <StatusItem label="Cron Jobs" status="online" compact={isMobile} />
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
        }} />
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
