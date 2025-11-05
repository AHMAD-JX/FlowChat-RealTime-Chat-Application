import { api } from '@/lib/api';

export interface RegisterData {
  username: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  countryCode?: string;
}

export interface LoginData {
  emailOrPhone: string;
  password: string;
}

export interface User {
  id: string;
  _id?: string; // Add _id for compatibility with backend
  username: string;
  email: string;
  phone?: string;
  countryCode?: string;
  avatar?: string;
  bio?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export const authService = {
  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      // Add _id for compatibility with chat system
      const user = { ...response.data.data.user, _id: response.data.data.user.id };
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  },

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      // Add _id for compatibility with chat system
      const user = { ...response.data.data.user, _id: response.data.data.user.id };
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  async getMe(): Promise<User> {
    const response = await api.get<{ success: boolean; data: { user: User } }>(
      '/auth/me'
    );
    return response.data.data.user;
  },

  // Update password
  async updatePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Promise<{ success: boolean; message: string; data: { token: string } }> {
    const response = await api.patch('/auth/update-password', data);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  // Check username availability
  async checkUsername(username: string): Promise<boolean> {
    const response = await api.get<{
      success: boolean;
      data: { available: boolean };
    }>(`/auth/check-username/${username}`);
    return response.data.data.available;
  },

  // Check email availability
  async checkEmail(email: string): Promise<boolean> {
    const response = await api.get<{
      success: boolean;
      data: { available: boolean };
    }>(`/auth/check-email/${email}`);
    return response.data.data.available;
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },

  // Get token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  // Update user profile
  async updateProfile(data: {
    bio?: string;
    avatar?: string;
  }): Promise<{ success: boolean; message: string; data: { user: User } }> {
    const response = await api.patch('/auth/update-profile', data);
    
    // Update localStorage with new user data
    if (response.data.data.user) {
      // Add _id for compatibility with chat system
      const user = { ...response.data.data.user, _id: response.data.data.user.id };
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  },

  // Upload avatar
  async uploadAvatar(file: File): Promise<{ success: boolean; message: string; data: { user: User } }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/auth/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Update localStorage with new user data
    if (response.data.data.user) {
      // Add _id for compatibility with chat system
      const user = { ...response.data.data.user, _id: response.data.data.user.id };
      localStorage.setItem('user', JSON.stringify(user));
    }

    return response.data;
  },
};

