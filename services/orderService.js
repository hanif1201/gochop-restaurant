import api from "./api";

export const getOrders = async (status = "") => {
  try {
    const response = await api.get("/api/orders", {
      params: status ? { status } : {},
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrder = async (orderId) => {
  try {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status, note = "") => {
  try {
    const response = await api.put(`/api/orders/${orderId}/status`, {
      status,
      note,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
