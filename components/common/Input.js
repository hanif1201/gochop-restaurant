// src/components/common/Input.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
  style = {},
  multiline = false,
  numberOfLines = 1,
  icon,
  onIconPress,
  disabled = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { theme } = useTheme();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? theme.colors.error : theme.colors.border,
            backgroundColor: disabled
              ? theme.colors.border
              : theme.colors.background,
          },
        ]}
      >
        {icon && (
          <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
            <Ionicons
              name={icon}
              size={20}
              color={theme.colors.gray}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}

        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text },
            multiline && {
              height: numberOfLines * 20,
              textAlignVertical: "top",
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.gray}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={!disabled}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={theme.colors.gray}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  icon: {
    marginHorizontal: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
