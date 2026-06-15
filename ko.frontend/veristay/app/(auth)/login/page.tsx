'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLoginMutation } from '@/app/errors/authApi';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import userModel from '@/app/api/model/userModel';
import { setLoggedInUser } from '@/app/store/useAuthSlice';
import BaseCard from '@/components/shared/base-card';
import { useGetUserByIdQuery } from '@/app/errors/studentApi';
import { jwtDecodeModel } from '@/app/api/model/userModel';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [loginUser] = useLoginMutation();
    const dispatch = useDispatch();

    const {
        data: userData,
        isLoading: isUserLoading,
        error: userError,
    } = useGetUserByIdQuery(userId || '', {
        skip: !userId,
    });

    useEffect(() => {
        if (userData && userData.data && userId) {
            const { role }: jwtDecodeModel = jwtDecode(localStorage.getItem('token') || '');

            const userWithAuthData: userModel = {
                ...userData.data,
                role: role,
                token: localStorage.getItem('token') || '',
                uid: userId,
                name: `${userData.data.firstName} ${userData.data.lastName}`,
            };

            dispatch(setLoggedInUser(userWithAuthData));
            toast.success('Logged in Successfully');
            router.push('/dashboard');
        }
    }, [userData, userId, dispatch, router]);

    useEffect(() => {
        if (userError) {
            console.log('Error fetching user details:', userError);
            toast.error('Failed to fetch user details');
        }
    }, [userError]);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setErrors([]);

        const formData = new FormData(event.currentTarget);
        const tempData = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        };

        try {
            const response = await loginUser(tempData);

            if ('data' in response && response.data) {
                const { data } = response;

                const token = data.data.token;
                const { name, uid, role }: jwtDecodeModel = jwtDecode(token);
                localStorage.setItem('token', token);

                setUserId(uid);
            } else if ('error' in response && response.error) {
                const { error } = response;

                if ('data' in error && error.data) {
                    const errorData = error.data as any;
                    const errorMessage = errorData.message || 'Invalid email or password';
                    setErrors([errorMessage]);
                    toast.error(errorMessage);
                } else if ('message' in error) {
                    const errorMessage = (error as any).message || 'Invalid email or password';
                    setErrors([errorMessage]);
                    toast.error(errorMessage);
                } else {
                    setErrors(['Invalid email or password']);
                    toast.error('Invalid email or password');
                }
            }
        } catch (error) {
            console.log('Login catch error:', error);
            setErrors(['An unexpected error occurred']);
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <BaseCard>
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email to sign in to your account
                        </p>
                    </div>

                    {errors.length > 0 && (
                        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-destructive">
                                        Login failed:
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
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                disabled={isLoading}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || isUserLoading}
                            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                            {isLoading || isUserLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link
                            href="/register"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </BaseCard>
        </div>
    );
}
