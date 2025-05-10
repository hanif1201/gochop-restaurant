import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getOrders } from "../../services/orderService";
import { useTheme } from "../../context/ThemeContext";
import { useAlert } from "../../context/AlertContext";
import { ORDER_STATUSES } from "../../config";
import Header from "../../components/common/Header";
import OrderItem from "../../components/orders/OrderItem";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const OrdersScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { showAlert } = useAlert();

  const initialFilter = route.params?.initialFilter || "all";

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  // Define filter options
  const filterOptions = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending", status: ORDER_STATUSES.PENDING },
    { id: "preparing", label: "Preparing", status: ORDER_STATUSES.PREPARING },
    { id: "ready", label: "Ready", status: ORDER_STATUSES.READY_FOR_PICKUP },
    { id: "delivered", label: "Delivered", status: ORDER_STATUSES.DELIVERED },
    { id: "cancelled", label: "Cancelled", status: ORDER_STATUSES.CANCELLED },
  ];

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
      filterOrders(response.data, activeFilter);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.log("Error fetching orders:", error);
      showAlert("error", "Failed to load orders");
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const filterOrders = (allOrders, filter) => {
    if (filter === "all") {
      setFilteredOrders(allOrders);
      return;
    }

    const filterOption = filterOptions.find((option) => option.id === filter);

    if (filterOption && filterOption.status) {
      const filtered = allOrders.filter(
        (order) => order.status === filterOption.status
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(allOrders);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    filterOrders(orders, filter);
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  useEffect(() => {
    if (initialFilter !== activeFilter) {
      handleFilterChange(initialFilter);
    }
  }, [initialFilter]);

  if (loading) {
    return <Loader fullScreen message='Loading orders...' />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title='Orders' />

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterOptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === item.id && {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary,
                },
                { borderColor: theme.colors.border },
              ]}
              onPress={() => handleFilterChange(item.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      activeFilter === item.id ? "#fff" : theme.colors.text,
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filtersContent}
        />
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <OrderItem
            order={item}
            onPress={() =>
              navigation.navigate("OrderDetail", { orderId: item._id })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title='No Orders Found'
            message={`No ${
              activeFilter !== "all" ? activeFilter : ""
            } orders available at the moment.`}
            imageSource={require("../../assets/empty-orders.png")}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
});

export default OrdersScreen;
