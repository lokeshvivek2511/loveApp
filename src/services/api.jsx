import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// Gallery API
export const getAllGalleryItems = () => api.get('/gallery');
export const addGalleryItem = (itemData) => api.post('/gallery', itemData);
export const updateGalleryItem = (id, itemData) => api.put(`/gallery/${id}`, itemData);
export const deleteGalleryItem = (id) => api.delete(`/gallery/${id}`);

// Quotes API
export const getAllQuotes = () => api.get('/quotes');
export const addQuote = (quoteData) => api.post('/quotes', quoteData);
export const updateQuote = (id, quoteData) => api.put(`/quotes/${id}`, quoteData);
export const deleteQuote = (id) => api.delete(`/quotes/${id}`);

// Calendar API
export const getAllCalendarEvents = () => api.get('/calendar');
export const addCalendarEvent = (eventData) => api.post('/calendar', eventData);
export const updateCalendarEvent = (id, eventData) => api.put(`/calendar/${id}`, eventData);
export const deleteCalendarEvent = (id) => api.delete(`/calendar/${id}`);

// Error handling wrapper
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with an error
    return error.response.data.message || 'An error occurred. Please try again.';
  } else if (error.request) {
    // Request was made but no response
    return 'Unable to connect to the server. Please check your connection.';
  } else {
    // Error in request setup
    return 'An error occurred while making the request.';
  }

  if (error.response) {
    // Server responded with error
    const message = error.response.data.message || 'An error occurred';
    throw new Error(message);
  } else if (error.request) {
    // Request made but no response
    throw new Error('No response from server');
  } else {
    // Request setup error
    throw new Error('Error setting up request');
  };
};

export default api;