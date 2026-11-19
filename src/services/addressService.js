

import api from "./api";

export const getAddresses = async () => {
    const response = await api.get("/Address");
    return response.data;
};

export const addAddress = async (addressData) => {
    const response = await api.post("/Address", addressData);
    return response.data;
};

export const updateAddress = async (id, addressData) => {
    const response = await api.put(`/Address/${id}`, addressData);
    return response.data;
};

export const deleteAddress = async (id) => {
    const response = await api.delete(`/Address/${id}`);
    return response.data;
};

export const setDefaultAddress = async (id) => {
    const response = await api.put(`/Address/${id}/default`);
    return response.data;
};
