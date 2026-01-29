'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

interface CronJob {
  id: string
  name: string
  schedule: string
  scheduleHuman: string
  purpose: string
  lastRun?: string
  nextRun?: string
  status: 'active' | 'disabled' | 'error'
  type: 'clawdbot' | 'system'
}

const CRON_JOBS: CronJob[] = [
  // Clawdbot cron jobs
  { id: 'morning-brief', name: 'Morning Brief', schedule: '0 11 * * *', scheduleHuman: '6:00 AM EST daily', purpose: 'Full morning briefing with calendar, tasks, weather', status: 'active', type: 'clawdbot' },
  { id: 'evening-winddown', name: 'Evening Winddown', schedule: '0 3 * * *', scheduleHuman: '10:00 PM EST daily', purpose: 'Recap day, prepare tomorrow, journal', status: 'active', type: 'clawdbot' },
  { id: 'weekly-review', name: 'Weekly Review', schedule: '0 23 * * 0', scheduleHuman: 'Sun 6:00 PM EST', purpose: 'Weekly analysis and planning', status: 'active', type: 'clawdbot' },
  { id: 'nightly-build', name: 'Nightly Build', schedule: '0 4 * * *', scheduleHuman: '11:00 PM EST daily', purpose: 'Build PRs while Noel sleeps', status: 'active', type: 'clawdbot' },
  { id: 'daytime-build', name: 'Daytime Build', schedule: '0 14 * * 1-5', scheduleHuman: '9:00 AM EST weekdays', purpose: 'Build while Noel at Army', status: 'active', type: 'clawdbot' },
  { id: 'disk-monitor', name: 'Disk Monitor', schedule: '0 */6 * * *', scheduleHuman: 'Every 6 hours', purpose: 'Storage alerts', status: 'active', type: 'clawdbot' },
  { id: 'security-check', name: 'Security Check', schedule: '0 12 * * 1', scheduleHuman: 'Mon 7:00 AM EST', purpose: 'Firewall, SSH, intrusion check', status: 'active', type: 'clawdbot' },
  { id: 'secrets-audit', name: 'Secrets Audit', schedule: '0 13 * * 3', scheduleHuman: 'Wed 8:00 AM EST', purpose: 'Find exposed credentials', status: 'active', type: 'clawdbot' },
  // System cron jobs
  { id: 'self-heal', name: 'Self Heal', schedule: '*/5 * * * *', scheduleHuman: 'Every 5 minutes', purpose: 'Keep Clawdbot alive', status: 'active', type: 'system' },
  { id: 'backup-jackal', name: 'Backup Jackal', schedule: '0 9 * * *', scheduleHuman: '4:00 AM EST daily', purpose: 'Daily workspace backup', status: 'active', type: 'system' },
]

export default function CronPage() {
  const [filter, setFilter] = useState<'all' | 'clawdbot' | 'system'>('all')

  const filteredJobs = CRON_JOBS.filter(job => {
    if (filter === 'all') return true
    return job.type === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--accent-green)'
      case 'disabled': return 'var(--text-muted)'
      case 'error': return '#ef4444'
      default: return 'var(--text-muted)'
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="cron">
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
                ⏰ Scheduled Jobs
              </h1>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
              }}>
                {CRON_JOBS.filter(j => j.status === 'active').length} active jobs running
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
              background: 'var(--bg-secondary)',
              padding: '4px',
              borderRadius: '10px',
            }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'clawdbot', label: '🤖 Clawdbot' },
                { id: 'system', label: '🖥️ System' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    background: filter === tab.id ? 'var(--bg-card)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: filter === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border-card)',
              padding: '20px',
            }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>
                Total Jobs
              </div>
              <div style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: '700' }}>
                {CRON_JOBS.length}
              </div>
            </div>
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border-card)',
              padding: '20px',
            }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>
                Clawdbot Jobs
              </div>
              <div style={{ color: 'var(--accent-blue)', fontSize: '24px', fontWeight: '700' }}>
                {CRON_JOBS.filter(j => j.type === 'clawdbot').length}
              </div>
            </div>
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border-card)',
              padding: '20px',
            }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>
                System Jobs
              </div>
              <div style={{ color: '#8b5cf6', fontSize: '24px', fontWeight: '700' }}>
                {CRON_JOBS.filter(j => j.type === 'system').length}
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-card)',
            overflow: 'hidden',
          }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 150px 200px 100px',
              gap: '16px',
              padding: '14px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Job</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Schedule</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Purpose</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Status</span>
            </div>

            {/* Job Rows */}
            {filteredJobs.map((job, i) => (
              <div
                key={job.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 150px 200px 100px',
                  gap: '16px',
                  padding: '16px 20px',
                  borderBottom: i < filteredJobs.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '2px',
                  }}>
                    <span style={{ fontSize: '14px' }}>
                      {job.type === 'clawdbot' ? '🤖' : '🖥️'}
                    </span>
                    <span style={{
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}>
                      {job.name}
                    </span>
                  </div>
                  <div style={{
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    fontFamily: "'JetBrains Mono', monospace",
                    marginLeft: '22px',
                  }}>
                    {job.schedule}
                  </div>
                </div>
                <div style={{
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                }}>
                  {job.scheduleHuman}
                </div>
                <div style={{
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                }}>
                  {job.purpose}
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
                    background: getStatusColor(job.status),
                  }} />
                  <span style={{
                    color: getStatusColor(job.status),
                    fontSize: '12px',
                    textTransform: 'capitalize',
                  }}>
                    {job.status}
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
