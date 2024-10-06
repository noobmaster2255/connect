import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import WelcomeScreen from './Screens/Welcome';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Screens/Login';
import Register from './Screens/Register';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRoute="Welcome">
        <Stack.Screen options={{headerShown: false}} name="Welcome" component={WelcomeScreen}/>
        <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
        <Stack.Screen options={{headerShown: false}} name="Register" component={Register} />
      </Stack.Navigator>
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
