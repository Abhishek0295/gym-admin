import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import * as yup from 'yup';
import FormField from '../../components/forms/FormField';
import Button from '../../components/ui/Button';
import { useAuthActions } from '../../hooks/useAuthActions';
import { useAuth } from '../../store/authContext';

const signupSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

const SignupPage: React.FC = () => {
    const { signup, isSigningUp } = useAuthActions();
    const { isAuthenticated } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signupSchema),
    });

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const onSubmit = (data: any) => {
        signup(data);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Create an account</h3>
                <p className="text-sm text-gray-600 mb-6">Join our gym community today</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        label="Name"
                        registration={register('name')}
                        error={errors.name?.message as string}
                        placeholder="John Doe"
                        required
                    />

                    <FormField
                        label="Email Address"
                        type="email"
                        registration={register('email')}
                        error={errors.email?.message as string}
                        placeholder="john@example.com"
                        required
                    />

                    <FormField
                        label="Password"
                        type="password"
                        registration={register('password')}
                        error={errors.password?.message as string}
                        placeholder="••••••••"
                        required
                    />

                    <FormField
                        label="Confirm Password"
                        type="password"
                        registration={register('confirmPassword')}
                        error={errors.confirmPassword?.message as string}
                        placeholder="••••••••"
                        required
                    />

                    <Button type="submit" className="w-full py-3 mt-4" loading={isSigningUp}>
                        Create Account
                    </Button>
                </form>
            </div>

            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
