import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { supabase } from "../supabase";
import Toast from "react-native-toast-message";
import { updateProfile } from "../Components/profileService";
import AppButton from "../Components/Button/Button";

const EditProfile = ({ navigation, session, setSession }) => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name, bio")
        .single();

      if (data) {
        setUsername(data.username);
        setFullName(data.full_name);
        setBio(data.bio);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      const { data, error } = await updateProfile(user.id, username, fullName, bio);

      if (error) {
        Toast.show({
          type: "error",
          text1: "Update Failed",
          text2: error.message,
          position: "bottom",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Profile Updated",
          text2: "Your profile has been successfully updated!",
          position: "bottom",
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error during profile update:", error);
      Toast.show({
        type: "error",
        text1: "An error occurred",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log("Trying to sign out....");
    const { error, data } = await supabase.auth.signOut();
    if (!error) {
      console.log("Signed out...");
      console.log("Data : ", data);
    } else {
      console.log("Signout error", error);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={(text) => setUsername(text)}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.textArea}
          value={bio}
          onChangeText={(text) => setBio(text)}
          multiline={true}
          numberOfLines={4}
        />
      </View>
      <View>
        <AppButton title={"Logout"} onPress={signOut} />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save Changes"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f4f4f4",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f4f4f4",
    height: 100,
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
    // fontWeight: 'bold',
  },
});
