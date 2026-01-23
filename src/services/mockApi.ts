// Mock API setup using axios interceptors
import { PaginatedResponse } from '../types';
import api from './api';
import {
    mockCategories,
    mockChartData,
    mockCMSPages,
    mockCommissions,
    mockDashboardStats,
    mockNotifications,
    mockPlans,
    mockProducts,
    mockTrainers,
    mockTransactions,
} from './mockData';

// Helper function to create paginated responses
function createPaginatedResponse<T>(
    data: T[],
    page: number = 1,
    limit: number = 10,
    searchTerm?: string,
    filterFn?: (item: T) => boolean
): PaginatedResponse<T> {
    let filteredData = data;

    if (filterFn) {
        filteredData = data.filter(filterFn);
    }

    if (searchTerm) {
        filteredData = filteredData.filter((item: any) =>
            Object.values(item).some((value) => typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);

    return {
        data: paginatedData,
        total: filteredData.length,
        page,
        limit,
        totalPages: Math.ceil(filteredData.length / limit),
    };
}

// Mock API responses
export const setupMockApi = () => {
    // Dashboard
    api.interceptors.response.use((response) => {
        const { url, method } = response.config;

        // Dashboard stats
        if (url?.includes('/dashboard/stats') && method === 'get') {
            return {
                ...response,
                data: { success: true, message: 'Stats retrieved', data: mockDashboardStats },
            };
        }

        // Chart data
        if (url?.includes('/dashboard/chart') && method === 'get') {
            return {
                ...response,
                data: { success: true, message: 'Chart data retrieved', data: mockChartData },
            };
        }

        // Products
        if (url?.includes('/products') && method === 'get' && !url.includes('/products/')) {
            const urlParams = new URLSearchParams(url.split('?')[1] || '');
            const page = parseInt(urlParams.get('page') || '1');
            const limit = parseInt(urlParams.get('limit') || '10');
            const search = urlParams.get('search') || '';
            const category = urlParams.get('category');
            const status = urlParams.get('status');

            const filterFn = (product: any) => {
                let matches = true;
                if (category) matches = matches && product.category === category;
                if (status) matches = matches && product.status === status;
                return matches;
            };

            const paginatedResponse = createPaginatedResponse(mockProducts, page, limit, search, filterFn);

            return {
                ...response,
                data: { success: true, message: 'Products retrieved', data: paginatedResponse },
            };
        }

        // Product detail
        if (url?.match(/\/products\/[\w-]+$/) && method === 'get') {
            const productId = url.split('/').pop();
            const product = mockProducts.find((p) => p.id === productId);

            return {
                ...response,
                data: { success: true, message: 'Product retrieved', data: product },
            };
        }

        // Trainers
        if (url?.includes('/trainers') && method === 'get') {
            const urlParams = new URLSearchParams(url.split('?')[1] || '');
            const page = parseInt(urlParams.get('page') || '1');
            const limit = parseInt(urlParams.get('limit') || '10');
            const search = urlParams.get('search') || '';
            const status = urlParams.get('status');

            const filterFn = status ? (trainer: any) => trainer.status === status : undefined;
            const paginatedResponse = createPaginatedResponse(mockTrainers, page, limit, search, filterFn);

            return {
                ...response,
                data: { success: true, message: 'Trainers retrieved', data: paginatedResponse },
            };
        }

        // Categories
        if (url?.includes('/categories') && method === 'get') {
            const urlParams = new URLSearchParams(url.split('?')[1] || '');
            const page = parseInt(urlParams.get('page') || '1');
            const limit = parseInt(urlParams.get('limit') || '10');
            const search = urlParams.get('search') || '';

            const paginatedResponse = createPaginatedResponse(mockCategories, page, limit, search);

            return {
                ...response,
                data: { success: true, message: 'Categories retrieved', data: paginatedResponse },
            };
        }

        // Transactions
        if (url?.includes('/transactions') && method === 'get') {
            const urlParams = new URLSearchParams(url.split('?')[1] || '');
            const page = parseInt(urlParams.get('page') || '1');
            const limit = parseInt(urlParams.get('limit') || '10');
            const search = urlParams.get('search') || '';
            const type = urlParams.get('type');

            const filterFn = type ? (transaction: any) => transaction.type === type : undefined;
            const paginatedResponse = createPaginatedResponse(mockTransactions, page, limit, search, filterFn);

            return {
                ...response,
                data: { success: true, message: 'Transactions retrieved', data: paginatedResponse },
            };
        }

        // Plans
        if (url?.includes('/plans') && method === 'get') {
            return {
                ...response,
                data: { success: true, message: 'Plans retrieved', data: mockPlans },
            };
        }

        // Commissions
        if (url?.includes('/commissions') && method === 'get') {
            return {
                ...response,
                data: { success: true, message: 'Commissions retrieved', data: mockCommissions },
            };
        }

        // CMS Pages
        if (url?.includes('/cms') && method === 'get') {
            return {
                ...response,
                data: { success: true, message: 'CMS pages retrieved', data: mockCMSPages },
            };
        }

        // Notifications
        if (url?.includes('/notifications') && method === 'get') {
            const urlParams = new URLSearchParams(url.split('?')[1] || '');
            const page = parseInt(urlParams.get('page') || '1');
            const limit = parseInt(urlParams.get('limit') || '10');

            const paginatedResponse = createPaginatedResponse(mockNotifications, page, limit);

            return {
                ...response,
                data: { success: true, message: 'Notifications retrieved', data: paginatedResponse },
            };
        }

        // Auth endpoints
        if (url?.includes('/auth/login') && method === 'post') {
            return {
                ...response,
                data: {
                    success: true,
                    message: 'Login successful',
                    data: {
                        user: {
                            id: '1',
                            username: 'admin',
                            email: 'admin@example.com',
                            role: 'admin',
                            createdAt: '2024-01-01T00:00:00Z',
                            updatedAt: '2024-01-01T00:00:00Z',
                        },
                        token: 'mock-jwt-token-123456789',
                    },
                },
            };
        }

        if (url?.includes('/auth/forgot-password') && method === 'post') {
            return {
                ...response,
                data: {
                    success: true,
                    message: 'Password reset email sent successfully',
                    data: null,
                },
            };
        }

        // Default success response for other requests
        return {
            ...response,
            data: { success: true, message: 'Operation successful', data: null },
        };
    });
};
