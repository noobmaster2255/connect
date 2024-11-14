// CommentItem.js

import { min } from "moment";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { getTimeAgo } from "../../utils/getTimeDifference";

const CommentItem = ({ profileImage, username, comment , created_at}) => {
  return (
    <View style={styles.commentContainer}>
      <Image source={{ uri: profileImage }} style={styles.profileImage} />
      <View style={styles.commentContent}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.comment}>{comment}</Text>
        <Text style={styles.comment}>{getTimeAgo(created_at)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
  },
  username: {
    fontWeight: "bold",
    marginBottom: 2,
    color: "#333",
  },
  comment: {
    color: "#555",
  },
});

export default CommentItem;
