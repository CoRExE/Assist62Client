import axios from 'axios';
import { useAppStore } from '../store';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // TODO: Make this configurable
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAppStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;