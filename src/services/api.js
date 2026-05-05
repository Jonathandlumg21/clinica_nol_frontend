import axios from 'axios';

const api = axios.create({
  baseURL: 'https://clinicanolbackend-production.up.railway.app',  // mientras trabajas en local
  // baseURL: 'https://tu-backend.railway.app/api',  // cuando subas a producción
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('clinica_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
