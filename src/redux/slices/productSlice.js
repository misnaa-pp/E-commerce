import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProducts, getProductById,
  addProduct as addProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from "../../services/productService";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const products = await getProducts();
    return products;
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id) => {
    const product = await getProductById(id);
    return product;
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product) => {
    const newProduct = await addProductService(product);
    return newProduct;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, product }) => {
    const updatedProduct = await updateProductService(id, product);
    return updatedProduct;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id) => { await deleteProductService(id);
  return id;
  }
);

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null;
      })

      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })

      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addProduct.pending,(state) => {
        state.loading = true;
        state.error = null;
      })

    .addCase(addProduct.fulfilled,(state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })

    .addCase(addProduct.rejected,(state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    .addCase(updateProduct.pending,(state) => {
        state.loading = true;
        state.error = null;
      })

    .addCase(updateProduct.fulfilled,(state, action) => {
        state.loading = false;
        const index = state.products.findIndex((product) =>
              product.id === action.payload.id );
        if (index !== -1) {
          state.products[index] =
            action.payload;
        }
      })

    .addCase(updateProduct.rejected,(state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    .addCase(deleteProduct.pending,(state) => {
        state.loading = true;
        state.error = null;
      })

    .addCase(deleteProduct.fulfilled,(state, action) => {
        state.loading = false;
        state.products = state.products.filter(
            (product) =>
              product.id !== action.payload);
      })

    .addCase(deleteProduct.rejected,(state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;