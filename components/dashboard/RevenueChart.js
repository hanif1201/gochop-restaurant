import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useTheme } from "../../context/ThemeContext";

const RevenueChart = ({ data }) => {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get("window").width;

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.gray }]}>
          No revenue data available
        </Text>
      </View>
    );
  }

  // Format data for chart
  const chartData = {
    labels: data.map((item) => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        data: data.map((item) => item.revenue),
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: theme.dark ? theme.colors.card : "#fff",
    backgroundGradientTo: theme.dark ? theme.colors.card : "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => theme.colors.primary,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: theme.colors.primary,
    },
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth - 64}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        verticalLabelRotation={0}
        fromZero
        formatYLabel={(value) => `$${value}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default RevenueChart;
