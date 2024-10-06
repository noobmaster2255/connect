import React, { useState, useEffect } from 'react';
import { NavigationContainer, StackRouter } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './pages/SignUp.js';
import Login from './pages/Login.js';
import WelcomeScreen from './pages/Welcome.js';
import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from "react-native";
import Profile from "./pages/Profile";
import { supabase } from './supabase.js';
import { Session } from '@supabase/supabase-js';
import Home from './pages/Home.js';
import Toast from 'react-native-toast-message';
import EditProfile from './pages/EditProfile.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
      {session ? ( 
        <>
          <Stack.Screen name="Home">
              {(props) => <Home {...props} session={session} setSession={setSession} />}
            </Stack.Screen>
          <Stack.Screen name="Profile">
            {(props) => <Profile {...props} session={session} setSession={setSession}/>}
          </Stack.Screen>
        </>
      ) : (
        // Unauthenticated flow (Stack Navigator)
        <>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Welcome"
            component={WelcomeScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login">
              {(props) => <Login {...props} session={session} setSession={setSession}/>}
            </Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Register">
              {(props) => <Register  {...props} session={session} setSession={setSession}/>}
            </Stack.Screen>
        </>
      )}
      </Stack.Navigator>
      <StatusBar style="auto" />
      <Toast />
    </NavigationContainer>
  );
}