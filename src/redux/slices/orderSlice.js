import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
} from "../../services/orderService";

// Fetch all orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async () => {
    return await getOrders();
  }
);

// Fetch order by ID
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (id) => {
    return await getOrderById(id);
  }
);

// Place new order
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData) => {
    return await createOrder(orderData);
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (order) => {
    const updatedOrder = {
      ...order,
      status: "Cancelled",
    };

    return await updateOrder(order.id, updatedOrder);
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

      // Fetch orders
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

      // Fetch single order
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

      // Place order
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

      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.error = null;
      })

      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );

        if (index !== -1) {
          state.orders[index] = action.payload;
        }

        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })

      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { clearOrderError } = orderSlice.actions;

export default orderSlice.reducer;