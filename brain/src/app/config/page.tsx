'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

interface ConfigSection {
  name: string
  icon: string
  settings: { key: string; value: string; type: 'string' | 'boolean' | 'number' | 'secret' }[]
}

const CONFIG_SECTIONS: ConfigSection[] = [
  {
    name: 'Gateway',
    icon: '🚀',
    settings: [
      { key: 'bind', value: '127.0.0.1', type: 'string' },
      { key: 'port', value: '18789', type: 'number' },
      { key: 'dashboard', value: 'true', type: 'boolean' },
    ],
  },
  {
    name: 'Agent',
    icon: '🤖',
    settings: [
      { key: 'model', value: 'anthropic/claude-opus-4-5', type: 'string' },
      { key: 'workspace', value: '/home/ubuntu/clawd', type: 'string' },
      { key: 'thinking', value: 'low', type: 'string' },
    ],
  },
  {
    name: 'Channels',
    icon: '📡',
    settings: [
      { key: 'telegram.enabled', value: 'true', type: 'boolean' },
      { key: 'telegram.token', value: '••••••••', type: 'secret' },
    ],
  },
  {
    name: 'Security',
    icon: '🔒',
    settings: [
      { key: 'rateLimit', value: '100', type: 'number' },
      { key: 'allowedUsers', value: '8569026974', type: 'string' },
    ],
  },
]

export default function ConfigPage() {
  const [config, setConfig] = useState<ConfigSection[]>(CONFIG_SECTIONS)
  const [editing, setEditing] = useState(false)

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="config">
        <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
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
                ⚙️ Configuration
              </h1>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
              }}>
                Gateway and agent configuration
              </p>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              style={{
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: '600',
                background: editing ? 'var(--accent-green)' : 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                color: editing ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {editing ? '💾 Save Changes' : '✏️ Edit Config'}
            </button>
          </div>

          {/* Config Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {config.map(section => (
              <div
                key={section.name}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-card)',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <span style={{ fontSize: '18px' }}>{section.icon}</span>
                  <span style={{
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    fontWeight: '600',
                  }}>
                    {section.name}
                  </span>
                </div>

                <div style={{ padding: '8px 0' }}>
                  {section.settings.map((setting, i) => (
                    <div
                      key={setting.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 20px',
                        borderBottom: i < section.settings.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      }}
                    >
                      <span style={{
                        color: 'var(--text-secondary)',
                        fontSize: '13px',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {setting.key}
                      </span>
                      {editing ? (
                        <input
                          type={setting.type === 'secret' ? 'password' : 'text'}
                          defaultValue={setting.type === 'secret' ? '' : setting.value}
                          placeholder={setting.type === 'secret' ? '••••••••' : ''}
                          style={{
                            padding: '6px 10px',
                            fontSize: '13px',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            color: 'var(--text-primary)',
                            fontFamily: "'JetBrains Mono', monospace",
                            width: '200px',
                            textAlign: 'right',
                          }}
                        />
                      ) : (
                        <span style={{
                          color: setting.type === 'secret' ? 'var(--text-muted)' : 'var(--text-primary)',
                          fontSize: '13px',
                          fontFamily: "'JetBrains Mono', monospace",
                          padding: '6px 10px',
                          background: 'var(--bg-secondary)',
                          borderRadius: '6px',
                        }}>
                          {setting.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Config File Location */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'var(--bg-secondary)',
            borderRadius: '10px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}>
            <strong>Config file:</strong>{' '}
            <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ~/.clawdbot/clawdbot.json
            </code>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
