import { createClient, RealtimeChannel } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Types
export interface Document {
  id: string
  slug: string
  title: string
  type: 'journal' | 'concept' | 'note' | 'project'
  content: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  slug: string
  description?: string
  status: 'active' | 'paused' | 'completed' | 'archived'
  color: string
  priority: number
  due_date?: string
  tags: string[]
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  project_id?: string
  title: string
  description?: string
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'archived'
  priority: number
  due_date?: string
  estimated_hours?: number
  actual_hours?: number
  tags: string[]
  metadata: Record<string, unknown>
  completed_at?: string
  created_at: string
  updated_at: string
  project?: Project
}

export interface ApiKey {
  id: string
  user_id: string
  name: string
  service: string
  key_preview: string
  is_active: boolean
  last_used_at?: string
  created_at: string
  updated_at: string
}

export interface Setting {
  id: string
  user_id: string
  key: string
  value: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  action: string
  entity_type: string
  entity_id?: string
  details: Record<string, unknown>
  created_at: string
}

// Realtime subscription helpers
export function subscribeToTable<T>(
  table: string,
  callback: (payload: { eventType: string; new: T | null; old: T | null }) => void
): RealtimeChannel {
  return supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      (payload) => callback({
        eventType: payload.eventType,
        new: payload.new as T | null,
        old: payload.old as T | null,
      })
    )
    .subscribe()
}

export function subscribeToDocuments(
  callback: (payload: { eventType: string; new: Document | null; old: Document | null }) => void
): RealtimeChannel {
  return subscribeToTable<Document>('documents', callback)
}

export function subscribeToTasks(
  callback: (payload: { eventType: string; new: Task | null; old: Task | null }) => void
): RealtimeChannel {
  return subscribeToTable<Task>('tasks', callback)
}

export function subscribeToProjects(
  callback: (payload: { eventType: string; new: Project | null; old: Project | null }) => void
): RealtimeChannel {
  return subscribeToTable<Project>('projects', callback)
}

// Unsubscribe helper
export function unsubscribe(channel: RealtimeChannel) {
  supabase.removeChannel(channel)
}

// Helper functions
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function signInWithEmail(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Default user ID for Jackal (system user)
export const JACKAL_USER_ID = '00000000-0000-0000-0000-000000000001'
