import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Header from "../../components/common/Header";
import ListItem from "../../components/common/ListItem";
import Loader from "../../components/common/Loader";
import { RESTAURANT_STATUSES } from "../../config";
import { useAlert } from "../../context/AlertContext";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getUserProfile } from "../../services/authService";
import { toggleRestaurantStatus } from "../../services/restaurantService";

const ProfileScreen = ({ navigation }) => {
  const { theme, darkMode, toggleTheme } = useTheme();
  const { showAlert } = useAlert();
  const { userInfo, signOut } = useContext(AuthContext);

  const [restaurant, setRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchProfileData = async () => {
    try {
      // Get user profile (which includes restaurant details)
      const userResponse = await getUserProfile();
      setUser(userResponse.data);

      // Set restaurant from the user profile response
      if (userResponse.data.restaurant) {
        setRestaurant(userResponse.data.restaurant);
      } else {
        showAlert("error", "Restaurant details not found");
      }

      setLoading(false);
    } catch (error) {
      console.log("Error fetching profile data:", error);
      showAlert("error", "Failed to load profile data");
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!restaurant?._id) {
      showAlert("error", "Restaurant ID not found");
      return;
    }

    setStatusLoading(true);

    try {
      const response = await toggleRestaurantStatus(restaurant._id);
      if (response.data) {
        setRestaurant(response.data);
        const statusText =
          response.data.status === RESTAURANT_STATUSES.OPEN ? "Open" : "Closed";
        showAlert("success", `Restaurant is now ${statusText}`);
      } else {
        throw new Error("No data received from server");
      }
    } catch (error) {
      console.log("Error toggling restaurant status:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update restaurant status";
      showAlert("error", errorMessage);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            signOut();
            showAlert("success", "You have been logged out");
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return <Loader fullScreen message='Loading profile...' />;
  }

  if (!restaurant) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header title='Profile' />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            Restaurant details not found. Please contact support.
          </Text>
          <Button
            title='Retry'
            onPress={fetchProfileData}
            type='primary'
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title='Profile' />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Restaurant Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <Text
                style={[styles.restaurantName, { color: theme.colors.text }]}
              >
                {restaurant?.name || "Restaurant Name Not Available"}
              </Text>
              <Badge
                text={(restaurant?.status || "closed").toUpperCase()}
                type={
                  restaurant?.status === RESTAURANT_STATUSES.OPEN
                    ? "success"
                    : "error"
                }
                style={styles.statusBadge}
              />
            </View>

            <View style={styles.ratingContainer}>
              <Ionicons name='star' size={18} color={theme.colors.warning} />
              <Text style={[styles.ratingText, { color: theme.colors.text }]}>
                {restaurant?.averageRating?.toFixed(1) || "0"} (
                {restaurant?.ratingCount || 0})
              </Text>
            </View>
          </View>

          {/* Restaurant Toggle Status */}
          <View style={styles.toggleContainer}>
            <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>
              Restaurant Open/Closed
            </Text>
            <Switch
              value={restaurant.status === RESTAURANT_STATUSES.OPEN}
              onValueChange={handleToggleStatus}
              disabled={statusLoading}
              trackColor={{
                false: "#D1D1D6",
                true: theme.colors.success + "80",
              }}
              thumbColor={
                restaurant.status === RESTAURANT_STATUSES.OPEN
                  ? theme.colors.success
                  : "#F4F3F4"
              }
            />
          </View>

          {/* Restaurant Address */}
          <View style={styles.addressContainer}>
            <Ionicons
              name='location-outline'
              size={20}
              color={theme.colors.gray}
              style={styles.addressIcon}
            />
            <Text style={[styles.addressText, { color: theme.colors.gray }]}>
              {restaurant.address}
            </Text>
          </View>

          <Button
            title='Edit Restaurant Profile'
            onPress={() => navigation.navigate("EditProfile", { restaurant })}
            type='primary'
            style={styles.editButton}
          />
        </Card>

        {/* Admin Info */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Admin Account
          </Text>

          <View style={styles.userInfoContainer}>
            <View
              style={[
                styles.avatarContainer,
                { backgroundColor: theme.colors.primary + "20" },
              ]}
            >
              <Text
                style={[styles.avatarText, { color: theme.colors.primary }]}
              >
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: theme.colors.text }]}>
                {user.name}
              </Text>
              <Text style={[styles.userEmail, { color: theme.colors.gray }]}>
                {user.email}
              </Text>
              <Text style={[styles.userPhone, { color: theme.colors.gray }]}>
                {user.phone}
              </Text>
            </View>
          </View>
        </Card>

        {/* Settings List */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Settings
          </Text>

          {/* App Settings */}
          <ListItem
            title='App Settings'
            subtitle='Theme, notifications, language'
            leftIcon='settings-outline'
            onPress={() => {}} // Not implemented in this demo
          />

          {/* Dark Mode Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Ionicons
                name='moon-outline'
                size={22}
                color={theme.colors.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleTheme}
              trackColor={{
                false: "#D1D1D6",
                true: theme.colors.primary + "80",
              }}
              thumbColor={darkMode ? theme.colors.primary : "#F4F3F4"}
            />
          </View>

          {/* Support */}
          <ListItem
            title='Support'
            subtitle='Get help, contact us'
            leftIcon='help-buoy-outline'
            onPress={() => {}} // Not implemented in this demo
          />

          {/* Privacy Policy */}
          <ListItem
            title='Privacy Policy'
            subtitle='View our privacy policy'
            leftIcon='shield-checkmark-outline'
            onPress={() => {}} // Not implemented in this demo
          />

          {/* Terms & Conditions */}
          <ListItem
            title='Terms & Conditions'
            subtitle='View our terms and conditions'
            leftIcon='document-text-outline'
            onPress={() => {}} // Not implemented in this demo
          />

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: theme.colors.gray }]}>
              App Version: 1.0.0
            </Text>
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          title='Logout'
          onPress={handleLogout}
          type='danger'
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
    marginRight: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEEEEE",
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  addressIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  editButton: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  settingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  versionContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  versionText: {
    fontSize: 14,
  },
  logoutButton: {
    marginTop: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 16,
  },
});

export default ProfileScreen;
