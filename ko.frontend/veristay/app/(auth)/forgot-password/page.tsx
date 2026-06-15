'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useForgotPasswordMutation } from '@/app/errors/authApi';
import BaseCard from '@/components/shared/base-card';
import Loading from '@/app/(platform)/loading';
export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [forgotPassword] = useForgotPasswordMutation();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setErrors([]);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;

        try {
            const { data } = await forgotPassword({ email });

            if (isLoading) {
                return <Loading />;
            }

            if (data?.data) {
                setIsSubmitted(true);
                toast.success('Password reset link sent to your email');
            } else if (data.error) {
                if (data.error?.data?.message) {
                    setErrors([data.error.data.message]);
                } else {
                    setErrors(['Failed to send reset link. Please try again.']);
                }
                toast.error('Failed to send reset link');
            }
        } catch (error) {
            console.log('Forgot password error:', error);
            setErrors(['Failed to send reset link. Please try again.']);
            toast.error('Failed to send reset link');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <BaseCard>
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    {!isSubmitted ? (
                        <>
                            <div className="flex flex-col space-y-2 text-center">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Forgot your password?
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Enter your email address and we'll send you a link to reset your
                                    password
                                </p>
                            </div>

                            {errors.length > 0 && (
                                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-destructive">
                                                Error:
                                            </h3>
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
                                        htmlFor="email"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        placeholder="name@example.com"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    {isLoading ? 'Sending...' : 'Send reset link'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-col space-y-4 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <svg
                                    className="h-6 w-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold">Check your email</h2>
                            <p className="text-sm text-muted-foreground">
                                We've sent a password reset link to your email address. Please check
                                your inbox and follow the instructions.
                            </p>
                        </div>
                    )}

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
