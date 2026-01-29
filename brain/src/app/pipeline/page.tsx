'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, Task, Project } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'archived'

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; icon: string }> = {
  backlog: { label: 'Backlog', color: '#6b7280', icon: '📥' },
  todo: { label: 'To Do', color: '#8b5cf6', icon: '📋' },
  in_progress: { label: 'In Progress', color: '#f59e0b', icon: '🔨' },
  review: { label: 'Review', color: '#3b82f6', icon: '👀' },
  done: { label: 'Done', color: '#22c55e', icon: '✅' },
  archived: { label: 'Archived', color: '#374151', icon: '📦' },
}

const PROJECT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#f59e0b', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
]

export default function PipelinePage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | 'all'>('all')
  const [showArchived, setShowArchived] = useState(false)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  
  // New task form
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project_id: '',
    priority: 0,
    due_date: '',
  })

  // New project form
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: PROJECT_COLORS[0],
  })

  const loadData = useCallback(async () => {
    if (!user) return
    
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        supabase.from('tasks').select('*, project:projects(*)').eq('user_id', user.id).order('priority', { ascending: false }),
        supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])

      if (tasksRes.data) setTasks(tasksRes.data)
      if (projectsRes.data) setProjects(projectsRes.data)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  const addTask = async () => {
    if (!user || !newTask.title) return

    await supabase.from('tasks').insert({
      user_id: user.id,
      title: newTask.title,
      description: newTask.description || null,
      project_id: newTask.project_id || null,
      priority: newTask.priority,
      due_date: newTask.due_date || null,
      status: 'backlog',
    })

    setNewTask({ title: '', description: '', project_id: '', priority: 0, due_date: '' })
    setShowAddTask(false)
    loadData()
  }

  const addProject = async () => {
    if (!user || !newProject.name) return

    const slug = newProject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    await supabase.from('projects').insert({
      user_id: user.id,
      name: newProject.name,
      slug,
      description: newProject.description || null,
      color: newProject.color,
    })

    setNewProject({ name: '', description: '', color: PROJECT_COLORS[0] })
    setShowAddProject(false)
    loadData()
  }

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const updates: Record<string, any> = { status: newStatus }
    if (newStatus === 'done') {
      updates.completed_at = new Date().toISOString()
    } else {
      updates.completed_at = null
    }

    await supabase.from('tasks').update(updates).eq('id', taskId)
    loadData()
  }

  const deleteTask = async (taskId: string) => {
    await supabase.from('tasks').delete().eq('id', taskId)
    loadData()
  }

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: TaskStatus) => {
    if (draggedTask && draggedTask.status !== status) {
      updateTaskStatus(draggedTask.id, status)
    }
    setDraggedTask(null)
  }

  const filteredTasks = tasks.filter(task => {
    if (selectedProject !== 'all' && task.project_id !== selectedProject) return false
    if (!showArchived && task.status === 'archived') return false
    return true
  })

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter(t => t.status === status)
  }

  const visibleStatuses: TaskStatus[] = showArchived 
    ? ['backlog', 'todo', 'in_progress', 'review', 'done', 'archived']
    : ['backlog', 'todo', 'in_progress', 'review', 'done']

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="pipeline">
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Toolbar */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary)',
              }}>
                🚀 Pipeline
              </h2>

              {/* Project Filter */}
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
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
                <option value="all">All Projects</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                />
                Show Archived
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowAddProject(true)}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>📁</span> New Project
              </button>
              <button
                onClick={() => setShowAddTask(true)}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  background: 'var(--accent-blue)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>+</span> Add Task
              </button>
            </div>
          </div>

          {/* Kanban Board */}
          {loading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Loading pipeline...</span>
            </div>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              gap: '16px',
              padding: '24px',
              overflowX: 'auto',
            }}>
              {visibleStatuses.map(status => {
                const config = STATUS_CONFIG[status]
                const statusTasks = getTasksByStatus(status)

                return (
                  <div
                    key={status}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(status)}
                    style={{
                      width: '300px',
                      minWidth: '300px',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'var(--bg-secondary)',
                      borderRadius: '12px',
                      border: draggedTask ? `2px dashed ${config.color}40` : '1px solid var(--border-subtle)',
                    }}
                  >
                    {/* Column Header */}
                    <div style={{
                      padding: '16px',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        <span>{config.icon}</span>
                        <span style={{
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                        }}>
                          {config.label}
                        </span>
                      </div>
                      <span style={{
                        padding: '2px 8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: `${config.color}20`,
                        color: config.color,
                        borderRadius: '10px',
                      }}>
                        {statusTasks.length}
                      </span>
                    </div>

                    {/* Tasks */}
                    <div style={{
                      flex: 1,
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      overflowY: 'auto',
                    }}>
                      {statusTasks.map(task => {
                        const project = projects.find(p => p.id === task.project_id)

                        return (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={() => handleDragStart(task)}
                            style={{
                              background: 'var(--bg-card)',
                              borderRadius: '10px',
                              border: '1px solid var(--border-card)',
                              padding: '14px',
                              cursor: 'grab',
                              transition: 'all 0.2s',
                            }}
                          >
                            {project && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                marginBottom: '8px',
                              }}>
                                <span style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: project.color,
                                }} />
                                <span style={{
                                  fontSize: '11px',
                                  color: 'var(--text-muted)',
                                }}>
                                  {project.name}
                                </span>
                              </div>
                            )}
                            <div style={{
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                              fontWeight: '500',
                              marginBottom: '8px',
                            }}>
                              {task.title}
                            </div>
                            {task.description && (
                              <div style={{
                                color: 'var(--text-muted)',
                                fontSize: '12px',
                                marginBottom: '8px',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}>
                                {task.description}
                              </div>
                            )}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                              {task.due_date && (
                                <span style={{
                                  fontSize: '11px',
                                  color: 'var(--text-muted)',
                                }}>
                                  📅 {new Date(task.due_date).toLocaleDateString()}
                                </span>
                              )}
                              <button
                                onClick={() => deleteTask(task.id)}
                                style={{
                                  marginLeft: 'auto',
                                  padding: '4px 8px',
                                  fontSize: '11px',
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--text-muted)',
                                  cursor: 'pointer',
                                  opacity: 0.5,
                                }}
                              >
                                🗑
                              </button>
                            </div>
                          </div>
                        )
                      })}

                      {statusTasks.length === 0 && (
                        <div style={{
                          padding: '20px',
                          textAlign: 'center',
                          color: 'var(--text-muted)',
                          fontSize: '12px',
                        }}>
                          No tasks
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Add Task Modal */}
          {showAddTask && (
            <Modal onClose={() => setShowAddTask(false)}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: 'var(--text-primary)' }}>
                ➕ Add New Task
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  style={inputStyle}
                  autoFocus
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                />
                <select
                  value={newTask.project_id}
                  onChange={(e) => setNewTask(prev => ({ ...prev, project_id: e.target.value }))}
                  style={inputStyle}
                >
                  <option value="">No Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                  style={inputStyle}
                />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setShowAddTask(false)} style={cancelBtnStyle}>
                    Cancel
                  </button>
                  <button onClick={addTask} disabled={!newTask.title} style={primaryBtnStyle}>
                    Add Task
                  </button>
                </div>
              </div>
            </Modal>
          )}

          {/* Add Project Modal */}
          {showAddProject && (
            <Modal onClose={() => setShowAddProject(false)}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: 'var(--text-primary)' }}>
                📁 New Project
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="Project name"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  style={inputStyle}
                  autoFocus
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                />
                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                    Color
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {PROJECT_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewProject(prev => ({ ...prev, color }))}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: color,
                          border: newProject.color === color ? '3px solid white' : 'none',
                          cursor: 'pointer',
                          boxShadow: newProject.color === color ? `0 0 0 2px ${color}` : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setShowAddProject(false)} style={cancelBtnStyle}>
                    Cancel
                  </button>
                  <button onClick={addProject} disabled={!newProject.name} style={primaryBtnStyle}>
                    Create Project
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-card)',
          padding: '24px',
          width: '100%',
          maxWidth: '440px',
        }}
      >
        {children}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '12px 14px',
  fontSize: '14px',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '10px',
  color: 'var(--text-primary)',
  width: '100%',
}

const cancelBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  fontSize: '14px',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '10px',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
}

const primaryBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  fontSize: '14px',
  fontWeight: '600',
  background: 'var(--accent-blue)',
  border: 'none',
  borderRadius: '10px',
  color: 'white',
  cursor: 'pointer',
}
