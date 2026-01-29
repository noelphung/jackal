'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

interface Node {
  id: string
  name: string
  type: 'mobile' | 'desktop' | 'server'
  status: 'online' | 'offline' | 'pending'
  lastSeen: string
  capabilities: string[]
}

const NODES: Node[] = [
  // No nodes paired yet - empty state
]

export default function NodesPage() {
  const [nodes] = useState<Node[]>(NODES)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'var(--accent-green)'
      case 'offline': return 'var(--text-muted)'
      case 'pending': return 'var(--accent-yellow)'
      default: return 'var(--text-muted)'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mobile': return '📱'
      case 'desktop': return '💻'
      case 'server': return '🖥️'
      default: return '📟'
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="nodes">
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
                🖥️ Nodes
              </h1>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
              }}>
                Paired devices and remote nodes
              </p>
            </div>

            <button style={{
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: '600',
              background: 'var(--accent-blue)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span>➕</span> Pair Node
            </button>
          </div>

          {nodes.length === 0 ? (
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-card)',
              padding: '60px 40px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🖥️</div>
              <h3 style={{
                color: 'var(--text-primary)',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '8px',
              }}>
                No Nodes Paired
              </h3>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
                marginBottom: '24px',
                maxWidth: '400px',
                margin: '0 auto 24px',
              }}>
                Pair your mobile device or other computers to enable remote capabilities like camera, screen capture, and notifications.
              </p>
              <button style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                background: 'var(--accent-blue)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                cursor: 'pointer',
              }}>
                Pair Your First Node
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {nodes.map(node => (
                <div
                  key={node.id}
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
                    marginBottom: '16px',
                  }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                    }}>
                      {getTypeIcon(node.type)}
                    </div>
                    <div>
                      <div style={{
                        color: 'var(--text-primary)',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}>
                        {node.name}
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
                          background: getStatusColor(node.status),
                        }} />
                        <span style={{
                          color: getStatusColor(node.status),
                          fontSize: '12px',
                          textTransform: 'capitalize',
                        }}>
                          {node.status}
                        </span>
                        <span style={{
                          color: 'var(--text-muted)',
                          fontSize: '11px',
                        }}>
                          • {node.lastSeen}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}>
                    {node.capabilities.map(cap => (
                      <span
                        key={cap}
                        style={{
                          padding: '4px 10px',
                          fontSize: '11px',
                          background: 'var(--bg-secondary)',
                          borderRadius: '6px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Capabilities Info */}
          <div style={{
            marginTop: '32px',
            padding: '20px',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '12px',
            }}>
              Node Capabilities
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '12px',
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}>
              <div>📷 <strong>Camera</strong> — Snap photos, video clips</div>
              <div>🖥️ <strong>Screen</strong> — Screenshots, recordings</div>
              <div>📍 <strong>Location</strong> — GPS coordinates</div>
              <div>🔔 <strong>Notify</strong> — Push notifications</div>
              <div>⌨️ <strong>Run</strong> — Execute commands</div>
              <div>📱 <strong>Canvas</strong> — Display UI</div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
