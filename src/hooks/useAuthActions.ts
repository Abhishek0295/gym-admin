import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../store/authContext';
import { LoginCredentials, ResetPasswordData, User } from '../types';

export const useAuthActions = () => {
    const { login: contextLogin, logout: contextLogout } = useAuth();

    const loginMutation = useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            // const response = await api.post('/auth/login', credentials);
            return {
                data: {
                    user: {
                        id: '1',
                        username: credentials.username,
                        email: 'test@example.com',
                        role: credentials.username === 'admin' ? 'admin' : 'user',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                    token: 'mock-token-' + Math.random(),
                },
            };
        },
        onSuccess: (data) => {
            contextLogin(data.data.user as User, data.data.token);
            toast.success('Login successful!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Login failed');
        },
    });

    const signupMutation = useMutation({
        mutationFn: async (data: any) => {
            // Mock signup
            return {
                data: {
                    user: {
                        id: '2',
                        username: data.username,
                        email: data.email,
                        role: 'user',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                    token: 'mock-token-signup',
                },
            };
        },
        onSuccess: (data) => {
            contextLogin(data.data.user as User, data.data.token);
            toast.success('Account created successfully!');
        },
        onError: (error: any) => {
            toast.error('Signup failed');
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
        contextLogout();
        toast.success('Logged out successfully');
    };

    return {
        login: loginMutation.mutate,
        signup: signupMutation.mutate,
        forgotPassword: forgotPasswordMutation.mutate,
        logout,
        isLoggingIn: loginMutation.isPending,
        isSigningUp: signupMutation.isPending,
        isSendingResetEmail: forgotPasswordMutation.isPending,
    };
};
