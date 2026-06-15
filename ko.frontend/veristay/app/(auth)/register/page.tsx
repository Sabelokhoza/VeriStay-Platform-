'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegisterMutation } from '@/app/errors/authApi';

import { toast } from 'react-toastify';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@heroui/react';
import BaseCard from '@/components/shared/base-card';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [citizenship, setCitizenship] = useState('south-african');
    const [registerUser] = useRegisterMutation();

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

        const data = {
            idNumber: formData.get('idNumber') as string,
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            dateOfBirth:
                citizenship === 'south-african'
                    ? '0001-01-01'
                    : (formData.get('dateOfBirth') as string),
            isSouthAfrican: citizenship === 'south-african',
            address: formData.get('address') as string,
            phoneNumber: formData.get('phoneNumber') as string,
            email: formData.get('email') as string,
            password: password,
        };

        try {
            const response = await registerUser(data);
            console.log('Register response:', response);

            if ('data' in response && response.data) {
                toast.success('Registered Successfully');
                router.push('/login');
            } else if ('error' in response && response.error) {
                const { error } = response;
                console.log('Registration error:', error);

                if ('data' in error && error.data) {
                    const errorData = error.data as any;

                    if (
                        errorData.details &&
                        Array.isArray(errorData.details) &&
                        errorData.details.length > 0
                    ) {
                        setErrors(errorData.details);
                        toast.error('Please check the form for errors');
                    } else if (errorData.message) {
                        setErrors([errorData.message]);
                        toast.error(errorData.message);
                    } else {
                        setErrors(['Registration failed. Please try again.']);
                        toast.error('Registration failed. Please try again.');
                    }
                } else if ('message' in error) {
                    const errorMessage = (error as any).message || 'Registration failed';
                    setErrors([errorMessage]);
                    toast.error(errorMessage);
                } else {
                    setErrors(['Registration failed. Please try again.']);
                    toast.error('Registration failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Registration catch error:', error);
            setErrors(['An unexpected error occurred. Please try again.']);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
            <BaseCard>
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your details to create your account
                        </p>
                    </div>

                    {/* Display validation errors */}
                    {errors.length > 0 && (
                        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
                            <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="mb-2 block">Citizenship</Label>
                            <RadioGroup
                                value={citizenship}
                                onValueChange={setCitizenship}
                                className="flex space-x-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="south-african" id="south-african" />
                                    <Label htmlFor="south-african">South African</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="other" id="other" />
                                    <Label htmlFor="other">Other</Label>
                                </div>
                            </RadioGroup>

                            <label htmlFor="idNumber" className="text-sm font-medium">
                                ID Number / Passport Number
                            </label>
                            <input
                                id="idNumber"
                                name="idNumber"
                                type="text"
                                disabled={isLoading}
                                className="flex h-10 w-full rounded-md border px-3"
                                placeholder="Enter your ID number"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="text-sm font-medium">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    disabled={isLoading}
                                    className="flex h-10 w-full rounded-md border px-3"
                                    placeholder="First name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="text-sm font-medium">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    disabled={isLoading}
                                    className="flex h-10 w-full rounded-md border px-3"
                                    placeholder="Last name"
                                    required
                                />
                            </div>
                        </div>

                        {citizenship === 'other' && (
                            <div className="space-y-2">
                                <DatePicker label="Date of Birth" name="dateOfBirth" />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="address" className="text-sm font-medium">
                                Address
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                rows={3}
                                disabled={isLoading}
                                className="flex w-full rounded-md border px-3 py-2"
                                placeholder="Enter your full address"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="phoneNumber" className="text-sm font-medium">
                                Phone Number
                            </label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                disabled={isLoading}
                                className="flex h-10 w-full rounded-md border px-3"
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                disabled={isLoading}
                                className="flex h-10 w-full rounded-md border px-3"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                disabled={isLoading}
                                className="flex h-10 w-full rounded-md border px-3"
                                placeholder="Create a password"
                                required
                            />
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                disabled={isLoading}
                                className="flex h-10 w-full rounded-md border px-3"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="underline hover:text-primary">
                            Sign in
                        </Link>
                    </p>
                </div>
            </BaseCard>
        </div>
    );
}
