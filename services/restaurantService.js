import api from "./api";

export const getRestaurantDetails = async (restaurantId) => {
  try {
    const response = await api.get(`/api/restaurants/${restaurantId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRestaurantDetails = async (restaurantId, details) => {
  try {
    const response = await api.put(`/api/restaurants/${restaurantId}`, details);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const toggleRestaurantStatus = async (restaurantId) => {
  try {
    const response = await api.put(
      `/api/restaurants/${restaurantId}/toggle-status`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRestaurantAnalytics = async (
  restaurantId,
  period = "30days"
) => {
  try {
    const response = await api.get(
      `/api/restaurants/${restaurantId}/analytics?period=${period}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
