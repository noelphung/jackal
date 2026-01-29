'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

interface MCPServer {
  name: string
  status: 'active' | 'inactive' | 'error'
  tools: number
  description: string
}

interface N8NWorkflow {
  name: string
  webhook: string
  method: 'GET' | 'POST'
  status: 'active' | 'inactive'
  description: string
}

interface Integration {
  name: string
  icon: string
  status: 'connected' | 'disconnected' | 'error'
  description: string
  lastSync?: string
}

const MCP_SERVERS: MCPServer[] = [
  { name: 'vercel', status: 'active', tools: 150, description: 'Vercel deployment & project management' },
  { name: 'n8n-mcp', status: 'active', tools: 20, description: 'n8n workflow automation' },
  { name: 'supabase', status: 'active', tools: 45, description: 'Database & auth operations' },
]

const N8N_WORKFLOWS: N8NWorkflow[] = [
  { name: 'Jackal Calendar View', webhook: '/webhook/jackal-calendar', method: 'GET', status: 'active', description: 'Fetch calendar events' },
  { name: 'Jackal Calendar Create', webhook: '/webhook/jackal-calendar-create', method: 'POST', status: 'active', description: 'Create calendar events' },
  { name: 'Jackal Calendar Edit', webhook: '/webhook/jackal-calendar-edit', method: 'POST', status: 'active', description: 'Edit calendar events' },
  { name: 'Jackal Calendar Delete', webhook: '/webhook/jackal-calendar-delete', method: 'POST', status: 'active', description: 'Delete calendar events' },
  { name: 'Jackal Gmail', webhook: '/webhook/jackal-gmail', method: 'GET', status: 'active', description: 'Fetch recent emails (25)' },
]

const INTEGRATIONS: Integration[] = [
  { name: 'Supabase', icon: '⚡', status: 'connected', description: 'Database, auth, storage', lastSync: 'Just now' },
  { name: 'Vercel', icon: '▲', status: 'connected', description: 'Hosting & deployments', lastSync: '2 min ago' },
  { name: 'GitHub', icon: '🐙', status: 'connected', description: 'Code repository', lastSync: '5 min ago' },
  { name: 'n8n', icon: '🔗', status: 'connected', description: 'Workflow automation', lastSync: 'Just now' },
  { name: 'Telegram', icon: '💬', status: 'connected', description: 'Messaging channel', lastSync: 'Active' },
  { name: 'Google Calendar', icon: '📅', status: 'connected', description: 'Calendar sync via n8n', lastSync: '1 min ago' },
  { name: 'Gmail', icon: '📧', status: 'connected', description: 'Email access via n8n', lastSync: '3 min ago' },
]

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'mcp' | 'n8n'>('overview')

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="integrations">
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
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
                🔗 Integrations
              </h1>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
              }}>
                Connected services, MCP servers, and workflows
              </p>
            </div>

            {/* Tab Switcher */}
            <div style={{
              display: 'flex',
              gap: '8px',
              background: 'var(--bg-secondary)',
              padding: '4px',
              borderRadius: '10px',
            }}>
              {[
                { id: 'overview', label: '📊 Overview' },
                { id: 'mcp', label: '🔌 MCP' },
                { id: 'n8n', label: '🔗 n8n' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Connected Services */}
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-card)',
                padding: '24px',
                marginBottom: '24px',
              }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '20px',
                }}>
                  Connected Services
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px',
                }}>
                  {INTEGRATIONS.map(int => (
                    <div
                      key={int.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '16px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                      }}
                    >
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'var(--bg-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                      }}>
                        {int.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px',
                        }}>
                          <span style={{
                            color: 'var(--text-primary)',
                            fontWeight: '600',
                            fontSize: '14px',
                          }}>
                            {int.name}
                          </span>
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: int.status === 'connected' ? 'var(--accent-green)' : '#ef4444',
                          }} />
                        </div>
                        <div style={{
                          color: 'var(--text-muted)',
                          fontSize: '12px',
                        }}>
                          {int.description}
                        </div>
                      </div>
                      {int.lastSync && (
                        <div style={{
                          color: 'var(--text-muted)',
                          fontSize: '11px',
                        }}>
                          {int.lastSync}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
              }}>
                <StatCard icon="🔌" label="MCP Servers" value={MCP_SERVERS.length} color="#8b5cf6" />
                <StatCard icon="⚙️" label="Total Tools" value={MCP_SERVERS.reduce((a, s) => a + s.tools, 0)} color="var(--accent-blue)" />
                <StatCard icon="🔗" label="n8n Workflows" value={N8N_WORKFLOWS.length} color="#f59e0b" />
                <StatCard icon="✅" label="Services" value={INTEGRATIONS.length} color="var(--accent-green)" />
              </div>
            </>
          )}

          {activeTab === 'mcp' && (
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-card)',
              padding: '24px',
            }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '20px',
              }}>
                MCP Servers
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {MCP_SERVERS.map(server => (
                  <div
                    key={server.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: server.status === 'active' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                      }}>
                        🔌
                      </div>
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '4px',
                        }}>
                          <span style={{
                            color: 'var(--text-primary)',
                            fontWeight: '600',
                            fontSize: '15px',
                          }}>
                            {server.name}
                          </span>
                          <span style={{
                            padding: '2px 8px',
                            fontSize: '11px',
                            borderRadius: '4px',
                            background: server.status === 'active' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                            color: server.status === 'active' ? 'var(--accent-green)' : 'var(--text-muted)',
                          }}>
                            {server.status}
                          </span>
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                          {server.description}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      padding: '8px 16px',
                      background: 'var(--bg-card)',
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}>
                      <div style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '700' }}>
                        {server.tools}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                        tools
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'n8n' && (
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-card)',
              padding: '24px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                }}>
                  n8n Workflows (Jackal)
                </h2>
                <a
                  href="https://synlixa2.app.n8n.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  Open n8n →
                </a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {N8N_WORKFLOWS.map(wf => (
                  <div
                    key={wf.webhook}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        borderRadius: '4px',
                        background: wf.method === 'GET' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: wf.method === 'GET' ? 'var(--accent-green)' : 'var(--accent-blue)',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {wf.method}
                      </span>
                      <div>
                        <div style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: '500' }}>
                          {wf.name}
                        </div>
                        <div style={{
                          color: 'var(--text-muted)',
                          fontSize: '11px',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>
                          {wf.webhook}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: wf.status === 'active' ? 'var(--accent-green)' : 'var(--text-muted)',
                      }} />
                      <span style={{
                        color: wf.status === 'active' ? 'var(--accent-green)' : 'var(--text-muted)',
                        fontSize: '12px',
                      }}>
                        {wf.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px solid var(--border-card)',
      padding: '20px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px',
      }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{label}</span>
      </div>
      <div style={{
        fontSize: '28px',
        fontWeight: '700',
        color: color,
      }}>
        {value}
      </div>
    </div>
  )
}
