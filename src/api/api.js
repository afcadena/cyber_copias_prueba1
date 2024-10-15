// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api', // URL base de tu backend
});

// Agregar un interceptor para incluir el token en todas las peticiones
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
