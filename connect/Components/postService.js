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

export const getSupabaseFileUrl = filePath =>{
    if(filePath){
        return {uri: `https://ayyntwwnialofpjjwogq.supabase.co/storage/v1/object/public/uploads/${filePath}`}
        
    }
    return null
}

export const fetchPosts = async (limit = 10) => {
    try {
      
        const {data, error} = await supabase
        .from('posts')
        .select(`*, user: profiles (id, user_id, username, full_name)`)
        .order('created_At', {ascending:false})
        .limit(limit);

        if(error){
            console.error("Error fetching post files:", error);
            return {success:false, msg:"Could fetch the post  "}
        }

        return {success:true, data:data};
        
    } catch (error) {
      console.error("Error fetching post files:", error);
      return {success:false, msg:"Could fetch the post  "}
    }
};