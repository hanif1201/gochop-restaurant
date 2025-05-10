import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Badge from "../common/Badge";
import { ORDER_STATUSES } from "../../config";

const RecentOrderItem = ({ order, onPress }) => {
  const { theme } = useTheme();

  const getStatusInfo = (status) => {
    switch (status) {
      case ORDER_STATUSES.PENDING:
        return { type: "warning", label: "Pending" };
      case ORDER_STATUSES.ACCEPTED:
        return { type: "info", label: "Accepted" };
      case ORDER_STATUSES.PREPARING:
        return { type: "info", label: "Preparing" };
      case ORDER_STATUSES.READY_FOR_PICKUP:
        return { type: "primary", label: "Ready" };
      case ORDER_STATUSES.PICKED_UP:
      case ORDER_STATUSES.ASSIGNED_TO_RIDER:
      case ORDER_STATUSES.ON_THE_WAY:
        return { type: "info", label: "On The Way" };
      case ORDER_STATUSES.DELIVERED:
        return { type: "success", label: "Delivered" };
      case ORDER_STATUSES.CANCELLED:
        return { type: "error", label: "Cancelled" };
      default:
        return { type: "default", label: status };
    }
  };

  const statusInfo = getStatusInfo(order.status);
  const orderDate = new Date(order.createdAt);
  const formattedDate = `${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" }
  )}`;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.leftSection}>
        <Text style={[styles.orderNumber, { color: theme.colors.text }]}>
          #{order._id.substring(order._id.length - 6)}
        </Text>
        <Text style={[styles.time, { color: theme.colors.gray }]}>
          {formattedDate}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.price, { color: theme.colors.text }]}>
          ${order.total.toFixed(2)}
        </Text>
        <Badge text={statusInfo.label} type={statusInfo.type} size='small' />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  leftSection: {
    justifyContent: "center",
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
});

export default RecentOrderItem;
