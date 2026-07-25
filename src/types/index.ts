export interface User {
    id: string;
    name: string;
    email?: string;
    role: string;
    phone?: string;
    address?: string;
    membershipCode?: string;
    membershipStatus?: "active" | "expired" | "inactive";
    feesPaid?: boolean;
    subscriptionExpiresAt?: string;
    membershipStartDate?: string;
    paymentDate?: string;
    paymentAmount?: number;
    profileImage?: string;
    createdAt: string;
    updatedAt: string;
}


export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: any; // Can be ID or populated object
    status: "published" | "draft" | "pending";
    image: string;
    createdAt: string;
    updatedAt: string;
}

export interface Trainer {
    id: string;
    name: string;
    email: string;
    status: "pending" | "approved" | "rejected" | "suspended";
    specialization: string;
    experience: string;
    joinedAt: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    isTopGenre: boolean;
    order?: number;
    createdAt: string;
}

export interface Transaction {
    id: string;
    userId: string;
    userName: string;
    userCode?: string;
    type?: "pay-in" | "payout";
    amount: number;
    paymentDate?: string;
    startDate?: string;
    endDate?: string;
    durationMonths?: number;
    paymentMethod?: string;
    status: "completed" | "pending" | "failed";
    description?: string;
    notes?: string;
    createdAt: string;
}

export interface Plan {
    id: string;
    name: string;
    price: number;
    features: string[];
    riftShardsConversion: number;
    isActive: boolean;
}

export interface Commission {
    id: string;
    creatorPercentage: number;
    platformPercentage: number;
    effectiveFrom: string;
}

export interface CMSPage {
    id: string;
    title: string;
    slug: string;
    content: string;
    isPublished: boolean;
    lastModified: string;
}

export interface Notification {
    id: string;
    type: "registration" | "publication" | "payment" | "riftshards" | "report";
    title: string;
    message: string;
    recipients: string[];
    status: "sent" | "pending" | "failed";
    createdAt: string;
}

export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    pendingFeesCount: number;
    totalTrainers: number;
    totalProducts: number;
    monthlyGrowth: {
        users: number;
        trainers: number;
        products: number;
    };
}

export interface GymSetting {
    id: string;
    gymName: string;
    gymPhone: string;
    gymEmail: string;
    whatsappTemplate: string;
    smsTemplate: string;
    updatedAt: string;
}


export interface ChartData {
    name: string;
    value: number;
    month?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface ResetPasswordData {
    email: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}
