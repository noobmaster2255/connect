import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppTextInput from "../TextInput/TextInput";
import SendButton from "../IconButton/IconButton";
import { supabase } from "../../supabase";
import CommentItem from "../CommentRow/CommentRow";
import { addComment } from "../postService";
import Toast from "react-native-toast-message";

const CommentOverlay = ({ visible, onClose, postId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // Add a comment
  const handleAddComment = async () => {
    if (comment !== "") {
       await addComment(postId, comment);
    } else {
      Toast.show({
        type: "error",
        text1: "Comment can't be empty!",
      });
    }
  };

  // Fetch existing comments
  const fetchComments = async (postId) => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId);
    if (error) {
      console.log("Can't retrieve comments", error);
      return;
    }
    setComments(data);
  };

  // Listen for new comments in real-time
  useEffect(() => {
    let subscription;

    if (visible) {
      fetchComments(postId); // Fetch existing comments when the modal is visible

      // Set up a real-time subscription for new comments
      subscription = supabase
        .channel("comments-channel")
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
          (payload) => {
            setComments((prevComments) => [...prevComments, payload.new]);
          }
        )
        .subscribe();
    }

    // Clean up the subscription when the modal closes
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [visible, postId]);

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color="#333" />
          </TouchableOpacity>
          <FlatList
            data={comments}
            renderItem={({ item }) => (
              <CommentItem
                username={item.username}
                comment={item.comment_content}
                created_at={item.created_at}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={styles.row}>
            <AppTextInput
              placeholder={"Write a comment..."}
              inputMode={"text"}
              keyboardType={"default"}
              autoComplete={"off"}
              textContentType={"none"}
              secureTextEntry={false}
              value={comment} // Bind the comment state
              onChangeText={(text) => setComment(text)} // Update the comment state
              autoCapitalize="sentences" // Capitalize the first letter of sentences
            />
            <SendButton onPress={handleAddComment} iconName={"send"} />
          </View>
        </View>
      </View>
      <Toast />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "60%", // Adjust height as necessary
  },
  closeButton: {
    padding: 25,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  row: {
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    height: 80,
    backgroundColor: "#f8f8f8",
    paddingBottom: 50,
  },
});

export default CommentOverlay;
