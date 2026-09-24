export type Role = 'ADMIN' | 'TEACHER' | 'PARENT';

export interface User {
  id: string;
  phone: string;
  email?: string | null;
  role: Role;
  name: string;
  mustChangePassword?: boolean;
}

export interface LoginResponseData {
  token: string;
  user: User;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
