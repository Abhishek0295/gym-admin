import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PaginatedResponse, Trainer } from '../types';
import { QUERY_KEYS } from '../utils/constants';
import api from './api';

interface TrainerQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

export const useTrainers = (params: TrainerQueryParams = {}) => {
    return useQuery({
        queryKey: [QUERY_KEYS.TRAINERS, params],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    searchParams.append(key, value.toString());
                }
            });

            const response = await api.get(`/trainers?${searchParams.toString()}`);
            return response.data.data as PaginatedResponse<Trainer>;
        },
    });
};

export const useTrainer = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.TRAINERS, id],
        queryFn: async () => {
            const response = await api.get(`/trainers/${id}`);
            return response.data.data as Trainer;
        },
        enabled: !!id,
    });
};

export const useCreateTrainer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (trainerData: Partial<Trainer>) => {
            const response = await api.post('/trainers', trainerData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRAINERS] });
            toast.success('Trainer added successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add trainer');
        },
    });
};

export const useUpdateTrainer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const response = await api.put(`/trainers/${id}`, { status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRAINERS] });
            toast.success('Trainer updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update trainer');
        },
    });
};
