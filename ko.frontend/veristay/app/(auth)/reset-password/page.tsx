'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useResetPasswordMutation } from '@/app/errors/authApi';
import BaseCard from '@/components/shared/base-card';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [resetPassword] = useResetPasswordMutation();

    useEffect(() => {
        const emailParam = searchParams.get('email');
        const tokenParam = searchParams.get('code');

        if (emailParam) setEmail(emailParam);
        if (tokenParam) setToken(tokenParam);

        if (!emailParam || !tokenParam) {
            setErrors(['Invalid or missing reset link. Please request a new password reset.']);
        }
    }, [searchParams]);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setErrors([]);

        const formData = new FormData(event.currentTarget);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setErrors(['Passwords do not match']);
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setErrors(['Password must be at least 8 characters long']);
            setIsLoading(false);
            return;
        }

        try {
            const response = await resetPassword({
                email,
                token,
                password,
            });

            console.log('Reset password response:', response);

            if ('data' in response && response.data) {
                toast.success('Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else if ('error' in response && response.error) {
                const { error } = response;
                console.log('Reset password error:', error);

                if ('data' in error && error.data) {
                    const errorData = error.data as any;

                    // Check for message string
                    if (errorData.message) {
                        setErrors([errorData.message]);
                        toast.error(errorData.message);
                    } else if (
                        errorData.details &&
                        Array.isArray(errorData.details) &&
                        errorData.details.length > 0
                    ) {
                        setErrors(errorData.details);
                        toast.error('Please check the form for errors');
                    } else {
                        setErrors([
                            'Failed to reset password. Please try again or request a new reset link.',
                        ]);
                        toast.error('Failed to reset password');
                    }
                } else if ('message' in error) {
                    const errorMessage = (error as any).message || 'Failed to reset password';
                    setErrors([errorMessage]);
                    toast.error(errorMessage);
                } else {
                    setErrors([
                        'Failed to reset password. Please try again or request a new reset link.',
                    ]);
                    toast.error('Failed to reset password');
                }
            }
        } catch (error) {
            console.log('Reset password catch error:', error);
            setErrors(['Failed to reset password. Please try again.']);
            toast.error('Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <BaseCard>
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Reset your password
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your new password below
                        </p>
                    </div>

                    {/* Display errors */}
                    {errors.length > 0 && (
                        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-destructive">Error:</h3>
                                    <div className="mt-2">
                                        <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                                            {errors.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                disabled={isLoading || !email || !token}
                                placeholder="Enter new password"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                disabled={isLoading || !email || !token}
                                placeholder="Confirm new password"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !email || !token}
                            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                            {isLoading ? 'Resetting password...' : 'Reset password'}
                        </button>
                    </form>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Remember your password?{' '}
                        <Link
                            href="/login"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </BaseCard>
        </div>
    );
}
