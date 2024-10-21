import { StyleSheet, View, Text, Image, Button, ScrollView, SafeAreaView,TouchableOpacity, Pressable, Alert} from 'react-native'
import React, { useRef, useState } from 'react'
import { supabase } from '../supabase'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import RichTextEditor from '../Components/TextEditor/RichTextEditor'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AppButton from "../Components/Button/Button";
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {Video} from 'expo-av'
import { createOrUpdatePost } from '../Components/postService';



const CreatePost = ({navigation, session, setSession}) => {

    const user =  session.user;
    console.log("User createpost", session.user.user_metadata.full_name, session.user.id)

    const bodyRef = useRef("")
    const editorRef = useRef(null)
    // const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const [inputText, setInputText] = useState('');

    const onPick = async(isImg)=>{
        
        let mediaConfig = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        };
        if(!isImg){
            mediaConfig={
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true
            }
        }
        let result = await ImagePicker.launchImageLibraryAsync(mediaConfig)


        console.log("File:", result.assets[0])
        if(!result.canceled){
            setFile(result.assets[0])
        }
           
    }

    const onSubmit = async()=>{

        console.log('body', inputText)
        console.log('file', file)

        if (!file) {
          Alert.alert("Post", "Please choose an Image");
          return;
        }

        let data ={
            file, body: inputText, userId: user?.id
        }

        setLoading(true)
        let res = await createOrUpdatePost(data)
        setLoading(false)

        console.log("post result", res)
        if(res){
            Alert.alert("Post uploaded sucessfully")
        }

    }

    const isLocalFile = file=>{
        if(!file){
            return null
        }
        if(typeof file=='object') return true;
        return false
    }

    const getFileType = ()=>{
        if (!file){
            return null
        }
        if(isLocalFile(file)){
            return file.type;
        }

        if(file.includes('postImage')){
            return 'image'
        }

        return 'video'
    }

    const getFileUri = ()=>{
        if(!file){
            return null
        }
        if(isLocalFile(file)){
            return file.uri;
        }

        return null
        // return getSupabaseFileUrl(file)?.uri;
    }

    console.log('file uri:', getFileUri(file))

  return (
    <View>
      <SafeAreaView style={styles.safeArea}>
        {/* <Text>Create Post</Text> */}
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <FontAwesome name="user-circle" size={55} color="#FF9567" />
                <View style={{gap:2}}>
                    <Text style={styles.userName}>
                        {
                            user && user?.user_metadata?.full_name
                        }
                    </Text>
                    <Text style={styles.subHeading}>
                        Public
                    </Text>
                </View>
            </View>
            <View style={styles.editor}>
                <RichTextEditor editorRef={useRef(null)} onChange={setInputText}/>
            </View>

            {
                file && (
                    <View style={styles.file}>
                        {
                            getFileType(file) == 'video' ? (
                                <Video
                                style={{flex:1}}
                                source={{
                                    uri: getFileUri(file)
                                }}
                                useNativeControls
                                resizeMode='cover'
                                isLooping
                                />
                            ):(
                                <Image source={{uri: getFileUri(file)}} resizeMode='cover' style={{flex:1}}/>
                            )
                        }

                        <Pressable style={styles.deleteIcon} onPress={()=>setFile(null)}>
                        <MaterialIcons name="delete" size={25} color="#FF9567" />
                        </Pressable>
                    </View>
                )
            }

            <View style={styles.media}>
                <Text style={styles.mediaText}>Add to your post</Text>
                <View style={styles.mediaIcons}>
                    <TouchableOpacity onPress={()=> onPick(true)}>
                        <FontAwesome6 name="image" size={24} color="#FF9567" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> onPick(false)}>
                        <FontAwesome6 name="video" size={24} color="#FF9567" />
                    </TouchableOpacity>
                </View>
            </View>
                  <View style={styles.buttonContainer}>
                      <AppButton onPress={onSubmit} title={"Post"} />
                  </View>
        </ScrollView>
        
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
    safeArea: {
    //   flex: 1,
    // backgroundColor:'white'
    },
    container: {
      flexGrow: 1,
    //   alignItems: "center",
      padding: 16,
    //   marginBottom:50,
      backgroundColor:'white'
    },
    header:{
        flexDirection:'row',
        alignItems:'center',
        gap:12
    },
    userName:{
        fontSize:20,
        fontWeight:'semibold'
    },
    subHeading:{
        color:'grey',
        fontWeight:'medium',
        fontSize:15
    },
    media:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderWidth:1.5,
        padding:12,
        paddingHorizontal: 18,
        borderRadius: 10,
        borderCurve: 'continuous',
        borderColor:'#FF9567',
        marginTop:20
    },
    mediaText:{
        color:'grey',
    },
    mediaIcons:{
        flexDirection:'row',
        alignItems:'center',
        gap:15
    },
    buttonContainer:{
        alignItems:'center',
        marginTop:20
    },
    file:{
        minHeight:100,
        width: '50%',
        borderRadius:10,
        overflow:'hidden',
        borderCurve:'continuous',
        marginTop:10
    },
    deleteIcon:{
        position:'absolute',
        top:10,
        right:10,
        backgroundColor:'white',
        borderRadius:50
    }
  });

export default CreatePost