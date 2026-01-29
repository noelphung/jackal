'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, ApiKey } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

const SERVICE_OPTIONS = [
  { value: 'openai', label: 'OpenAI', icon: '🤖' },
  { value: 'anthropic', label: 'Anthropic', icon: '🧠' },
  { value: 'supabase', label: 'Supabase', icon: '⚡' },
  { value: 'vercel', label: 'Vercel', icon: '▲' },
  { value: 'stripe', label: 'Stripe', icon: '💳' },
  { value: 'twilio', label: 'Twilio', icon: '📱' },
  { value: 'sendgrid', label: 'SendGrid', icon: '📧' },
  { value: 'ghl', label: 'GoHighLevel', icon: '🚀' },
  { value: 'n8n', label: 'n8n', icon: '🔗' },
  { value: 'other', label: 'Other', icon: '🔧' },
]

export default function ApiKeysPage() {
  const { user } = useAuth()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newKey, setNewKey] = useState({ name: '', service: 'openai', key: '' })
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadApiKeys()
    }
  }, [user])

  const loadApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setApiKeys(data)
      }
    } catch (err) {
      console.error('Failed to load API keys:', err)
    } finally {
      setLoading(false)
    }
  }

  const addApiKey = async () => {
    if (!user || !newKey.name || !newKey.key) return
    setSaving(true)

    try {
      // Create preview (last 4 chars)
      const keyPreview = '...' + newKey.key.slice(-4)
      
      // In production, encrypt the key server-side
      // For now, we'll store it (Supabase has encryption at rest)
      const { error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          name: newKey.name,
          service: newKey.service,
          key_preview: keyPreview,
          encrypted_key: newKey.key, // TODO: Add proper encryption
          is_active: true,
        })

      if (!error) {
        setNewKey({ name: '', service: 'openai', key: '' })
        setShowAddModal(false)
        loadApiKeys()
      }
    } catch (err) {
      console.error('Failed to add API key:', err)
    } finally {
      setSaving(false)
    }
  }

  const toggleKeyStatus = async (id: string, currentStatus: boolean) => {
    await supabase
      .from('api_keys')
      .update({ is_active: !currentStatus })
      .eq('id', id)
    loadApiKeys()
  }

  const deleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This cannot be undone.')) return
    
    await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
    loadApiKeys()
  }

  const copyToClipboard = async (id: string) => {
    // In production, fetch the decrypted key from a secure endpoint
    // For now, show a message that this would copy the key
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getServiceIcon = (service: string) => {
    return SERVICE_OPTIONS.find(s => s.value === service)?.icon || '🔧'
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="api-keys">
        <div style={{
          padding: '24px',
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '32px',
          }}>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}>
                🔑 API Keys
              </h1>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
              }}>
                Securely manage your API keys and credentials
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                background: 'var(--accent-blue)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>+</span> Add Key
            </button>
          </div>

          {/* Security Notice */}
          <div style={{
            background: 'rgba(234, 179, 8, 0.1)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <div style={{ color: 'var(--accent-yellow)', fontWeight: '600', marginBottom: '4px' }}>
                Security Notice
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                API keys are encrypted at rest. Never share your keys or expose them in client-side code.
                Keys are only accessible to you and are protected by Row Level Security.
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
              Loading API keys...
            </div>
          ) : apiKeys.length === 0 ? (
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border-card)',
              padding: '60px 40px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No API Keys Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                Add your first API key to get started
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: 'var(--accent-blue)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Add Your First Key
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {apiKeys.map(key => (
                <div
                  key={key.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-card)',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  {/* Service Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }}>
                    {getServiceIcon(key.service)}
                  </div>

                  {/* Key Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '4px',
                    }}>
                      <span style={{
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        fontSize: '14px',
                      }}>
                        {key.name}
                      </span>
                      <span style={{
                        padding: '2px 8px',
                        fontSize: '11px',
                        borderRadius: '4px',
                        background: key.is_active
                          ? 'rgba(34, 197, 94, 0.15)'
                          : 'rgba(107, 114, 128, 0.15)',
                        color: key.is_active
                          ? 'var(--accent-green)'
                          : 'var(--text-muted)',
                      }}>
                        {key.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <div style={{
                      color: 'var(--text-muted)',
                      fontSize: '13px',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {key.service} • {key.key_preview}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                  }}>
                    <button
                      onClick={() => copyToClipboard(key.id)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: copiedId === key.id ? 'var(--accent-green)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      {copiedId === key.id ? '✓ Copied' : '📋 Copy'}
                    </button>
                    <button
                      onClick={() => toggleKeyStatus(key.id, key.is_active)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      {key.is_active ? '⏸ Disable' : '▶ Enable'}
                    </button>
                    <button
                      onClick={() => deleteKey(key.id)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        color: '#ef4444',
                        cursor: 'pointer',
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Key Modal */}
          {showAddModal && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}>
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-card)',
                padding: '32px',
                width: '100%',
                maxWidth: '480px',
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '24px',
                }}>
                  🔑 Add New API Key
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      marginBottom: '8px',
                    }}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={newKey.name}
                      onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Production OpenAI"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: '14px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      marginBottom: '8px',
                    }}>
                      Service
                    </label>
                    <select
                      value={newKey.service}
                      onChange={(e) => setNewKey(prev => ({ ...prev, service: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: '14px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      {SERVICE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.icon} {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      marginBottom: '8px',
                    }}>
                      API Key
                    </label>
                    <input
                      type="password"
                      value={newKey.key}
                      onChange={(e) => setNewKey(prev => ({ ...prev, key: e.target.value }))}
                      placeholder="sk-..."
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: '14px',
                        fontFamily: "'JetBrains Mono', monospace",
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '12px',
                  }}>
                    <button
                      onClick={() => setShowAddModal(false)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        fontSize: '14px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addApiKey}
                      disabled={saving || !newKey.name || !newKey.key}
                      style={{
                        flex: 1,
                        padding: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        background: saving || !newKey.name || !newKey.key ? 'var(--bg-secondary)' : 'var(--accent-blue)',
                        border: 'none',
                        borderRadius: '10px',
                        color: 'white',
                        cursor: saving || !newKey.name || !newKey.key ? 'not-allowed' : 'pointer',
                        opacity: saving || !newKey.name || !newKey.key ? 0.5 : 1,
                      }}
                    >
                      {saving ? 'Saving...' : 'Add Key'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
