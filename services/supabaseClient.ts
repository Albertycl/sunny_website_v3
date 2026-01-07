import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xazqkzuazbzvlpilvioe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhenFrenVhemJ6dmxwaWx2aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NTAwMjEsImV4cCI6MjA4MzMyNjAyMX0._wky5aZUw3ze-dqBGm8qHg2Ho3gR-kjtqrFfFO5DJk0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
