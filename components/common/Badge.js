import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const Badge = ({
  text,
  type = "default",
  size = "medium",
  style = {},
  textStyle = {},
}) => {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return theme.colors.success;
      case "error":
        return theme.colors.error;
      case "warning":
        return theme.colors.warning;
      case "info":
        return theme.colors.info;
      case "primary":
        return theme.colors.primary;
      default:
        return theme.colors.gray;
    }
  };

  const getBadgeStyle = () => {
    let badgeStyle = { ...styles.badge, backgroundColor: getBackgroundColor() };

    if (size === "small") {
      badgeStyle.paddingVertical = 2;
      badgeStyle.paddingHorizontal = 6;
    } else if (size === "large") {
      badgeStyle.paddingVertical = 6;
      badgeStyle.paddingHorizontal = 12;
    }

    return badgeStyle;
  };

  const getTextStyle = () => {
    let textStyleObj = { ...styles.text };

    if (size === "small") {
      textStyleObj.fontSize = 10;
    } else if (size === "large") {
      textStyleObj.fontSize = 14;
    }

    return textStyleObj;
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      <Text style={[getTextStyle(), textStyle]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Badge;
