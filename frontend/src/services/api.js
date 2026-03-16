import axios from 'axios';

// Use environment variable or default to localhost:4000
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for sending/receiving JWT cookies
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '');
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status}`, response.data);
    }
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        success: false,
        message: 'Network error. Please check your connection.'
      });
    }

    const { status, data } = error.response;
    const message = data?.message || 'Something went wrong';

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error (${status}):`, message, error.response.data);
    }

    // Handle unauthorized errors (token expired)
    if (status === 401) {
      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Handle forbidden errors
    if (status === 403) {
      console.error('Access forbidden:', message);
    }

    // Handle not found errors
    if (status === 404) {
      console.error('Resource not found:', message);
    }

    // Handle server errors
    if (status >= 500) {
      console.error('Server error:', message);
    }

    return Promise.reject({
      success: false,
      status,
      message,
      data: error.response.data
    });
  }
);

/**
 * AUTHENTICATION API
 */
export const authAPI = {
  // Register new user
  register: (userData) => API.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => API.post('/auth/login', credentials),
  
  // Logout user
  logout: () => API.post('/auth/logout'),
  
  // Get current user profile
  getMe: () => API.get('/auth/me'),
  
  // Update user profile
  updateProfile: (userData) => API.put('/auth/profile', userData),
  
  // Change password
  changePassword: (passwordData) => API.put('/auth/change-password', passwordData),
};

/**
 * STALLS API
 */
export const stallAPI = {
  // Find stalls near user location
  getNearby: (lat, lon, maxDistance = 10000) => 
    API.get(`/stalls/nearby?lat=${lat}&lon=${lon}&maxDistance=${maxDistance}`),
  
  // Get all stalls with optional filters
  getAll: (category, isActive, limit = 50) => {
    let url = '/stalls';
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (isActive !== undefined) params.append('isActive', isActive);
    if (limit) params.append('limit', limit);
    if (params.toString()) url += `?${params.toString()}`;
    return API.get(url);
  },
  
  // Search stalls by text
  search: (query) => API.get(`/stalls/search?q=${query}`),
  
  // Get single stall by ID
  getById: (id) => API.get(`/stalls/${id}`),

  // Create new stall (admin)
  create: (stallData) => API.post('/stalls', stallData),

  // Update stall (admin)
  update: (id, stallData) => API.put(`/stalls/${id}`, stallData),

  // Delete stall (admin)
  delete: (id) => API.delete(`/stalls/${id}`),
  
  // Toggle stall active status (admin)
  toggleActive: (id) => API.patch(`/stalls/${id}/toggle`),
  
  // Get stall statistics (admin)
  getStats: (id) => API.get(`/stalls/${id}/stats`),
};

/**
 * BOOKINGS API
 */
export const bookingAPI = {
  // Create new booking
  create: (bookingData) => API.post('/bookings', bookingData),
  
  // Get user's bookings
  getUserBookings: () => API.get('/bookings/user'),
  
  // Get single booking by ID
  getById: (id) => API.get(`/bookings/${id}`),
  
  // Cancel booking
  cancelBooking: (id, reason) => API.put(`/bookings/${id}/cancel`, { reason }),
  
  // Get booking QR code
  getQRCode: (id) => API.get(`/bookings/${id}/qrcode`, { responseType: 'blob' }),
  
  // Admin: Get all bookings with pagination
  getAllBookings: (page = 1, limit = 10, status, date) => {
    let url = `/bookings/admin/all?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (date) url += `&date=${date}`;
    return API.get(url);
  },
  
  // Admin: Update booking status
  updateStatus: (id, status) => API.put(`/bookings/${id}/status`, { status }),
  
  // Admin: Get booking statistics
  getStats: () => API.get('/bookings/admin/stats'),
};

/**
 * USER API (Admin only)
 */
export const userAPI = {
  // Get all users (admin)
  getAllUsers: (page = 1, limit = 10) => 
    API.get(`/users?page=${page}&limit=${limit}`),
  
  // Get user by ID (admin)
  getUserById: (id) => API.get(`/users/${id}`),
  
  // Update user (admin)
  updateUser: (id, userData) => API.put(`/users/${id}`, userData),
  
  // Delete user (admin)
  deleteUser: (id) => API.delete(`/users/${id}`),
  
  // Get user statistics (admin)
  getStats: () => API.get('/users/stats'),
};

/**
 * DASHBOARD API
 */
export const dashboardAPI = {
  // Get user dashboard stats
  getUserStats: () => API.get('/dashboard/user-stats'),
  
  // Get admin dashboard stats
  getAdminStats: () => API.get('/dashboard/admin-stats'),
  
  // Get recent activity
  getRecentActivity: (limit = 10) => API.get(`/dashboard/recent-activity?limit=${limit}`),
};

/**
 * UTILITY FUNCTIONS
 */

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token') && !!localStorage.getItem('user');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Check if current user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

// Clear auth data
export const clearAuth = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Format error message
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return 'An unexpected error occurred';
};

export default API;