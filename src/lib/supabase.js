
import { createClient } from '@supabase/supabase-js'

//const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3bGV2a3FpaHZwd2huc3l1eGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0NDk4MjgsImV4cCI6MjA0ODAyNTgyOH0.3dB8M-Nv_yWTwujkJYo4qXd--lBzaVtJ_COSAzxz3Mw'
export const supabase = createClient(process.env.NEXT_SUPABASE_URL, process.env.SUPABASE_ANON_KEY)