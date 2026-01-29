'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

interface DebugInfo {
  category: string
  items: { label: string; value: string; status?: 'ok' | 'warn' | 'error' }[]
}

const DEBUG_INFO: DebugInfo[] = [
  {
    category: 'Runtime',
    items: [
      { label: 'Version', value: 'Clawdbot 2026.1.24-3', status: 'ok' },
      { label: 'Node.js', value: 'v22.22.0', status: 'ok' },
      { label: 'Platform', value: 'Linux 6.14.0-1018-aws (x64)', status: 'ok' },
      { label: 'PID', value: '3357', status: 'ok' },
      { label: 'Uptime', value: '12h 34m', status: 'ok' },
    ],
  },
  {
    category: 'Memory',
    items: [
      { label: 'Heap Used', value: '145 MB', status: 'ok' },
      { label: 'Heap Total', value: '200 MB', status: 'ok' },
      { label: 'RSS', value: '312 MB', status: 'ok' },
      { label: 'External', value: '24 MB', status: 'ok' },
    ],
  },
  {
    category: 'Model',
    items: [
      { label: 'Provider', value: 'anthropic', status: 'ok' },
      { label: 'Model', value: 'claude-opus-4-5', status: 'ok' },
      { label: 'Context', value: '145k/200k (73%)', status: 'ok' },
      { label: 'Thinking', value: 'low', status: 'ok' },
    ],
  },
  {
    category: 'Network',
    items: [
      { label: 'Gateway Bind', value: '127.0.0.1:18789', status: 'ok' },
      { label: 'WebSocket', value: 'Connected', status: 'ok' },
      { label: 'Telegram', value: 'Polling active', status: 'ok' },
    ],
  },
  {
    category: 'Storage',
    items: [
      { label: 'Workspace', value: '/home/ubuntu/clawd', status: 'ok' },
      { label: 'Logs', value: '/tmp/clawdbot/', status: 'ok' },
      { label: 'Config', value: '~/.clawdbot/clawdbot.json', status: 'ok' },
    ],
  },
]

export default function DebugPage() {
  const [debugInfo] = useState<DebugInfo[]>(DEBUG_INFO)
  const [showRaw, setShowRaw] = useState(false)

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ok': return 'var(--accent-green)'
      case 'warn': return 'var(--accent-yellow)'
      case 'error': return '#ef4444'
      default: return 'var(--text-muted)'
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="debug">
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px',
          }}>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}>
                🔧 Debug
              </h1>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
              }}>
                System diagnostics and debugging info
              </p>
            </div>

            <button
              onClick={() => setShowRaw(!showRaw)}
              style={{
                padding: '10px 20px',
                fontSize: '13px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {showRaw ? '📊 Formatted' : '📄 Raw JSON'}
            </button>
          </div>

          {showRaw ? (
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-card)',
              padding: '20px',
            }}>
              <pre style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                color: 'var(--text-secondary)',
                overflow: 'auto',
                margin: 0,
              }}>
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {debugInfo.map(section => (
                <div
                  key={section.category}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-card)',
                    padding: '20px',
                  }}
                >
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}>
                    {section.category}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {section.items.map(item => (
                      <div
                        key={item.label}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{
                          color: 'var(--text-muted)',
                          fontSize: '12px',
                        }}>
                          {item.label}
                        </span>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}>
                          <span style={{
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            fontFamily: "'JetBrains Mono', monospace",
                          }}>
                            {item.value}
                          </span>
                          {item.status && (
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: getStatusColor(item.status),
                            }} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div style={{
            marginTop: '24px',
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-card)',
            padding: '20px',
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '16px',
            }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <ActionButton icon="🔄" label="Restart Gateway" />
              <ActionButton icon="🗑️" label="Clear Cache" />
              <ActionButton icon="📋" label="Copy Debug Info" />
              <ActionButton icon="📥" label="Export Logs" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function ActionButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button style={{
      padding: '10px 16px',
      fontSize: '13px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '8px',
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <span>{icon}</span>
      {label}
    </button>
  )
}
