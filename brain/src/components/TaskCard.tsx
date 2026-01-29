'use client'

import { useState } from 'react'

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'archived'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  date: string
  type?: 'journal' | 'concept' | 'note' | 'project'
  slug?: string
}

interface TaskCardProps {
  task: Task
  index: number
}

const statusStyles: Record<TaskStatus, {
  bg: string
  bgHover: string
  border?: string
  showCheck?: boolean
}> = {
  todo: {
    bg: 'var(--bg-card)',
    bgHover: 'var(--bg-card-hover)',
  },
  in_progress: {
    bg: 'var(--bg-progress)',
    bgHover: 'rgba(251, 191, 36, 0.15)',
    border: 'rgba(251, 191, 36, 0.2)',
  },
  done: {
    bg: 'var(--bg-done)',
    bgHover: 'var(--bg-done-hover)',
    border: 'rgba(34, 197, 94, 0.2)',
    showCheck: true,
  },
  archived: {
    bg: 'var(--bg-archived)',
    bgHover: 'rgba(255, 255, 255, 0.05)',
  },
}

export default function TaskCard({ task, index }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const styles = statusStyles[task.status]
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="animate-slide-up"
      style={{
        background: isHovered ? styles.bgHover : styles.bg,
        border: `1px solid ${styles.border || 'var(--border-card)'}`,
        borderRadius: '10px',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translateY(-2px)' : 'none',
        boxShadow: isHovered ? 'var(--shadow-card)' : 'none',
        animationDelay: `${index * 50}ms`,
        opacity: task.status === 'archived' ? 0.6 : 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '12px',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '500',
          color: task.status === 'archived' ? 'var(--text-archived)' : 'var(--text-primary)',
          marginBottom: '6px',
          lineHeight: '1.4',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {task.title}
        </h3>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {formatDate(task.date)}
        </p>
      </div>
      
      {styles.showCheck && (
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'var(--accent-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: 'var(--shadow-glow-green)',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  )
}
