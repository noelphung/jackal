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

// Free Lottie animation URLs for different states
const lottieUrls: Record<AgentState, string> = {
  working: 'https://lottie.host/4db68bbd-31f6-4cd8-84eb-189571aa4678/7PXQrjHjSI.json', // lightning/energy
  thinking: 'https://lottie.host/c7af3a88-fdc7-4706-bc93-7adf16948b80/aMSGsXjnXb.json', // brain/thinking
  idle: 'https://lottie.host/413e81ee-2d0e-4bf0-b25e-16de2d1a0eff/VgQ2tLqGRE.json', // happy face
  sleeping: 'https://lottie.host/6d93e329-4803-4ce3-b660-2e5789d1fc3d/G3QfBMxcZh.json', // sleeping
  online: 'https://lottie.host/413e81ee-2d0e-4bf0-b25e-16de2d1a0eff/VgQ2tLqGRE.json', // happy face
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
    const url = lottieUrls[status.state]
    if (url) {
      fetch(url)
        .then(res => res.json())
        .then(data => setLottieData(data))
        .catch(() => setLottieData(null))
    }
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
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '1px solid var(--border-card)',
        }}>
          {lottieData ? (
            <Lottie animationData={lottieData} loop={true} style={{ width: 28, height: 28 }} />
          ) : (
            <span style={{ fontSize: '18px' }}>🦊</span>
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
      {/* Avatar Container with Lottie */}
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
          overflow: 'hidden',
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.4), 0 0 30px ${config.color}30`,
          border: `2px solid ${config.color}40`,
          transition: 'all 0.3s ease',
        }}>
          {lottieData ? (
            <Lottie 
              animationData={lottieData} 
              loop={true} 
              style={{ width: 70, height: 70 }} 
            />
          ) : (
            <span style={{ fontSize: '42px' }}>🦊</span>
          )}
        </div>
        
        {/* Connection indicator */}
        <div style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: isConnected ? 'var(--accent-green)' : '#ef4444',
          border: '2px solid var(--bg-secondary)',
          boxShadow: isConnected ? '0 0 8px var(--accent-green)' : '0 0 8px #ef4444',
        }} className="animate-pulse" />
        
        {/* Status badge */}
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
        maxWidth: '140px',
        lineHeight: '1.4',
      }}>
        {status.currentTask}
      </p>
    </div>
  )
}
