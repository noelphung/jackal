'use client'

import TaskCard, { Task, TaskStatus } from './TaskCard'

interface ColumnConfig {
  title: string
  icon: string
  status: TaskStatus
  accentColor?: string
}

const columnConfigs: Record<TaskStatus, ColumnConfig> = {
  todo: {
    title: 'To Do',
    icon: '📋',
    status: 'todo',
  },
  in_progress: {
    title: 'In Progress',
    icon: '⚡',
    status: 'in_progress',
    accentColor: 'var(--accent-yellow)',
  },
  done: {
    title: 'Done',
    icon: '✓',
    status: 'done',
    accentColor: 'var(--accent-green)',
  },
  archived: {
    title: 'Archived',
    icon: '📦',
    status: 'archived',
  },
}

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
}

export default function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const config = columnConfigs[status]
  const filteredTasks = tasks.filter(t => t.status === status)

  return (
    <div style={{
      flex: 1,
      minWidth: '280px',
      maxWidth: '320px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Column Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 4px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '16px',
      }}>
        <span style={{
          fontSize: '16px',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          background: config.accentColor ? `${config.accentColor}20` : 'var(--bg-card)',
          color: config.accentColor || 'var(--text-secondary)',
        }}>
          {config.icon}
        </span>
        <h2 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--text-primary)',
        }}>
          {config.title}
        </h2>
        <span style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginLeft: 'auto',
          background: 'var(--bg-card)',
          padding: '2px 8px',
          borderRadius: '10px',
        }}>
          {filteredTasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        paddingRight: '4px',
      }}>
        {filteredTasks.map((task, index) => (
          <TaskCard key={task.id} task={task} index={index} />
        ))}
        
        {filteredTasks.length === 0 && (
          <div style={{
            padding: '24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '13px',
            fontStyle: 'italic',
          }}>
            No tasks
          </div>
        )}
      </div>
    </div>
  )
}
