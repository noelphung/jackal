'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

interface DocLink {
  title: string
  description: string
  url: string
  icon: string
}

const DOC_SECTIONS: { category: string; links: DocLink[] }[] = [
  {
    category: 'Getting Started',
    links: [
      { title: 'Installation', description: 'How to install and configure Clawdbot', url: 'https://docs.clawd.bot/installation', icon: '📦' },
      { title: 'Quick Start', description: 'Get up and running in 5 minutes', url: 'https://docs.clawd.bot/quickstart', icon: '🚀' },
      { title: 'Configuration', description: 'Configure channels, agents, and settings', url: 'https://docs.clawd.bot/configuration', icon: '⚙️' },
    ],
  },
  {
    category: 'Features',
    links: [
      { title: 'Channels', description: 'Telegram, Discord, Slack, and more', url: 'https://docs.clawd.bot/channels', icon: '📡' },
      { title: 'Skills', description: 'Extend capabilities with skills', url: 'https://docs.clawd.bot/skills', icon: '⚡' },
      { title: 'Cron Jobs', description: 'Schedule automated tasks', url: 'https://docs.clawd.bot/cron', icon: '⏰' },
      { title: 'Nodes', description: 'Pair mobile devices and computers', url: 'https://docs.clawd.bot/nodes', icon: '🖥️' },
    ],
  },
  {
    category: 'Security',
    links: [
      { title: 'Security Best Practices', description: 'Keep your instance secure', url: 'https://docs.clawd.bot/security', icon: '🔒' },
      { title: 'Authentication', description: 'User whitelist and access control', url: 'https://docs.clawd.bot/auth', icon: '🔑' },
    ],
  },
  {
    category: 'Resources',
    links: [
      { title: 'GitHub', description: 'Source code and issues', url: 'https://github.com/clawdbot/clawdbot', icon: '🐙' },
      { title: 'Discord Community', description: 'Get help and share', url: 'https://discord.com/invite/clawd', icon: '💬' },
      { title: 'Skill Hub', description: 'Find and share skills', url: 'https://clawdhub.com', icon: '🏪' },
    ],
  },
]

const LOCAL_DOCS = [
  { path: 'SOUL.md', description: 'Agent personality and behavior' },
  { path: 'USER.md', description: 'User profile and preferences' },
  { path: 'TOOLS.md', description: 'Tool configuration notes' },
  { path: 'AGENTS.md', description: 'Agent workspace guidelines' },
  { path: 'HEARTBEAT.md', description: 'Heartbeat check configuration' },
  { path: 'MEMORY.md', description: 'Long-term memory storage' },
]

export default function DocsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="docs">
        <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}>
              📚 Documentation
            </h1>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '14px',
            }}>
              Guides, references, and resources
            </p>
          </div>

          {/* Online Docs */}
          <div style={{ marginBottom: '32px' }}>
            {DOC_SECTIONS.map(section => (
              <div key={section.category} style={{ marginBottom: '24px' }}>
                <h2 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '12px',
                }}>
                  {section.category}
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '12px',
                }}>
                  {section.links.map(link => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '16px',
                        background: 'var(--bg-card)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-card)',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'var(--bg-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                      }}>
                        {link.icon}
                      </div>
                      <div>
                        <div style={{
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '2px',
                        }}>
                          {link.title}
                        </div>
                        <div style={{
                          color: 'var(--text-muted)',
                          fontSize: '12px',
                        }}>
                          {link.description}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Local Docs */}
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
              marginBottom: '16px',
            }}>
              📁 Workspace Files
            </h2>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '13px',
              marginBottom: '16px',
            }}>
              Local configuration and memory files in <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>/home/ubuntu/clawd/</code>
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '10px',
            }}>
              {LOCAL_DOCS.map(doc => (
                <div
                  key={doc.path}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <div style={{
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {doc.path}
                    </div>
                    <div style={{
                      color: 'var(--text-muted)',
                      fontSize: '11px',
                    }}>
                      {doc.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
