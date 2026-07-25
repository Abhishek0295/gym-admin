import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import toast from 'react-hot-toast';

export interface WhatsAppStatus {
    isReady: boolean;
    statusMessage: string;
    qrCodeDataUrl: string | null;
}

export const useWhatsAppStatus = (enabled = true) => {
    return useQuery({
        queryKey: ['whatsapp-status'],
        queryFn: async () => {
            const response = await api.get('/whatsapp/status');
            return response.data.data as WhatsAppStatus;
        },
        enabled,
        refetchInterval: (query) => {
            const data = query.state.data;
            // Poll every 3 seconds if unauthenticated so QR code live-refreshes and detects when scanned
            return data?.isReady ? 15000 : 3000;
        },
    });
};

export const useWhatsAppLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await api.post('/whatsapp/logout');
            return response.data;
        },
        onSuccess: () => {
            toast.success('WhatsApp device unlinked successfully');
            queryClient.invalidateQueries({ queryKey: ['whatsapp-status'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to unlink WhatsApp device');
        },
    });
};
