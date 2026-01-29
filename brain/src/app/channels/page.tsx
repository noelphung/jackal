'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

interface Channel {
  id: string
  name: string
  type: string
  status: 'connected' | 'disconnected' | 'error'
  lastActivity: string
  config: {
    botName?: string
    chatId?: string
  }
}

const CHANNELS: Channel[] = [
  {
    id: 'telegram',
    name: 'Telegram',
    type: 'telegram',
    status: 'connected',
    lastActivity: 'Just now',
    config: {
      botName: '@JackalAssistantBot',
      chatId: '8569026974',
    },
  },
]

export default function ChannelsPage() {
  const [channels] = useState<Channel[]>(CHANNELS)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'var(--accent-green)'
      case 'disconnected': return 'var(--text-muted)'
      case 'error': return '#ef4444'
      default: return 'var(--text-muted)'
    }
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'telegram': return '💬'
      case 'discord': return '🎮'
      case 'slack': return '💼'
      case 'whatsapp': return '📱'
      case 'signal': return '🔒'
      default: return '📨'
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="channels">
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}>
              📡 Channels
            </h1>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '14px',
            }}>
              Connected messaging channels
            </p>
          </div>

          {/* Channel Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}>
            {channels.map(channel => (
              <div
                key={channel.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-card)',
                  padding: '24px',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '20px',
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                  }}>
                    {getChannelIcon(channel.type)}
                  </div>
                  <div>
                    <div style={{
                      color: 'var(--text-primary)',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}>
                      {channel.name}
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
                        background: getStatusColor(channel.status),
                      }} />
                      <span style={{
                        color: getStatusColor(channel.status),
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                      }}>
                        {channel.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '10px',
                }}>
                  {channel.config.botName && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Bot</span>
                      <span style={{
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {channel.config.botName}
                      </span>
                    </div>
                  )}
                  {channel.config.chatId && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Chat ID</span>
                      <span style={{
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {channel.config.chatId}
                      </span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Last Activity</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                      {channel.lastActivity}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Channel Card */}
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: '16px',
              border: '2px dashed var(--border-subtle)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              cursor: 'pointer',
              opacity: 0.6,
            }}>
              <span style={{ fontSize: '32px', marginBottom: '12px' }}>➕</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Add Channel
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px' }}>
                (Configure in gateway)
              </span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
