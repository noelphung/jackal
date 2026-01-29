'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Whitelist check - only allow specific emails
    const allowedEmails = ['contact@synlixa.com', 'hung.d.phung1@gmail.com', 'noel@synlixa.com']
    if (!allowedEmails.includes(email.toLowerCase())) {
      setError('Access denied. This dashboard is private.')
      setLoading(false)
      return
    }

    const { error } = await signIn(email)

    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for the magic link! 🦊')
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-card)',
        padding: '40px',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{
          fontSize: '64px',
          marginBottom: '16px',
        }}>
          🦊
        </div>
        
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}>
          Jackal Dashboard
        </h1>
        
        <p style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          marginBottom: '32px',
        }}>
          Sign in with your email to continue
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="noel@synlixa.com"
            required
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '14px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              marginBottom: '16px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-blue)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '14px',
              fontWeight: '600',
              background: loading ? 'var(--bg-secondary)' : 'var(--accent-blue)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: 'rgba(34, 197, 94, 0.15)',
            borderRadius: '8px',
            color: 'var(--accent-green)',
            fontSize: '14px',
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            borderRadius: '8px',
            color: '#ef4444',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <p style={{
          marginTop: '32px',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          🔒 Private dashboard. Authorized users only.
        </p>
      </div>
    </div>
  )
}
