import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import Loadable from "../utils/Loadable";

// Lazy-loaded pages wrapped in Suspense
const DashboardPage = Loadable(
    lazy(() => import("../pages/dashboard/DashboardPage")),
);
const ProductsPage = Loadable(
    lazy(() => import("../pages/products/ProductsPage")),
);
const ProductDetailPage = Loadable(
    lazy(() => import("../pages/products/ProductDetailPage")),
);
const TrainersPage = Loadable(
    lazy(() => import("../pages/trainers/TrainersPage")),
);
const CategoriesPage = Loadable(
    lazy(() => import("../pages/categories/CategoriesPage")),
);
const TransactionsPage = Loadable(
    lazy(() => import("../pages/transactions/TransactionsPage")),
);
const CurrencyPage = Loadable(
    lazy(() => import("../pages/currency/CurrencyPage")),
);
const CMSPage = Loadable(lazy(() => import("../pages/cms/CMSPage")));
const NotificationsPage = Loadable(
    lazy(() => import("../pages/notifications/NotificationsPage")),
);
const SettingsPage = Loadable(
    lazy(() => import("../pages/settings/SettingsPage")),
);
const ContactsPage = Loadable(
    lazy(() => import("../pages/contacts/ContactsPage")),
);
const UsersPage = Loadable(
    lazy(() => import("../pages/users/UsersPage")),
);
const UserDetailPage = Loadable(
    lazy(() => import("../pages/users/UserDetailPage")),
);

export const protectedRoutes = {
    path: "/",
    element: (
        <ProtectedRoute>
            <AdminLayout />
        </ProtectedRoute>
    ),
    children: [
        { path: "dashboard", element: <DashboardPage /> },
        { path: "products", element: <ProductsPage /> },
        { path: "products/:id", element: <ProductDetailPage /> },
        { path: "products/:id/edit", element: <div>Product Edit Page</div> },
        { path: "trainers", element: <TrainersPage /> },
        {
            path: "trainers/requests",
            element: <div>Trainer Requests Page</div>,
        },
        { path: "users", element: <UsersPage /> },
        { path: "users/:id", element: <UserDetailPage /> },
        { path: "categories", element: <CategoriesPage /> },
        { path: "transactions", element: <TransactionsPage /> },
        { path: "currency", element: <CurrencyPage /> },
        { path: "cms", element: <CMSPage /> },
        { path: "notifications", element: <NotificationsPage /> },
        { path: "contacts", element: <ContactsPage /> },
        { path: "settings", element: <SettingsPage /> },
        { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
};
