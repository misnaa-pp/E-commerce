
import api from "./api";

export const getWishlist = async () => {
    const response = await api.get("/Wishlist");

    return response.data.map(item => ({
        ...item,
        id: item.productId,
        images: item.imageUrl ? [item.imageUrl] : []
    }));
};

export const addWishlistItem = async (productId) => {
    const response = await api.post(
        `/Wishlist/${productId}`
    );

    return response.data;
};

export const removeWishlistItem = async (productId) => {
    const response = await api.delete(
        `/Wishlist/${productId}`
    );

    return response.data;
};