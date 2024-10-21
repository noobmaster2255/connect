import { StyleSheet, View, Text, FlatList } from "react-native";
import AppButton from "../Components/Button/Button";
import { supabase } from "../supabase";
import ProfilePage from "./Profile";
import CommentOverlay from "../Components/CommentOverlay/CommentOverlay";
import { useEffect, useState } from "react";
import { fetchPosts } from '../Components/postService';
import PostCard from "../Components/PostCard/PostCard";
import Ionicons from "react-native-vector-icons/Ionicons";

let limit = 0;
export default function Home({navigation, session, setSession}){

    const [posts, setPosts] = useState([])

    const user =  session.user;
    console.log("User Home", session.user.user_metadata.full_name, session.user.id)

    useEffect(() =>{
        getPosts();
    }, [])

    const getPosts = async()=>{

        limit = limit+10;
        console.log("posts", limit)
        let res = await fetchPosts(limit);
        
        if(res.success){
            setPosts(res.data)
        }

    }


    
    return(
    <View style={styles.container}>
        {/* <Text style={{color: "#ff0000"}}>Welcome</Text> */}

            <FlatList
                data={posts}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listStyle}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <PostCard item={item} currentUser={user} />
                }
            />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listStyle:{
        paddingTop:20,
        paddingHorizontal:10
    }
})