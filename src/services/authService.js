
import api from "./api";


export const registerUser = async (userData) => {
    const response = await api.post("/Auth/register", userData);
    return response.data;
};


export const loginUser = async (credentials) => {
    const response = await api.post("/Auth/login", credentials);
    return response.data;
};



export const getMyProfile = async (accessToken) => {

    const response = await api.get("/Auth/profile", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    return response.data;
};


export const updateProfile = async (profileData) => {
    const response = await api.put("/Auth/profile", profileData);
    return response.data;
};




export const refreshToken = async (token) => {
    const response = await api.post("/Auth/refresh-token", {
        refreshToken: token
    });
    return response.data;
};


export const logoutUser = async (token) => {
    const response = await api.post("/Auth/logout", {
        refreshToken: token
    });
    return response.data;
};
