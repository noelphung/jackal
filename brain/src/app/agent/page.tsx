'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

interface Skill {
  name: string
  description: string
  location: string
}

interface MemoryFile {
  name: string
  path: string
  type: 'daily' | 'memory' | 'config'
  lastModified?: string
}

const SKILLS: Skill[] = [
  { name: 'github', description: 'Interact with GitHub using the gh CLI', location: 'clawdbot/skills/github' },
  { name: 'notion', description: 'Notion API for pages, databases, blocks', location: 'clawdbot/skills/notion' },
  { name: 'slack', description: 'Control Slack via Clawdbot', location: 'clawdbot/skills/slack' },
  { name: 'weather', description: 'Get weather and forecasts', location: 'clawdbot/skills/weather' },
  { name: 'tmux', description: 'Remote-control tmux sessions', location: 'clawdbot/skills/tmux' },
  { name: 'mcporter', description: 'MCP server management', location: 'clawdbot/skills/mcporter' },
  { name: 'frontend-design', description: 'Production-grade frontend interfaces', location: 'clawd/skills/frontend-design' },
  { name: 'n8n-workflow-patterns', description: 'Proven n8n workflow patterns', location: 'clawd/skills/n8n-workflow-patterns' },
  { name: 'n8n-mcp-tools-expert', description: 'n8n MCP tools guidance', location: 'clawd/skills/n8n-mcp-tools-expert' },
]

const MEMORY_FILES: MemoryFile[] = [
  { name: 'MEMORY.md', path: '/home/ubuntu/clawd/MEMORY.md', type: 'memory' },
  { name: 'SOUL.md', path: '/home/ubuntu/clawd/SOUL.md', type: 'config' },
  { name: 'USER.md', path: '/home/ubuntu/clawd/USER.md', type: 'config' },
  { name: 'TOOLS.md', path: '/home/ubuntu/clawd/TOOLS.md', type: 'config' },
  { name: 'HEARTBEAT.md', path: '/home/ubuntu/clawd/HEARTBEAT.md', type: 'config' },
  { name: 'AGENTS.md', path: '/home/ubuntu/clawd/AGENTS.md', type: 'config' },
]

export default function AgentPage() {
  const [agentStatus, setAgentStatus] = useState<{
    state: string
    currentTask: string
    lastActive: string
  } | null>(null)
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null)
  const [memoryContent, setMemoryContent] = useState<string>('')

  useEffect(() => {
    // Fetch agent status
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setAgentStatus(data))
      .catch(() => setAgentStatus({ state: 'unknown', currentTask: 'Unable to fetch status', lastActive: '' }))
  }, [])

  const getStateColor = (state: string) => {
    switch (state) {
      case 'online': case 'working': return 'var(--accent-green)'
      case 'thinking': return 'var(--accent-blue)'
      case 'idle': return 'var(--accent-yellow)'
      default: return 'var(--text-muted)'
    }
  }

  const getStateEmoji = (state: string) => {
    switch (state) {
      case 'online': case 'working': return '🟢'
      case 'thinking': return '🔵'
      case 'idle': return '🟡'
      case 'sleeping': return '😴'
      default: return '⚪'
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="agent">
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}>
            🤖 Agent Control
          </h1>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '14px',
            marginBottom: '32px',
          }}>
            Monitor and configure Jackal
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Agent Status Card */}
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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                🦊 Status
              </h2>

              {agentStatus ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                  }}>
                    <span style={{ fontSize: '32px' }}>🦊</span>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}>
                        <span style={{ fontSize: '16px' }}>{getStateEmoji(agentStatus.state)}</span>
                        <span style={{
                          color: getStateColor(agentStatus.state),
                          fontWeight: '600',
                          textTransform: 'capitalize',
                        }}>
                          {agentStatus.state}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {agentStatus.currentTask}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}>
                    <InfoBox label="Runtime" value="Clawdbot 2026.1.24" />
                    <InfoBox label="Model" value="claude-opus-4-5" />
                    <InfoBox label="Channel" value="Telegram" />
                    <InfoBox label="Workspace" value="/home/ubuntu/clawd" />
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>Loading status...</div>
              )}
            </div>

            {/* Memory Files */}
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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                🧠 Memory & Config
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {MEMORY_FILES.map(file => (
                  <div
                    key={file.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>{file.type === 'memory' ? '🧠' : file.type === 'daily' ? '📅' : '⚙️'}</span>
                      <span style={{ color: 'var(--text-primary)', fontSize: '13px' }}>
                        {file.name}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {file.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-card)',
              padding: '24px',
              gridColumn: 'span 2',
            }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                ⚡ Available Skills ({SKILLS.length})
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
              }}>
                {SKILLS.map(skill => (
                  <div
                    key={skill.name}
                    style={{
                      padding: '16px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}>
                      <span style={{
                        padding: '4px 8px',
                        background: 'var(--accent-blue)',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}>
                        {skill.name}
                      </span>
                    </div>
                    <div style={{
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                      lineHeight: '1.5',
                    }}>
                      {skill.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      padding: '12px',
      background: 'var(--bg-secondary)',
      borderRadius: '8px',
    }}>
      <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: '500' }}>
        {value}
      </div>
    </div>
  )
}
