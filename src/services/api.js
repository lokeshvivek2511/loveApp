import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
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

// Auth API calls
export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const register = (userData) => {
  return api.post('/auth/register', userData);
};

// Gallery API calls
export const getAllGalleryItems = () => {
  return api.get('/gallery');
};

export const addGalleryItem = (itemData) => {
  return api.post('/gallery', itemData);
};

export const updateGalleryItem = (id, itemData) => {
  return api.put(`/gallery/${id}`, itemData);
};

export const deleteGalleryItem = (id) => {
  return api.delete(`/gallery/${id}`);
};

// Calendar API calls
export const getAllCalendarEvents = () => {
  return api.get('/calendar');
};

export const addCalendarEvent = (eventData) => {
  return api.post('/calendar', eventData);
};

export const updateCalendarEvent = (id, eventData) => {
  return api.put(`/calendar/${id}`, eventData);
};

export const deleteCalendarEvent = (id) => {
  return api.delete(`/calendar/${id}`);
};

// Quotes API calls
export const getAllQuotes = () => {
  return api.get('/quotes');
};

export const addQuote = (quoteData) => {
  return api.post('/quotes', quoteData);
};

export const updateQuote = (id, quoteData) => {
  return api.put(`/quotes/${id}`, quoteData);
};

export const deleteQuote = (id) => {
  return api.delete(`/quotes/${id}`);
};