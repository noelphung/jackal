'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, Setting } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

interface SettingsForm {
  theme: 'dark' | 'light' | 'system'
  autoSync: boolean
  syncInterval: number
  notifications: boolean
  compactMode: boolean
  showArchived: boolean
  defaultProjectView: 'kanban' | 'list' | 'timeline'
}

const defaultSettings: SettingsForm = {
  theme: 'dark',
  autoSync: true,
  syncInterval: 60,
  notifications: true,
  compactMode: false,
  showArchived: false,
  defaultProjectView: 'kanban',
}

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const [settings, setSettings] = useState<SettingsForm>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user?.id)

      if (!error && data) {
        const settingsMap: Partial<SettingsForm> = {}
        data.forEach((s: Setting) => {
          settingsMap[s.key as keyof SettingsForm] = s.value as any
        })
        setSettings({ ...defaultSettings, ...settingsMap })
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!user) return
    setSaving(true)
    setMessage('')

    try {
      // Upsert each setting
      for (const [key, value] of Object.entries(settings)) {
        await supabase
          .from('settings')
          .upsert({
            user_id: user.id,
            key,
            value,
          }, {
            onConflict: 'user_id,key'
          })
      }
      setMessage('Settings saved! ✓')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Failed to save settings:', err)
      setMessage('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key: keyof SettingsForm, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="settings">
        <div style={{
          padding: '24px',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}>
            ⚙️ Settings
          </h1>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '14px',
            marginBottom: '32px',
          }}>
            Configure your dashboard preferences
          </p>

          {loading ? (
            <div style={{ color: 'var(--text-muted)' }}>Loading settings...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Account Section */}
              <section style={{
                background: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border-card)',
                padding: '24px',
              }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  👤 Account
                </h2>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                      {user?.email}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      Signed in since {new Date(user?.created_at || '').toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    style={{
                      padding: '8px 16px',
                      fontSize: '13px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      color: '#ef4444',
                      cursor: 'pointer',
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </section>

              {/* Appearance Section */}
              <section style={{
                background: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border-card)',
                padding: '24px',
              }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  🎨 Appearance
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <SettingRow label="Theme">
                    <select
                      value={settings.theme}
                      onChange={(e) => handleChange('theme', e.target.value)}
                      style={selectStyle}
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="system">System</option>
                    </select>
                  </SettingRow>
                  <SettingRow label="Compact Mode">
                    <Toggle
                      checked={settings.compactMode}
                      onChange={(v) => handleChange('compactMode', v)}
                    />
                  </SettingRow>
                  <SettingRow label="Show Archived Items">
                    <Toggle
                      checked={settings.showArchived}
                      onChange={(v) => handleChange('showArchived', v)}
                    />
                  </SettingRow>
                </div>
              </section>

              {/* Sync Section */}
              <section style={{
                background: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border-card)',
                padding: '24px',
              }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  🔄 Sync
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <SettingRow label="Auto Sync">
                    <Toggle
                      checked={settings.autoSync}
                      onChange={(v) => handleChange('autoSync', v)}
                    />
                  </SettingRow>
                  <SettingRow label="Sync Interval (seconds)">
                    <input
                      type="number"
                      value={settings.syncInterval}
                      onChange={(e) => handleChange('syncInterval', parseInt(e.target.value))}
                      min={10}
                      max={300}
                      style={inputStyle}
                    />
                  </SettingRow>
                  <SettingRow label="Notifications">
                    <Toggle
                      checked={settings.notifications}
                      onChange={(v) => handleChange('notifications', v)}
                    />
                  </SettingRow>
                </div>
              </section>

              {/* Projects Section */}
              <section style={{
                background: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border-card)',
                padding: '24px',
              }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  📊 Projects
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <SettingRow label="Default View">
                    <select
                      value={settings.defaultProjectView}
                      onChange={(e) => handleChange('defaultProjectView', e.target.value)}
                      style={selectStyle}
                    >
                      <option value="kanban">Kanban Board</option>
                      <option value="list">List View</option>
                      <option value="timeline">Timeline</option>
                    </select>
                  </SettingRow>
                </div>
              </section>

              {/* Save Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  style={{
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    background: 'var(--accent-blue)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
                {message && (
                  <span style={{
                    color: message.includes('✓') ? 'var(--accent-green)' : '#ef4444',
                    fontSize: '14px',
                  }}>
                    {message}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

// Helper components
function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <label style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        background: checked ? 'var(--accent-blue)' : 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        padding: '2px',
        cursor: 'pointer',
        transition: 'background 0.2s',
        position: 'relative',
      }}
    >
      <div style={{
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: 'white',
        transition: 'transform 0.2s',
        transform: checked ? 'translateX(20px)' : 'translateX(0)',
      }} />
    </button>
  )
}

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '14px',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  minWidth: '150px',
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '14px',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  width: '100px',
  textAlign: 'center',
}
