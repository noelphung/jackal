import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function getStatus() {
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
        const updatedAt = new Date(data[0].updated_at)
        const ageMs = Date.now() - updatedAt.getTime()
        
        // If status is older than 3 minutes, return idle
        if (ageMs > 3 * 60 * 1000) {
          return {
            state: 'idle',
            currentTask: 'Ready for tasks',
            lastActive: data[0].updated_at,
            updatedAt: data[0].updated_at,
          }
        }
        
        return {
          state: status.state || 'idle',
          currentTask: status.currentTask || 'Ready for tasks',
          lastActive: data[0].updated_at,
          updatedAt: data[0].updated_at,
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
      let lastStatus = ''
      
      const sendStatus = async () => {
        try {
          const status = await getStatus()
          const statusStr = JSON.stringify(status)
          
          if (statusStr !== lastStatus) {
            lastStatus = statusStr
            controller.enqueue(encoder.encode(`data: ${statusStr}\n\n`))
          }
        } catch (e) {}
      }
      
      await sendStatus()
      const interval = setInterval(sendStatus, 3000)
      
      setTimeout(() => {
        clearInterval(interval)
        controller.close()
      }, 5 * 60 * 1000)
    },
  })
  
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
