import { createClient } from '@supabase/supabase-js'

// DB = tNPnWxdIfnvMI3jC

const SUPABASE_URL = 'https://vlpzvdfbaramorblbgzg.supabase.co'
const SUPABASE_API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZscHp2ZGZiYXJhbW9yYmxiZ3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwMzIzMTYsImV4cCI6MjA0NzYwODMxNn0.1GrLXhGDWEegEphvYNVDImawwgMewHCLNHPvBT_o1kA'

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY)
export default supabase
