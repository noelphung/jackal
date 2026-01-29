import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function fetchStatus() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/documents?slug=eq._agent_status&select=content,updated_at`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: 'no-store',
      }
    )
    
    if (res.ok) {
      const data = await res.json()
      if (data?.[0]?.content) {
        const status = JSON.parse(data[0].content)
        const updatedAt = data[0].updated_at
        const ageMs = Date.now() - new Date(updatedAt).getTime()
        const isStale = ageMs > 3 * 60 * 1000
        
        return {
          state: isStale ? 'idle' : status.state,
          currentTask: isStale ? 'Ready for tasks' : status.currentTask,
          lastActive: updatedAt,
          updatedAt,
        }
      }
    }
  } catch (e) {}
  
  return {
    state: 'idle',
    currentTask: 'Ready for tasks',
    lastActive: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export async function GET() {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      let lastJson = ''
      
      const send = async () => {
        const status = await fetchStatus()
        const json = JSON.stringify(status)
        if (json !== lastJson) {
          lastJson = json
          controller.enqueue(encoder.encode(`data: ${json}\n\n`))
        }
      }
      
      await send()
      const interval = setInterval(send, 2000)
      
      setTimeout(() => {
        clearInterval(interval)
        controller.close()
      }, 5 * 60 * 1000)
    },
  })
  
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Connection': 'keep-alive',
    },
  })
}
