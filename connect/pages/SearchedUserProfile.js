import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../supabase";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";

const getProfile = async (userId) => {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId);

    if (error) {
      console.log("Error fetching profile:", error);
      throw error;
    }
    return data[0];
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return null;
  }
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
  return count;
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
  return count;
};

const checkFriendRequestStatus = async (currentUserId, searchedUserId) => {
  try {
    const { data, error } = await supabase
      .from("friend_requests")
      .select("*")
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .or(`sender_id.eq.${searchedUserId},receiver_id.eq.${searchedUserId}`);

    if (error) {
      console.error("Error checking friend request status:", error.message);
      return null;
    }

    // Check if there's an active friend request between the two users
    const request = data.find(
      (req) =>
        (req.sender_id === currentUserId && req.receiver_id === searchedUserId) ||
        (req.sender_id === searchedUserId && req.receiver_id === currentUserId)
    );

    if (request) {
      return request.sender_id === currentUserId ? "Sent" : "Received"; // "Sent" or "Received" based on who sent the request
    }

    return null; // No active request
  } catch (error) {
    console.error("Error checking friend request status:", error.message);
    return null;
  }
};

const SearchedUserProfile = ({ navigation, userId }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [images, setImages] = useState([]);
  const [isFriend, setIsFriend] = useState(false); // State to track friend status
  const [loadingFriendStatus, setLoadingFriendStatus] = useState(true); // State to handle loading state for friend status
  const [buttonText, setButtonText] = useState("Send Friend Request");

  const fetchProfile = async () => {
    try {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (userData) {
        const profileData = await getProfile(userId);
        setProfile(profileData);
        await fetchPostDetails(userId);
        await fetchFriendStatus(userData.user.id); // Fetch the friend status after profile
      }
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPostDetails = async (userId) => {
    try {
      const { data, error } = await supabase.from("posts").select("*").eq("userId", userId);
      if (error) {
        throw new Error(error.message);
      }

      const postsData = await Promise.all(
        data.map(async (post) => {
          const file = post.file
            ? supabase.storage.from("uploads").getPublicUrl(post.file).data.publicUrl
            : null;
          const likesCount = await fetchLikesCount(post.id);
          const commentsCount = await fetchCommentsCount(post.id);

          return {
            id: post.id,
            image: file,
            caption: post.body,
            likes: likesCount,
            comments: commentsCount,
          };
        })
      );

      const imageUrls = await Promise.all(
        data.map(async (post) => {
          const file = post.file
            ? supabase.storage.from("uploads").getPublicUrl(post.file).data.publicUrl
            : null;
          return { id: post.id, imageUrl: file };
        })
      );

      setPosts(postsData);
      setImages(imageUrls);
    } catch (error) {
      console.error("Error fetching post files:", error);
    }
  };

  const fetchFriendStatus = async (currentUserId) => {
    try {
      // Check if they are already friends
      const status = await checkFriendRequestStatus(currentUserId, userId);
      setIsFriend(status);
      setButtonText(status ? "Unfriend" : "Send Friend Request");
  
      // Check if there's an active friend request
      const requestStatus = await checkFriendRequestStatus(currentUserId, userId);
  
      if (requestStatus) {
        if (requestStatus === "Sent") {
          setButtonText("Cancel Friend Request");
        } else if (requestStatus === "Received") {
          setButtonText("Accept Friend Request");
        }
      }
  
      setLoadingFriendStatus(false); // Finished loading friend status
    } catch (error) {
      console.error("Error fetching friend status:", error.message);
    }
  };

  const handleFriendRequest = async () => {
    try {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) throw error;
  
      const requestStatus = await checkFriendRequestStatus(userData.user.id, userId);
  
      if (isFriend) {
        // Unfriend action (remove from friends)
        const { error } = await supabase
          .from("friends")
          .delete()
          .or(`user_id_1.eq.${userData.user.id},user_id_2.eq.${userData.user.id}`)
          .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);
  
        if (error) {
          console.error("Error unfriending:", error.message);
          return;
        }
        setIsFriend(false);
        setButtonText("Send Friend Request");
      } else if (requestStatus === "Sent") {
        // Cancel friend request action
        const { error } = await supabase
          .from("friend_requests")
          .delete()
          .or(`sender_id.eq.${userData.user.id},receiver_id.eq.${userId}`);
  
        if (error) {
          console.error("Error canceling friend request:", error.message);
          return;
        }
        setButtonText("Send Friend Request");
      } else if (requestStatus === "Received") {
        // Accept friend request action
        const { error } = await supabase
          .from("friends")
          .insert([{ user_id_1: userData.user.id, user_id_2: userId }]);
  
        if (error) {
          console.error("Error accepting friend request:", error.message);
          return;
        }
  
        // Remove the request after accepting
        await supabase
          .from("friend_requests")
          .delete()
          .or(`sender_id.eq.${userId},receiver_id.eq.${userData.user.id}`);
  
        setButtonText("Unfriend");
      } else {
        // Send friend request action
        const { error } = await supabase
          .from("friend_requests")
          .insert([{ sender_id: userData.user.id, receiver_id: userId }]);
  
        if (error) {
          console.error("Error sending friend request:", error.message);
          return;
        }
        setButtonText("Cancel Friend Request");
      }
    } catch (error) {
      console.error("Error handling friend request:", error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchProfile();
    }, [])
  );

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => navigation.navigate("PostDetail", { post: item })}
      >
        <Image source={{ uri: item.image }} style={styles.gridImage} resizeMode="cover" />
      </TouchableOpacity>
    );
  };

  if (isLoading || loadingFriendStatus) {
    return (
      <SafeAreaView>
        <ActivityIndicator size={"large"} color={"#0000ff"} />
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <View>
              <Image
                source={
                  profile?.profile_image_url
                    ? { uri: profile.profile_image_url }
                    : require("../assets/images/profileimg.jpeg")
                }
                style={styles.profileImage}
              />
            </View>

            <Text style={styles.profileName}>{profile.full_name || "John Doe"}</Text>
            <Text style={styles.profileUsername}>
              @{profile.username || "Please set a username."}
            </Text>
            <Text style={styles.profileBio}>{profile.bio || ""}</Text>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailNumber}>{profile.post_count || 0}</Text>
              <Text style={styles.detailLabel}>Posts</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailNumber}>{profile.connection_count || 180}</Text>
              <Text style={styles.detailLabel}>Friends</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("EditProfile")} style={styles.editbtn}>
          <Text style={styles.btnText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Friend Request Button */}
        <TouchableOpacity onPress={handleFriendRequest} style={styles.editbtn}>
          <Text style={styles.btnText}>{buttonText}</Text>
        </TouchableOpacity>

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Posts</Text>
        </View>

        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 5,
  },
  profileUsername: {
    fontSize: 16,
    color: "gray",
  },
  profileBio: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  profileDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  detailItem: {
    alignItems: "center",
  },
  detailNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detailLabel: {
    color: "gray",
  },
  editbtn: {
    backgroundColor: "#2D9CDB",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  postsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    width: (Dimensions.get("window").width - 40) / 3,
    marginBottom: 10,
  },
  gridImage: {
    width: "100%",
    height: 100,
    borderRadius: 5,
  },
});

export default SearchedUserProfile;
