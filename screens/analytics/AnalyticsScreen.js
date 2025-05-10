import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import Card from "../../components/common/Card";
import Header from "../../components/common/Header";
import Loader from "../../components/common/Loader";
import { useAlert } from "../../context/AlertContext";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getRestaurantAnalytics } from "../../services/restaurantService";

const AnalyticsScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const { theme } = useTheme();
  const { showAlert } = useAlert();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activePeriod, setActivePeriod] = useState("week");

  const screenWidth = Dimensions.get("window").width;

  const fetchAnalytics = async () => {
    try {
      if (!userInfo?.restaurantId) {
        console.log("No restaurant ID available for analytics");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const response = await getRestaurantAnalytics(
        userInfo.restaurantId,
        activePeriod
      );
      setAnalytics(response.data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.log("Error fetching analytics:", error);
      showAlert("error", "Failed to load analytics data");
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [activePeriod]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  const handlePeriodChange = (period) => {
    setActivePeriod(period);
    setLoading(true);
  };

  // Chart Configuration
  const chartConfig = {
    backgroundGradientFrom: theme.dark ? theme.colors.card : "#fff",
    backgroundGradientTo: theme.dark ? theme.colors.card : "#fff",
    color: (opacity = 1) => `rgba(253, 106, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
    labelColor: () => theme.colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: theme.colors.primary,
    },
  };

  if (loading) {
    return <Loader fullScreen message='Loading analytics...' />;
  }

  if (!analytics) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header title='Analytics' />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            No analytics data available. Please try again later.
          </Text>
          <Button
            title='Retry'
            onPress={fetchAnalytics}
            type='primary'
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Format data for revenue chart
  const revenueChartData = {
    labels:
      analytics.salesByDay?.slice(-7).map((item) => {
        const date = new Date(item.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }) || [],
    datasets: [
      {
        data: analytics.salesByDay?.slice(-7).map((item) => item.revenue) || [
          0,
        ],
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
    legend: ["Revenue"],
  };

  // Format data for orders chart
  const ordersChartData = {
    labels:
      analytics.salesByDay?.slice(-7).map((item) => {
        const date = new Date(item.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }) || [],
    datasets: [
      {
        data: analytics.salesByDay
          ?.slice(-7)
          .map((item) => item.orderCount) || [0],
        color: (opacity = 1) => theme.colors.info,
        strokeWidth: 2,
      },
    ],
    legend: ["Orders"],
  };

  // Format data for top items chart
  const topItemsChartData = {
    labels:
      analytics.topItems?.map(
        (item) => item.name.slice(0, 12) + (item.name.length > 12 ? "..." : "")
      ) || [],
    datasets: [
      {
        data: analytics.topItems?.map((item) => item.orderCount) || [0],
      },
    ],
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title='Analytics' />

      <View style={styles.periodsContainer}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            activePeriod === "week" && {
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
            },
            { borderColor: theme.colors.border },
          ]}
          onPress={() => handlePeriodChange("week")}
        >
          <Text
            style={[
              styles.periodText,
              { color: activePeriod === "week" ? "#fff" : theme.colors.text },
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.periodButton,
            activePeriod === "month" && {
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
            },
            { borderColor: theme.colors.border },
          ]}
          onPress={() => handlePeriodChange("month")}
        >
          <Text
            style={[
              styles.periodText,
              { color: activePeriod === "month" ? "#fff" : theme.colors.text },
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.periodButton,
            activePeriod === "year" && {
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
            },
            { borderColor: theme.colors.border },
          ]}
          onPress={() => handlePeriodChange("year")}
        >
          <Text
            style={[
              styles.periodText,
              { color: activePeriod === "year" ? "#fff" : theme.colors.text },
            ]}
          >
            Year
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Ionicons
              name='cash-outline'
              size={24}
              color={theme.colors.primary}
              style={styles.summaryIcon}
            />
            <Text style={[styles.summaryLabel, { color: theme.colors.gray }]}>
              Total Revenue
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              ${(analytics.totalRevenue || 0).toFixed(2)}
            </Text>
          </Card>

          <Card style={styles.summaryCard}>
            <Ionicons
              name='receipt-outline'
              size={24}
              color={theme.colors.info}
              style={styles.summaryIcon}
            />
            <Text style={[styles.summaryLabel, { color: theme.colors.gray }]}>
              Total Orders
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {analytics.totalOrders || 0}
            </Text>
          </Card>
        </View>

        {/* Revenue Chart */}
        <Card>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Revenue Trend
          </Text>

          {analytics.salesByDay && analytics.salesByDay.length > 0 ? (
            <LineChart
              data={revenueChartData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              formatYLabel={(value) => `$${value}`}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={[styles.noDataText, { color: theme.colors.gray }]}>
                No revenue data available for this period
              </Text>
            </View>
          )}
        </Card>

        {/* Orders Chart */}
        <Card>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Orders Trend
          </Text>

          {analytics.salesByDay && analytics.salesByDay.length > 0 ? (
            <LineChart
              data={ordersChartData}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(23, 162, 184, ${opacity})`,
              }}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={[styles.noDataText, { color: theme.colors.gray }]}>
                No order data available for this period
              </Text>
            </View>
          )}
        </Card>

        {/* Top Items Chart */}
        <Card>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Top Menu Items
          </Text>

          {analytics.topItems && analytics.topItems.length > 0 ? (
            <BarChart
              data={topItemsChartData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              verticalLabelRotation={30}
              showValuesOnTopOfBars
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={[styles.noDataText, { color: theme.colors.gray }]}>
                No menu item data available for this period
              </Text>
            </View>
          )}
        </Card>

        {/* Additional Analytics Information */}
        <Card>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Additional Insights
          </Text>

          <View style={styles.insightItem}>
            <Text style={[styles.insightLabel, { color: theme.colors.gray }]}>
              Average Order Value:
            </Text>
            <Text style={[styles.insightValue, { color: theme.colors.text }]}>
              $
              {analytics.totalRevenue && analytics.totalOrders
                ? (analytics.totalRevenue / analytics.totalOrders).toFixed(2)
                : 0}
            </Text>
          </View>

          <View style={styles.insightItem}>
            <Text style={[styles.insightLabel, { color: theme.colors.gray }]}>
              Best Selling Category:
            </Text>
            <Text style={[styles.insightValue, { color: theme.colors.text }]}>
              {analytics.topItems && analytics.topItems.length > 0
                ? analytics.topItems[0].category || "None"
                : "None"}
            </Text>
          </View>

          <View style={styles.insightItem}>
            <Text style={[styles.insightLabel, { color: theme.colors.gray }]}>
              Most Active Day:
            </Text>
            <Text style={[styles.insightValue, { color: theme.colors.text }]}>
              {analytics.salesByDay && analytics.salesByDay.length > 0
                ? (() => {
                    const mostActiveDay = [...analytics.salesByDay].sort(
                      (a, b) => b.orderCount - a.orderCount
                    )[0];
                    const date = new Date(mostActiveDay.date);
                    return date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    });
                  })()
                : "None"}
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  periodsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 8,
    borderWidth: 1,
  },
  periodText: {
    fontSize: 14,
    fontWeight: "500",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    width: "48%",
    alignItems: "center",
    paddingVertical: 16,
  },
  summaryIcon: {
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 14,
    textAlign: "center",
  },
  insightItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  insightLabel: {
    fontSize: 14,
  },
  insightValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
  },
});

export default AnalyticsScreen;
