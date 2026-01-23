import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { protectedRoutes } from './protectedRoutes';

export const router = createBrowserRouter([authRoutes, protectedRoutes]);
