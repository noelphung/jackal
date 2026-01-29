import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/documents?slug=eq._agent_status&select=content,updated_at`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: 'no-store',
        next: { revalidate: 0 },
      }
    )
    
    if (!res.ok) {
      throw new Error(`Supabase error: ${res.status}`)
    }
    
    const data = await res.json()
    
    if (data && data.length > 0 && data[0].content) {
      const statusContent = JSON.parse(data[0].content)
      const updatedAt = data[0].updated_at
      
      // Check staleness (3 min)
      const ageMs = Date.now() - new Date(updatedAt).getTime()
      const isStale = ageMs > 3 * 60 * 1000
      
      return NextResponse.json({
        state: isStale ? 'idle' : (statusContent.state || 'idle'),
        currentTask: isStale ? 'Ready for tasks' : (statusContent.currentTask || 'Ready for tasks'),
        lastActive: updatedAt,
        updatedAt: updatedAt,
      })
    }
  } catch (error) {
    console.error('Status fetch error:', error)
  }
  
  return NextResponse.json({
    state: 'idle',
    currentTask: 'Ready for tasks',
    lastActive: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}
