import { NextResponse } from 'next/server'
import fs from 'fs'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const STATUS_FILE = '/home/ubuntu/clawd/brain-docs/.jackal-status.json'

function getStatus() {
  try {
    if (fs.existsSync(STATUS_FILE)) {
      const data = fs.readFileSync(STATUS_FILE, 'utf-8')
      const status = JSON.parse(data)
      
      // Check if stale (>2 minutes = idle)
      const updatedAt = new Date(status.updatedAt)
      const ageMs = Date.now() - updatedAt.getTime()
      
      if (ageMs > 2 * 60 * 1000) {
        return {
          state: 'idle',
          currentTask: 'Ready for tasks',
          lastActive: status.lastActive,
          updatedAt: status.updatedAt,
        }
      }
      return status
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
      
      const sendStatus = () => {
        try {
          const status = getStatus()
          const statusStr = JSON.stringify(status)
          
          // Only send if changed
          if (statusStr !== lastStatus) {
            lastStatus = statusStr
            controller.enqueue(encoder.encode(`data: ${statusStr}\n\n`))
          }
        } catch (e) {
          // Ignore errors
        }
      }
      
      // Send initial status
      sendStatus()
      
      // Poll every 2 seconds for changes
      const interval = setInterval(sendStatus, 2000)
      
      // Clean up after 5 minutes (client should reconnect)
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
