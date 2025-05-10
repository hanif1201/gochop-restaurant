import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { ORDER_STATUSES } from "../../config";

const OrderStatusStepper = ({ currentStatus, statusHistory }) => {
  const { theme } = useTheme();

  const orderFlow = [
    {
      status: ORDER_STATUSES.PENDING,
      label: "Pending",
      icon: "hourglass-outline",
    },
    {
      status: ORDER_STATUSES.ACCEPTED,
      label: "Accepted",
      icon: "checkmark-circle-outline",
    },
    {
      status: ORDER_STATUSES.PREPARING,
      label: "Preparing",
      icon: "restaurant-outline",
    },
    {
      status: ORDER_STATUSES.READY_FOR_PICKUP,
      label: "Ready for Pickup",
      icon: "bicycle-outline",
    },
    {
      status: ORDER_STATUSES.DELIVERED,
      label: "Delivered",
      icon: "checkmark-done-circle-outline",
    },
  ];

  // Special handling for cancelled orders
  if (currentStatus === ORDER_STATUSES.CANCELLED) {
    return (
      <View style={styles.cancelledContainer}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.error + "20" },
          ]}
        >
          <Ionicons
            name='close-circle-outline'
            size={24}
            color={theme.colors.error}
          />
        </View>
        <Text style={[styles.cancelledText, { color: theme.colors.error }]}>
          This order has been cancelled
        </Text>
      </View>
    );
  }

  // Find the current status index
  const currentIndex = orderFlow.findIndex(
    (item) => item.status === currentStatus
  );

  // Get timestamp for a status
  const getStatusTimestamp = (status) => {
    if (!statusHistory) return null;

    const statusEntry = statusHistory.find((entry) => entry.status === status);
    return statusEntry ? new Date(statusEntry.time) : null;
  };

  return (
    <View style={styles.container}>
      {orderFlow.map((step, index) => {
        const isActive = currentIndex >= index;
        const isLast = index === orderFlow.length - 1;
        const timestamp = getStatusTimestamp(step.status);
        const formattedTime = timestamp
          ? timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        return (
          <View key={step.status} style={styles.stepContainer}>
            <View style={styles.stepContent}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: isActive
                      ? theme.colors.primary + "20"
                      : theme.colors.gray + "20",
                  },
                ]}
              >
                <Ionicons
                  name={step.icon}
                  size={20}
                  color={isActive ? theme.colors.primary : theme.colors.gray}
                />
              </View>

              <View style={styles.stepInfo}>
                <Text
                  style={[
                    styles.stepLabel,
                    {
                      color: isActive
                        ? theme.colors.primary
                        : theme.colors.gray,
                      fontWeight: isActive ? "bold" : "normal",
                    },
                  ]}
                >
                  {step.label}
                </Text>

                {timestamp && (
                  <Text style={[styles.stepTime, { color: theme.colors.gray }]}>
                    {formattedTime}
                  </Text>
                )}
              </View>
            </View>

            {!isLast && (
              <View
                style={[
                  styles.connector,
                  {
                    backgroundColor:
                      index < currentIndex
                        ? theme.colors.primary
                        : theme.colors.gray + "40",
                  },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  stepContainer: {
    marginBottom: 8,
  },
  stepContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepInfo: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 14,
  },
  stepTime: {
    fontSize: 12,
    marginTop: 2,
  },
  connector: {
    width: 2,
    height: 16,
    marginLeft: 18,
  },
  cancelledContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelledText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
});

export default OrderStatusStepper;
