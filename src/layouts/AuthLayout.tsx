import { Dumbbell } from 'lucide-react';
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="flex items-center space-x-2">
                            <Dumbbell className="h-12 w-12 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">GymAdmin</span>
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Portal</h2>
                </div>

                <div className="bg-white rounded-lg shadow-xl p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
