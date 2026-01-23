import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { protectedRoutes } from './protectedRoutes';
import { publicRoutes } from './publicRoutes';

export const router = createBrowserRouter([publicRoutes, authRoutes, protectedRoutes]);
