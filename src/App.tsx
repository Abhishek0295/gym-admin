import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import ToasterProvider from './components/ToasterProvider';
import { router } from './routes';
import { queryClient } from './store/queryClient';

import { AuthProvider } from './store/authContext';

// setupMockApi();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RouterProvider router={router} />
                <ToasterProvider />
            </AuthProvider>
        </QueryClientProvider>
    );
}
