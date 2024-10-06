import { StyleSheet, View, Text, Image } from "react-native";
import { useState } from 'react';
import AppTextInput from "../Components/TextInput/TextInput";
import AppButton from "../Components/Button/Button";

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = () => {
        console.log(email, password);
    };

    const goToRegister = () => {
        navigation.navigate("Register");
    };
  return (
    <View style={styles.loginContainer}>
      <View style={styles.imageContainer}>
        <Image style={{height: 70, width: 320}} source={require("../assets/images/konnect.png")}></Image>
      </View>
      <View style={styles.formContainer}>
      <AppTextInput
         placeholder={"Email"}
         keyboardType={"email"}
         autoComplete={"email"}
         inputMode={"email"}
         textContentType={"emailAddress"}
         secureTextEntry={false}
         onChangeText={(text) => {setEmail(text)}}
         autoCapitalize={"none"}
         />
          <AppTextInput
         placeholder={"Password"}
         keyboardType={"password"}
         autoComplete={""}
         inputMode={"password"}
         textContentType={"password"}
         secureTextEntry={true}
         onChangeText={(text) => {setPassword(text)}}
         autoCapitalize={"none"}
         />
         <Text style={{...styles.loginStyle, fontSize: 16}}>Forgot your password?</Text>
      <View style={styles.buttonContainer}>
        <AppButton onPress={handleLogin} title={"Login"} />
      </View>
      </View>
      <Text style={{fontSize: 16}}>Don't have an accout? <Text style={styles.loginStyle} onPress={goToRegister}>Join us</Text></Text>
    </View>
  );
}
const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
    },
    formContainer: {

    },
    buttonContainer: {
        marginTop: 50
    },
    imageContainer: {
        position: "relative",
        height: "auto",
        width: 200,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 200,
        marginBottom: 20,
    },
    loginStyle: {
        fontWeight: '600',
        color: '#ffad73',
        fontSize: 16.5
      }
});