import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { GymSetting } from '../types';
import { QUERY_KEYS } from '../utils/constants';
import api from './api';

export const useSettings = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.SETTINGS],
        queryFn: async () => {
            const response = await api.get('/settings');
            return response.data.data as GymSetting;
        },
    });
};

export const useUpdateSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (settingsData: Partial<GymSetting>) => {
            const response = await api.put('/settings', settingsData);
            return response.data.data as GymSetting;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS] });
            toast.success('Gym settings updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update settings');
        },
    });
};
