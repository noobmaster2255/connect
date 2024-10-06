import { StyleSheet, View, Text, Image, Button, ScrollView, SafeAreaView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from "../supabase";

const ProfilePage = ({ navigation, session, setSession}) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    await supabase.auth.getUser()
      .then(async (data) => {
        // console.log(data);
        // console.log(data.data.user.id);
        if(data) {
          const profileData = await getProfile(data.data.user.id);
          // console.log(profileData);
          setProfile(profileData);
        }
        setIsLoading(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchProfile();
    }, [])
  );

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
          {/* <Image
            source={
              profile.profile_image_url
                ? { uri: profile.profile_image_url }
                : require("../assets/default-profile.png")
            } // Dynamic profile image
            style={styles.profileImage}
          /> */}
          <Text style={styles.profileName}>{profile.full_name || "John Doe"}</Text>
          <Text style={styles.profileUsername}>@{profile.username || "Please set a username."}</Text>
          <Text style={styles.profileUsername}>{profile.bio || "Please set a bio."}</Text>
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
        </View>

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Posts</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const getProfile = async (userId) => {
  // console.log("User ID:", userId);
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.log("Error fetching profile:", error);
      throw error;
    }
    // console.log("Profile data received:", data[0]);

    return data[0];
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return null;
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 16,
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
    marginBottom: 10,
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  postItem: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default ProfilePage;
