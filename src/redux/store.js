import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/AuthSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import orderReducer from "./slices/orderSlice";
import adminReducer from "./slices/adminSlice";
import userReducer from "./slices/userSlice";


export const store = configureStore({
  reducer: {
    products: productReducer,
    auth : authReducer,
    cart : cartReducer,
    wishlist : wishlistReducer,
    orders : orderReducer,
    admin: adminReducer,
    users: userReducer,
  },
});
