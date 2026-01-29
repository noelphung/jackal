import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type AgentState = 'online' | 'working' | 'thinking' | 'idle' | 'sleeping'

interface StatusData {
  state: AgentState
  currentTask: string
  lastActive: string
  updatedAt: string
}

const STATUS_FILE = '/home/ubuntu/clawd/brain-docs/.jackal-status.json'

function getDefaultStatus(): StatusData {
  const hour = new Date().getUTCHours()
  // Noel is EST (UTC-5), so 11pm-6am EST = 4am-11am UTC
  const isNighttime = hour >= 4 && hour < 11
  
  return {
    state: isNighttime ? 'sleeping' : 'idle',
    currentTask: isNighttime ? 'Sleeping (quiet hours)' : 'Ready for tasks',
    lastActive: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export async function GET() {
  try {
    // Try to read status file
    if (fs.existsSync(STATUS_FILE)) {
      const data = fs.readFileSync(STATUS_FILE, 'utf-8')
      const status: StatusData = JSON.parse(data)
      
      // Check if status is stale (>5 minutes old)
      const updatedAt = new Date(status.updatedAt)
      const now = new Date()
      const ageMs = now.getTime() - updatedAt.getTime()
      
      if (ageMs > 5 * 60 * 1000) {
        // Status is stale, return idle
        return NextResponse.json({
          ...getDefaultStatus(),
          state: 'idle',
          currentTask: 'Ready for tasks',
        })
      }
      
      return NextResponse.json(status)
    }
    
    return NextResponse.json(getDefaultStatus())
  } catch (error) {
    return NextResponse.json(getDefaultStatus())
  }
}

// POST to update status (called by Clawdbot)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { state, currentTask } = body
    
    const status: StatusData = {
      state: state || 'working',
      currentTask: currentTask || 'Processing...',
      lastActive: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    // Ensure directory exists
    const dir = path.dirname(STATUS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2))
    
    return NextResponse.json({ success: true, status })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
