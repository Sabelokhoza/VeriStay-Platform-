'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import BaseCard from '@/components/shared/base-card';
import { useRegisterMutation } from '@/app/errors/authApi';

interface RegisterStudentDto {
    fullName: string;
    email: string;
    studentNumber: string;
    phoneNumber: string;
    budget: number;
    password: string;
    confirmPassword: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [registerStudent] = useRegisterMutation();

    const [formData, setFormData] = useState<RegisterStudentDto>({
        fullName: '',
        email: '',
        studentNumber: '',
        phoneNumber: '',
        budget: 0,
        password: '',
        confirmPassword: '',
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'budget' ? parseFloat(value) || 0 : value,
        }));
    }

    function validate(): string[] {
        const validationErrors: string[] = [];

        if (!formData.fullName.trim()) validationErrors.push('Full name is required');

        if (!formData.email.trim()) validationErrors.push('Email is required');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            validationErrors.push('Please enter a valid email address');

        if (!formData.studentNumber.trim()) validationErrors.push('Student number is required');

        if (!formData.phoneNumber.trim()) validationErrors.push('Phone number is required');
        else if (!/^\+?[\d\s\-()]{7,15}$/.test(formData.phoneNumber))
            validationErrors.push('Please enter a valid phone number');

        if (formData.budget <= 0) validationErrors.push('Monthly budget must be a positive value');

        if (!formData.password) validationErrors.push('Password is required');
        else if (formData.password.length < 8)
            validationErrors.push('Password must be at least 8 characters');

        if (formData.password !== formData.confirmPassword)
            validationErrors.push('Passwords do not match');

        return validationErrors;
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrors([]);

        const validationErrors = validate();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        const { confirmPassword, ...payload } = formData;

        try {
            const response = await registerStudent(payload);

            if ('data' in response && response.data) {
                toast.success('Account created successfully! Please sign in.');
                router.push('/login');
            } else if ('error' in response && response.error) {
                const error = response.error;
                console.log('Registration error:', error);
                if ('data' in error && error.data) {
                    const errorData = error.data as {
                        data: null;
                        success: boolean;
                        message: string;
                        Details: string[];
                        traceId: string | null;
                        timestamp: string;
                    };
                    console.log('Sabelo');
                    console.log(errorData.Details);
                    // Show details array if present, otherwise fall back to message
                    if (errorData.Details && errorData.Details.length > 0) {
                        console.log('Khoza');
                        setErrors(errorData.Details);
                        errorData.Details.forEach((detail: string) => toast.error(detail));
                    } else if (errorData.message) {
                        setErrors([errorData.message]);
                        toast.error(errorData.message);
                    } else {
                        setErrors(['Registration failed. Please try again.']);
                        toast.error('Registration failed. Please try again.');
                    }
                } else {
                    setErrors(['Registration failed. Please try again.']);
                    toast.error('Registration failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrors(['An unexpected error occurred']);
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    const inputClass =
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    const labelClass =
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';

    return (
        <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-10">
            <BaseCard>
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your details below to create your student account
                        </p>
                    </div>

                    {errors.length > 0 && (
                        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-destructive">
                                        Please fix the following errors:
                                    </h3>
                                    <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-destructive">
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label htmlFor="fullName" className={labelClass}>
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={inputClass}
                                required
                            />
                        </div>

                        {/* Institutional Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className={labelClass}>
                                Institutional Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="student@university.ac.za"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={inputClass}
                                required
                            />
                        </div>

                        {/* Student Number */}
                        <div className="space-y-2">
                            <label htmlFor="studentNumber" className={labelClass}>
                                Student Number
                            </label>
                            <input
                                id="studentNumber"
                                name="studentNumber"
                                type="text"
                                placeholder="e.g. 2021001234"
                                value={formData.studentNumber}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={inputClass}
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label htmlFor="phoneNumber" className={labelClass}>
                                Phone Number
                            </label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                placeholder="+27 81 234 5678"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={inputClass}
                                required
                            />
                        </div>

                        {/* Monthly Budget */}
                        <div className="space-y-2">
                            <label htmlFor="budget" className={labelClass}>
                                Monthly Budget (ZAR)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    R
                                </span>
                                <input
                                    id="budget"
                                    name="budget"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.budget || ''}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={`${inputClass} pl-7`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label htmlFor="password" className={labelClass}>
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Min. 8 characters"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={inputClass}
                                required
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className={labelClass}>
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Re-enter your password"
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={inputClass}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
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
