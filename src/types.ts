export interface User {
  id?: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  message?: string;
  user?: User;
  token?: string;
  error?: string;
}

export interface SignupResponse {
  message?: string;
  user?: User;
  error?: string;
}

export type FormState = 'idle' | 'loading' | 'success' | 'error';
