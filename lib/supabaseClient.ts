// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Memastikan variabel lingkungan ada
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Membuat dan mengekspor Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
