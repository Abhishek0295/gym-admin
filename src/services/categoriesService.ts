import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { PaginatedResponse, Category } from "../types";
import { QUERY_KEYS } from "../utils/constants";

interface CategoryQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

export const useCategories = (params: CategoryQueryParams = {}) => {
    return useQuery({
        queryKey: [QUERY_KEYS.CATEGORIES, params],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== "") {
                    searchParams.append(key, value.toString());
                }
            });

            const response = await api.get(
                `/categories?${searchParams.toString()}`,
            );
            
            // Log for debugging (the user says it's coming but not showing)
            console.log("Categories API Response:", response.data);

            const rawData = response.data.data || response.data;
            
            // Handle different structure variants
            const categories = rawData.data || rawData.categories || (Array.isArray(rawData) ? rawData : []);
            const pagination = rawData.pagination || rawData;

            return {
                data: categories,
                total: pagination.total || categories.length,
                page: pagination.page || 1,
                limit: pagination.limit || 100,
                totalPages: pagination.totalPages || pagination.pages || 1
            } as PaginatedResponse<Category>;
        },
    });
};

export const fetchCategories = async (
    page: number,
    limit: number,
    search: string,
) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
    });
    const response = await api.get(`/categories?${params.toString()}`);
    const rawData = response.data.data || response.data;
    const categories = rawData.data || rawData.categories || (Array.isArray(rawData) ? rawData : []);
    const pagination = rawData.pagination || rawData;

    return {
        data: categories,
        total: pagination.total || categories.length,
        page: pagination.page || 1,
        limit: pagination.limit || 100,
        totalPages: pagination.totalPages || pagination.pages || 1
    } as PaginatedResponse<Category>;
};

export const toggleCategoryStatus = async (id: string, isActive: boolean) => {
    const response = await api.put(`/categories/${id}`, { isActive });
    return response.data;
};

export const deleteCategory = async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};
