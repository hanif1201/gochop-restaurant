import api from "./api";

export const getMenuItems = async (restaurantId) => {
  try {
    const response = await api.get("/api/menu", {
      params: { restaurant: restaurantId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMenuItem = async (menuItemId) => {
  try {
    const response = await api.get(`/api/menu/${menuItemId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createMenuItem = async (menuItemData) => {
  try {
    const response = await api.post("/api/menu", menuItemData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMenuItem = async (menuItemId, menuItemData) => {
  try {
    const response = await api.put(`/api/menu/${menuItemId}`, menuItemData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMenuItem = async (menuItemId) => {
  try {
    const response = await api.delete(`/api/menu/${menuItemId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const toggleMenuItemAvailability = async (menuItemId) => {
  try {
    const response = await api.put(
      `/api/menu/${menuItemId}/toggle-availability`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
