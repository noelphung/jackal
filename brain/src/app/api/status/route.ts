import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type AgentState = 'online' | 'working' | 'thinking' | 'idle' | 'sleeping'

interface StatusData {
  state: AgentState
  currentTask: string
  lastActive: string
  updatedAt: string
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function getStatusFromSupabase(): Promise<StatusData> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/documents?slug=eq._agent_status&select=content,updated_at`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        cache: 'no-store',
      }
    )
    
    if (res.ok) {
      const data = await res.json()
      if (data && data[0]) {
        const status = JSON.parse(data[0].content)
        return {
          state: status.state || 'idle',
          currentTask: status.currentTask || 'Ready for tasks',
          lastActive: data[0].updated_at,
          updatedAt: data[0].updated_at,
        }
      }
    }
  } catch (e) {
    console.error('Supabase fetch error:', e)
  }
  
  // Default fallback
  const hour = new Date().getUTCHours()
  const isNighttime = hour >= 4 && hour < 11 // EST night
  
  return {
    state: isNighttime ? 'sleeping' : 'idle',
    currentTask: isNighttime ? 'Sleeping' : 'Ready for tasks',
    lastActive: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export async function GET() {
  const status = await getStatusFromSupabase()
  return NextResponse.json(status)
}
