import { StyleSheet, View, Text } from "react-native";
import AppButton from "../Components/Button/Button";
import { supabase } from "../supabase";
import ProfilePage from "./Profile";

export default function Home({navigation, session, setSession}){
    const signOut = async () => {
        console.log("Trying to sign out....");
       const {error, data} =  await supabase.auth.signOut();
       if(!error){
        console.log("Signed out...");
        console.log("Data : " , data);
        setSession(null);
       } else {
       console.log("Signout error", error);
       }
    };
    return(
    <View style={styles.container}>
        <Text style={{color: "#ff0000"}}>Home screen</Text>
        <AppButton
        title={"Go To Profile"}
        onPress={() => navigation.navigate('Profile')}
        />
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
    },
})