// CommentOverlay.js

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
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons
import AppTextInput from "../TextInput/TextInput"; // Make sure this is the right import for your text input
import SendButton from "../IconButton/IconButton";
import { supabase } from "../../supabase";
import CommentItem from "../CommentRow/CommentRow";

const CommentOverlay = ({ visible, onClose, postId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]); // Replace with fetched comments
  const handleAddComment = async () => {
    console.log( await supabase.from('comments').select('*', 'posts(username)'))
    const {data, error} = await supabase.from('comments').select('*'); //returns an array of objects
    if(error){
        console.log("Can't retrieve comments", error);
        return
    }
    setComments(data.map(obj => [obj.id, obj.username, obj.comment_content, obj.userId, obj.created_at, obj.post_id]));
  };
  const fetchComments = async () => {
    const {data, error} = await supabase.from('comments').select('*'); //returns an array of objects
    if(error){
        console.log("Can't retrieve comments", error);
        return
    }
    setComments(data.map(obj => [obj.id, obj.username, obj.comment_content, obj.userId, obj.created_at, obj.post_id]));
  }
  
    useEffect(() => {
       if(visible){
       fetchComments()
       }
    },[visible]);
  
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
                <CommentItem username={item[1]} comment={item[2]} created_at={item[4]}/>
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
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: "row",
    height: 80,
    backgroundColor: '#f8f8f8',
    paddingBottom: 50,
  },
});

export default CommentOverlay;