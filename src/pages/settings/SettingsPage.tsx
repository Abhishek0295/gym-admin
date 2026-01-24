import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Save, Mail, Lock, CreditCard, User } from "lucide-react";
import { useAuth } from "../../store/authContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import FormField from "../../components/forms/FormField";
import toast from "react-hot-toast";

const emailSchema = yup.object({
    currentEmail: yup
        .string()
        .email("Invalid email")
        .required("Current email is required"),
    newEmail: yup
        .string()
        .email("Invalid email")
        .required("New email is required"),
    password: yup.string().required("Password is required for verification"),
});

const passwordSchema = yup.object({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword")], "Passwords must match")
        .required("Please confirm your password"),
});

const bankSchema = yup.object({
    accountName: yup.string().required("Account name is required"),
    accountNumber: yup.string().required("Account number is required"),
    routingNumber: yup.string().required("Routing number is required"),
    bankName: yup.string().required("Bank name is required"),
});

const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<"email" | "password" | "bank">(
        "email",
    );

    const emailForm = useForm({
        resolver: yupResolver(emailSchema),
        defaultValues: {
            currentEmail: user?.email || "",
            newEmail: "",
            password: "",
        },
    });

    const passwordForm = useForm({
        resolver: yupResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const bankForm = useForm({
        resolver: yupResolver(bankSchema),
        defaultValues: {
            accountName: "",
            accountNumber: "",
            routingNumber: "",
            bankName: "",
        },
    });

    const onSubmitEmail = (data: any) => {
        // Mock API call
        setTimeout(() => {
            toast.success("Email updated successfully!");
            emailForm.reset();
        }, 1000);
    };

    const onSubmitPassword = (data: any) => {
        // Mock API call
        setTimeout(() => {
            toast.success("Password updated successfully!");
            passwordForm.reset();
        }, 1000);
    };

    const onSubmitBank = (data: any) => {
        // Mock API call
        setTimeout(() => {
            toast.success("Bank details updated successfully!");
        }, 1000);
    };

    const tabs = [
        { id: "email", label: "Email Settings", icon: Mail },
        { id: "password", label: "Password", icon: Lock },
        { id: "bank", label: "Bank Details", icon: CreditCard },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Account Settings
                    </h1>
                    <p className="text-gray-600">
                        Manage your account preferences and security
                    </p>
                </div>
            </div>

            {/* Profile Summary */}
            <Card>
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {user?.name}
                        </h2>
                        <p className="text-gray-600">{user?.email}</p>
                        <p className="text-sm text-gray-500">
                            Role: {user?.role}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Settings Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <Card padding="sm">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md transition-colors ${
                                        activeTab === tab.id
                                            ? "bg-blue-100 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <tab.icon className="h-5 w-5" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    <Card>
                        {activeTab === "email" && (
                            <form
                                onSubmit={emailForm.handleSubmit(onSubmitEmail)}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Change Email Address
                                    </h3>
                                    <div className="space-y-4">
                                        <FormField
                                            label="Current Email"
                                            registration={emailForm.register(
                                                "currentEmail",
                                            )}
                                            error={
                                                emailForm.formState.errors
                                                    .currentEmail?.message
                                            }
                                        />
                                        <FormField
                                            label="New Email Address"
                                            type="email"
                                            registration={emailForm.register(
                                                "newEmail",
                                            )}
                                            error={
                                                emailForm.formState.errors
                                                    .newEmail?.message
                                            }
                                            placeholder="Enter new email address"
                                            required
                                        />
                                        <FormField
                                            label="Password"
                                            type="password"
                                            registration={emailForm.register(
                                                "password",
                                            )}
                                            error={
                                                emailForm.formState.errors
                                                    .password?.message
                                            }
                                            placeholder="Enter your password to confirm"
                                            helperText="Required for security verification"
                                            required
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    loading={emailForm.formState.isSubmitting}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Update Email
                                </Button>
                            </form>
                        )}

                        {activeTab === "password" && (
                            <form
                                onSubmit={passwordForm.handleSubmit(
                                    onSubmitPassword,
                                )}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Change Password
                                    </h3>
                                    <div className="space-y-4">
                                        <FormField
                                            label="Current Password"
                                            type="password"
                                            registration={passwordForm.register(
                                                "currentPassword",
                                            )}
                                            error={
                                                passwordForm.formState.errors
                                                    .currentPassword?.message
                                            }
                                            placeholder="Enter current password"
                                            required
                                        />
                                        <FormField
                                            label="New Password"
                                            type="password"
                                            registration={passwordForm.register(
                                                "newPassword",
                                            )}
                                            error={
                                                passwordForm.formState.errors
                                                    .newPassword?.message
                                            }
                                            placeholder="Enter new password"
                                            helperText="Password must be at least 6 characters long"
                                            required
                                        />
                                        <FormField
                                            label="Confirm New Password"
                                            type="password"
                                            registration={passwordForm.register(
                                                "confirmPassword",
                                            )}
                                            error={
                                                passwordForm.formState.errors
                                                    .confirmPassword?.message
                                            }
                                            placeholder="Confirm new password"
                                            required
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    loading={
                                        passwordForm.formState.isSubmitting
                                    }
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Update Password
                                </Button>
                            </form>
                        )}

                        {activeTab === "bank" && (
                            <form
                                onSubmit={bankForm.handleSubmit(onSubmitBank)}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Bank Details
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Add or update your bank details for
                                        payouts and transactions.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            label="Account Name"
                                            registration={bankForm.register(
                                                "accountName",
                                            )}
                                            error={
                                                bankForm.formState.errors
                                                    .accountName?.message
                                            }
                                            placeholder="Enter account holder name"
                                            required
                                        />
                                        <FormField
                                            label="Bank Name"
                                            registration={bankForm.register(
                                                "bankName",
                                            )}
                                            error={
                                                bankForm.formState.errors
                                                    .bankName?.message
                                            }
                                            placeholder="Enter bank name"
                                            required
                                        />
                                        <FormField
                                            label="Account Number"
                                            registration={bankForm.register(
                                                "accountNumber",
                                            )}
                                            error={
                                                bankForm.formState.errors
                                                    .accountNumber?.message
                                            }
                                            placeholder="Enter account number"
                                            required
                                        />
                                        <FormField
                                            label="Routing Number"
                                            registration={bankForm.register(
                                                "routingNumber",
                                            )}
                                            error={
                                                bankForm.formState.errors
                                                    .routingNumber?.message
                                            }
                                            placeholder="Enter routing number"
                                            required
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    loading={bankForm.formState.isSubmitting}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Bank Details
                                </Button>
                            </form>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
