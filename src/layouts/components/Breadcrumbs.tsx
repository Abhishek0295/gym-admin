import { ChevronRight, Home } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const Breadcrumbs: React.FC = () => {
    return null;

    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
                <li>
                    <Link to={ROUTES.DASHBOARD} className="text-gray-500 hover:text-gray-700 flex items-center">
                        <Home className="h-4 w-4" />
                    </Link>
                </li>

                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    const name = breadcrumbNameMap[value] || value;

                    return (
                        <li key={to} className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                            {isLast ? (
                                <span className="text-sm font-medium text-gray-900">{name}</span>
                            ) : (
                                <Link to={to} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                                    {name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
