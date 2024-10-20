import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";

const PostDetail = ({ route }) => {
  const navigation = useNavigation();
  const { post } = route.params;

  const handleEditPost = () => {
    navigation.navigate('EditPost', { post });
  };
  
  return (
    <View style={styles.container}>
      <Image source={{ uri: post.image }} style={styles.image} />
      <View style={styles.actionsContainer}>
        <View style={styles.action}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={20} color={"black"}/>
          </TouchableOpacity>
          <Text>{post.likeCount}</Text>
        </View>
        <View style={styles.action}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={20} color={"black"}/>
          </TouchableOpacity>
          <Text>{post.commentCount}</Text>
        </View>
        <View style={styles.action}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={20} color={"black"}/>
          </TouchableOpacity>
          <Text>Share</Text>
        </View>
        <View style={styles.action}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEditPost}>
            <Ionicons name="ellipsis-horizontal-outline" size={20} color={"black"}/>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.captionContainer}>
        <Text>{post.caption}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').width,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  action: {
    padding: 10
  },
  actionButton: {
    padding: 3,
  },
  captionContainer: {
    maxHeight: 200,
  },
});

export default PostDetail;