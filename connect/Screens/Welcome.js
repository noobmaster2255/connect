import { View, StyleSheet, Image, Text, TouchableOpacity, StatusBar } from "react-native";
import AppButton from "../Components/Button/Button";
import AppTextInput from "../Components/TextInput/TextInput";

export default function WelcomeScreen({navigation}) {
    console.log(navigation)
  return (
    <View style={styles.welcomeScreenContainer}>
      <View style={styles.topContent}>
        <View style={styles.imageContainer}>
          <Image style={{width: 200, height: 200}} source={require("../assets/images/Konnect_vector.png")} />
        </View>
        <View style={styles.imageContainer}>
          <Image source={require("../assets/images/Konnect.png")}></Image>
        </View>
        <View style={styles.taglineContainer}>
          <Text style={styles.taglineTextStyle}>
            ❝Where community meets tranquility❞
          </Text>
        </View>
      </View>
      {/* <View style={styles.formContainer}>
        <AppTextInput
          placeholder={"Email"}
          keyboardType={"email"}
          inputMode={"email"}
          autoComplete={"email"}
        />
      </View> */}
      <View style={styles.buttonContainer}>
        <AppButton onPress={() => {}} title={"Get Started"} />
        <View style={styles.loginPrompt}>
        <Text style={{fontSize: 16}}>Already a user? <Text style={styles.loginStyle} onPress={()=>{console.log("Login clicked")}}>Login</Text></Text>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeScreenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  topContent: {
    alignItems: "center",
  },
  taglineContainer: {
    paddingBottom: 30,
  },
  taglineTextStyle: {
    fontSize: 18,
  },
  imageContainer: {
    position: "relative",
    height: "auto",
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  loginPrompt:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  loginStyle: {
    fontWeight: '600',
    color: '#ffad73',
    fontSize: 16.5
  }
});
