import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Set base URL
axios.defaults.baseURL = API_URL;

// Food APIs
export const foodAPI = {
  getAll: (params) => axios.get('/foods', { params }),
  getById: (id) => axios.get(`/foods/${id}`),
  create: (data) => axios.post('/foods', data),
  update: (id, data) => axios.put(`/foods/${id}`, data),
  delete: (id) => axios.delete(`/foods/${id}`)
};

// Category APIs
export const categoryAPI = {
  getAll: () => axios.get('/categories'),
  getById: (id) => axios.get(`/categories/${id}`),
  create: (data) => axios.post('/categories', data),
  update: (id, data) => axios.put(`/categories/${id}`, data),
  delete: (id) => axios.delete(`/categories/${id}`)
};

// Order APIs
export const orderAPI = {
  create: (data) => axios.post('/orders', data),
  getMyOrders: () => axios.get('/orders/myorders'),
  getById: (id) => axios.get(`/orders/${id}`),
  getAll: () => axios.get('/orders'),
  updateStatus: (id, status) => axios.put(`/orders/${id}/status`, { orderStatus: status }),
  cancel: (id) => axios.put(`/orders/${id}/cancel`),
  assignRider: (id, riderId) => axios.put(`/orders/${id}/assign-rider`, { riderId }),
  getRiderOrders: () => axios.get('/orders/rider/my-deliveries'),
  updateDeliveryStatus: (id, status) => axios.put(`/orders/${id}/delivery-status`, { orderStatus: status })
};

// Review APIs
export const reviewAPI = {
  create: (data) => axios.post('/reviews', data),
  getMyReviews: () => axios.get('/reviews/myreviews'),
  getAll: () => axios.get('/reviews'),
  getByFood: (foodId) => axios.get(`/reviews/food/${foodId}`),
  delete: (id) => axios.delete(`/reviews/${id}`)
};

// User APIs (Admin)
export const userAPI = {
  getAll: () => axios.get('/users'),
  getById: (id) => axios.get(`/users/${id}`),
  update: (id, data) => axios.put(`/users/${id}`, data),
  delete: (id) => axios.delete(`/users/${id}`)
};

// Rider APIs (Admin)
export const riderAPI = {
  getAll: () => axios.get('/riders'),
  create: (data) => axios.post('/riders', data),
  getById: (id) => axios.get(`/riders/${id}`),
  update: (id, data) => axios.put(`/riders/${id}`, data),
  delete: (id) => axios.delete(`/riders/${id}`)
};
export default axios;
