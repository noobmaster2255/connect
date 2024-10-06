import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ayyntwwnialofpjjwogq.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5eW50d3duaWFsb2Zwamp3b2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwMDU0MDMsImV4cCI6MjA0MzU4MTQwM30.TSgo58rSGa5zcuwmt3yrN9qlvdfF26bhJdr4tjhWneQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
