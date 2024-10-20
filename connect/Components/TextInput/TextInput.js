import { StyleSheet, TextInput, View } from "react-native";

export default function AppTextInput({
  placeholder,
  inputMode,
  autoComplete,
  keyboardType,
  textContentType,
  secureTextEntry,
  onChangeText,
  autoCapitalize,
  marginBottom
}) {
  return (
    <View style={styles.textInputContainer}>
      <TextInput
        style={styles.textInput}
        autoCorrect = {false}
        inputMode={inputMode}
        autoComplete={autoComplete}
        clearButtonMode="while-editing"
        keyboardType={keyboardType}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={"#999999"}
        textContentType={textContentType}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    width: 320,
    height: 50,
    marginBottom: 20
  },
  textInput: {
    flex: 1,
    width: '100%',
    backgroundColor: "#f7f4dc",
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#ffad73',
    fontSize: 18,
    padding: 6,
  },
});
