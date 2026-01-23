import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">© 2025 GymAdmin. All rights reserved.</p>
                    <p className="text-sm text-gray-500">Version 1.0.0</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
