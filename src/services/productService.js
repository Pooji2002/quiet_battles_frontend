import api from "./api";

export const getAllProducts = () => api.get("/products");

export const createProduct = (productData) =>
  api.post("/products", productData);

export const updateProduct = (id, productData) =>
  api.put(`/products/${id}`, productData);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);

export const getProductById = (id) =>
  api.get(`/products/${id}`);