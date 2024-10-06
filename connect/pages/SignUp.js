import { StyleSheet, View, Text, Image } from "react-native";
import AppTextInput from "../Components/TextInput/TextInput";
import AppButton from "../Components/Button/Button";
import Spacer from "../Components/Spacer/Spacer";
import {useState} from 'react';
import { useNavigation } from "@react-navigation/native";

export default function Register({navigation}){
    //variables
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    //functions
    const handleSignup = async () => {
        if(password === confirmPassword){
        } else {

        }
        console.log(fullName, " ", email, " ", password)
    };
    const isScreenInStack = (routeName) => {
        const state = navigation.getState();
        return state.routes.some((route) => route.name == routeName);
    };
    return(
        <View style={styles.registerContainer}>
            <View style={styles.imageContainer}>
                 <Image style={{height: 70, width: 320}} source={require("../assets/images/konnect.png")}></Image>
            </View>
            <View style={styles.formContainer}>
                <AppTextInput
                placeholder={"Full Name"}
                inputMode={"text"}
                autoComplete={"name"}
                keyboardType={"default"}
                textContentType={"name"} 
                secureTextEntry={false}
                autoCapitalize={"sentences"}
                onChangeText={(text) => {setFullName(text)}}
                />
                <AppTextInput
                placeholder={"Email"}
                keyboardType={"email"}
                autoComplete={"email"}
                inputMode={"email"}
                textContentType={"emailAddress"}
                secureTextEntry={false}
                autoCapitalize={"none"}
                onChangeText={(text) => {setEmail(text)}}
                />
                <AppTextInput
                placeholder={"Password"}
                keyboardType={"password"}
                autoComplete={""}
                inputMode={"password"}
                textContentType={"password"}
                secureTextEntry={true}
                autoCapitalize={"none"}
                onChangeText={(text) => {setPassword(text)}}
                />
                <AppTextInput
                placeholder={"Password"}
                keyboardType={"password"}
                autoComplete={""}
                inputMode={"password"}
                textContentType={"password"}
                secureTextEntry={true}
                autoCapitalize={"none"}
                onChangeText={(text) => {setConfirmPassword(text)}}
                />
            </View>
            <View style={styles.buttonContainer}>
                <AppButton
                onPress={handleSignup}
                title={"Sign Up"} />
            </View>
            <Text style={{fontSize: 16}}>Already have an accout? <Text style={styles.loginStyle} onPress={()=>{
                 if(isScreenInStack("Login")){
                    navigation.pop();
                 } else {
                    navigation.navigate("Login");
                 }

            }}>Login</Text></Text>
            <Spacer height={40} width={100} />
        </View>
    );
}
const styles = StyleSheet.create({
    registerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
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
    buttonContainer: {
    },
    loginStyle: {
        fontWeight: '600',
        color: '#ffad73',
        fontSize: 16.5
      }

});