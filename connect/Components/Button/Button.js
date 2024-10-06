import { Platform, Button, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function AppButton({ onPress, title }) {
  return Platform.select({
    ios: (
      <View style={styles.iosButtonContainer}>
        <Button
          onPress={onPress}
          title={title}
          color="#333333"
          style={styles.iosButtonStyle}
        />
      </View>
    ),
    android: (
      <TouchableOpacity onPress={onPress} style={styles.androidButtonContainer}>
        <Text style={styles.androidButtonText}>{title}</Text>
      </TouchableOpacity>
    ),
  });
}

const styles = StyleSheet.create({
  iosButtonContainer: {
    width: 320,
    height: 50,
    backgroundColor: '#ffad73',
    borderRadius: 10,
    justifyContent: 'center',
  },
  iosButtonStyle: {},

  androidButtonContainer: {
    width: 320,
    height: 50,
    backgroundColor: '#ffad73',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  androidButtonText: {
    fontSize: 16,
    color: '#333333',
  },
});