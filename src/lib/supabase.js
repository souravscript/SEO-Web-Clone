
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://iwlevkqihvpwhnsyuxel.supabase.co'

const supabaseKey=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
console.log(supabaseKey)
export const supabase = createClient(supabaseUrl, supabaseKey)
