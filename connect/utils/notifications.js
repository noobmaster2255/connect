import { supabase } from "../supabase";
import * as Notifications from "expo-notifications"

export const subscribeToPost = () => {  
const channels = supabase.channel('custom-insert-channel')
.on(
  'postgres_changes',
  { event: 'INSERT', schema: 'public', table: 'posts' },
  (payload) => {
    console.log('New post added', payload.new)
    triggerLocalNotification(payload.new)
  }
)
.subscribe()

return channels;
}
export const subscribeLike = () => {
  const channel = supabase.channel("like-channel").on('postgres_changes', {event: "INSERT", schema: 'public', table: 'post_likes'}, (payload) => {
    triggerLocalLikeNotification(payload.new);
  }).subscribe();

  return channel;
}

const triggerLocalLikeNotification = async (payload) => {
  console.log("LIKE PAYLOAD",payload);
  const {data, error} = await supabase.from('posts').select("*").eq("id", payload.post_id);
  const {data:userData} = await supabase.auth.getSession();
  const {data:likedUser, error:likedUserError} = await supabase.from("profiles").select("*").eq("user_id", payload.userId);
  console.log("LIKED USER ", likedUser)
  if(userData.session.user.id === data[0].userId){
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${likedUser[0].full_name} liked your post!`,
        body: "Check it out!"
      },
      trigger: null
    })
  }
}

export const subscribeComment = () => {
  
  const channel = supabase.channel("comment-channel").on(
    'postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'comments'},
      (payload) => {
        console.log("commented")
        console.log("NEW PAYLOAD",payload.new)
        triggerLocalCommentNotification(payload.new);
      }
  ).subscribe()

  return channel;
}

const triggerLocalCommentNotification = async (payload) => {
  const {data,error} = await supabase.from('posts').select("*").eq("id", payload.post_id); 
  const {data:userData} = await supabase.auth.getSession();
  console.log("POST DARA ", data);
  console.log("LOGGED IN USER DATA" ,userData)
  if(userData.session.user.id === data[0].userId){
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${payload.username} Commented in your post`,
        body: `Check it out!`
      },
      trigger: null,
    })
  }
}

const triggerLocalNotification = async (post) => {
  const {data, error} = await supabase.from('profiles').select("full_name").eq("user_id", post.userId).single()
  console.log(data, "USER")
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${data.full_name} created a post! Check it out`,
      body: `A new post titled "${post.body}" was added.`,
    },
    trigger: null, // Trigger immediately
  });
};