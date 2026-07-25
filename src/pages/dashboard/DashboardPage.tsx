import { useQuery } from "@tanstack/react-query";
import {
    Package,
    UserCheck as TrainerIcon,
    TrendingUp,
    Users,
    DollarSign,
} from "lucide-react";
import React, { useState } from "react";
import AnalyticsChart from "../../components/charts/AnalyticsChart";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import api from "../../services/api";
import { ChartData, DashboardStats } from "../../types";
import { QUERY_KEYS } from "../../utils/constants";
import { formatNumber } from "../../utils/helpers";

type ChartPeriod = "monthly" | "weekly" | "quarterly" | "yearly";

const DashboardPage: React.FC = () => {
    const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("monthly");

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: [QUERY_KEYS.DASHBOARD_STATS],
        queryFn: async () => {
            const response = await api.get("/dashboard/stats");
            return response.data.data as DashboardStats;
        },
    });

    // Dummy data generation
    const getDummyData = (period: ChartPeriod): ChartData[] => {
        const dummyData: Record<ChartPeriod, ChartData[]> = {
            monthly: [
                { name: "Jan", value: 2400 },
                { name: "Feb", value: 1398 },
                { name: "Mar", value: 9800 },
                { name: "Apr", value: 3908 },
                { name: "May", value: 4800 },
                { name: "Jun", value: 3800 },
                { name: "Jul", value: 4300 },
                { name: "Aug", value: 2400 },
                { name: "Sep", value: 1398 },
                { name: "Oct", value: 9800 },
                { name: "Nov", value: 3908 },
                { name: "Dec", value: 4800 },
            ],
            weekly: [
                { name: "Mon", value: 4000 },
                { name: "Tue", value: 3000 },
                { name: "Wed", value: 2000 },
                { name: "Thu", value: 2780 },
                { name: "Fri", value: 1890 },
                { name: "Sat", value: 2390 },
                { name: "Sun", value: 3490 },
            ],
            quarterly: [
                { name: "Q1", value: 14000 },
                { name: "Q2", value: 13980 },
                { name: "Q3", value: 9800 },
                { name: "Q4", value: 13908 },
            ],
            yearly: [
                { name: "2023", value: 24000 },
                { name: "2024", value: 13980 },
                { name: "2025", value: 9800 },
                { name: "2026", value: 13908 },
            ],
        };
        return dummyData[period];
    };

    const chartData = getDummyData(chartPeriod);
    const chartLoading = false;

    if (statsLoading) {
        return <LoadingSpinner size="lg" className="h-64" />;
    }

    const statCards = [
        {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            growth: stats?.monthlyGrowth.users || 0,
            icon: Users,
            color: "text-blue-600",
        },
        {
            title: "Active Members",
            value: stats?.activeUsers || 0,
            growth: 0,
            icon: Users,
            color: "text-green-600",
        },
        {
            title: "Pending Fees",
            value: stats?.pendingFeesCount || 0,
            growth: 0,
            icon: DollarSign,
            color: "text-red-600",
        },
        {
            title: "Total Trainers",
            value: stats?.totalTrainers || 0,
            growth: stats?.monthlyGrowth.trainers || 0,
            icon: TrainerIcon,
            color: "text-indigo-600",
        },
        {
            title: "Total Products",
            value: stats?.totalProducts || 0,
            growth: stats?.monthlyGrowth.products || 0,
            icon: Package,
            color: "text-purple-600",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">
                    Welcome back! Here's what's happening with your platform.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {statCards.map((stat, index) => (
                    <Card key={index}>
                        <div className="flex items-center">
                            <div
                                className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}
                            >
                                <stat.icon
                                    className={`h-6 w-6 ${stat.color}`}
                                />
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-500 truncate uppercase tracking-wider">
                                    {stat.title}
                                </p>
                                <div className="flex items-baseline">
                                    <p className="text-xl font-bold text-gray-900">
                                        {formatNumber(stat.value)}
                                    </p>
                                    {stat.growth > 0 && (
                                        <div className="ml-1.5 flex items-center">
                                            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                                            <span className="text-xs text-green-600 font-semibold ml-0.5">
                                                +{stat.growth}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>


            {/* Analytics Chart */}
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Analytics Overview
                    </h2>
                    <div className="flex space-x-2">
                        {(
                            [
                                "monthly",
                                "weekly",
                                "quarterly",
                                "yearly",
                            ] as ChartPeriod[]
                        ).map((period) => (
                            <button
                                key={period}
                                onClick={() => setChartPeriod(period)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                    chartPeriod === period
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                {period.charAt(0).toUpperCase() +
                                    period.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {chartLoading ? (
                    <LoadingSpinner size="lg" className="h-64" />
                ) : (
                    <AnalyticsChart
                        data={chartData || []}
                        type="area"
                        height={400}
                        color="#3B82F6"
                    />
                )}
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Products
                    </h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="flex items-center space-x-3"
                            >
                                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        Product {item}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Published 2 hours ago
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Registrations
                    </h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="flex items-center space-x-3"
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        User {item}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Joined 1 hour ago
                                    </p>
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
