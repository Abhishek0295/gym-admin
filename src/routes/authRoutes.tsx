import { Navigate } from 'react-router-dom';
import { lazy } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import Loadable from '../utils/Loadable';

const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
const ForgotPasswordPage = Loadable(lazy(() => import('../pages/auth/ForgotPasswordPage')));

export const authRoutes = {
    path: '/',
    element: <AuthLayout />,
    children: [
        { path: 'login', element: <LoginPage /> },
        { path: 'forgot-password', element: <ForgotPasswordPage /> },
        { path: '', element: <Navigate to="/dashboard" replace /> },
    ],
};
