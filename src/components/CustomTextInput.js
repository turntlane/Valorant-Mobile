import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";

const CustomTextInput = (props) => {
  return (
    <View>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        style={styles.input}
        secureTextEntry={props.secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    width: "100%",

    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal: 10,
    marginVertical: 5,
  },
});

export default CustomTextInput;
