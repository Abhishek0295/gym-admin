import { useMutation, useQuery } from '@tanstack/react-query';
import { loginUser, logoutUser } from '../store/authContext';
import api from '../services/api';
import { LoginCredentials, ResetPasswordData, User } from '../types';
import toast from 'react-hot-toast';

export const useAuth = () => {
  // const authContext = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // const response = await api.post('/auth/login', credentials);
      return {
        data: {
          user: {
            id: "string",
            username: "string",
            email: "string",
            role: "admin",
            createdAt: "string",
            updatedAt: "string",
          },
          token: 'token'
        }
      }
    },
    onSuccess: (data) => {
      loginUser(data.data.user, data.data.token);
      toast.success('Login successful!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await api.post('/auth/forgot-password', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset email sent!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    },
  });

  const logout = () => {
    logoutUser();
    toast.success('Logged out successfully');
  };

  return {
    login: loginMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isSendingResetEmail: forgotPasswordMutation.isPending,
  };
};