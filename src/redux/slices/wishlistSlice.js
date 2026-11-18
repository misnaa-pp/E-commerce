
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    getWishlist as getWishlistService,
    addWishlistItem,
    removeWishlistItem
} from "../../services/wishlistService";

export const fetchWishlist = createAsyncThunk(
    "wishlist/fetchWishlist",
    async () => {
        return await getWishlistService();
    }
);

export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async (product) => {
        await addWishlistItem(product.id);
        return product;
    }
);

export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeFromWishlist",
    async (productId) => {
        await removeWishlistItem(productId);
        return productId;
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",

    initialState: {
        items: [],
        loading: false,
        error: null
    },

    reducers: {
        clearWishlist: (state) => {
            state.items = [];
        }
    },

    extraReducers: (builder) => {
        builder

            
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })

            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(addToWishlist.fulfilled, (state, action) => {
                const exists = state.items.some(
                    item => item.id === action.payload.id
                );

                if (!exists) {
                    state.items.push(action.payload);
                }
            })

            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    item => item.id !== action.payload
                );
            });
    }
});

export const { clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;