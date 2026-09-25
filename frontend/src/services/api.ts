import axios from 'axios';
import { ApiResponse, LoginResponseData, User } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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
