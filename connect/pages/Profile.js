import {
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../supabase";
import ImageGrid from "../Components/ImageGrid/ImageGrid";
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

const ProfilePage = ({ navigation, session, setSession }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);

  const fetchProfile = async () => {
    try {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (userData) {
        const profileData = await getProfile(userData.user.id);
        setProfile(profileData);
        await fetchPostFiles(userData.user.id);
      }
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPostFiles = async (userId) => {
    try {
      const { data, error } = await supabase.from("posts").select("file").eq("userId", userId);
      if (error) {
        throw new Error(error.message);
      }

      if (data && data.length > 0) {
        const postFiles = data
          .map((post) => {
            const file = post.file;

            if (file) {
              const { data, error } = supabase.storage.from("uploads").getPublicUrl(file);

              if (error) {
                console.error("Error fetching public URL:", error.message);
                return null;
              }
              console.log("Fetched public URL:", data.publicUrl);
              return data.publicUrl;
            }
            return null;
          })
          .filter((file) => file);

        console.log("Fetched image URLs:", postFiles);
        setImages(postFiles);
      }
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
    console.log("Rendering item:", item); // Log the current item

    return (
      <View style={styles.imageContainer}>
        {item && item.trim() ? ( // Check if item exists and is not an empty string
          <Image
            source={{ uri: item }} // Assuming item is a valid URL
            style={styles.gridImage}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require("../assets/images/Konnect_vector.png")} // Fallback image
            style={styles.gridImage}
            resizeMode="contain" // Maintain aspect ratio for the fallback image
          />
        )}
      </View>
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
        <View style={styles.profileHeader}>
          <Image
            source={
              profile?.profile_image_url
                ? { uri: profile.profile_image_url }
                : require("../assets/images/Konnect_vector.png")
            }
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{profile.full_name || "John Doe"}</Text>
          <Text style={styles.profileUsername}>
            @{profile.username || "Please set a username."}
          </Text>
          <Text style={styles.profileBio}>{profile.bio || "Please set a bio."}</Text>
          <Button title="Edit Profile" onPress={() => navigation.navigate("EditProfile")} />
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

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Posts</Text>
        </View>

        <View style={styles.imageGrid}>
          <FlatList
            data={images}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const windowWidth = (Dimensions.get("window").width) - 5;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileUsername: {
    fontSize: 16,
    color: "gray",
    marginBottom: 5,
  },
  profileBio: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
    textAlign: "center",
  },
  profileDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  detailItem: {
    alignItems: "center",
  },
  detailNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  detailLabel: {
    fontSize: 14,
    color: "gray",
  },
  postsSection: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageGrid: {
    flexDirection: "row",
    alignItems: 'center',
    padding:5,
    width: "100%",
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

  gridContainer: {
    alignItems:'flex-start',
    justifyContent:'center',
  },
});

export default ProfilePage;
