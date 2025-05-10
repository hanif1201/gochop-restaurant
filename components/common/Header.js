import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";

const Header = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  showBackButton = false,
  style = {},
}) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleBackPress = () => {
    if (onLeftPress) {
      onLeftPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: theme.colors.background },
        style,
      ]}
    >
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity onPress={handleBackPress} style={styles.iconButton}>
            <Ionicons name='arrow-back' size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
        {leftIcon && (
          <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
            <Ionicons name={leftIcon} size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>

      <View style={styles.rightContainer}>
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
            <Ionicons name={rightIcon} size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  leftContainer: {
    flexDirection: "row",
    width: 40,
  },
  rightContainer: {
    flexDirection: "row",
    width: 40,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  iconButton: {
    padding: 8,
  },
});

export default Header;
