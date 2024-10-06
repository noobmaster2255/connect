import { createClient } from '@supabase/supabase-js'
import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://ayyntwwnialofpjjwogq.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5eW50d3duaWFsb2Zwamp3b2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwMDU0MDMsImV4cCI6MjA0MzU4MTQwM30.TSgo58rSGa5zcuwmt3yrN9qlvdfF26bhJdr4tjhWneQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })