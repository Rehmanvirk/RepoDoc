// frontend/src/api/axiosClient.js

import axios from 'axios';
// --- FIX: Move this import to the top ---
import { useAuthStore } from '../store/authStore'; 

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

axiosClient.interceptors.request.use(
  (config) => {
    // Now useAuthStore is correctly defined here
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;

// --- FIX: Remove the old import from the bottom ---