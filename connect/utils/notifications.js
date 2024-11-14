import { supabase } from "../supabase";

const subscribeToPost = () => {  
const channels = supabase.channel('custom-insert-channel')
.on(
  'postgres_changes',
  { event: 'INSERT', schema: 'public', table: 'posts' },
  (payload) => {
    console.log('New post added', payload.new)
  }
)
.subscribe()
}