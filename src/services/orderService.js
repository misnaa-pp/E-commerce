
import api from "./api";

export const getOrders = async () => {
  const response = await api.get("/Order");
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/Order/${id}`);
  return response.data;
};

export const checkoutOrder = async (checkoutData) => {
  const response = await api.post("/Order/checkout", checkoutData);
  return response.data;
};

export const updateOrder = async (id) => {
  const response = await api.put(`/Order/${id}/cancel`);
  return response.data;
};
