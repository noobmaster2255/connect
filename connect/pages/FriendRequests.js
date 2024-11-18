import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { supabase } from "../supabase";

export default function FriendRequests({ session, navigation }) {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Fetch friend requests with sender details
        const { data, error } = await supabase
          .from("friend_requests")
          .select("id, sender_id, profiles!friend_requests_sender_id_fkey(full_name)")
          .eq("receiver_id", session.user.id);

        if (error) {
          console.log("Error fetching friend requests:", error);
        } else {
          setFriendRequests(data);
        }
      } catch (err) {
        console.log("Error:", err.message);
      }
    };

    fetchRequests();
  }, [session.user.id]);

  const acceptRequest = async (requestId, senderId) => {
    // Logic to accept the friend request
    try {
      await supabase
        .from("friend_requests")
        .delete()
        .eq("id", requestId);

      await supabase
        .from("friends")
        .insert([
          {
            user_id_1: senderId,
            user_id_2: session.user.id,
          },
        ]);

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
        .delete()
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
            <Text style={styles.requestText}>
              {`${item.profiles.full_name} has sent you a friend request.`}
            </Text>
            <Button
              title="Accept"
              onPress={() => acceptRequest(item.id, item.sender_id)}
              backgroundColor={styles.acceptButton.backgroundColor}
              style={styles.button}
            />
            <Button
              title="Decline"
              onPress={() => declineRequest(item.id)}
              color={styles.declineButton.backgroundColor}
              style={styles.button}
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
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  request: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    width: "100%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  requestText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  button: {
    marginVertical: 5,
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  declineButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});