import {createAsyncThunk,createSlice,} from "@reduxjs/toolkit";
import { getAdmins } from "../../services/adminService";

export const adminLogin = createAsyncThunk(
  "admin/adminLogin",
  async ({ email, password }) => {
    try {
      const admins = await getAdmins();

      const admin = admins.find(
        (admin) =>
          admin.email === email &&
          admin.password === password);

      if (!admin) {
        throw new Error(
          "Invalid admin email or password"
        );
      }

      return admin;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Admin login failed"
      );
    }
  }
);

const savedAdmin = localStorage.getItem("admin");


const adminSlice = createSlice({
  name: "admin",
  initialState: {
  admin: savedAdmin
    ? JSON.parse(savedAdmin)
    : null,
  isAuthenticated: !!savedAdmin,
  loading: false,
  error: null,
},

  reducers: {
    adminLogout: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("admin");
    },

    clearAdminError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        adminLogin.fulfilled,
        (state, action) => {
          state.loading = false;
          state.admin = action.payload;
          state.isAuthenticated = true;
          state.error = null;

          localStorage.setItem(
            "admin",
            JSON.stringify(action.payload)
          );
        }
      )

      .addCase(
        adminLogin.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
          state.isAuthenticated = false;
        }
      );
  },
});

export const {adminLogout,clearAdminError,} = adminSlice.actions;
export default adminSlice.reducer;