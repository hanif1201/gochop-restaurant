// App.js - Main app component with navigation setup
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { AlertProvider } from "./context/AlertContext";
import { AuthContext } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Auth screens
import ForgotPasswordScreen from "./screens/auth/ForgotPasswordScreen";
import LoginScreen from "./screens/auth/LoginScreen";

// Main app screens
import AlertNotification from "./components/common/AlertNotification";
import AnalyticsScreen from "./screens/analytics/AnalyticsScreen";
import DashboardScreen from "./screens/dashboard/DashboardScreen";
import AddMenuItemScreen from "./screens/menu/AddMenuItemScreen";
import EditMenuItemScreen from "./screens/menu/EditMenuItemScreen";
import MenuScreen from "./screens/menu/MenuScreen";
import OrderDetailScreen from "./screens/orders/OrderDetailScreen";
import OrdersScreen from "./screens/orders/OrdersScreen";
import EditProfileScreen from "./screens/profile/EditProfileScreen";
import ProfileScreen from "./screens/profile/ProfileScreen";
import SplashScreen from "./screens/SplashScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Orders") {
            iconName = focused ? "receipt" : "receipt-outline";
          } else if (route.name === "Menu") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Analytics") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FD6A00",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name='Dashboard' component={DashboardScreen} />
      <Tab.Screen name='Orders' component={OrdersNavigator} />
      <Tab.Screen name='Menu' component={MenuNavigator} />
      <Tab.Screen name='Analytics' component={AnalyticsScreen} />
      <Tab.Screen name='Profile' component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

// Orders Stack Navigator
const OrdersStack = createNativeStackNavigator();
const OrdersNavigator = () => {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name='OrdersList' component={OrdersScreen} />
      <OrdersStack.Screen name='OrderDetail' component={OrderDetailScreen} />
    </OrdersStack.Navigator>
  );
};

// Menu Stack Navigator
const MenuStack = createNativeStackNavigator();
const MenuNavigator = () => {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name='MenuList' component={MenuScreen} />
      <MenuStack.Screen name='AddMenuItem' component={AddMenuItemScreen} />
      <MenuStack.Screen name='EditMenuItem' component={EditMenuItemScreen} />
    </MenuStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStack = createNativeStackNavigator();
const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name='ProfileMain' component={ProfileScreen} />
      <ProfileStack.Screen name='EditProfile' component={EditProfileScreen} />
    </ProfileStack.Navigator>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const authContext = {
    signIn: async (token, user, refreshToken) => {
      setIsLoading(true);
      try {
        if (!token || !user || !refreshToken) {
          console.error("Missing required data for sign in:", {
            token,
            user,
            refreshToken,
          });
          throw new Error("Missing required data for sign in");
        }

        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        await AsyncStorage.setItem("userInfo", JSON.stringify(user));
        setUserToken(token);
        setUserInfo(user);
      } catch (e) {
        console.error("Error signing in:", e);
        throw e; // Re-throw to handle in the login screen
      } finally {
        setIsLoading(false);
      }
    },
    signOut: async () => {
      setIsLoading(true);
      try {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("refreshToken");
        await AsyncStorage.removeItem("userInfo");
        setUserToken(null);
        setUserInfo(null);
      } catch (e) {
        console.log("Error signing out:", e);
      }
      setIsLoading(false);
    },
    userToken,
    userInfo,
  };

  useEffect(() => {
    // Check if user is logged in
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const userInfoString = await AsyncStorage.getItem("userInfo");

        if (token && userInfoString) {
          setUserToken(token);
          setUserInfo(JSON.parse(userInfoString));
        }
      } catch (e) {
        console.log("Error restoring token:", e);
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return (
      <ThemeProvider>
        <SplashScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AlertProvider>
        <AuthContext.Provider value={authContext}>
          <NavigationContainer>
            <StatusBar barStyle='dark-content' backgroundColor='#fff' />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {userToken === null ? (
                // Auth screens
                <Stack.Group>
                  <Stack.Screen name='Login' component={LoginScreen} />
                  <Stack.Screen
                    name='ForgotPassword'
                    component={ForgotPasswordScreen}
                  />
                </Stack.Group>
              ) : (
                // App screens
                <Stack.Screen name='Main' component={TabNavigator} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
          <AlertNotification />
        </AuthContext.Provider>
      </AlertProvider>
    </ThemeProvider>
  );
}
