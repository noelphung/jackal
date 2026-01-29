import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Document = {
  id: string
  slug: string
  title: string
  type: 'journal' | 'concept' | 'note' | 'project'
  content: string
  tags: string[]
  created_at: string
  updated_at: string
}

export async function getDocuments(type?: string) {
  let query = supabase.from('documents').select('*').order('updated_at', { ascending: false })
  
  if (type) {
    query = query.eq('type', type)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data as Document[]
}

export async function getDocumentBySlug(slug: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  return data as Document
}

export async function createDocument(doc: Omit<Document, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('documents')
    .insert(doc)
    .select()
    .single()
  
  if (error) throw error
  return data as Document
}

export async function updateDocument(id: string, updates: Partial<Document>) {
  const { data, error } = await supabase
    .from('documents')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Document
}
