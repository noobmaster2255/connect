import { StyleSheet, View, Text, Image, Alert } from "react-native";
import AppTextInput from "../Components/TextInput/TextInput";
import AppButton from "../Components/Button/Button";
import Spacer from "../Components/Spacer/Spacer";
import {useState} from 'react';
import { supabase } from "../supabase";
import Toast from "react-native-toast-message";
import { ActivityIndicator } from "react-native";

export default function Register({navigation, session, setSession}){
    //variables
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [isLoading, setIsLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userId, setUserId] = useState(null);
    //functions
    const isValidEmail = (email) => {
        return emailRegex.test(email);
      };
      
    const handleSignup = async () => {
        if(password === confirmPassword && fullName !== '' && email !== ''){
            if(!isValidEmail(email)){
                console.log("In valid email")
                Toast.show({
                    type: 'error',
                    text1: "Invalid Email",
                    text1Style: {fontSize: 14},
                    text2: "Provide a valid email!",
                    position: 'bottom',
                    text2Style: {fontSize: 12, color: "#860000"}
                });
            } else if(password.length < 6){
                Toast.show({
                    type: 'error',
                    text1: "Invalid password",
                    text1Style: {fontSize: 14},
                    text2: "Minimum 5 characters",
                    position: 'bottom',
                    text2Style: {fontSize: 12, color: "#860000"}
                });
            }
            try {
                setIsLoading(true);
                console.log("Loading .... signup");
                const {error, data} = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: fullName
                        }
                    }
                });
                console.log("USER HERE" ,data.session.user.id)
                const {data: data2, error: error2} = await supabase.from("profiles").insert([{
                    user_id: data.session.user.id,
                    full_name: fullName
                }], {bypassRls: true});
                console.log("DATA 2 HERE ",data2);
                console.log("ERROR 2 HERE ", error2);
                if(error || error2){
                    setIsLoading(false);
                    Alert.alert(error.message);
                }
                setIsLoading(false);
                console.log("Loading done... signup");
                Toast.show({
                    type: 'success',
                    text1: "Signup Success",
                    text1Style: {fontSize: 14},
                    position: 'bottom',
                });
                setSession(data.session);
            } catch (error) {
                setIsLoading(false);
                console.log("Error signing up: ", error);
            }
            setIsLoading(false);
            
        } else {
            Toast.show({
                type: 'error',
                text1: "Required fields empty!",
                text1Style: {fontSize: 14},
                text2: "Input all fields with proper data!",
                position: 'bottom',
                text2Style: {fontSize: 12, color: "#860000"}
            });
        }
        console.log(fullName, " ", email, " ", password)

    };
    //function to check if a screen is in stack
    const isScreenInStack = (routeName) => {
        const state = navigation.getState();
        return state.routes.some((route) => route.name == routeName);
    };
    return(
        <View style={styles.registerContainer}>
            <View style={styles.imageContainer}>
                 <Image style={{height: 70, width: 320}} source={require("../assets/images/konnect.png")}></Image>
                 {isLoading ? <ActivityIndicator style={{padding: 20}} size={"large"} color={"#FFC2E2"}/> : null}
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
        marginTop: 150,
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