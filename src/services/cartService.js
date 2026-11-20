
import api from "./api";

export const getCart = async () => {
    const response = await api.get("/Cart");

    return response.data.map(item => ({
        ...item,
        id: item.productId,
        images: item.imageUrl ? [item.imageUrl] : []
    }));
};

export const addCartItem = async (productId, size, quantity = 1) => {
    const response = await api.post(
        `/Cart/${productId}`,
        null,
        {
            params: { size, quantity }
        }
    );

    return response.data;
};

export const updateCartItem = async (productId, size, quantity) => {
    const response = await api.put(
        `/Cart/${productId}`,
        null,
        {
            params: { size, quantity }
        }
    );

    return response.data;
};

export const removeCartItem = async (productId, size) => {
    const response = await api.delete(
        `/Cart/${productId}`,
        {
            params: { size }
        }
    );

    return response.data;
};
