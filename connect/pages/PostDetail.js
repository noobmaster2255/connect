import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PostDetail = ({ route }) => {
  const navigation = useNavigation();
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: post.image }} style={styles.image} />
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text>❤️ {post.likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text>💬 {post.commentCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text>🔗 Share</Text>
        </TouchableOpacity>
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  actionButton: {
    padding: 10,
  },
  captionContainer: {
    maxHeight: 200,
  },
});

export default PostDetail;