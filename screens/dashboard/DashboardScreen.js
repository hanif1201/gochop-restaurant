import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Header from "../../components/common/Header";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import RevenueChart from "../../components/dashboard/RevenueChart";
import StatsOverview from "../../components/dashboard/StatsOverview";
import RecentOrderItem from "../../components/orders/RecentOrderItem";
import { ORDER_STATUSES, RESTAURANT_STATUSES } from "../../config";
import { useAlert } from "../../context/AlertContext";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getOrders } from "../../services/orderService";
import {
  getRestaurantAnalytics,
  getRestaurantDetails,
  toggleRestaurantStatus,
} from "../../services/restaurantService";

const DashboardScreen = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);
  const { theme } = useTheme();
  const { showAlert } = useAlert();

  const [restaurant, setRestaurant] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const fetchRestaurantData = async () => {
    try {
      // Find the restaurant associated with the logged-in user
      const restaurantResponse = await getRestaurantDetails(
        userInfo.restaurantId
      );
      setRestaurant(restaurantResponse.data);

      // Get restaurant analytics
      const analyticsResponse = await getRestaurantAnalytics(
        restaurantResponse.data._id
      );
      setAnalytics(analyticsResponse.data);

      // Get recent orders
      const ordersResponse = await getOrders();
      setRecentOrders(ordersResponse.data.slice(0, 5));

      // Get count of pending orders
      const pendingOrdersCount = ordersResponse.data.filter(
        (order) => order.status === ORDER_STATUSES.PENDING
      ).length;
      setPendingOrders(pendingOrdersCount);

      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.log("Error fetching restaurant data:", error);
      showAlert("error", "Failed to load restaurant data");
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRestaurantData();
  };

  const handleToggleStatus = async () => {
    setShowStatusModal(false);
    setStatusLoading(true);

    try {
      const response = await toggleRestaurantStatus(restaurant._id);
      setRestaurant(response.data);

      const statusText =
        response.data.status === RESTAURANT_STATUSES.OPEN ? "open" : "closed";
      showAlert("success", `Restaurant is now ${statusText}`);
    } catch (error) {
      console.log("Error toggling restaurant status:", error);
      showAlert("error", "Failed to update restaurant status");
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  if (loading) {
    return <Loader fullScreen message='Loading restaurant data...' />;
  }

  if (!restaurant) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header title='Dashboard' />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            Failed to load restaurant data. Please try again.
          </Text>
          <Button
            title='Retry'
            onPress={fetchRestaurantData}
            type='primary'
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = () => {
    switch (restaurant.status) {
      case RESTAURANT_STATUSES.OPEN:
        return theme.colors.success;
      case RESTAURANT_STATUSES.CLOSED:
        return theme.colors.error;
      case RESTAURANT_STATUSES.BUSY:
        return theme.colors.warning;
      default:
        return theme.colors.gray;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title='Dashboard' />

      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Restaurant Status Card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={[styles.restaurantName, { color: theme.colors.text }]}>
              {restaurant.name}
            </Text>
            <Badge
              text={restaurant.status.toUpperCase()}
              type={
                restaurant.status === RESTAURANT_STATUSES.OPEN
                  ? "success"
                  : "error"
              }
            />
          </View>

          <View style={styles.statusDetails}>
            <View style={styles.statusItem}>
              <Ionicons name='location' size={18} color={theme.colors.gray} />
              <Text style={[styles.statusText, { color: theme.colors.gray }]}>
                {restaurant.address}
              </Text>
            </View>

            <View style={styles.statusItem}>
              <Ionicons name='star' size={18} color={theme.colors.warning} />
              <Text style={[styles.statusText, { color: theme.colors.gray }]}>
                {restaurant.averageRating?.toFixed(1) || "No ratings"} (
                {restaurant.ratingCount || 0} reviews)
              </Text>
            </View>
          </View>

          <Button
            title={`Set as ${
              restaurant.status === RESTAURANT_STATUSES.OPEN ? "CLOSED" : "OPEN"
            }`}
            onPress={() => setShowStatusModal(true)}
            type={
              restaurant.status === RESTAURANT_STATUSES.OPEN
                ? "danger"
                : "success"
            }
            loading={statusLoading}
          />
        </Card>

        {/* Orders Overview */}
        <Card>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Orders Overview
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Orders")}
              style={styles.viewAllButton}
            >
              <Text
                style={[styles.viewAllText, { color: theme.colors.primary }]}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stats Overview Component */}
          <StatsOverview
            pendingOrders={pendingOrders}
            totalOrders={analytics?.totalOrders || 0}
            totalRevenue={analytics?.totalRevenue || 0}
          />

          {/* Pending Orders Button */}
          {pendingOrders > 0 && (
            <Button
              title={`View ${pendingOrders} Pending Order${
                pendingOrders > 1 ? "s" : ""
              }`}
              onPress={() =>
                navigation.navigate("Orders", { initialFilter: "pending" })
              }
              style={styles.pendingButton}
            />
          )}
        </Card>

        {/* Revenue Chart */}
        <Card>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Revenue (Last 7 Days)
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Analytics")}
              style={styles.viewAllButton}
            >
              <Text
                style={[styles.viewAllText, { color: theme.colors.primary }]}
              >
                Details
              </Text>
            </TouchableOpacity>
          </View>

          <RevenueChart data={analytics?.salesByDay?.slice(-7) || []} />
        </Card>

        {/* Recent Orders */}
        <Card>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Recent Orders
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Orders")}
              style={styles.viewAllButton}
            >
              <Text
                style={[styles.viewAllText, { color: theme.colors.primary }]}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {recentOrders.length > 0 ? (
            <View style={styles.ordersList}>
              {recentOrders.map((order) => (
                <RecentOrderItem
                  key={order._id}
                  order={order}
                  onPress={() =>
                    navigation.navigate("OrderDetail", { orderId: order._id })
                  }
                />
              ))}
            </View>
          ) : (
            <Text style={[styles.noOrders, { color: theme.colors.gray }]}>
              No recent orders
            </Text>
          )}
        </Card>
      </ScrollView>

      {/* Status Toggle Confirmation Modal */}
      <Modal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title='Change Restaurant Status'
      >
        <Text style={[styles.modalText, { color: theme.colors.text }]}>
          Are you sure you want to set your restaurant as
          {restaurant?.status === RESTAURANT_STATUSES.OPEN
            ? " CLOSED"
            : " OPEN"}
          ?
        </Text>
        <Text style={[styles.modalSubtext, { color: theme.colors.gray }]}>
          {restaurant?.status === RESTAURANT_STATUSES.OPEN
            ? "Your restaurant will stop receiving new orders."
            : "Your restaurant will start receiving new orders."}
        </Text>

        <View style={styles.modalButtons}>
          <Button
            title='Cancel'
            type='secondary'
            onPress={() => setShowStatusModal(false)}
            style={styles.modalButton}
          />
          <Button
            title='Confirm'
            type={
              restaurant?.status === RESTAURANT_STATUSES.OPEN
                ? "danger"
                : "success"
            }
            onPress={handleToggleStatus}
            style={styles.modalButton}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 16,
  },
  statusCard: {
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusDetails: {
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  viewAllButton: {
    padding: 4,
  },
  viewAllText: {
    fontSize: 14,
  },
  pendingButton: {
    marginTop: 12,
  },
  ordersList: {
    marginTop: 8,
  },
  noOrders: {
    textAlign: "center",
    padding: 16,
    fontSize: 14,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtext: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    minWidth: 120,
  },
});

export default DashboardScreen;
