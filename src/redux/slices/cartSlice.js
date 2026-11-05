
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: [],
  },

  reducers: {
    // ADD PRODUCT TO CART
    addToCart: (state, action) => {
      const product = action.payload;

      const stock = Number(product.stock) || 0;
      const requestedQuantity = Math.max(
        1,
        Number(product.quantity) || 1
      );

      // Prevent adding out-of-stock products
      if (stock <= 0) return;

      const existingItem = state.items.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        existingItem.stock = stock;

        existingItem.quantity = Math.min(
          existingItem.quantity + requestedQuantity,
          stock
        );
      } else {
        state.items.push({
          ...product,
          quantity: Math.min(requestedQuantity, stock),
          stock,
        });
      }
    },

    // REMOVE PRODUCT FROM CART
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    // INCREASE QUANTITY
    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.id === action.payload
      );

      if (item && item.quantity < item.stock) {
        item.quantity += 1;
      }
    },

    // DECREASE QUANTITY
    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.id === action.payload
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    // CLEAR CART
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
