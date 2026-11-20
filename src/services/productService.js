
import api from "./api";

export const getProducts = async (params = {}) => {
    const response = await api.get("/Product", {
        params: {
            pageNumber: 1,
            pageSize: 8,
            ...params
        }
    });

    return {
        products: response.data.items.map(product => ({
            ...product,
            id: product.productId
        })),
        pageNumber: response.data.pageNumber,
        pageSize: response.data.pageSize,
        totalCount: response.data.totalCount,
        totalPages: response.data.totalPages
    };
};

export const getProductById = async (id) => {
    const response = await api.get(`/Product/${id}`);

    return {
        ...response.data,
        id: response.data.productId
    };
};


export const addProduct = async (product) => {
    const response = await api.post("/AdminProduct", product);
    return {
        ...response.data,
        id: response.data.productId
    };
};

export const updateProduct = async (id, product) => {
    const response = await api.put(`/AdminProduct/${id}`, product);
    return {
        ...response.data,
        id: response.data.productId
    };
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/AdminProduct/${id}`);
    return response.data;
};

