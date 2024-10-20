// SendButton.js

import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const SendButton = ({ onPress, iconName }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name={iconName} size={20} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ffad73", // Set the background color
    borderRadius: 50, // Make it circular
    padding: 10,
    marginLeft: 10,
    width: 50,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default SendButton;
