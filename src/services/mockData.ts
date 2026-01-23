import { Category, ChartData, CMSPage, Commission, DashboardStats, Notification, Plan, Product, Trainer, Transaction } from '../types';

export const mockDashboardStats: DashboardStats = {
    totalUsers: 15234,
    totalTrainers: 1247,
    totalProducts: 3456,
    monthlyGrowth: {
        users: 12.5,
        trainers: 8.3,
        products: 15.7,
    },
};

export const mockChartData: ChartData[] = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
    { name: 'Aug', value: 4000 },
    { name: 'Sep', value: 3200 },
    { name: 'Oct', value: 2100 },
    { name: 'Nov', value: 3800 },
    { name: 'Dec', value: 4200 },
];

export const mockProducts: Product[] = [
    {
        id: '1',
        title: 'Whey Protein Isolate',
        brand: 'Optimum Nutrition',
        category: 'Protein',
        status: 'published',
        image: 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'High-quality whey protein isolate for muscle recovery.',
        price: 59.99,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z',
    },
    {
        id: '2',
        title: 'Micronized Creatine Powder',
        brand: 'MuscleTech',
        category: 'Supplements',
        status: 'draft',
        image: 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Pure micronized creatine for increased strength and power.',
        price: 29.99,
        createdAt: '2024-02-01T09:15:00Z',
        updatedAt: '2024-02-05T11:45:00Z',
    },
    {
        id: '3',
        title: 'Pre-Workout Energy Boost',
        brand: 'Cellucor',
        category: 'Supplements',
        status: 'pending',
        image: 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Ignite your workouts with explosive energy and focus.',
        price: 34.99,
        createdAt: '2024-02-10T14:20:00Z',
        updatedAt: '2024-02-12T16:00:00Z',
    },
];

export const mockTrainers: Trainer[] = [
    {
        id: '1',
        name: 'Emma Wilson',
        email: 'emma.wilson@example.com',
        status: 'approved',
        specialization: 'Bodybuilding',
        experience: '10 years',
        joinedAt: '2024-01-10T08:30:00Z',
    },
    {
        id: '2',
        name: 'David Rodriguez',
        email: 'david.rod@example.com',
        status: 'pending',
        specialization: 'Yoga & Pilates',
        experience: '5 years',
        joinedAt: '2024-02-15T12:45:00Z',
    },
    {
        id: '3',
        name: 'Lisa Chang',
        email: 'lisa.chang@example.com',
        status: 'suspended',
        specialization: 'CrossFit',
        experience: '7 years',
        joinedAt: '2024-01-25T16:20:00Z',
    },
];

export const mockCategories: Category[] = [
    {
        id: '1',
        name: 'Protein',
        description: 'Various types of protein supplements',
        isActive: true,
        isTopGenre: true,
        order: 1,
        createdAt: '2024-01-01T00:00:00Z',
    },
    {
        id: '2',
        name: 'Supplements',
        description: 'Vitamins, minerals, and other health supplements',
        isActive: true,
        isTopGenre: true,
        order: 2,
        createdAt: '2024-01-01T00:00:00Z',
    },
    {
        id: '3',
        name: 'Workout Gear',
        description: 'Equipment and clothing for your workouts',
        isActive: false,
        isTopGenre: false,
        createdAt: '2024-01-01T00:00:00Z',
    },
];

export const mockTransactions: Transaction[] = [
    {
        id: '1',
        userId: 'user-1',
        userName: 'John Doe',
        type: 'pay-in',
        amount: 59.99,
        status: 'completed',
        description: 'Product purchase - Whey Protein Isolate',
        createdAt: '2024-02-20T10:30:00Z',
    },
    {
        id: '2',
        userId: 'user-2',
        userName: 'Jane Smith',
        type: 'payout',
        amount: 150.0,
        status: 'pending',
        description: 'Trainer earnings payout',
        createdAt: '2024-02-19T15:45:00Z',
    },
    {
        id: '3',
        userId: 'user-3',
        userName: 'Bob Johnson',
        type: 'pay-in',
        amount: 99.99,
        status: 'failed',
        description: 'Membership purchase',
        createdAt: '2024-02-18T09:20:00Z',
    },
];

export const mockPlans: Plan[] = [
    {
        id: '1',
        name: 'Basic Plan',
        price: 9.99,
        features: ['Gym access', 'Monthly newsletter', 'Community access'],
        riftShardsConversion: 100,
        isActive: true,
    },
    {
        id: '2',
        name: 'Premium Plan',
        price: 19.99,
        features: ['24/7 access', 'Exclusive events', 'Priority support', 'Advanced coaching'],
        riftShardsConversion: 250,
        isActive: true,
    },
];

export const mockCommissions: Commission[] = [
    {
        id: '1',
        creatorPercentage: 70,
        platformPercentage: 30,
        effectiveFrom: '2024-01-01T00:00:00Z',
    },
];

export const mockCMSPages: CMSPage[] = [
    {
        id: '1',
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        content: 'This is the privacy policy content...',
        isPublished: true,
        lastModified: '2024-02-15T10:00:00Z',
    },
    {
        id: '2',
        title: 'Terms & Conditions',
        slug: 'terms-conditions',
        content: 'These are the terms and conditions...',
        isPublished: true,
        lastModified: '2024-02-10T14:30:00Z',
    },
    {
        id: '3',
        title: 'Contact Us',
        slug: 'contact-us',
        content: 'Contact information and form...',
        isPublished: true,
        lastModified: '2024-02-12T09:15:00Z',
    },
];

export const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'registration',
        title: 'New User Registration',
        message: 'A new user has registered on the platform',
        recipients: ['admin@example.com'],
        status: 'sent',
        createdAt: '2024-02-20T08:30:00Z',
    },
    {
        id: '2',
        type: 'publication',
        title: 'New Product Published',
        message: 'Whey Protein Isolate has been published',
        recipients: ['admin@example.com', 'editors@example.com'],
        status: 'pending',
        createdAt: '2024-02-19T16:45:00Z',
    },
];
