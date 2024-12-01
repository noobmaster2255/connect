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
  Switch,
} from "react-native";
import { React, useState, useCallback, useLayoutEffect, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../supabase";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import {EventRegister} from 'react-native-event-listeners'
import themeContext from "../theme/themeContext";

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


const ProfilePage = ({ navigation, session, setSession }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [images, setImages] = useState([]);
  const theme = useContext(themeContext)
  const [darkMode, setDarkMode] = useState(false)


  //  console.log("Mode", darkMode)

  const fetchProfile = async () => {
    try {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (userData) {
        const profileData = await getProfile(userData.user.id);
        setProfile(profileData);
        await fetchPostDetails(userData.user.id);
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


      // const postsData = await Promise.all(data.map(async (post) => {
      //   const file = post.file ? supabase.storage.from("uploads").getPublicUrl(post.file).data.publicUrl : null;
      //   return {
      //     id: post.id,
      //     image: file,
      //     caption: post.body,
      //   };
      // }));

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
        <View style={styles.loader}>
        <ActivityIndicator size={"large"} color={"grey"} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.safeArea,{backgroundColor: theme.background}]}>
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

            <Text style={[styles.profileName,{color: theme.text}]}>{profile.full_name || "-"}</Text>
            <Text style={styles.profileUsername}>
              @{profile.username || "Please set a username."}
            </Text>
            <Text style={styles.profileBio}>{profile.bio || ""}</Text>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
               <TouchableOpacity
                style={styles.iconContainer}>
                <Text style={[styles.detailNumber,{color: theme.text}]}>{posts.length || "-"}</Text>
                <Text style={styles.detailLabel}>Posts</Text> 
              </TouchableOpacity>
            </View>
            <View style={styles.detailItem}>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => navigation.navigate('FriendsList', { profileId: profile?.user_id })}>
                <Text style={[styles.detailNumber,{color: theme.text}]}>{profile.connection_count || "-"}</Text>
                <Text style={styles.detailLabel}>Friends</Text> 
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.options}>
          <Menu>
              <MenuTrigger>
              <Entypo name="dots-three-vertical" size={24} color='grey' />
              </MenuTrigger>
              <MenuOptions customStyles={{
                optionsContainer:{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: -60,
                      marginLeft: -20,
                      shadowOpacity:0.2,
                      borderRadius: 10, 
                      width:200,
                      padding:5,
                      backgroundColor:theme.card
                }
              }}>
                  <MenuOption>
                      <View style={styles.settingIcon}>
                      <Feather name="settings" size={30} color="grey" />
                      </View>
                  </MenuOption>
                  <View style={styles.divider}></View>
                <MenuOption>
                  <View style={styles.optionItem}>
                    <Text style={{color:theme.text}}>Dark Mode</Text>
                    <Switch
                      size={1}
                      value={darkMode}
                      onValueChange={(value) => {
                        setDarkMode(value)
                        EventRegister.emit('changeTheme', value)
                      }}
                    />
                  </View>
                </MenuOption>
              </MenuOptions>
          </Menu>
      </View>
        </View>
        <View style={styles.editBtnsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("EditProfile")} style={styles.editbtn}>
            <Text style={styles.btnText}>Edit Profile</Text>
          </TouchableOpacity>
        
          <TouchableOpacity onPress={() => navigation.navigate("FriendRequests")} style={styles.friendRequestsBtn}>
            <Ionicons name="people-outline" size={24} color="black" />
            <Text style={styles.btnText}>Friend Requests</Text>
          </TouchableOpacity>
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
    marginTop:0
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
    backgroundColor: "#ffad73",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  friendRequestsBtn: {
    width: "auto",
    borderWidth: 1,
    backgroundColor: "#ffad73",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  btnText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
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
  iconContainer: { alignItems: 'center', marginTop: 20 },
  options:{
    paddingTop:10,
    display:'flex',
    flexDirection: 'row',
    justifyContent:'flex-end',
    padding:20,
    paddingBottom:25,
    // backgroundColor: colors.dashboardHeader,
},
divider:{
    padding:0.5,
    // width: '100%',
    backgroundColor:'#9ea3b0',
    display: 'flex',
    width:150, 
},
settingIcon:{
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  height:50
},
loader:{
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  height:'100%'
},
optionItem:{
  display:'flex',
  flexDirection:'row',
  gap:'10',
  justifyContent:'center',
  alignItems:'center',
  padding:10
}

});

export default ProfilePage;
