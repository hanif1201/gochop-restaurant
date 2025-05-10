// src/components/common/Button.js
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

const Button = ({
  title,
  onPress,
  type = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style = {},
  textStyle = {},
}) => {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    let buttonStyle = { ...styles.button };

    // Button type
    if (type === "primary") {
      buttonStyle.backgroundColor = theme.colors.primary;
    } else if (type === "secondary") {
      buttonStyle.backgroundColor = "transparent";
      buttonStyle.borderWidth = 1;
      buttonStyle.borderColor = theme.colors.primary;
    } else if (type === "danger") {
      buttonStyle.backgroundColor = theme.colors.error;
    } else if (type === "text") {
      buttonStyle.backgroundColor = "transparent";
      buttonStyle.elevation = 0;
      buttonStyle.shadowOpacity = 0;
    }

    // Button size
    if (size === "small") {
      buttonStyle.paddingVertical = 8;
      buttonStyle.paddingHorizontal = 12;
    } else if (size === "large") {
      buttonStyle.paddingVertical = 16;
      buttonStyle.paddingHorizontal = 24;
    }

    // Disabled state
    if (disabled || loading) {
      buttonStyle.opacity = 0.7;
    }

    return buttonStyle;
  };

  const getTextStyle = () => {
    let textStyleObj = { ...styles.text };

    if (type === "secondary" || type === "text") {
      textStyleObj.color = theme.colors.primary;
    }

    if (size === "small") {
      textStyleObj.fontSize = 14;
    } else if (size === "large") {
      textStyleObj.fontSize = 18;
    }

    return textStyleObj;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={type === "primary" ? "#fff" : theme.colors.primary}
          size='small'
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Button;
