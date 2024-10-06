import { View, StyleSheet, Image, Text, TouchableOpacity, StatusBar } from "react-native";
import AppButton from "../Components/Button/Button";

export default function WelcomeScreen({navigation}) {
    console.log(navigation)
    const goToLogin = () => {
        navigation.navigate("Login")
    };
    const goToSignup = () => {
        navigation.navigate("Register");
    };
  return (
    <View style={styles.welcomeScreenContainer}>
      <View style={styles.topContent}>
        <View style={styles.imageContainer}>
          <Image style={{width: 250, height: 250}} source={require("../assets/images/Konnect_vector.png")} />
        </View>
        <View style={styles.imageContainer}>
          <Image style={{height: 70, width: 320}} source={require("../assets/images/konnect.png")}></Image>
        </View>
        <View style={styles.taglineContainer}>
          <Text style={styles.taglineTextStyle}>
            ❝Where community meets tranquility❞
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton onPress={goToSignup} title={"Get Started"} />
        <View style={styles.loginPrompt}>
        <Text style={{fontSize: 16}}>Already a user? <Text style={styles.loginStyle} onPress={goToLogin}>Login</Text></Text>
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
    marginTop: 20,
    paddingBottom: 30,
  },
  taglineTextStyle: {
    fontSize: 16,
  },
  imageContainer: {
    position: "relative",
    height: "auto",
    width: 200,
    justifyContent: "center",
    alignItems: "center",
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
