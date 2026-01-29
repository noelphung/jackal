'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AgentStatus from './AgentStatus'

type TabType = 'overview' | 'tasks' | 'pipeline' | 'documents' | 'logs' | 'agent' | 'integrations' | 'cron' | 'backups' | 'security' | 'api-keys' | 'settings'

interface NavItem {
  id: TabType
  icon: string
  label: string
  href: string
}

const navItems: NavItem[] = [
  { id: 'overview', icon: '📊', label: 'Overview', href: '/' },
  { id: 'pipeline', icon: '🚀', label: 'Pipeline', href: '/pipeline' },
  { id: 'documents', icon: '📄', label: 'Documents', href: '/documents' },
  { id: 'logs', icon: '📝', label: 'Logs', href: '/logs' },
]

const systemNavItems: NavItem[] = [
  { id: 'agent', icon: '🤖', label: 'Agent', href: '/agent' },
  { id: 'integrations', icon: '🔗', label: 'Integrations', href: '/integrations' },
  { id: 'cron', icon: '⏰', label: 'Cron Jobs', href: '/cron' },
  { id: 'backups', icon: '💾', label: 'Backups', href: '/backups' },
  { id: 'security', icon: '🔒', label: 'Security', href: '/security' },
]

const bottomNavItems: NavItem[] = [
  { id: 'api-keys', icon: '🔑', label: 'API Keys', href: '/api-keys' },
  { id: 'settings', icon: '⚙️', label: 'Settings', href: '/settings' },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  activeTab?: TabType
}

export default function DashboardLayout({ children, activeTab }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [lastSync, setLastSync] = useState<Date>(new Date())

  // Determine active tab from pathname if not provided
  const currentTab = activeTab || (() => {
    if (pathname === '/') return 'overview'
    const path = pathname.slice(1).split('/')[0]
    return path as TabType
  })()

  useEffect(() => {
    const interval = setInterval(() => setLastSync(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--bg-primary)',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <AgentStatus />
        
        {/* Main Navigation */}
        <nav style={{ padding: '16px 0', flex: 1 }}>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            padding: '0 20px 8px',
          }}>
            Dashboard
          </div>
          {navItems.map(item => (
            <Link
              key={item.id}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 20px',
                color: currentTab === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
                background: currentTab === item.id ? 'var(--bg-card)' : 'transparent',
                borderLeft: currentTab === item.id ? '3px solid var(--accent-blue)' : '3px solid transparent',
                transition: 'all 0.2s',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {/* System Section */}
          <div style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            padding: '16px 20px 8px',
          }}>
            System
          </div>
          {systemNavItems.map(item => (
            <Link
              key={item.id}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 20px',
                color: currentTab === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
                background: currentTab === item.id ? 'var(--bg-card)' : 'transparent',
                borderLeft: currentTab === item.id ? '3px solid var(--accent-blue)' : '3px solid transparent',
                transition: 'all 0.2s',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <nav style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '16px 0',
        }}>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            padding: '0 20px 8px',
          }}>
            Configuration
          </div>
          {bottomNavItems.map(item => (
            <Link
              key={item.id}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 20px',
                color: currentTab === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
                background: currentTab === item.id ? 'var(--bg-card)' : 'transparent',
                borderLeft: currentTab === item.id ? '3px solid var(--accent-blue)' : '3px solid transparent',
                transition: 'all 0.2s',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* System Status */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          <div style={{ marginBottom: '4px' }}>System Status</div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--accent-green)',
            }} />
            <span>All systems operational</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🦊</span>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'var(--text-primary)',
            }}>
              Jackal Dashboard
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'rgba(34, 197, 94, 0.15)',
              borderRadius: '12px',
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent-green)',
              }} className="animate-pulse" />
              <span style={{
                fontSize: '12px',
                color: 'var(--accent-green)',
                fontWeight: '500',
              }}>
                Online
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <span style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              Last sync: {formatTime(lastSync)}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
