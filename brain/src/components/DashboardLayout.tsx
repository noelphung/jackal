'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AgentStatus from './AgentStatus'

type TabType = 'overview' | 'tasks' | 'pipeline' | 'documents' | 'logs' | 'sessions' | 'channels' | 'agent' | 'nodes' | 'integrations' | 'cron' | 'backups' | 'security' | 'config' | 'debug' | 'api-keys' | 'settings' | 'docs'

interface NavItem {
  id: TabType
  icon: string
  label: string
  href: string
}

// Control section (main dashboard features)
const navItems: NavItem[] = [
  { id: 'overview', icon: '📊', label: 'Overview', href: '/' },
  { id: 'pipeline', icon: '🚀', label: 'Pipeline', href: '/pipeline' },
  { id: 'sessions', icon: '💬', label: 'Sessions', href: '/sessions' },
  { id: 'channels', icon: '📡', label: 'Channels', href: '/channels' },
]

// Agent section
const agentNavItems: NavItem[] = [
  { id: 'agent', icon: '🤖', label: 'Agent', href: '/agent' },
  { id: 'nodes', icon: '🖥️', label: 'Nodes', href: '/nodes' },
  { id: 'cron', icon: '⏰', label: 'Cron Jobs', href: '/cron' },
]

// System section
const systemNavItems: NavItem[] = [
  { id: 'integrations', icon: '🔗', label: 'Integrations', href: '/integrations' },
  { id: 'backups', icon: '💾', label: 'Backups', href: '/backups' },
  { id: 'security', icon: '🔒', label: 'Security', href: '/security' },
  { id: 'documents', icon: '📄', label: 'Documents', href: '/documents' },
  { id: 'logs', icon: '📝', label: 'Logs', href: '/logs' },
]

// Settings section
const bottomNavItems: NavItem[] = [
  { id: 'config', icon: '⚙️', label: 'Config', href: '/config' },
  { id: 'debug', icon: '🔧', label: 'Debug', href: '/debug' },
  { id: 'api-keys', icon: '🔑', label: 'API Keys', href: '/api-keys' },
  { id: 'docs', icon: '📚', label: 'Docs', href: '/docs' },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  activeTab?: TabType
}

export default function DashboardLayout({ children, activeTab }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [lastSync, setLastSync] = useState<Date>(new Date())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
      if (window.innerWidth > 768) {
        setSidebarOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const NavLink = ({ item }: { item: NavItem }) => (
    <Link
      href={item.href}
      onClick={() => isMobile && setSidebarOpen(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 20px',
        color: currentTab === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontSize: '14px',
        cursor: 'pointer',
        background: currentTab === item.id ? 'var(--bg-card)' : 'transparent',
        borderLeft: currentTab === item.id ? '3px solid var(--accent-blue)' : '3px solid transparent',
        transition: 'all 0.2s',
        textDecoration: 'none',
      }}
    >
      <span style={{ fontSize: '16px' }}>{item.icon}</span>
      {item.label}
    </Link>
  )

  const SectionLabel = ({ label }: { label: string }) => (
    <div style={{
      fontSize: '11px',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      padding: '16px 20px 8px',
      fontWeight: '600',
    }}>
      {label}
    </div>
  )

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--bg-primary)',
      overflow: 'hidden',
    }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="mobile-overlay active"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          width: isMobile ? '280px' : '220px',
          maxWidth: isMobile ? '85vw' : undefined,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          position: isMobile ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Close button on mobile */}
        {isMobile && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontSize: '16px',
              }}
            >
              ✕
            </button>
          </div>
        )}

        <AgentStatus />
        
        {/* Main Navigation */}
        <nav style={{ 
          padding: '16px 0', 
          flex: 1, 
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}>
          <SectionLabel label="Dashboard" />
          {navItems.map(item => <NavLink key={item.id} item={item} />)}

          <SectionLabel label="Agent" />
          {agentNavItems.map(item => <NavLink key={item.id} item={item} />)}

          <SectionLabel label="System" />
          {systemNavItems.map(item => <NavLink key={item.id} item={item} />)}
        </nav>

        {/* Bottom Navigation */}
        <nav style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '16px 0',
        }}>
          <SectionLabel label="Configuration" />
          {bottomNavItems.map(item => <NavLink key={item.id} item={item} />)}
        </nav>

        {/* System Status */}
        <div style={{
          padding: '16px 20px',
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
        minWidth: 0, // Prevent flex overflow
      }}>
        {/* Header */}
        <header className="header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '12px 16px' : '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          gap: '12px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              style={{
                display: isMobile ? 'flex' : 'none',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 12px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                fontSize: '18px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ☰
            </button>

            <span style={{ fontSize: isMobile ? '20px' : '24px' }}>🦊</span>
            <h1 style={{
              fontSize: isMobile ? '16px' : '20px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
            }}>
              {isMobile ? 'Jackal' : 'Jackal Dashboard'}
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

          <div className="header-right" style={{
            display: isMobile ? 'none' : 'flex',
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
        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}>
          {children}
        </div>
      </main>
    </div>
  )
}
