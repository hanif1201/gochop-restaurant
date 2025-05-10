import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const StatsOverview = ({ pendingOrders, totalOrders, totalRevenue }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.primary + "20" },
          ]}
        >
          <Ionicons
            name='hourglass-outline'
            size={24}
            color={theme.colors.primary}
          />
        </View>
        <Text style={[styles.statValue, { color: theme.colors.text }]}>
          {pendingOrders}
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.gray }]}>
          Pending
        </Text>
      </View>

      <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.info + "20" },
          ]}
        >
          <Ionicons
            name='receipt-outline'
            size={24}
            color={theme.colors.info}
          />
        </View>
        <Text style={[styles.statValue, { color: theme.colors.text }]}>
          {totalOrders}
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.gray }]}>
          Total Orders
        </Text>
      </View>

      <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.success + "20" },
          ]}
        >
          <Ionicons
            name='cash-outline'
            size={24}
            color={theme.colors.success}
          />
        </View>
        <Text style={[styles.statValue, { color: theme.colors.text }]}>
          ${totalRevenue.toFixed(2)}
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.gray }]}>
          Revenue
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  iconContainer: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
});

export default StatsOverview;
