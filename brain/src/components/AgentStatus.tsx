'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export type AgentState = 'online' | 'working' | 'thinking' | 'idle' | 'sleeping'

export interface AgentStatusData {
  state: AgentState
  currentTask: string
  lastActive: string
}

// Animated emoji face Lottie URLs for different states
const avatarLottie: Record<AgentState, string> = {
  working: 'https://assets5.lottiefiles.com/packages/lf20_aZTdD5.json', // excited working face
  thinking: 'https://assets2.lottiefiles.com/packages/lf20_n2m0isqr.json', // thinking face
  idle: 'https://assets9.lottiefiles.com/packages/lf20_kkflmtur.json', // happy winking face
  sleeping: 'https://assets3.lottiefiles.com/packages/lf20_twijbubv.json', // sleeping zzz
  online: 'https://assets9.lottiefiles.com/packages/lf20_kkflmtur.json', // happy face
}

// Fallback to simpler animations if above don't load
const fallbackLottie: Record<AgentState, string> = {
  working: 'https://lottie.host/embed/7c491c6d-5e10-4045-a0dc-bf02f81e435a/OQPCqF5rqC.json',
  thinking: 'https://lottie.host/embed/e90e7ba8-a959-4d26-aa2c-1c8f51aa6bf8/uxA1z3k3Ol.json',
  idle: 'https://lottie.host/embed/38f9a9a9-80f6-4ea4-b3e2-8a5b29ef9a12/x5dUXvfhlx.json',
  sleeping: 'https://lottie.host/embed/3d8ac0ba-98d9-4c53-a7e8-17f1a2e70a1e/1r8dN07J4z.json',
  online: 'https://lottie.host/embed/38f9a9a9-80f6-4ea4-b3e2-8a5b29ef9a12/x5dUXvfhlx.json',
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
      
      eventSource.onopen = () => {
        setIsConnected(true)
      }
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setStatus(data)
        } catch (e) {}
      }
      
      eventSource.onerror = () => {
        setIsConnected(false)
        eventSource.close()
        // Reconnect after 3 seconds
        setTimeout(connect, 3000)
      }
    }
    
    connect()
    
    return () => {
      eventSourceRef.current?.close()
    }
  }, [])

  // Load Lottie animation when state changes
  useEffect(() => {
    const loadAnimation = async () => {
      const url = avatarLottie[status.state]
      try {
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setLottieData(data)
        } else {
          throw new Error('Primary failed')
        }
      } catch {
        // Try fallback
        try {
          const fallbackUrl = fallbackLottie[status.state]
          const res = await fetch(fallbackUrl)
          if (res.ok) {
            const data = await res.json()
            setLottieData(data)
          }
        } catch {
          setLottieData(null)
        }
      }
    }
    
    loadAnimation()
  }, [status.state])

  const config = stateConfig[status.state]

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: `2px solid ${config.color}40`,
        }}>
          {lottieData ? (
            <Lottie animationData={lottieData} loop={true} style={{ width: 32, height: 32 }} />
          ) : (
            <span style={{ fontSize: '20px' }} className="emoji-bounce">😊</span>
          )}
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
              background: isConnected ? config.color : '#ef4444',
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
      {/* Animated Avatar */}
      <div style={{
        position: 'relative',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '22px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: `0 4px 24px rgba(0, 0, 0, 0.5), 0 0 40px ${config.color}25`,
          border: `3px solid ${config.color}50`,
          transition: 'all 0.3s ease',
        }}>
          {lottieData ? (
            <Lottie 
              animationData={lottieData} 
              loop={true} 
              style={{ width: 80, height: 80 }} 
            />
          ) : (
            <span style={{ fontSize: '50px' }} className="emoji-bounce">😊</span>
          )}
        </div>
        
        {/* Live connection indicator */}
        <div style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: isConnected ? 'var(--accent-green)' : '#ef4444',
          border: '3px solid var(--bg-secondary)',
          boxShadow: isConnected ? '0 0 12px var(--accent-green)' : '0 0 12px #ef4444',
        }} className="animate-pulse" />
        
        {/* Sparkles when working */}
        {status.state === 'working' && (
          <>
            <span style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '16px',
            }} className="animate-ping-slow">✨</span>
          </>
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
        }} className="animate-pulse" />
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
        maxWidth: '150px',
        lineHeight: '1.4',
      }}>
        {status.currentTask}
      </p>
    </div>
  )
}
