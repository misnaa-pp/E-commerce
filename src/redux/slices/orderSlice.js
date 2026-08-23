import {createAsyncThunk,createSlice,} from "@reduxjs/toolkit";
import {createOrder,getOrders,} from "../../services/orderService";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async () => {
    return await getOrders();
  }
);

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData) => {
    return await createOrder(orderData);
  }
);

const orderSlice = createSlice({
  name: "orders",

  initialState: {
   orders: [],
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

      .addCase(
        fetchOrders.fulfilled,
        (state, action) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )

      .addCase(fetchOrders.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        placeOrder.fulfilled,
        (state, action) => {
          state.loading = false;
          state.orders.unshift(action.payload);
        }
      )

      .addCase(
        placeOrder.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearOrderError } =
  orderSlice.actions;

export default orderSlice.reducer;