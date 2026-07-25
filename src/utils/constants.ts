export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export const ROUTES = {
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    DASHBOARD: "/dashboard",
    PRODUCTS: "/products",
    PRODUCT_DETAIL: "/products/:id",
    PRODUCT_EDIT: "/products/:id/edit",
    TRAINERS: "/trainers",
    TRAINER_REQUESTS: "/trainers/requests",
    USERS: "/users",
    CATEGORIES: "/categories",
    TRANSACTIONS: "/transactions",
    CURRENCY: "/currency",
    CMS: "/cms",
    NOTIFICATIONS: "/notifications",
    SETTINGS: "/settings",
    CONTACTS: "/contacts",
} as const;

export const QUERY_KEYS = {
    DASHBOARD_STATS: "dashboard-stats",
    PRODUCTS: "products",
    PRODUCT_DETAIL: "product-detail",
    TRAINERS: "trainers",
    TRAINER_REQUESTS: "trainer-requests",
    USERS: "users",
    SETTINGS: "settings",
    CATEGORIES: "categories",
    TRANSACTIONS: "transactions",
    PLANS: "plans",
    COMMISSIONS: "commissions",
    CMS_PAGES: "cms-pages",
    NOTIFICATIONS: "notifications",
    CONTACTS: "contacts",
    CONTACT_STATS: "contact-stats",
    USER_PROFILE: "user-profile",
} as const;

export const ITEMS_PER_PAGE = 10;

export const CHART_COLORS = {
    primary: "#3B82F6",
    secondary: "#10B981",
    accent: "#F59E0B",
    danger: "#EF4444",
    warning: "#F97316",
    info: "#06B6D4",
};

export const PRODUCT_STATUSES = [
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
] as const;

export const TRAINER_STATUSES = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "suspended", label: "Suspended" },
] as const;

export const TRANSACTION_TYPES = [
    { value: "pay-in", label: "Pay-in" },
    { value: "payout", label: "Payout" },
] as const;

export const NOTIFICATION_TYPES = [
    { value: "registration", label: "New Registration" },
    { value: "publication", label: "Product Publication" },
    { value: "payment", label: "Payment" },
    { value: "riftshards", label: "RiftShards Purchase" },
    { value: "report", label: "Report" },
] as const;
