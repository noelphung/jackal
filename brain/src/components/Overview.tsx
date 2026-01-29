'use client'

import { useEffect, useState } from 'react'

interface QuickStat {
  label: string
  value: string | number
  icon: string
  color: string
}

export default function Overview() {
  const [time, setTime] = useState(new Date())
  
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const stats: QuickStat[] = [
    { label: 'Tasks Today', value: 5, icon: '📋', color: 'var(--accent-blue)' },
    { label: 'Done', value: 5, icon: '✅', color: 'var(--accent-green)' },
    { label: 'Documents', value: 8, icon: '📄', color: 'var(--accent-yellow)' },
    { label: 'Uptime', value: '8h 24m', icon: '⏱️', color: 'var(--accent-purple)' },
  ]

  const recentLogs = [
    { time: '2:35 PM', event: 'Dashboard redesigned to kanban style', type: 'success' },
    { time: '2:25 PM', event: 'Supabase documents table created', type: 'success' },
    { time: '2:15 PM', event: 'Git push fixed (removed large files)', type: 'success' },
    { time: '2:10 PM', event: 'Vercel deployment triggered', type: 'info' },
    { time: '7:00 AM', event: 'All Jackal workflows verified', type: 'success' },
  ]

  const upcomingEvents = [
    { time: 'Today', title: 'Text Briana\'s parents', priority: 'high' },
    { time: 'Today', title: 'File LLC annual report', priority: 'medium' },
    { time: 'This week', title: 'Consulting with accounting firm', priority: 'low' },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      padding: '20px',
      overflowY: 'auto',
      height: '100%',
    }}>
      {/* Morning Brief Card */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border-card)',
        padding: '20px',
        gridColumn: 'span 2',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}>
          <span style={{ fontSize: '20px' }}>☀️</span>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}>
            OVERVIEW — {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </h2>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '20px',
        }}>
          {stats.map(stat => (
            <div key={stat.label} style={{
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center',
            }}>
              <span style={{ fontSize: '20px' }}>{stat.icon}</span>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: stat.color,
                margin: '4px 0',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission Control */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
        }}>
          <span style={{ fontSize: '16px' }}>🎯</span>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}>
            MISSION CONTROL
          </h3>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}>
          <div>
            <h4 style={{
              fontSize: '12px',
              color: 'var(--accent-yellow)',
              marginBottom: '8px',
              fontWeight: '600',
            }}>
              In Progress (Jackal):
            </h4>
            <ul style={{
              listStyle: 'none',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}>
              <li style={{ marginBottom: '4px' }}>• 2nd Brain Dashboard expansion</li>
              <li style={{ marginBottom: '4px' }}>• Auto-journaling system</li>
              <li style={{ marginBottom: '4px' }}>• Live status API</li>
            </ul>
          </div>
          <div>
            <h4 style={{
              fontSize: '12px',
              color: 'var(--accent-blue)',
              marginBottom: '8px',
              fontWeight: '600',
            }}>
              Noel's Focus:
            </h4>
            <ul style={{
              listStyle: 'none',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}>
              {upcomingEvents.map((event, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>• {event.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border-card)',
        padding: '20px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}>
          <span style={{ fontSize: '16px' }}>📋</span>
          <h2 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}>
            RECENT ACTIVITY
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentLogs.map((log, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '8px',
              borderRadius: '6px',
              background: log.type === 'success' ? 'rgba(34, 197, 94, 0.05)' : 'var(--bg-secondary)',
            }}>
              <span style={{
                fontSize: '10px',
                color: 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
                minWidth: '60px',
              }}>
                {log.time}
              </span>
              <span style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
              }}>
                {log.event}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border-card)',
        padding: '20px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}>
          <span style={{ fontSize: '16px' }}>⚙️</span>
          <h2 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}>
            SYSTEM STATUS
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { name: 'Clawdbot Gateway', status: 'online', detail: 'v2026.1.24-3' },
            { name: 'n8n Workflows', status: 'online', detail: '5 active' },
            { name: 'Supabase', status: 'online', detail: 'Connected' },
            { name: 'Vercel', status: 'online', detail: 'Deployed' },
          ].map(system => (
            <div key={system.name} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: system.status === 'online' ? 'var(--accent-green)' : 'var(--accent-yellow)',
                  boxShadow: `0 0 6px ${system.status === 'online' ? 'var(--accent-green)' : 'var(--accent-yellow)'}`,
                }} />
                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                  {system.name}
                </span>
              </div>
              <span style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {system.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
