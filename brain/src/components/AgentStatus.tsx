'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export type AgentState = 'online' | 'working' | 'thinking' | 'idle' | 'sleeping'

export interface AgentStatusData {
  state: AgentState
  currentTask: string
  lastActive: string
}

// Verified working Lottie animation URLs
const avatarLottie: Record<AgentState, string> = {
  working: 'https://assets2.lottiefiles.com/packages/lf20_uwR49r.json',
  thinking: 'https://assets6.lottiefiles.com/packages/lf20_au98spwy.json',
  idle: 'https://assets9.lottiefiles.com/packages/lf20_kkflmtur.json',
  sleeping: 'https://assets2.lottiefiles.com/packages/lf20_1cazwtnc.json',
  online: 'https://assets9.lottiefiles.com/packages/lf20_kkflmtur.json',
}

const stateConfig: Record<AgentState, { emoji: string; label: string; color: string }> = {
  online: { emoji: '🟢', label: 'Online', color: '#22c55e' },
  working: { emoji: '⚡', label: 'Working', color: '#fbbf24' },
  thinking: { emoji: '🧠', label: 'Thinking', color: '#a855f7' },
  idle: { emoji: '😊', label: 'Idle', color: '#3b82f6' },
  sleeping: { emoji: '😴', label: 'Sleeping', color: '#6b7280' },
}

export default function AgentStatus({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<AgentStatusData>({
    state: 'idle',
    currentTask: 'Connecting...',
    lastActive: new Date().toISOString(),
  })
  const [lottieData, setLottieData] = useState<object | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  // SSE connection for live updates
  useEffect(() => {
    const connect = () => {
      const eventSource = new EventSource('/api/status/stream')
      eventSourceRef.current = eventSource
      
      eventSource.onopen = () => setIsConnected(true)
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setStatus(data)
        } catch (e) {}
      }
      
      eventSource.onerror = () => {
        setIsConnected(false)
        eventSource.close()
        setTimeout(connect, 3000)
      }
    }
    
    connect()
    return () => eventSourceRef.current?.close()
  }, [])

  // Load Lottie animation
  useEffect(() => {
    const url = avatarLottie[status.state]
    fetch(url)
      .then(res => res.json())
      .then(data => setLottieData(data))
      .catch(() => setLottieData(null))
  }, [status.state])

  const config = stateConfig[status.state]

  // Fallback animated emoji when Lottie fails
  const FallbackEmoji = () => (
    <span 
      style={{ 
        fontSize: compact ? '24px' : '50px',
        display: 'inline-block',
        animation: status.state === 'working' 
          ? 'bounce 0.6s ease-in-out infinite' 
          : status.state === 'thinking'
          ? 'pulse 1.5s ease-in-out infinite'
          : 'float 3s ease-in-out infinite'
      }}
    >
      {status.state === 'sleeping' ? '😴' : status.state === 'working' ? '🤩' : status.state === 'thinking' ? '🤔' : '😊'}
    </span>
  )

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: `2px solid ${config.color}50`,
        }}>
          {lottieData ? (
            <Lottie animationData={lottieData} loop style={{ width: 36, height: 36 }} />
          ) : (
            <FallbackEmoji />
          )}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#fafafa' }}>Jackal</div>
          <div style={{ fontSize: '11px', color: config.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: isConnected ? config.color : '#ef4444',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
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
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Avatar */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 60px ${config.color}20`,
          border: `3px solid ${config.color}60`,
          transition: 'all 0.3s ease',
        }}>
          {lottieData ? (
            <Lottie animationData={lottieData} loop style={{ width: 80, height: 80 }} />
          ) : (
            <FallbackEmoji />
          )}
        </div>
        
        {/* Connection indicator */}
        <div style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: isConnected ? '#22c55e' : '#ef4444',
          border: '3px solid #141418',
          boxShadow: `0 0 12px ${isConnected ? '#22c55e' : '#ef4444'}`,
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        
        {status.state === 'working' && (
          <span style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '18px',
            animation: 'ping 1.5s ease-in-out infinite',
          }}>✨</span>
        )}
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fafafa', marginBottom: '8px' }}>
        Jackal
      </h2>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: '14px',
        background: `${config.color}20`,
        border: `1px solid ${config.color}40`,
        marginBottom: '12px',
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: config.color,
          boxShadow: `0 0 10px ${config.color}`,
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        <span style={{ fontSize: '13px', color: config.color, fontWeight: '500' }}>
          {config.label}
        </span>
      </div>

      <p style={{
        fontSize: '12px',
        color: '#71717a',
        textAlign: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        maxWidth: '150px',
        lineHeight: '1.5',
      }}>
        {status.currentTask}
      </p>
    </div>
  )
}
