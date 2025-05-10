import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import Badge from "../common/Badge";
import { ORDER_STATUSES } from "../../config";

const OrderItem = ({ order, onPress }) => {
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
          borderColor: theme.colors.border,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.orderNumber, { color: theme.colors.text }]}>
          Order #{order._id.substring(order._id.length - 6)}
        </Text>
        <Badge text={statusInfo.label} type={statusInfo.type} size='small' />
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name='time-outline' size={16} color={theme.colors.gray} />
          <Text style={[styles.infoText, { color: theme.colors.gray }]}>
            {formattedDate}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name='person-outline' size={16} color={theme.colors.gray} />
          <Text style={[styles.infoText, { color: theme.colors.gray }]}>
            {order.user?.name || "Customer"}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.itemsInfo}>
          <Text style={[styles.itemsCount, { color: theme.colors.text }]}>
            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
          </Text>
          <Text style={[styles.paymentMethod, { color: theme.colors.gray }]}>
            {order.paymentMethod.toUpperCase()}
          </Text>
        </View>

        <Text style={[styles.total, { color: theme.colors.primary }]}>
          ${order.total.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemsInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemsCount: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 12,
  },
  paymentMethod: {
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OrderItem;
