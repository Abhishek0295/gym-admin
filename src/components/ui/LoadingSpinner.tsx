import React from "react";
import { cn } from "../../utils/helpers";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    variant?: "primary" | "inverted" | "neutral";
    centered?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = "md",
    className,
    variant = "primary",
    centered = true,
}) => {
    const sizes = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-4",
        lg: "h-12 w-12 border-4",
    };

    const variants = {
        primary: "border-gray-200 border-t-blue-600",
        inverted: "border-white/30 border-t-white",
        neutral: "border-gray-200 border-t-gray-600",
    };

    const spinner = (
        <div
            className={cn(
                "animate-spin rounded-full",
                sizes[size],
                variants[variant],
                !centered && className,
            )}
        />
    );

    if (!centered) return spinner;

    return (
        <div className={cn("flex justify-center items-center", className)}>
            {spinner}
        </div>
    );
};

export default LoadingSpinner;
