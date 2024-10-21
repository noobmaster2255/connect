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
    const { data, error } = await supabase.from('comments').insert([{'userId': sessionData.data.session.user.id, 'comment_content': comment, 'username': userName.username, 'post_id': postId}])
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