import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const Loader = ({ size = "large", message, fullScreen = false }) => {
  const { theme } = useTheme();

  if (fullScreen) {
    return (
      <View
        style={[
          styles.fullScreenContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size={size} color={theme.colors.primary} />
        {message && (
          <Text style={[styles.message, { color: theme.colors.text }]}>
            {message}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {message && (
        <Text style={[styles.message, { color: theme.colors.text }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
});

export default Loader;
