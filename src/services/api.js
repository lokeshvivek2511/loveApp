import axios from "axios";

// ✅ Use environment variable for API URL (Works with Vite & Netlify)
const API_URL = import.meta.env.VITE_API_URL || "https://loveappbackend.netlify.app/api";

// ✅ Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 🔹 Auth API calls
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    localStorage.setItem("token", response.data.token); // ✅ Save token after login
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    localStorage.setItem("token", response.data.token); // ✅ Save token after register
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🔹 Gallery API calls
export const getAllGalleryItems = async () => {
  try {
    const response = await api.get("/gallery");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addGalleryItem = async (itemData) => {
  try {
    const response = await api.post("/gallery", itemData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGalleryItem = async (id, itemData) => {
  try {
    const response = await api.put(`/gallery/${id}`, itemData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGalleryItem = async (id) => {
  try {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🔹 Calendar API calls
export const getAllCalendarEvents = async () => {
  try {
    const response = await api.get("/calendar");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addCalendarEvent = async (eventData) => {
  try {
    const response = await api.post("/calendar", eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCalendarEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/calendar/${id}`, eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCalendarEvent = async (id) => {
  try {
    const response = await api.delete(`/calendar/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🔹 Quotes API calls
export const getAllQuotes = async () => {
  try {
    const response = await api.get("/quotes");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addQuote = async (quoteData) => {
  try {
    const response = await api.post("/quotes", quoteData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateQuote = async (id, quoteData) => {
  try {
    const response = await api.put(`/quotes/${id}`, quoteData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteQuote = async (id) => {
  try {
    const response = await api.delete(`/quotes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🔹 Logout Function
export const logout = () => {
  localStorage.removeItem("token"); // ✅ Remove token on logout
};
