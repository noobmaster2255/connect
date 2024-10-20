import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../supabase';

const EditPost = ({ route, navigation }) => {
  const { post } = route.params;
  const [caption, setCaption] = useState(post.caption);

  const updatePost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .update({ body: caption })
      .eq('id', post.id);

    if (error) {
      Alert.alert('Error', 'There was an error updating the post.');
    } else {
      Alert.alert('Success', 'Post updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('ProfileScreen')
        }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={caption}
        onChangeText={setCaption}
        style={styles.textInput}
        multiline
        placeholder="Edit your post..."
      />
      <TouchableOpacity style={styles.saveButton} onPress={updatePost}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    height: 150,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: "#ffad73",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default EditPost;