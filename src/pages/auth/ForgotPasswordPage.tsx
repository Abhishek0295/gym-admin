import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/authContext";
import FormField from "../../components/forms/FormField";
import Button from "../../components/ui/Button";
import { ResetPasswordData } from "../../types";

const resetSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPasswordPage: React.FC = () => {
    const { forgotPassword, isSendingResetEmail } = useAuth();
    const [emailSent, setEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordData>({
        resolver: yupResolver(resetSchema),
    });

    const onSubmit = (data: ResetPasswordData) => {
        forgotPassword(data);
        setEmailSent(true);
    };

    if (emailSent) {
        return (
            <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Check your email
                </h3>
                <p className="text-gray-600 mb-6">
                    We've sent a password reset link to your email address.
                </p>
                <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                >
                    Back to login
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                    Reset your password
                </h3>
                <p className="text-gray-600 mb-6">
                    Enter your email address and we'll send you a link to reset
                    your password.
                </p>

                <FormField
                    label="Email Address"
                    type="email"
                    registration={register("email")}
                    error={errors.email?.message}
                    placeholder="Enter your email address"
                    required
                />
            </div>

            <Button
                type="submit"
                className="w-full"
                loading={isSendingResetEmail}
            >
                Send Reset Link
            </Button>

            <div className="text-center">
                <Link
                    to="/login"
                    className="text-sm text-blue-600 hover:text-blue-500"
                >
                    Back to login
                </Link>
            </div>
        </form>
    );
};

export default ForgotPasswordPage;
