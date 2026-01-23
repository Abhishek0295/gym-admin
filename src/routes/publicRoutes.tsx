import { lazy } from 'react';
import LandingLayout from '../layouts/LandingLayout';
import Loadable from '../utils/Loadable';

const LandingPage = Loadable(lazy(() => import('../pages/public/LandingPage')));
const PublicProductsPage = Loadable(lazy(() => import('../pages/public/PublicProductsPage')));
const PublicTrainersPage = Loadable(lazy(() => import('../pages/public/PublicTrainersPage')));
const AboutPage = Loadable(lazy(() => import('../pages/public/AboutPage')));
const ContactPage = Loadable(lazy(() => import('../pages/public/ContactPage')));

export const publicRoutes = {
    path: '/',
    element: <LandingLayout />,
    children: [
        { path: '/', element: <LandingPage /> },
        { path: 'shop', element: <PublicProductsPage /> },
        { path: 'our-trainers', element: <PublicTrainersPage /> },
        { path: 'about', element: <AboutPage /> },
        { path: 'contact', element: <ContactPage /> },
    ],
};
