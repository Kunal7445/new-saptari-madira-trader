import api from './api';

export const orderService = {
  getAllOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

  getRecentOrders: async (limit = 10) => {
    const response = await api.get('/orders/recent', { params: { limit } });
    return response.data;
  },
};

export const customerService = {
  getAllCustomers: async (params = {}) => {
    const response = await api.get('/customers', { params });
    return response.data;
  },

  getCustomerById: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  deleteCustomer: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  searchCustomers: async (searchTerm) => {
    const response = await api.get('/customers', { params: { search: searchTerm } });
    return response.data;
  },
};

export const paymentService = {
  getAllPayments: async (params = {}) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  getPaymentsByCustomer: async (customerId) => {
    const response = await api.get(`/payments/customer/${customerId}`);
    return response.data;
  },

  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  updatePaymentStatus: async (id, status) => {
    const response = await api.put(`/payments/${id}/status`, { status });
    return response.data;
  },

  deletePayment: async (id) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },

  getPendingPayments: async () => {
    const response = await api.get('/payments/pending');
    return response.data;
  },

  getPaymentSummary: async () => {
    const response = await api.get('/payments/summary');
    return response.data;
  },
};

export const reportService = {
  getDashboardStats: async () => {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },

  getBalanceSheet: async (params = {}) => {
    const response = await api.get('/reports/balance-sheet', { params });
    return response.data;
  },

  getSalesReport: async (params = {}) => {
    const response = await api.get('/reports/sales', { params });
    return response.data;
  },

  getInventoryReport: async (params = {}) => {
    const response = await api.get('/reports/inventory', { params });
    return response.data;
  },

  getLowStockReport: async (params = {}) => {
    const response = await api.get('/reports/low-stock', { params });
    return response.data;
  },

  getCustomerReport: async () => {
    const response = await api.get('/reports/customers');
    return response.data;
  },
};
