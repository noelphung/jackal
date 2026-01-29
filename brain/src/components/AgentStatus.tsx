'use client'

import { useEffect, useState } from 'react'

type AgentState = 'online' | 'working' | 'thinking' | 'idle' | 'sleeping'

interface AgentStatusData {
  state: AgentState
  currentTask?: string
  lastActive: string
}

const stateConfig: Record<AgentState, { emoji: string; label: string; color: string }> = {
  online: { emoji: '🟢', label: 'Online', color: '#22c55e' },
  working: { emoji: '⚡', label: 'Working', color: '#fbbf24' },
  thinking: { emoji: '🧠', label: 'Thinking', color: '#a855f7' },
  idle: { emoji: '😊', label: 'Idle', color: '#3b82f6' },
  sleeping: { emoji: '😴', label: 'Sleeping', color: '#6b7280' },
}

export default function AgentStatus() {
  const [status, setStatus] = useState<AgentStatusData>({
    state: 'online',
    currentTask: 'Ready for tasks',
    lastActive: new Date().toISOString(),
  })

  // In production, this would poll an API endpoint
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        lastActive: new Date().toISOString(),
      }))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const config = stateConfig[status.state]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 16px',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {/* Avatar */}
      <div style={{
        position: 'relative',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '42px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          border: '2px solid var(--border-card)',
        }}
        className="animate-float"
        >
          🦊
        </div>
        {/* Sparkles */}
        <span style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          fontSize: '20px',
        }}>✨</span>
      </div>

      {/* Name */}
      <h2 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '8px',
      }}>
        Jackal
      </h2>

      {/* Status Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '12px',
        background: 'var(--bg-card)',
        marginBottom: '12px',
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: config.color,
          boxShadow: `0 0 8px ${config.color}`,
        }}
        className="animate-pulse"
        />
        <span style={{ fontSize: '13px' }}>{config.emoji}</span>
        <span style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}>
          {config.label}
        </span>
      </div>

      {/* Current Task */}
      <p style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        textAlign: 'center',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        {status.currentTask}
      </p>
    </div>
  )
}
