

import { createSlice } from "@reduxjs/toolkit";

const storedAuth = JSON.parse(
    localStorage.getItem("authData") || "null"
);

const authSlice = createSlice({
    name: "auth",

    initialState: {
        user: storedAuth?.user || null,
        accessToken: storedAuth?.accessToken || null,
        refreshToken: storedAuth?.refreshToken || null,
        isAuthenticated: !!storedAuth?.accessToken,
    },

    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;

            localStorage.setItem(
                "authData",
                JSON.stringify(action.payload)
            );
        },

        updateTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;

            localStorage.setItem(
                "authData",
                JSON.stringify({
                    user: state.user,
                    accessToken: state.accessToken,
                    refreshToken: state.refreshToken
                })
            );
        },

        updateUser: (state, action) => {
            state.user = action.payload;

            localStorage.setItem(
                "authData",
                JSON.stringify({
                    user: state.user,
                    accessToken: state.accessToken,
                    refreshToken: state.refreshToken
                })
            );
        },

        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;

            localStorage.removeItem("authData");
        },
    },
});

export const {
    login,
    logout,
    updateTokens,
    updateUser
} = authSlice.actions;

export default authSlice.reducer;
