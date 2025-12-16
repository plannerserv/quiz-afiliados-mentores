import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export type UserProfile = {
  id?: string
  name: string
  whatsapp: string
  instagram: string
  user_type: 'creator' | 'user'
  is_founder: boolean
  created_at?: string
}
