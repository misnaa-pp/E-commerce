
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getOrders,
  getOrderById,
  updateOrder,
  checkoutOrder,
} from "../../services/orderService";
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async () => {
    return await getOrders();
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (id) => {
    return await getOrderById(id);
  }
);

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (checkoutData) => {
    return await checkoutOrder(checkoutData);
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (id) => {
    return await updateOrder(id);
  }
);

const orderSlice = createSlice({
  name: "orders",

  initialState: {
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })

      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
      })

      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(cancelOrder.pending, (state) => {
        state.error = null;
      })

      .addCase(cancelOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload;

        const index = state.orders.findIndex(
          (order) => order.orderId === updatedOrder.orderId
        );

        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }

        if (
          state.selectedOrder?.orderId === updatedOrder.orderId
        ) {
          state.selectedOrder = updatedOrder;
        }
      })

      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { clearOrderError } = orderSlice.actions;

export default orderSlice.reducer;
