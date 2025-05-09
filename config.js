export const API_BASE_URL = "http://192.168.1.100:5000"; // Replace with your API URL

// Constants for the app
export const ORDER_STATUSES = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  PREPARING: "preparing",
  READY_FOR_PICKUP: "ready_for_pickup",
  ASSIGNED_TO_RIDER: "assigned_to_rider",
  PICKED_UP: "picked_up",
  ON_THE_WAY: "on_the_way",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const RESTAURANT_STATUSES = {
  OPEN: "open",
  CLOSED: "closed",
  BUSY: "busy",
};
