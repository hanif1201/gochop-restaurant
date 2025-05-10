import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export const login = async (email, password) => {
  try {
    console.log("Login attempt with:", { email });
    const response = await api.post(
      "/api/auth/login",
      {
        email,
        password,
      },
      {
        headers: {
          "x-dashboard-type": "restaurant",
        },
      }
    );

    // Log the complete response including headers
    console.log("Complete login response:", {
      data: response.data,
      headers: response.headers,
      status: response.status,
    });

    // Store tokens in AsyncStorage from response data
    if (response.data.token) {
      await AsyncStorage.setItem("userToken", response.data.token);
    }
    if (response.data.refreshToken) {
      await AsyncStorage.setItem("refreshToken", response.data.refreshToken);
    }

    // If login is successful and we have a restaurantId, fetch restaurant details
    if (response.data.success && response.data.user?.restaurantId) {
      try {
        const restaurantResponse = await api.get(
          `/api/restaurants/${response.data.user.restaurantId}`
        );
        // Add restaurant details to user data
        response.data.user.restaurant = restaurantResponse.data.data;
      } catch (error) {
        console.error(
          "Error fetching restaurant details:",
          error.response?.data || error.message
        );
      }
    }

    // Store user info including restaurant details
    if (response.data.user) {
      await AsyncStorage.setItem(
        "userInfo",
        JSON.stringify(response.data.user)
      );
    }

    // Return the complete response data
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/api/auth/forgotpassword", {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (resetToken, password) => {
  try {
    const response = await api.put(`/api/auth/resetpassword/${resetToken}`, {
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    console.log("Fetching user profile...");
    const response = await api.get("/api/auth/me");
    console.log("User Profile Response:", {
      success: response.data.success,
      user: response.data.data,
      hasRestaurantId: !!response.data.data?.restaurantId,
      restaurantId: response.data.data?.restaurantId,
    });

    // Get the restaurantId from AsyncStorage (stored during login)
    const userInfo = await AsyncStorage.getItem("userInfo");
    const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;
    const restaurantId = parsedUserInfo?.restaurantId;

    // If we have a restaurantId, fetch the restaurant details
    if (restaurantId) {
      try {
        console.log("Fetching restaurant details for ID:", restaurantId);
        const restaurantResponse = await api.get(
          `/api/restaurants/${restaurantId}`
        );
        console.log("Restaurant details:", restaurantResponse.data);

        // Add restaurant details to the response
        response.data.data.restaurant = restaurantResponse.data.data;
        response.data.data.restaurantId = restaurantId;
      } catch (error) {
        console.error(
          "Error fetching restaurant details:",
          error.response?.data || error.message
        );
      }
    } else {
      console.warn("No restaurant ID found in user info");
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error in getUserProfile:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateUserDetails = async (details) => {
  try {
    console.log("Updating user details:", details);
    const response = await api.put("/api/auth/updatedetails", details);
    console.log("Update response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put("/api/auth/updatepassword", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
