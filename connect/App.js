
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './pages/SignUp.js';
import Login from './pages/Login.js';
import WelcomeScreen from './pages/Welcome.js';
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from "react-native";
import Profile from "./pages/Profile";

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRoute="Welcome">
        <Stack.Screen options={{headerShown: false}} name="Welcome" component={WelcomeScreen}/>
        <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
        <Stack.Screen options={{headerShown: false}} name="Register" component={Register} />
      </Stack.Navigator>
        <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={Profile} />
        {/* <Tab.Screen name="Settings" component={SettingsPage} /> */}
      </Tab.Navigator>
      <StatusBar style='auto' />
    </NavigationContainer>
  );
}
const Stack = createNativeStackNavigator();
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'start',
  },
});
