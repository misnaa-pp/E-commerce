
import api from "./api";

export const createRazorpayOrder = async (orderId) => {
  const response = await api.post(
    "/Payment/create-order",
    null,
    {
      params: { orderId },
    }
  );

  return response.data;
};

export const verifyRazorpayPayment = async (paymentData) => {
  const response = await api.post(
    "/Payment/verify",
    paymentData
  );

  return response.data;
};
