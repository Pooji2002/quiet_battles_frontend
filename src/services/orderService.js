import api from "./api";

// Create a new order
export const createOrder = (orderData) =>
  api.post("/orders", orderData);

// Get logged-in user's orders
export const getMyOrders = () =>
  api.get("/orders/my-orders");

// Get a particular order
export const getOrderById = (orderId) =>
  api.get(`/orders/${orderId}`);

// Cancel an order
export const cancelOrder = (orderId) =>
  api.patch(`/orders/${orderId}/cancel`);