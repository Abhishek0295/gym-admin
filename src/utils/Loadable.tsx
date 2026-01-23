// src/utils/Loadable.tsx
import { Suspense, ComponentType, ReactNode } from 'react';

const Loadable = (Component: ComponentType, fallback: ReactNode = <div className="flex h-screen items-center justify-center">Loading...</div>) => {
    return (props: any) => (
        <Suspense fallback={fallback}>
            <Component {...props} />
        </Suspense>
    );
};

export default Loadable;
