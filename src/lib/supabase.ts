import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://guhheodzljhlqrbesswf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1aGhlb2R6bGpobHFyYmVzc3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjgzMzEsImV4cCI6MjA3NjA0NDMzMX0.gsgBpGhF6wNdmiOOd8B7H_74WoZIzLBCsluROMq1TAw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase