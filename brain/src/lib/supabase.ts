import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
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
