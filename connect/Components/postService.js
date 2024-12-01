import { decode } from "base64-arraybuffer"
import { supabase } from "../supabase"
import * as FileSystem  from 'expo-file-system'

export const createOrUpdatePost = async(post)=>{
    try {

        post.created_At = new Date().toISOString();
        
        if(post.file && typeof post.file == 'object'){
            let isImg = post?.file?.type == 'image'
            let folderName = isImg? 'postImages':'postVideos'
            let fileResult = await uploadFile(folderName, post?.file?.uri, isImg)
            if(fileResult.success) post.file =fileResult.data
            else{
                return fileResult;
            }
        }

        const {data, error} = await supabase
        .from('posts')
        .upsert(post)
        .select()
        .single();

        if(error){
            console.log("create post", error)
            return {success:false, msg:"Could not create your post"}
        }

        return {success: true, data: data}
    } catch (error) {
        console.log("create post error",error)
        return {success:false, msg:"Could not create your post 2"}
    }
}

export const uploadFile = async(folderName, fileUri, isImg=true)=>{
    try {

        let fileName =  getFilePath(folderName, isImg)

        const fileBase64 =  await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64
        })
        let imageData = decode(fileBase64)

        let {data, error} = await supabase
        .storage.from('uploads')
        .upload(fileName, imageData, {
            cacheControl: '3600',
            upsert: false,
            contentType: isImg? 'image/*': 'video/*'
        });

        if(error){
            console.log("file upload error", error)
            return {sucess:false,msg:"could not upload media"}
        }
        console.log("data", data)
        return {success:true, data:data.path}
        
    } catch (error) {
        console.log("file upload error", error)
        return {sucess:false,msg:"could not upload media"}
    }
}

export const getFilePath = (folderName, isImg)=>{
    return `/${folderName}/${(new Date()).getTime()}${isImg? '.png':'.mp4'}`
}


export const addLike = async (postId) => {
    const sessionData = await supabase.auth.getSession();
    console.log("This is session data",sessionData.data.session.user.id)
    const { data, error } = await supabase.from('post_likes').insert([{'post_id': postId, 'userId': sessionData.data.session.user.id}])
        console.log("Error",error)
        console.log("Data", data)
}

export const removeLike = async (postId) => {
    const sessionData = await supabase.auth.getSession();
    const {data, error} = await supabase.from('post_likes').delete().eq('post_id', postId).eq('userId', sessionData.data.session.user.id);
        console.log("Data", data)
        console.log("Error",  error);
}
const getUserName = async (user_id)=>{
    const {data,error} = await supabase.from('profiles').select('*').eq('user_id',user_id).single();
    if(!error){
        let obj = {
            username: (data.username) ? data.username : data.full_name
        }
        return obj;
    }
    else {
        console.log(error)
    } 
}

export const addComment = async (postId, comment) => {
    const sessionData = await supabase.auth.getSession();
    let userName = await getUserName(sessionData.data.session.user.id);
    console.log(userName);
    const { data, error } = await supabase.from('comments').insert([{'userId': sessionData.data.session.user.id, 'comment_content': comment, 'username': userName.username, 'post_id': postId}]);
    if(error){
        console.log(error)
    }
}
// export const isUserLiked = async (postId) => {
//     const sessionData = await supabase.auth.getSession();
//     const { count } = await supabase.from('post_likes').select('id', {count: 'exact'}).eq('post_id', postId).eq('userId', sessionData.data.session.user.id);
//     console.log("Count: ", count)
//     if(count > 0){
//         return true
//     } else {
//         return false
//     }
// }

export const getSupabaseFileUrl = filePath =>{
    if(filePath){
        return {uri: `https://ayyntwwnialofpjjwogq.supabase.co/storage/v1/object/public/uploads/${filePath}`}
        
    }
    return null
}




// Main function to fetch posts and handle real-time updates
export const fetchPostsWithRealtimeUpdates = async (limit = 10, setPosts) => {
    try {
      // Initial fetch of posts with user data
      const { data, error } = await supabase
        .from("posts")
        .select(`*, user:profiles (id, user_id, username, full_name)`)
        .order("created_At", { ascending: false })
        .limit(limit)
        .neq("is_hidden", true);
  
      if (error) {
        console.error("Error fetching posts:", error);
        return { success: false, msg: "Could not fetch posts" };
      }
  
      // Set initial posts
      setPosts(data);
  
      // Subscribe to real-time updates
      const channel = supabase
        .channel("posts-channel")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, async (payload) => {
          const newPost = payload.new;
          console.log("NEW POST" ,newPost)
          // Fetch user profile if it's not present in the payload
          if (!newPost.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("username, full_name")
              .eq("user_id", newPost.userId)
              .single();
  
            if (profile) {
              newPost.user = profile; // Attach the profile data to the post
            }
          }
  
          // Update posts state with the new post
          setPosts((prevPosts) => [newPost, ...prevPosts]);
        })
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "posts" }, (payload) => {
          const updatedPost = payload.new;
          setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === updatedPost.id ? { ...post, ...updatedPost } : post))
          );
        })
        .on("postgres_changes", { event: "DELETE", schema: "public", table: "posts" }, (payload) => {
          const deletedPostId = payload.old.id;
          setPosts((prevPosts) => prevPosts.filter((post) => post.id !== deletedPostId));
        })
        .subscribe();
  
      return { success: true, data, channel };
    } catch (error) {
      console.error("Error in fetchPostsWithRealtimeUpdates:", error);
      return { success: false, msg: "Could not fetch posts" };
    }
  };