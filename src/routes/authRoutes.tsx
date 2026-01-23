import { lazy } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import Loadable from '../utils/Loadable';

const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
const SignupPage = Loadable(lazy(() => import('../pages/auth/SignupPage')));
const ForgotPasswordPage = Loadable(lazy(() => import('../pages/auth/ForgotPasswordPage')));

export const authRoutes = {
    path: '/',
    element: <AuthLayout />,
    children: [
        { path: 'login', element: <LoginPage /> },
        { path: 'signup', element: <SignupPage /> },
        { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
};
