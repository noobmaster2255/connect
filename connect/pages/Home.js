import { StyleSheet, View, Text } from "react-native";
import AppButton from "../Components/Button/Button";
import { supabase } from "../supabase";
import ProfilePage from "./Profile";
import CommentOverlay from "../Components/CommentOverlay/CommentOverlay";
import { useState } from "react";

export default function Home({navigation, session, setSession}){
    const [isCommentVisible, setIsCommentVisible] = useState(false);
    
    return(
    <View style={styles.container}>
        <Text style={{color: "#ff0000"}}>Home screen</Text>
        <AppButton onPress={() => {getLikeCount("0b1fb65e-0e32-4068-92f5-d5527b18666e")}} title={"Get Like"}/>
        <AppButton onPress={() => {addLike("0b1fb65e-0e32-4068-92f5-d5527b18666e")}} title={"Add Like"}/>
        <AppButton onPress={() => {unlike("0b1fb65e-0e32-4068-92f5-d5527b18666e")}} title={"Remove Like"}/>
        <AppButton onPress={() => {setIsCommentVisible(true)}} title={"Show Overlay"}/>
            <CommentOverlay visible={isCommentVisible} onClose={()=>{setIsCommentVisible(false)}} postId={""}/>
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