import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Button from "./Button";

const EmptyState = ({
  title,
  message,
  imageSource,
  buttonTitle,
  onButtonPress,
  style = {},
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {imageSource && (
        <Image source={imageSource} style={styles.image} resizeMode='contain' />
      )}

      <Text style={[styles.title, { color: theme.colors.text }]}>
        {title || "No data found"}
      </Text>

      {message && (
        <Text style={[styles.message, { color: theme.colors.gray }]}>
          {message}
        </Text>
      )}

      {buttonTitle && onButtonPress && (
        <Button
          title={buttonTitle}
          onPress={onButtonPress}
          type='primary'
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginVertical: 16,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 32,
  },
  button: {
    minWidth: 150,
  },
});

export default EmptyState;
