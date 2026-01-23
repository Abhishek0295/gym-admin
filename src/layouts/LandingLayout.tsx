import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import PublicHeader from './components/PublicHeader';

const LandingLayout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <PublicHeader />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default LandingLayout;
