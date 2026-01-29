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
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
          {/* Welcome Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}>
              Welcome back, {user?.email?.split('@')[0]} 👋
            </h1>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '14px',
            }}>
              Here&apos;s what&apos;s happening with your projects today.
            </p>
          </div>

          {loading ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px' }}>
              Loading dashboard...
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                marginBottom: '32px',
              }}>
                <StatCard
                  icon="📋"
                  label="Total Tasks"
                  value={stats.totalTasks}
                  color="var(--accent-blue)"
                />
                <StatCard
                  icon="✅"
                  label="Completed"
                  value={stats.completedTasks}
                  color="var(--accent-green)"
                  subtext={stats.totalTasks > 0 ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}% done` : ''}
                />
                <StatCard
                  icon="🚀"
                  label="Active Projects"
                  value={stats.activeProjects}
                  color="#8b5cf6"
                />
                <StatCard
                  icon="📄"
                  label="Documents"
                  value={stats.totalDocuments}
                  color="#f59e0b"
                />
              </div>

              {/* Main Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
              }}>
                {/* Recent Tasks */}
                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-card)',
                  padding: '24px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}>
                    <h2 style={{
                      fontSize: '16px',
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
                      padding: '40px 20px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
                      <p>No tasks yet. Add your first task in Pipeline!</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {recentTasks.map(task => (
                        <div
                          key={task.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            background: 'var(--bg-secondary)',
                            borderRadius: '10px',
                          }}
                        >
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: getStatusColor(task.status),
                          }} />
                          <div style={{ flex: 1 }}>
                            <div style={{
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                              fontWeight: '500',
                            }}>
                              {task.title}
                            </div>
                          </div>
                          <span style={{
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            textTransform: 'capitalize',
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
                  padding: '24px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}>
                    <h2 style={{
                      fontSize: '16px',
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
                      padding: '40px 20px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>📁</div>
                      <p>No projects yet. Create one in Pipeline!</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {projects.map(project => (
                        <div
                          key={project.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '14px',
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
                          }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '4px',
                              background: project.color,
                            }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              color: 'var(--text-primary)',
                              fontSize: '14px',
                              fontWeight: '500',
                            }}>
                              {project.name}
                            </div>
                            {project.description && (
                              <div style={{
                                color: 'var(--text-muted)',
                                fontSize: '12px',
                                marginTop: '2px',
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
                  padding: '24px',
                }}>
                  <h2 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '20px',
                  }}>
                    ⚡ Quick Actions
                  </h2>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}>
                    <QuickAction href="/pipeline" icon="➕" label="New Task" />
                    <QuickAction href="/pipeline" icon="📁" label="New Project" />
                    <QuickAction href="/documents" icon="📄" label="View Docs" />
                    <QuickAction href="/api-keys" icon="🔑" label="Manage Keys" />
                  </div>
                </div>

                {/* System Status */}
                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-card)',
                  padding: '24px',
                }}>
                  <h2 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '20px',
                  }}>
                    🖥️ System Status
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <StatusItem label="Jackal Agent" status="online" />
                    <StatusItem label="Supabase" status="online" />
                    <StatusItem label="n8n Workflows" status="online" />
                    <StatusItem label="Cron Jobs" status="online" />
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

function StatCard({ icon, label, value, color, subtext }: {
  icon: string
  label: string
  value: number
  color: string
  subtext?: string
}) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px solid var(--border-card)',
      padding: '24px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px',
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
        }}>
          {icon}
        </div>
        <div>
          <div style={{
            color: 'var(--text-muted)',
            fontSize: '12px',
            marginBottom: '2px',
          }}>
            {label}
          </div>
          <div style={{
            color: 'var(--text-primary)',
            fontSize: '28px',
            fontWeight: '700',
          }}>
            {value}
          </div>
        </div>
      </div>
      {subtext && (
        <div style={{
          color: color,
          fontSize: '12px',
          fontWeight: '500',
        }}>
          {subtext}
        </div>
      )}
    </div>
  )
}

function QuickAction({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px',
        background: 'var(--bg-secondary)',
        borderRadius: '10px',
        color: 'var(--text-primary)',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: '500',
        transition: 'background 0.2s',
      }}
    >
      <span style={{ fontSize: '16px' }}>{icon}</span>
      {label}
    </a>
  )
}

function StatusItem({ label, status }: { label: string; status: 'online' | 'offline' | 'degraded' }) {
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
      padding: '12px',
      background: 'var(--bg-secondary)',
      borderRadius: '10px',
    }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
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
          fontSize: '12px',
          fontWeight: '500',
          textTransform: 'capitalize',
        }}>
          {status}
        </span>
      </div>
    </div>
  )
}
