import axios from 'axios';
import { ApiResponse, LoginResponseData, User } from '../types';

/**
 * Resolve the API base URL.
 * Priority:
 * 1. import.meta.env.VITE_API_BASE_URL (standard)
 * 2. import.meta.env.VITE_API_URL (backward compatibility)
 * 3. Production build fallback to deployed Render backend
 * 4. Local development default to '/api' (proxied by Vite to http://localhost:5000)
 *
 * Normalizes input to ensure endpoints combine correctly without duplicate '/api/api'.
 */
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

  if (envUrl) {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    if (trimmed.endsWith('/api')) {
      return trimmed;
    }
    return `${trimmed}/api`;
  }

  // Fallback for production deployment if environment variable is omitted at build time
  if (import.meta.env.PROD) {
    return 'https://infinite-tutorial-1.onrender.com/api';
  }

  // Default for local development with Vite dev server proxy
  return '/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('it_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginApi = async (identifier: string, password: string): Promise<ApiResponse<LoginResponseData>> => {
  const response = await api.post<ApiResponse<LoginResponseData>>('/auth/login', {
    identifier,
    password,
  });
  return response.data;
};

export const logoutApi = async (): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>('/auth/logout');
  return response.data;
};

export const getMeApi = async (): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>('/auth/me');
  return response.data;
};

export default api;
