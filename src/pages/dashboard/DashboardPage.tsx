import { useQuery } from '@tanstack/react-query';
import { Package, UserCheck as TrainerIcon, TrendingUp, Users } from 'lucide-react';
import React, { useState } from 'react';
import AnalyticsChart from '../../components/charts/AnalyticsChart';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { ChartData, DashboardStats } from '../../types';
import { QUERY_KEYS } from '../../utils/constants';
import { formatNumber } from '../../utils/helpers';

type ChartPeriod = 'monthly' | 'weekly' | 'quarterly' | 'yearly';

const DashboardPage: React.FC = () => {
    const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('monthly');

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: [QUERY_KEYS.DASHBOARD_STATS],
        queryFn: async () => {
            const response = await api.get('/dashboard/stats');
            return response.data.data as DashboardStats;
        },
    });

    const { data: chartData, isLoading: chartLoading } = useQuery({
        queryKey: [QUERY_KEYS.DASHBOARD_STATS, 'chart', chartPeriod],
        queryFn: async () => {
            const response = await api.get(`/dashboard/chart?period=${chartPeriod}`);
            return response.data.data as ChartData[];
        },
    });

    if (statsLoading) {
        return <LoadingSpinner size="lg" className="h-64" />;
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            growth: stats?.monthlyGrowth.users || 0,
            icon: Users,
            color: 'text-blue-600',
        },
        {
            title: 'Total Trainers',
            value: stats?.totalTrainers || 0,
            growth: stats?.monthlyGrowth.trainers || 0,
            icon: TrainerIcon,
            color: 'text-green-600',
        },
        {
            title: 'Total Products',
            value: stats?.totalProducts || 0,
            growth: stats?.monthlyGrowth.products || 0,
            icon: Package,
            color: 'text-purple-600',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index}>
                        <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <div className="flex items-center">
                                    <p className="text-2xl font-bold text-gray-900">{formatNumber(stat.value)}</p>
                                    <div className="ml-2 flex items-center">
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-green-600 ml-1">+{stat.growth}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Analytics Chart */}
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Analytics Overview</h2>
                    <div className="flex space-x-2">
                        {(['monthly', 'weekly', 'quarterly', 'yearly'] as ChartPeriod[]).map((period) => (
                            <button
                                key={period}
                                onClick={() => setChartPeriod(period)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                    chartPeriod === period ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {period.charAt(0).toUpperCase() + period.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {chartLoading ? (
                    <LoadingSpinner size="lg" className="h-64" />
                ) : (
                    <AnalyticsChart data={chartData || []} type="area" height={400} color="#3B82F6" />
                )}
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Product {item}</p>
                                    <p className="text-xs text-gray-500">Published 2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">User {item}</p>
                                    <p className="text-xs text-gray-500">Joined 1 hour ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
