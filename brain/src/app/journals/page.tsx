import Link from 'next/link'
import { getDocumentsByType } from '@/lib/mock-data'

export default function JournalsPage() {
  const journals = getDocumentsByType('journal').sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d0f',
      color: '#fafafa',
      padding: '40px',
    }}>
      <Link href="/" style={{ color: '#3b82f6', fontSize: '14px' }}>← Back to Dashboard</Link>
      <h1 style={{ fontSize: '24px', marginTop: '24px', marginBottom: '24px' }}>📓 Journals</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {journals.map(doc => (
          <Link key={doc.id} href={`/journals/${doc.slug}`} style={{
            background: '#1a1a1f',
            padding: '16px',
            borderRadius: '8px',
            color: '#fafafa',
            textDecoration: 'none',
          }}>
            <div style={{ fontWeight: '500' }}>{doc.title}</div>
            <div style={{ fontSize: '12px', color: '#71717a', marginTop: '4px' }}>
              {doc.tags.map(t => `#${t}`).join(' ')}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
