import React from "react";
import { View, Text, StyleSheet, Switch as RNSwitch } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const Switch = ({
  label,
  value,
  onValueChange,
  disabled = false,
  style = {},
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}

      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: "#D1D1D6",
          true: theme.colors.primary + "80", // 50% opacity
        }}
        thumbColor={value ? theme.colors.primary : "#F4F3F4"}
        ios_backgroundColor='#D1D1D6'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    marginRight: 8,
    flex: 1,
  },
});

export default Switch;
