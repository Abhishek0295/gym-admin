import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, toggleCategoryStatus, deleteCategory } from '../../services/categoriesService';
import { QUERY_KEYS } from '../../utils/constants';
import toast from 'react-hot-toast';

interface CategoryQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

// Fetch Categories
export const useCategories = (params: CategoryQueryParams = {}) => {
    return useQuery({
        queryKey: [QUERY_KEYS.CATEGORIES, params],
        queryFn: () => fetchCategories(params.page || 1, params.limit || 10, params.search || ''),
    });
};

// Toggle Category Active/Inactive
export const useToggleCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            toggleCategoryStatus(id, isActive),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
            toast.success('Category status updated successfully!');
        },
        onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to update category'),
    });
};

// Delete Category
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
            toast.success('Category deleted successfully!');
        },
        onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to delete category'),
    });
};
