import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Text,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  getMenuItems,
  toggleMenuItemAvailability,
} from "../../services/menuService";
import { useTheme } from "../../context/ThemeContext";
import { useAlert } from "../../context/AlertContext";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import MenuItem from "../../components/menu/MenuItem";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";

const MenuScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { showAlert } = useAlert();
  const { userInfo } = React.useContext(AuthContext);

  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchMenuItems = async () => {
    try {
      const response = await getMenuItems(userInfo.restaurantId);
      setMenuItems(response.data);
      setFilteredItems(response.data);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(response.data.map((item) => item.category)),
      ];
      setCategories(uniqueCategories);

      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.log("Error fetching menu items:", error);
      showAlert("error", "Failed to load menu items");
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMenuItems();
  };

  const handleToggleAvailability = async (menuItemId) => {
    try {
      const response = await toggleMenuItemAvailability(menuItemId);

      // Update the local state
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item._id === menuItemId
            ? { ...item, available: response.data.available }
            : item
        )
      );

      setFilteredItems((prevItems) =>
        prevItems.map((item) =>
          item._id === menuItemId
            ? { ...item, available: response.data.available }
            : item
        )
      );

      showAlert(
        "success",
        `Item ${response.data.available ? "available" : "unavailable"}`
      );
    } catch (error) {
      console.log("Error toggling item availability:", error);
      showAlert("error", "Failed to update item availability");
    }
  };

  const filterItems = () => {
    let filtered = menuItems;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  };

  useFocusEffect(
    useCallback(() => {
      fetchMenuItems();
    }, [])
  );

  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedCategory, menuItems]);

  if (loading) {
    return <Loader fullScreen message='Loading menu items...' />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header
        title='Menu'
        rightIcon='add-circle-outline'
        onRightPress={() => navigation.navigate("AddMenuItem")}
      />

      <View
        style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}
      >
        <Ionicons
          name='search'
          size={20}
          color={theme.colors.gray}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder='Search menu items...'
          placeholderTextColor={theme.colors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name='close-circle' size={20} color={theme.colors.gray} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { id: "all", name: "All" },
            ...categories.map((cat) => ({ id: cat, name: cat })),
          ]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.id && {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary,
                },
                { borderColor: theme.colors.border },
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === item.id ? "#fff" : theme.colors.text,
                  },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MenuItem
            item={item}
            onPress={() =>
              navigation.navigate("EditMenuItem", { menuItemId: item._id })
            }
            onToggleAvailability={() => handleToggleAvailability(item._id)}
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
            title='No Menu Items Found'
            message="You haven't added any menu items yet or there are no items matching your filter."
            imageSource={require("../../assets/empty-menu.png")}
            buttonTitle='Add New Item'
            onButtonPress={() => navigation.navigate("AddMenuItem")}
          />
        }
      />

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate("AddMenuItem")}
        >
          <Ionicons name='add' size={24} color='#fff' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 80, // Extra space for FAB
  },
  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MenuScreen;
