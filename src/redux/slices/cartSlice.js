
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    getCart as getCartService,
    addCartItem,
    updateCartItem,
    removeCartItem
} from "../../services/cartService";

export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async () => {
        return await getCartService();
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (product) => {
        await addCartItem(
            product.id,
            product.size,
            product.quantity || 1
        );

        return await getCartService();
    }
);

export const updateCartQuantity = createAsyncThunk(
    "cart/updateQuantity",
    async ({ id, size, quantity }) => {
        await updateCartItem(id, size, quantity);

        return await getCartService();
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async ({ id, size }) => {
        await removeCartItem(id, size);

        return { id, size };
    }
);

const cartSlice = createSlice({
    name: "cart",

    initialState: {
        items: [],
        loading: false,
        error: null
    },

    reducers: {
        clearCart: (state) => {
            state.items = [];
        }
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })

            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload;
            })

            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.items = action.payload;
            })

            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    item =>
                        !(item.id === action.payload.id &&
                          item.size === action.payload.size)
                );
            });
    }
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
