
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  adminLogin as loginAdmin,
  getAdminProfile
} from "../../services/adminService";

export const adminLogin = createAsyncThunk(
  "admin/adminLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      // 1. Login and receive JWT tokens
      const authData = await loginAdmin(credentials);

      // 2. Fetch admin profile using the access token
      const admin = await getAdminProfile(authData.accessToken);

      // 3. Return admin details and tokens
      return {
        admin,
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Admin login failed"
      );
    }
  }
);

const savedAdmin = JSON.parse(
  localStorage.getItem("admin") || "null"
);

const adminSlice = createSlice({
  name: "admin",

  initialState: {
    admin: savedAdmin?.admin || null,
    accessToken: savedAdmin?.accessToken || null,
    refreshToken: savedAdmin?.refreshToken || null,
    isAuthenticated: !!savedAdmin?.accessToken,
    loading: false,
    error: null
  },

  reducers: {
    adminLogout: (state) => {
    state.admin = null;
    state.accessToken = null;
    state.refreshToken = null;
    state.isAuthenticated = false;
    state.error = null;

    localStorage.removeItem("admin");
    localStorage.removeItem("authData");
},

    clearAdminError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })


      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;

        state.admin = action.payload.admin;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;

        localStorage.setItem(
          "authData",
          JSON.stringify({
            user: action.payload.admin,
            accessToken: action.payload.accessToken,
            refreshToken: action.payload.refreshToken
          })
        );

        localStorage.setItem(
          "admin",
          JSON.stringify(action.payload)
        );
      })


      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  }
});

export const { adminLogout, clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
