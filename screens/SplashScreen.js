import React from "react";
import { View, StyleSheet, Image, StatusBar } from "react-native";
import { useTheme } from "../context/ThemeContext";

const SplashScreen = () => {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle='dark-content'
      />
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode='contain'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default SplashScreen;
