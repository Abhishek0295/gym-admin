import { Dialog, Transition } from '@headlessui/react';
import { Bell, CreditCard, DollarSign, Dumbbell, FileText, FolderOpen, LayoutDashboard, Package, Settings, Users, X } from 'lucide-react';
import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { cn } from '../../utils/helpers';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navigation = [
    { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: 'Products', href: ROUTES.PRODUCTS, icon: Package },
    { name: 'Trainers', href: ROUTES.TRAINERS, icon: Users },
    { name: 'Categories', href: ROUTES.CATEGORIES, icon: FolderOpen },
    { name: 'Transactions', href: ROUTES.TRANSACTIONS, icon: CreditCard },
    { name: 'Currency & Plans', href: ROUTES.CURRENCY, icon: DollarSign },
    { name: 'CMS', href: ROUTES.CMS, icon: FileText },
    { name: 'Notifications', href: ROUTES.NOTIFICATIONS, icon: Bell },
    { name: 'Settings', href: ROUTES.SETTINGS, icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="flex items-center h-16 px-6 border-b border-gray-200">
                <Dumbbell className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">GymAdmin</span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href || (item.href !== ROUTES.DASHBOARD && location.pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={onClose}
                            className={cn(
                                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                                isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            )}
                        >
                            <item.icon className="h-5 w-5 mr-3" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );

    return (
        <>
            {/* Mobile sidebar */}
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                    <button type="button" className="-m-2.5 p-2.5" onClick={onClose}>
                                        <span className="sr-only">Close sidebar</span>
                                        <X className="h-6 w-6 text-white" />
                                    </button>
                                </div>
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white">
                                    <SidebarContent />
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
                    <SidebarContent />
                </div>
            </div>
        </>
    );
};

export default Sidebar;
