import { StyleSheet, View, Text, Image, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import AppTextInput from "../Components/TextInput/TextInput";
import AppButton from "../Components/Button/Button";
import { supabase } from "../supabase";
import Toast from "react-native-toast-message";

export default function Login({ navigation, session, setSession }) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //
  const checkValidEmail = (email) => {
    return emailRegex.test(email);
  };
  const handleLogin = async () => {
    if (email !== "" && password !== "") {
      if (!checkValidEmail(email)) {
        Toast.show({
          type: "error",
          text1: "Invalid Email",
          text1Style: { fontSize: 14 },
          text2: "Provide a valid email!",
          position: "bottom",
          text2Style: { fontSize: 12, color: "#860000" },
        });
      } else if (password.length < 6) {
        Toast.show({
          type: "error",
          text1: "Invalid password",
          text1Style: { fontSize: 14 },
          text2: "Minimum 6 characters",
          position: "bottom",
          text2Style: { fontSize: 12, color: "#860000" },
        });
      } else {
        try {
          setIsLoading(true, "Started");
          const { error, data } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });
          console.log("ERROR HERER", error);
          if (!error) {
            console.log("in here");
            console.log(data);
            const { user, session } = data;
            console.log("SESSION IN !ERROR", session);
            console.log(
              "User",
              supabase.auth
                .getUser()
                .then((data) => console.log("User data ", data))
            );
            setIsLoading(false);
            setSession(session);
            Toast.show({
              type: 'success',
              text1: "Login Success",
              text1Style: {fontSize: 14},
              position: 'bottom',
          });
          } else {
            setIsLoading(false);
            Alert.alert(
              error.message
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            );
          }
        } catch (error) {
          setIsLoading(false);
          throw error;
        }
        setIsLoading(false);
      }
    }
  };
  const goToRegister = () => {
    navigation.navigate("Register");
  };
  //
  return (
    <View style={styles.loginContainer}>
      <View style={styles.imageContainer}>
        <Image
          style={{ height: 70, width: 320 }}
          source={require("../assets/images/konnect.png")}
        ></Image>
        {isLoading ? <ActivityIndicator style={{padding: 20}} size={"large"} color={"#FFC2E2"}/> : null}
      </View>
      <View style={styles.formContainer}>
        <AppTextInput
          placeholder={"Email"}
          keyboardType={"email"}
          autoComplete={"email"}
          inputMode={"email"}
          textContentType={"emailAddress"}
          secureTextEntry={false}
          onChangeText={(text) => {
            setEmail(text);
          }}
          autoCapitalize={"none"}
        />
        <AppTextInput
          placeholder={"Password"}
          keyboardType={"password"}
          autoComplete={""}
          inputMode={"password"}
          textContentType={"password"}
          secureTextEntry={true}
          onChangeText={(text) => {
            setPassword(text);
          }}
          autoCapitalize={"none"}
        />
        <Text style={{ ...styles.loginStyle, fontSize: 16 }}>
          Forgot your password?
        </Text>
        <View style={styles.buttonContainer}>
          <AppButton onPress={handleLogin} title={"Login"} />
        </View>
      </View>
      <Text style={{ fontSize: 16 }}>
        Don't have an accout?{" "}
        <Text style={styles.loginStyle} onPress={goToRegister}>
          Join us
        </Text>
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  formContainer: {},
  buttonContainer: {
    marginTop: 50,
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
    fontWeight: "600",
    color: "#ffad73",
    fontSize: 16.5,
  },
});
