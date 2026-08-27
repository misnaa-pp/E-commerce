import {createAsyncThunk,createSlice,} from "@reduxjs/toolkit";
import {getUsers,updateUser as updateUserService,} from "../../services/UserService";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async () => {
    const users = await getUsers();
    return users;
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }) => {
    const updatedUser = await updateUserService( id, userData);
    return updatedUser;
  }
);


const userSlice = createSlice({
  name: "users",

  initialState: {
  users: [],
  loading: false,
  error: null,
},

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH USERS
      .addCase(
        fetchUsers.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchUsers.fulfilled,
        (state, action) => {
          state.loading = false;
          state.users = action.payload;
        }
      )

      .addCase(
        fetchUsers.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // UPDATE USER
      .addCase(
        updateUser.pending,
        (state) => {
          state.error = null;
        }
      )

      .addCase(
        updateUser.fulfilled,
        (state, action) => {
          const index =
            state.users.findIndex(
              (user) =>
                user.id ===
                action.payload.id
            );

          if (index !== -1) {
            state.users[index] =
              action.payload;
          }
        }
      )

      .addCase(
        updateUser.rejected,
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export default userSlice.reducer;