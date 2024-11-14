import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { supabase } from "../supabase";
import { addLike, removeLike } from "../Components/postService";
import CommentOverlay from "../Components/CommentOverlay/CommentOverlay";


const PostDetail = ({ route }) => {
  const navigation = useNavigation();
  const { post } = route.params;
  const [likesCount, setLikesCount] = useState(""); //count
  const [commentsCount, setCommentCount] = useState(""); //count
  const [userLiked, setIsUserLiked] = useState(false);
  const [isCommentVisible, setIsCommentVisible] = useState(false);


  const handleEditPost = () => {
    navigation.navigate("EditPost", { post });
  };

  const fetchCommentsCount = async (postId) => {
    const { count, error } = await supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("post_id", postId);
    if (error) {
      console.error("Error fetching comments count:", error.message);
      return 0;
    }
    setCommentCount(count);
  };

  const fetchLikesCount = async (postId) => {
    const { count, error } = await supabase
      .from("post_likes")
      .select("id", { count: "exact", head: true })
      .eq("post_id", postId);
    if (error) {
      console.error("Error fetching likes count:", error.message);
      return 0;
    }
    setLikesCount(count);
  };

  const fetchUserLiked = async (postId) => {
    const sessionData = await supabase.auth.getSession();
    const { count } = await supabase
      .from("post_likes")
      .select("id", { count: "exact" })
      .eq("post_id", postId)
      .eq("userId", sessionData.data.session.user.id);
    console.log("Count: ", count);
    if (count > 0) {
      setIsUserLiked(true);
      Icon()
    } else {
      setIsUserLiked(false);
    }
  };
  const Icon = () => {
    if (userLiked) {
      return <Ionicons name="heart" size={20} color={"red"} />;
    } else {
      return <Ionicons name="heart-outline" size={20} color={"black"} />;
    }
  };

  const handleComment = () => {
    setIsCommentVisible((previous) => !previous);
    fetchCommentsCount(post.id);
  }
  useEffect(() => {
    fetchLikesCount(post.id);
    fetchCommentsCount(post.id);
    fetchUserLiked(post.id);
  }, [commentsCount]);
  return (
    <View style={styles.container}>
      <Image source={{ uri: post.image }} style={styles.image} />
      <View style={styles.actionsContainer}>
        <View style={styles.action}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (userLiked) {
                removeLike(post.id);
                setLikesCount((previousCount) => previousCount - 1);
                setIsUserLiked((previous) => !previous)
                Icon();
              } else {
                addLike(post.id);
                setLikesCount((previousCount) => previousCount + 1);
                setIsUserLiked((previous) => !previous)
                Icon();
              }
            }}
          >
            {Icon()}
          </TouchableOpacity>
          <Text>{likesCount}</Text>
        </View>
        <View style={styles.action}>
          <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
            <Ionicons name="chatbubble-outline" size={20} color={"black"} />
          </TouchableOpacity>
          <Text>{commentsCount}</Text>
        </View>
        <View style={styles.action}>
          {/* <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={20} color={"black"} />
          </TouchableOpacity> */}
        </View>
        <View style={styles.action}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEditPost}
          >
            <Ionicons
              name="ellipsis-horizontal-outline"
              size={20}
              color={"black"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.captionContainer}>
        <Text>{post.caption}</Text>
      </ScrollView>
      <CommentOverlay visible={isCommentVisible} onClose={()=>{setIsCommentVisible(false)}} postId={post.id}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: Dimensions.get("window").width,
    resizeMode: "cover",
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  action: {
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionButton: {
    padding: 3,
  },
  captionContainer: {
    maxHeight: 200,
  },
});

export default PostDetail;
