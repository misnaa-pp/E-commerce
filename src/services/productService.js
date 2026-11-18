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

    const product = response.data;

    return {
        ...product,
        id: product.productId
    };
};



export const addProduct = async(product) => {
    const response = await api.post("/products",product);
    return response.data
}

export const updateProduct = async(id,product) => {
    const response = await api.put(`/products/${id}`,product);
    return response.data
}

export const deleteProduct = async(id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data
}