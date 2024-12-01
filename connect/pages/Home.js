import React,{ StyleSheet, View, Text, FlatList } from "react-native";
import AppButton from "../Components/Button/Button";
import { supabase } from "../supabase";
import ProfilePage from "./Profile";
import CommentOverlay from "../Components/CommentOverlay/CommentOverlay";
import { useEffect, useState } from "react";
import { fetchPosts, fetchPostsWithRealtimeUpdates } from '../Components/postService';
import PostCard from "../Components/PostCard/PostCard";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";

let limit = 10;
export default function Home({navigation, session, setSession}){
  const [posts, setPosts] = useState([]);
  const [channel, setChannel] = useState(null);

  const user =  session.user;
  console.log("User Home", session.user.user_metadata.full_name, session.user.id)

  useEffect(() =>{
    getPosts();
  }, [])

  // useFocusEffect(
  //     React.useCallback(() => {
  //         getPosts();
  //     }, [])
  // );

  const getPosts = async()=>{
    console.log("posts", limit)
    const {channel} = await fetchPostsWithRealtimeUpdates(10, setPosts);
    setChannel(channel)
  }

  return(
    <View style={styles.container}>
      {/* <Text style={{color: "#ff0000"}}>Welcome</Text> */}

      <FlatList
        data={posts}
        onEndReached={() => {limit += 10; getPosts();}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <PostCard item={item} currentUser={user} posts={posts} setPosts={setPosts}/> }
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
  icon: {
    marginRight: 10,
},
  listStyle:{
    paddingTop:20,
    paddingHorizontal:10
  }
})