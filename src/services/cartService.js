
import api from "./api";

export const getCart = async () => {
    const response = await api.get("/Cart");

    return response.data.map(item => ({
        ...item,
        id: item.productId,
        images: item.imageUrl ? [item.imageUrl] : []
    }));
};

export const addCartItem = async (productId, quantity = 1) => {
    const response = await api.post(
        `/Cart/${productId}`,
        null,
        {
            params: { quantity }
        }
    );

    return response.data;
};

export const updateCartItem = async (productId, quantity) => {
    const response = await api.put(
        `/Cart/${productId}`,
        null,
        {
            params: { quantity }
        }
    );

    return response.data;
};

export const removeCartItem = async (productId) => {
    const response = await api.delete(`/Cart/${productId}`);

    return response.data;
};
