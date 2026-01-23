import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './store/queryClient';
import { setupMockApi } from './services/mockApi';
import { router } from './routes';
import ToasterProvider from './components/ToasterProvider';

setupMockApi();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToasterProvider />
    </QueryClientProvider>
  );
}
