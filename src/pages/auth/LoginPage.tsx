import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import * as yup from "yup";
import FormField from "../../components/forms/FormField";
import Button from "../../components/ui/Button";
import { useAuthActions } from "../../hooks/useAuthActions";
import { useAuth } from "../../store/authContext";
import { LoginCredentials } from "../../types";

const loginSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
});

const LoginPage: React.FC = () => {
    const { login, isLoggingIn } = useAuthActions();
    const { isAuthenticated, user } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginCredentials>({
        resolver: yupResolver(loginSchema),
    });

    if (isAuthenticated) {
        return (
            <Navigate
                to={user?.role === "admin" ? "/dashboard" : "/"}
                replace
            />
        );
    }

    const onSubmit = (data: LoginCredentials) => {
        login(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                    Sign in to your account
                </h3>

                <div className="space-y-4">
                    <FormField
                        label="Email"
                        type="email"
                        registration={register("email")}
                        error={errors.email?.message}
                        placeholder="Enter your email"
                        required
                    />

                    <FormField
                        label="Password"
                        type="password"
                        registration={register("password")}
                        error={errors.password?.message}
                        placeholder="Enter your password"
                        required
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500"
                >
                    Forgot your password?
                </Link>
            </div>

            <Button type="submit" className="w-full" loading={isLoggingIn}>
                Sign In
            </Button>

            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-500">
                        Sign Up
                    </Link>
                </p>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600 mb-2">Admin Credentials:</p>
                <p className="text-xs text-gray-500">Email: admin@gym.com</p>
                <p className="text-xs text-gray-500">Password: admin123</p>
            </div>
        </form>
    );
};

export default LoginPage;
