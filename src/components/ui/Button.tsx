import React from "react";
import { cn } from "../../utils/helpers";
import LoadingSpinner from "./LoadingSpinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    className,
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    children,
    ...props
}) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-600 text-white hover:bg-gray-700",
        outline:
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        ghost: "text-gray-700 hover:bg-gray-100",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                className,
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <LoadingSpinner
                    size="sm"
                    centered={false}
                    variant={
                        variant === "primary" ||
                        variant === "secondary" ||
                        variant === "danger"
                            ? "inverted"
                            : "neutral"
                    }
                    className="-ml-1 mr-2"
                />
            )}
            {children}
        </button>
    );
};

export default Button;
