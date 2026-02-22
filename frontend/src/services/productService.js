import api from './api';

export const productService = {
  getAllProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  updateStock: async (stockData) => {
    const response = await api.put('/products/stock/update', stockData);
    return response.data;
  },

  getStockSummary: async () => {
    const response = await api.get('/products/stock-summary');
    return response.data;
  },

  getLowStock: async (threshold = 10) => {
    const response = await api.get('/products', { params: { lowStock: true, threshold } });
    return response.data;
  },

  searchProducts: async (searchTerm) => {
    const response = await api.get('/products', { params: { search: searchTerm } });
    return response.data;
  },
};

export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export const godownService = {
  getAllGodowns: async () => {
    const response = await api.get('/godowns');
    return response.data;
  },

  getGodownById: async (id) => {
    const response = await api.get(`/godowns/${id}`);
    return response.data;
  },

  createGodown: async (godownData) => {
    const response = await api.post('/godowns', godownData);
    return response.data;
  },

  updateGodown: async (id, godownData) => {
    const response = await api.put(`/godowns/${id}`, godownData);
    return response.data;
  },

  deleteGodown: async (id) => {
    const response = await api.delete(`/godowns/${id}`);
    return response.data;
  },
};
