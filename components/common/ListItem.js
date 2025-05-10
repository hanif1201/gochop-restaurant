import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const ListItem = ({
  title,
  subtitle,
  leftIcon,
  leftImage,
  rightIcon = "chevron-forward",
  onPress,
  badge,
  style = {},
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        },
        style,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      {leftIcon && (
        <View
          style={[
            styles.leftIconContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <Ionicons name={leftIcon} size={22} color={theme.colors.primary} />
        </View>
      )}

      {leftImage && <Image source={leftImage} style={styles.leftImage} />}

      <View style={styles.contentContainer}>
        <Text
          style={[styles.title, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {subtitle && (
          <Text
            style={[styles.subtitle, { color: theme.colors.gray }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {badge && <View style={styles.badgeContainer}>{badge}</View>}

      {rightIcon && onPress && (
        <Ionicons
          name={rightIcon}
          size={20}
          color={theme.colors.gray}
          style={styles.rightIcon}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  leftIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  leftImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  badgeContainer: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default ListItem;
