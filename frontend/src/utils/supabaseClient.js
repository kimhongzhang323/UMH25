import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://uxmfzkkoiespapqbiznf.supabase.co/"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4bWZ6a2tvaWVzcGFwcWJpem5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNzg2OTUsImV4cCI6MjA1NjY1NDY5NX0.zLJGT1Han_bawI4FXHqK929NjR5LWs4jjMtwAYzdKfM"

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase