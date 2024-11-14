import React, { useState, useEffect } from "react";
import { NavigationContainer, StackRouter } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "./pages/SignUp.js";
import Login from "./pages/Login.js";
import WelcomeScreen from "./pages/Welcome.js";
import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Alert, LogBox, StyleSheet, Text, View } from "react-native";
import Profile from "./pages/Profile";
import { supabase } from "./supabase.js";
import { Session } from "@supabase/supabase-js";
import Home from "./pages/Home.js";
import Toast from "react-native-toast-message";
import EditProfile from "./pages/EditProfile.js";
import Ionicons from "react-native-vector-icons/Ionicons";
import CreatePost from "./pages/CreatePost.js";
import PostDetail from "./pages/PostDetail.js";
import EditPost from "./pages/EditPost.js";
import * as Notifications from "expo-notifications";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

//permission for notifications
async function getPushNotificationPermission() {
  const {status} = await Notifications.requestPermissionsAsync();
  if(status !== "granted"){
    Alert.alert("Permission Required!", "Enable permission to receive notifications.");
    return;
  }

  const token = await Notifications.getExpoPushTokenAsync({projectId: "5e3048f4-d26c-462f-8ae4-8b351c45e255"})
  console.log("Token : ",token.data);
}


function ProfileStack({ session , setSession}) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileScreen" options={{ headerShown: false }}>
        {(props) => <Profile {...props} session={session} />}
      </Stack.Screen>
      <Stack.Screen name="EditProfile" options={{ headerShown: false }}>
        {(props) => <EditProfile {...props} session={session} setSession={setSession}/>}
      </Stack.Screen>
      <Stack.Screen name="PostDetail" options={{ headerShown: false }}>
        {(props) => <PostDetail {...props} session={session} setSession={setSession}/>}
      </Stack.Screen>
      <Stack.Screen name="EditPost" options={{ headerShown: false }}>
        {(props) => <EditPost {...props} session={session} setSession={setSession}/>}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

LogBox.ignoreLogs(['Warning: TNodeChildrenRenderer','Warning: MemoizedTNodeRenderer','Warning: TRenderEngineProvider'])

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    getSession();
    getPushNotificationPermission();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {session ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === "Home") {
                iconName = "home";
              } else if (route.name === "Profile") {
                iconName = "person";
              } else if (route.name === "CreatePost") {
                iconName = "add-circle";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarShowLabel: false,
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen name="Home" >
            {(props) => <Home {...props} session={session} setSession={setSession} />}
          </Tab.Screen>
          <Tab.Screen name="CreatePost">
            {(props) => <CreatePost {...props} session={session} setSession={setSession}/>}
          </Tab.Screen>
          <Tab.Screen name="Profile">
            {(props) => <ProfileStack {...props} session={session} setSession={setSession}/>}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        // Unauthenticated flow (Stack Navigator)
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="Welcome" component={WelcomeScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Login">
            {(props) => <Login {...props} session={session} setSession={setSession} />}
          </Stack.Screen>
          <Stack.Screen options={{ headerShown: false }} name="Register">
            {(props) => <Register {...props} session={session} setSession={setSession} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}

      <StatusBar style="auto" />
      <Toast />
    </NavigationContainer>
  );
}
