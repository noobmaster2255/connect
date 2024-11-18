import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { supabase } from "../supabase";

export default function FriendRequests({ session, navigation }) {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("friend_requests")
        .select("*")
        .eq("receiver_id", session.user.id);

      if (error) {
        console.log("Error fetching friend requests:", error);
      } else {
        setFriendRequests(data);
      }
    };

    fetchRequests();
  }, [session.user.id]);

  const acceptRequest = async (requestId, senderId) => {
    // Logic to accept the friend request
    try {
      // First, delete the accepted request from the friend_requests table
      await supabase
        .from("friend_requests")
        .delete()
        .eq("id", requestId);

      // Then, insert the new friendship into the friends table
      await supabase
        .from("friends")
        .insert([
          {
            user_id_1: senderId,
            user_id_2: session.user.id, // The receiver of the request
          },
        ]);

      // Remove the accepted request from the local state
      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      console.log("Error accepting friend request:", error);
    }
  };

  const declineRequest = async (requestId) => {
    // Logic to decline the friend request
    try {
      await supabase
        .from("friend_requests")
        .update({ status: "declined" })
        .eq("id", requestId);

      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      console.log("Error declining friend request:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friend Requests</Text>
      <FlatList
        data={friendRequests}
        renderItem={({ item }) => (
          <View style={styles.request}>
            <Text>{item.sender_id}</Text>
            <Button
              title="Accept"
              onPress={() => acceptRequest(item.id, item.sender_id)}
            />
            <Button
              title="Decline"
              onPress={() => declineRequest(item.id)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  request: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    borderRadius: 5,
  },
});