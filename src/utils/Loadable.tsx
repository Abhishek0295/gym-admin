import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Suspense, ComponentType, ReactNode } from "react";

const Loadable = (
    Component: ComponentType,
    fallback: ReactNode = (
        <div className="flex h-screen items-center justify-center">
            <LoadingSpinner />
        </div>
    ),
) => {
    return (props: any) => (
        <Suspense fallback={fallback}>
            <Component {...props} />
        </Suspense>
    );
};

export default Loadable;
