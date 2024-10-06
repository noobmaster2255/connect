import { StyleSheet, View, Text } from "react-native";
import AppButton from "../Components/Button/Button";
import { supabase } from "../supabase";

export default function Home({navigation, session}){
    const signOut = async () => {
        console.log("Trying to sign out....");
       const {error, data} =  await supabase.auth.signOut();
       if(!error){
        console.log("Signed out...");
        console.log("Data : " , data);
        navigation.navigate("Login");
       } else {
       console.log("Signout error", error);
       }
    };
    return(
    <View style={styles.container}>
        <Text style={{color: "#ff0000"}}>Home screen</Text>
        <AppButton 
        title={"Logout"}
        onPress={signOut}
        />
    </View>
    
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})