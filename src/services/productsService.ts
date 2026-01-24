import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PaginatedResponse, Product } from '../types';
import { QUERY_KEYS } from '../utils/constants';
import api from './api';

interface ProductQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
}

export const useProducts = (params: ProductQueryParams = {}) => {
    return useQuery<PaginatedResponse<Product>>({
        queryKey: [QUERY_KEYS.PRODUCTS, params],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    searchParams.append(key, value.toString());
                }
            });

            const response = await api.get(`/products?${searchParams.toString()}`);
            return response.data.data as PaginatedResponse<Product>;
        },
        staleTime: 30 * 1000,
        placeholderData: (previousData) => previousData,
    });
};

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.PRODUCT_DETAIL, id],
        queryFn: async () => {
            const response = await api.get(`/products/${id}`);
            return response.data.data as Product;
        },
        enabled: !!id,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productData: Partial<Product>) => {
            const response = await api.post('/products', productData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
            toast.success('Product created successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create product');
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...productData }: Partial<Product> & { id: string }) => {
            const response = await api.put(`/products/${id}`, productData);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCT_DETAIL, variables.id] });
            toast.success('Product updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update product');
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/products/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
            toast.success('Product deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete product');
        },
    });
};
