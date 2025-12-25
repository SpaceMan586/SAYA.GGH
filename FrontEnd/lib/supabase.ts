
import { createClient } from '@supabase/supabase-js';

// Ganti nilai ini dengan URL dan Key dari Dashboard Supabase Anda
// Sebaiknya simpan di .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'MASUKKAN_SUPABASE_URL_DISINI';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'MASUKKAN_SUPABASE_ANON_KEY_DISINI';

export const supabase = createClient(supabaseUrl, supabaseKey);
