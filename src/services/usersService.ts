import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PaginatedResponse, User } from '../types';
import { QUERY_KEYS } from '../utils/constants';
import api from './api';

interface UserQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    feesPaid?: string;
}

export const useUsers = (params: UserQueryParams = {}) => {
    return useQuery({
        queryKey: [QUERY_KEYS.USERS, params],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    searchParams.append(key, value.toString());
                }
            });

            const response = await api.get(`/users?${searchParams.toString()}`);
            return response.data.data as PaginatedResponse<User>;
        },
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: Partial<User>) => {
            const response = await api.post('/users', userData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
            toast.success('Member added successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add member');
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
            const response = await api.put(`/users/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
            toast.success('Member updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update member');
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
            toast.success('Member deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete member');
        },
    });
};

export const useSendAlert = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.post(`/users/${id}/send-alert`);
            return response.data.data as {
                phone: string;
                whatsappMessage: string;
                smsMessage: string;
                whatsappUrl: string;
                autoSent?: boolean;
                autoSendError?: string;
            };
        },
        onSuccess: (data) => {
            if (data.autoSent) {
                toast.success('WhatsApp alert sent automatically!');
            } else {
                toast.success('Alert template generated!');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to send alert');
        },
    });
};
