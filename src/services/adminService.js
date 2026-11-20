
import api from "./api";

export const adminLogin = async (credentials) => {
    const response = await api.post("/Auth/login", credentials);
    return response.data;
};

export const getAdminProfile = async (accessToken) => {
    const response = await api.get("/Auth/admin-profile", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    return response.data;
};


export const getAdminDashboard = async () => {
    const response = await api.get("/AdminDashboard/dashboard");
    return response.data;
};


export const getAdminProducts = async (params = {}) => {
    const response = await api.get("/AdminProduct", {
        params
    });
    return response.data;
};

export const getAdminProductById = async (id) => {
    const response = await api.get(`/AdminProduct/${id}`);
    return response.data;
};

export const addAdminProduct = async (productData) => {
    const response = await api.post("/AdminProduct", productData);
    return response.data;
};

export const updateAdminProduct = async (id, productData) => {
    const response = await api.put(`/AdminProduct/${id}`, productData);
    return response.data;
};

export const deleteAdminProduct = async (id) => {
    const response = await api.delete(`/AdminProduct/${id}`);
    return response.data;
};


export const getAdminOrders = async (params = {}) => {
    const response = await api.get("/AdminOrder", {
        params
    });

    return response.data;
};

export const getAdminOrderById = async (id) => {
    const response = await api.get(`/AdminOrder/${id}`);

    return response.data;
};

export const getAdminOrderDetails = async (id) => {
    const response = await api.get(`/AdminOrder/${id}/details`);

    return response.data;
};

export const updateAdminOrderStatus = async (id, status) => {
    const response = await api.put(
        `/AdminOrder/${id}/status`,
        { status }
    );

    return response.data;
};


export const getAdminUsers = async (search = "") => {
    const response = await api.get("/AdminUser", {
        params: { search }
    });

    return response.data;
};

export const getAdminUserById = async (id) => {
    const response = await api.get(`/AdminUser/${id}`);

    return response.data;
};


export const toggleBlockUser = async (id) => {
    const response = await api.put(`/AdminUser/${id}/toggle-block`);
    return response.data;
};



