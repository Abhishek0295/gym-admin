import { Dumbbell, LayoutDashboard, LogIn, Menu, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useAuth } from '../../store/authContext';

const PublicHeader: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: 'Trainers', href: '/our-trainers' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
                        <Dumbbell className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900 italic">GymAdmin</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.href} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Auth Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {user?.role === 'admin' && (
                                    <Link to="/dashboard">
                                        <Button variant="ghost" size="sm" className="hidden lg:flex items-center">
                                            <LayoutDashboard className="h-4 w-4 mr-2" />
                                            Admin Panel
                                        </Button>
                                    </Link>
                                )}
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 hidden lg:block">{user?.username}</span>
                                </div>
                                <Button variant="outline" size="sm" onClick={logout}>
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button size="sm" className="hidden sm:flex items-center">
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                onClick={closeMenu}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-200">
                        {isAuthenticated ? (
                            <div className="px-5 space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-base font-medium leading-none text-gray-800">{user?.username}</div>
                                        <div className="text-sm font-medium leading-none text-gray-500">{user?.email}</div>
                                    </div>
                                </div>
                                {user?.role === 'admin' && (
                                    <Link to="/dashboard" onClick={closeMenu}>
                                        <Button variant="ghost" className="w-full justify-start mt-2">
                                            <LayoutDashboard className="h-4 w-4 mr-2" />
                                            Admin Panel
                                        </Button>
                                    </Link>
                                )}
                                <div className="mt-3">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center"
                                        onClick={() => {
                                            logout();
                                            closeMenu();
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="px-5 space-y-3">
                                <Link to="/login" onClick={closeMenu}>
                                    <Button variant="ghost" className="w-full justify-center">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup" onClick={closeMenu}>
                                    <Button className="w-full justify-center">
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default PublicHeader;
