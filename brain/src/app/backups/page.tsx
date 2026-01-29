'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

interface Backup {
  id: string
  name: string
  type: 'full' | 'incremental' | 'config'
  size: string
  created: string
  location: string
  status: 'completed' | 'in_progress' | 'failed'
}

const BACKUP_HISTORY: Backup[] = [
  { id: '1', name: 'jackal-workspace-20260129', type: 'full', size: '156 MB', created: '2026-01-29 04:00 EST', location: '/backups/jackal/', status: 'completed' },
  { id: '2', name: 'jackal-workspace-20260128', type: 'full', size: '152 MB', created: '2026-01-28 04:00 EST', location: '/backups/jackal/', status: 'completed' },
  { id: '3', name: 'jackal-workspace-20260127', type: 'full', size: '148 MB', created: '2026-01-27 04:00 EST', location: '/backups/jackal/', status: 'completed' },
  { id: '4', name: 'brain-docs-20260129', type: 'config', size: '2.4 MB', created: '2026-01-29 04:00 EST', location: '/backups/brain-docs/', status: 'completed' },
  { id: '5', name: 'clawd-config-20260129', type: 'config', size: '48 KB', created: '2026-01-29 04:00 EST', location: '/backups/clawd/', status: 'completed' },
]

const BACKUP_TARGETS = [
  { name: 'Workspace', path: '/home/ubuntu/clawd', size: '~160 MB', schedule: 'Daily 4 AM EST', lastBackup: '2026-01-29 04:00 EST' },
  { name: 'Brain Docs', path: '/home/ubuntu/clawd/brain-docs', size: '~2.5 MB', schedule: 'Daily 4 AM EST', lastBackup: '2026-01-29 04:00 EST' },
  { name: 'NextDial', path: '/home/ubuntu/nextdial', size: '~85 MB', schedule: 'Not configured', lastBackup: 'Never' },
  { name: 'Config Files', path: 'SOUL/USER/TOOLS.md', size: '~50 KB', schedule: 'Daily 4 AM EST', lastBackup: '2026-01-29 04:00 EST' },
]

export default function BackupsPage() {
  const [triggeringBackup, setTriggeringBackup] = useState(false)

  const triggerBackup = async () => {
    setTriggeringBackup(true)
    // In a real implementation, this would call an API endpoint
    setTimeout(() => {
      setTriggeringBackup(false)
      alert('Backup triggered! Check logs for progress.')
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'var(--accent-green)'
      case 'in_progress': return 'var(--accent-yellow)'
      case 'failed': return '#ef4444'
      default: return 'var(--text-muted)'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full': return 'var(--accent-blue)'
      case 'incremental': return '#8b5cf6'
      case 'config': return '#f59e0b'
      default: return 'var(--text-muted)'
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="backups">
        <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
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
                💾 Backups
              </h1>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
              }}>
                Automated backups and recovery
              </p>
            </div>

            <button
              onClick={triggerBackup}
              disabled={triggeringBackup}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                background: triggeringBackup ? 'var(--bg-secondary)' : 'var(--accent-blue)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                cursor: triggeringBackup ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {triggeringBackup ? '⏳ Running...' : '▶️ Run Backup Now'}
            </button>
          </div>

          {/* Backup Status */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <StatusCard icon="✅" label="Last Backup" value="4 hours ago" subtext="2026-01-29 04:00 EST" color="var(--accent-green)" />
            <StatusCard icon="📊" label="Total Size" value="310 MB" subtext="All backups" color="var(--accent-blue)" />
            <StatusCard icon="📁" label="Backup Count" value={BACKUP_HISTORY.length.toString()} subtext="This month" color="#8b5cf6" />
            <StatusCard icon="⏰" label="Next Backup" value="20 hours" subtext="2026-01-30 04:00 EST" color="#f59e0b" />
          </div>

          {/* Backup Targets */}
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
              📁 Backup Targets
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}>
              {BACKUP_TARGETS.map(target => (
                <div
                  key={target.name}
                  style={{
                    padding: '16px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}>
                      {target.name}
                    </div>
                    <div style={{
                      color: 'var(--text-muted)',
                      fontSize: '11px',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {target.path}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                      marginBottom: '2px',
                    }}>
                      {target.size}
                    </div>
                    <div style={{
                      color: 'var(--text-muted)',
                      fontSize: '11px',
                    }}>
                      {target.schedule}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Backup History */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-card)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text-primary)',
              }}>
                📋 Backup History
              </h2>
            </div>

            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 100px 100px 180px 100px',
              gap: '16px',
              padding: '12px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Name</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Type</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Size</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Created</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Status</span>
            </div>

            {/* Rows */}
            {BACKUP_HISTORY.map((backup, i) => (
              <div
                key={backup.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 100px 100px 180px 100px',
                  gap: '16px',
                  padding: '14px 24px',
                  borderBottom: i < BACKUP_HISTORY.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '500',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {backup.name}
                  </div>
                  <div style={{
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                  }}>
                    {backup.location}
                  </div>
                </div>
                <span style={{
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: '500',
                  borderRadius: '4px',
                  background: `${getTypeColor(backup.type)}20`,
                  color: getTypeColor(backup.type),
                  textTransform: 'capitalize',
                  width: 'fit-content',
                }}>
                  {backup.type}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  {backup.size}
                </span>
                <span style={{
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {backup.created}
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getStatusColor(backup.status),
                  }} />
                  <span style={{
                    color: getStatusColor(backup.status),
                    fontSize: '12px',
                    textTransform: 'capitalize',
                  }}>
                    {backup.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function StatusCard({ icon, label, value, subtext, color }: {
  icon: string
  label: string
  value: string
  subtext: string
  color: string
}) {
  return (
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
        marginBottom: '12px',
      }}>
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{label}</span>
      </div>
      <div style={{
        fontSize: '22px',
        fontWeight: '700',
        color: color,
        marginBottom: '4px',
      }}>
        {value}
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
        {subtext}
      </div>
    </div>
  )
}
