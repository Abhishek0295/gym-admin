import api from '../services/api';
import { PaginatedResponse, Category } from '../types';

export const fetchCategories = async (page: number, limit: number, search: string) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
    });
    const response = await api.get(`/categories?${params.toString()}`);
    return response.data.data as PaginatedResponse<Category>;
};

export const toggleCategoryStatus = async (id: string, isActive: boolean) => {
    const response = await api.put(`/categories/${id}`, { isActive });
    return response.data;
};

export const deleteCategory = async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};
