import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PaginatedResponse, Transaction } from '../types';
import { QUERY_KEYS } from '../utils/constants';
import api from './api';

export interface TransactionQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    userId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export interface CreateTransactionPayload {
    userId: string;
    amount: number;
    paymentDate?: string;
    startDate?: string;
    endDate?: string;
    durationMonths?: number;
    paymentMethod?: string;
    notes?: string;
}

export interface PaginatedTransactionsResponse extends PaginatedResponse<Transaction> {
    totalRevenue?: number;
}

export const useTransactions = (params: TransactionQueryParams = {}) => {
    return useQuery({
        queryKey: [QUERY_KEYS.TRANSACTIONS, params],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    searchParams.append(key, value.toString());
                }
            });

            const response = await api.get(`/transactions?${searchParams.toString()}`);
            return response.data.data as PaginatedTransactionsResponse;
        },
    });
};

export const useUserTransactions = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.TRANSACTIONS, 'user', userId],
        queryFn: async () => {
            if (!userId) return [];
            const response = await api.get(`/transactions/user/${userId}`);
            return response.data.data as Transaction[];
        },
        enabled: !!userId,
    });
};

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateTransactionPayload) => {
            const response = await api.post('/transactions', payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
            toast.success('Payment recorded & membership renewed!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to record payment');
        },
    });
};
