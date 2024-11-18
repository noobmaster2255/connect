import {
    StyleSheet,
    View,
    Text,
    Image,
    Button,
    SafeAreaView,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
  } from "react-native";
  import { useState, useCallback } from "react";
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
  
  
  const SearchedUserProfile = ({ navigation, userId }) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [images, setImages] = useState([]);
  
    const fetchProfile = async () => {
      try {
        const { data: userData, error } = await supabase.auth.getUser();
        if (error) throw error;
  
        if (userData) {
          const profileData = await getProfile(userId);
          setProfile(profileData);
          await fetchPostDetails(userId);
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
  
    if (isLoading) {
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
                <Text style={styles.detailLabel}>Following</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailNumber}>0</Text>
                <Text style={styles.detailLabel}>Followers</Text>
              </View>
            </View>
          </View>
  
          <View style={styles.postsSection}>
            <Text style={styles.sectionTitle}>Posts</Text>
          </View>
  
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
            style={styles.imageGrid}
          />
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  };
  
  const windowWidth = Dimensions.get("window").width - 5;
  
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#fff",
    },
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 10,
      width: windowWidth,
    },
    profileHeader: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    profileName: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
    },
    profileUsername: {
      fontSize: 14,
      color: "gray",
      marginBottom: 5,
    },
    profileBio: {
      fontSize: 12,
      color: "gray",
      marginBottom: 10,
      textAlign: "center",
    },
    profileDetails: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "60%",
      marginTop: 25,
    },
    detailItem: {
      alignItems: "center",
    },
    detailNumber: {
      fontSize: 16,
      fontWeight: "bold",
    },
    detailLabel: {
      fontSize: 12,
      color: "gray",
    },
    editbtn: {
      width: "auto",
      borderWidth: 1,
      borderColor: "#ffad73",
      borderRadius: 5,
      padding: 10,
      backgroundColor: "white",
      alignItems: "center",
      marginHorizontal: 10,
      alignSelf: "flex-start",
    },
    btnText: {
      color: "#ffad73",
      fontWeight: "bold",
      fontSize: 16,
    },
    postsSection: {
      width: "auto",
      paddingVertical: 10,
      marginHorizontal: 10,
      alignItems: "center",
    },
    sectionTitle: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
      width: "100%",
    },
    imageGrid: {
      width: "100%",
      padding: 5,
    },
    gridContainer: {
      alignItems: "flex-start",
      justifyContent: "center",
      paddingBottom: 10,
    },
    imageContainer: {
      width: windowWidth / 3,
      height: windowWidth / 3,
      padding: 1,
      backgroundColor: "#eee",
      justifyContent: "center",
      alignItems: "center",
    },
    gridImage: {
      width: "100%",
      height: "100%",
      resizeMode: "contain",
    },
  });
  
  export default SearchedUserProfile;
  