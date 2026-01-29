'use client'

import { useEffect, useState } from 'react'

export type AgentState = 'online' | 'working' | 'thinking' | 'idle' | 'sleeping'

export interface AgentStatusData {
  state: AgentState
  currentTask: string
  lastActive: string
}

const stateConfig: Record<AgentState, { emoji: string; label: string; color: string }> = {
  online: { emoji: '🟢', label: 'Online', color: '#22c55e' },
  working: { emoji: '⚡', label: 'Working', color: '#fbbf24' },
  thinking: { emoji: '🧠', label: 'Thinking', color: '#a855f7' },
  idle: { emoji: '😊', label: 'Idle', color: '#3b82f6' },
  sleeping: { emoji: '😴', label: 'Sleeping', color: '#6b7280' },
}

interface AgentStatusProps {
  compact?: boolean
}

export default function AgentStatus({ compact = false }: AgentStatusProps) {
  const [status, setStatus] = useState<AgentStatusData>({
    state: 'idle',
    currentTask: 'Loading...',
    lastActive: new Date().toISOString(),
  })

  // Fetch real status from API
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setStatus(data)
        }
      } catch (e) {
        // Fallback to idle on error
        setStatus(prev => ({ ...prev, state: 'idle', currentTask: 'Ready for tasks' }))
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 10000) // Poll every 10s
    return () => clearInterval(interval)
  }, [])

  const config = stateConfig[status.state]
  
  // Get animation class for emoji based on state
  const getEmojiAnimation = () => {
    switch (status.state) {
      case 'working': return 'emoji-bounce'
      case 'thinking': return 'emoji-pulse'
      case 'sleeping': return 'emoji-sleep'
      default: return ''
    }
  }

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          border: '1px solid var(--border-card)',
        }}>
          <span className={getEmojiAnimation()}>🦊</span>
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600' }}>Jackal</div>
          <div style={{ 
            fontSize: '11px', 
            color: config.color,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: config.color,
            }} className="animate-pulse" />
            {config.label}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 16px',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {/* Avatar Container */}
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
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.4), 0 0 30px ${config.color}30`,
          border: `2px solid ${config.color}40`,
          transition: 'all 0.3s ease',
        }}>
          {/* The emoji itself animates */}
          <span 
            style={{ fontSize: '42px', display: 'inline-block' }}
            className={getEmojiAnimation()}
          >
            🦊
          </span>
        </div>
        
        {/* Status indicator badge */}
        <div style={{
          position: 'absolute',
          bottom: '-4px',
          right: '-4px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid var(--bg-secondary)',
        }}>
          <span style={{ fontSize: '14px' }}>{config.emoji}</span>
        </div>
        
        {/* Sparkles when working */}
        {status.state === 'working' && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            fontSize: '16px',
          }} className="animate-ping-slow">✨</span>
        )}
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
        background: `${config.color}15`,
        border: `1px solid ${config.color}30`,
        marginBottom: '12px',
        transition: 'all 0.3s ease',
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
        <span style={{
          fontSize: '13px',
          color: config.color,
          fontWeight: '500',
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
        maxWidth: '140px',
        lineHeight: '1.4',
      }}>
        {status.currentTask}
      </p>
    </div>
  )
}
