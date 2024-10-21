import { StyleSheet, View, Text } from "react-native";
import AppButton from "../Components/Button/Button";
import { supabase } from "../supabase";
import ProfilePage from "./Profile";
import CommentOverlay from "../Components/CommentOverlay/CommentOverlay";
import { useState } from "react";

export default function Home({navigation, session, setSession}){
    
    return(
    <View style={styles.container}>
        <Text style={{color: "#ff0000"}}>Home screen</Text>
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