import { Toaster } from 'react-hot-toast';

const ToasterProvider = () => (
    <Toaster
        position="top-right"
        containerStyle={{ zIndex: 100000 }}
        toastOptions={{
            duration: 4000,
            style: { background: '#363636', color: '#fff' },
            success: { iconTheme: { primary: '#10B981', secondary: '#fff' }, duration: 3000 },
            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' }, duration: 4000 },
        }}
    />
);

export default ToasterProvider;
