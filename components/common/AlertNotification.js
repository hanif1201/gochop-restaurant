import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAlert } from "../../context/AlertContext";
import { useTheme } from "../../context/ThemeContext";

const AlertNotification = () => {
  const { alert, hideAlert } = useAlert();
  const { theme } = useTheme();
  const translateY = new Animated.Value(-100);

  React.useEffect(() => {
    if (alert.visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [alert.visible]);

  const getIconName = () => {
    switch (alert.type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "alert-circle";
      case "warning":
        return "warning";
      case "info":
        return "information-circle";
      default:
        return "information-circle";
    }
  };

  const getBackgroundColor = () => {
    switch (alert.type) {
      case "success":
        return theme.colors.success;
      case "error":
        return theme.colors.error;
      case "warning":
        return theme.colors.warning;
      case "info":
        return theme.colors.info;
      default:
        return theme.colors.info;
    }
  };

  if (!alert.visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name={getIconName()}
          size={24}
          color='#fff'
          style={styles.icon}
        />
        <Text style={styles.message}>{alert.message}</Text>
      </View>
      <TouchableOpacity onPress={hideAlert} style={styles.closeButton}>
        <Ionicons name='close' size={20} color='#fff' />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  message: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
});

export default AlertNotification;
