//	Auth headers auto-set
import axios from 'axios';
// Base API URL - matches your backend server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL:API_URL,
});

// Add Authorization header if token exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Handle auth errors and auto-logout on 401
API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  // Auth API endpoints
export const authAPI = {
    register: (userData) => API.post('/auth/register', userData),
    login: (credentials) => API.post('/auth/login', credentials),
    getMe: () => API.get('/auth/me'),
   
  };
// Listings API endpoints
export const listingsAPI = {
  getAll: (params = {}) => API.get('/listings', { params }),
  getById: (id) => API.get(`/listings/${id}`),
  create: (listingData) => API.post('/listings', listingData),
  update: (id, listingData) => API.put(`/listings/${id}`, listingData),
  delete: (id) => API.delete(`/listings/${id}`),
  //getByLandlord: (landlordId) => API.get(`/listings/landlord/${landlordId}`),
};

// Buildings API endpoints
export const buildingsAPI = {
  getAll: () => API.get('/buildings'),
  getById: (id) => API.get(`/buildings/${id}`),
  create: (buildingData) => API.post('/buildings', buildingData),
  update: (id, buildingData) => API.put(`/buildings/${id}`, buildingData),
  delete: (id) => API.delete(`/buildings/${id}`),
};

// Forum API endpoints
export const forumAPI = {
  getPosts: (buildingId) => API.get(`/forums/building/${buildingId}`),
  getPost: (postId) => API.get(`/forums/posts/${postId}`),
  createPost: (postData,buildingId) => API.post(`/forums/posts/${buildingId}`, postData),
  //updatePost: (postId, postData) => API.put(`/forums/posts/${postId}`, postData),
  deletePost: (postId) => API.delete(`/forums/posts/${postId}`),
  //addComment: (postId, commentData) => API.post(`/forums/posts/${postId}/comments`, commentData),
};

// Reviews API endpoints
export const reviewsAPI = {
  getAll: () => API.get('/reviews'),
  getByBuilding: (buildingId) => API.get(`/reviews/building/${buildingId}`),
  getByUser: (userId) => API.get(`/reviews/user/${userId}`),
  //create: (reviewData) => API.post('/reviews', reviewData),
  createForBuilding: (buildingId, reviewData) => API.post(`/reviews/building/${buildingId}`, reviewData),
  delete: (reviewId) => API.delete(`/reviews/${reviewId}`),
};

// Verification API endpoints (Admin only)
export const verificationAPI = {
  createVerificationRequest:()=>API.post("/verification"),
  getAllRequests: () => API.get('/verification'),
  submitVerification: (userId, verificationData) => API.put(`/verification/${userId}`, verificationData),
};

// Users API endpoints (Admin functionality)
export const usersAPI = {
  getAll: () => API.get('/users'),
  getById: (id) => API.get(`/users/${id}`),
  update: (id, userData) => API.put(`/users/${id}`, userData),
  delete: (id) => API.delete(`/users/${id}`),
};

export default API;  

