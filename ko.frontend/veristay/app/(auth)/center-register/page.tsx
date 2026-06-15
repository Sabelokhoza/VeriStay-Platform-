'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Label } from '@/components/ui/label';
import BaseCard from '@/components/shared/base-card';
import { useAddTrainingCentreMutation, AddTrainingCentreDto } from '@/app/errors/trainingCenterApi';
import { CentreRegistrationSuccessModal } from '@/components/center-registration-modal';

const PROVINCES = [
    { id: 1, code: 'EC', name: 'Eastern Cape' },
    { id: 2, code: 'FS', name: 'Free State' },
    { id: 3, code: 'GP', name: 'Gauteng' },
    { id: 4, code: 'KZN', name: 'KwaZulu-Natal' },
    { id: 5, code: 'LP', name: 'Limpopo' },
    { id: 6, code: 'MP', name: 'Mpumalanga' },
    { id: 7, code: 'NC', name: 'Northern Cape' },
    { id: 8, code: 'NW', name: 'North West' },
    { id: 9, code: 'WC', name: 'Western Cape' },
];

export default function CenterRegister() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [addTrainingCentre] = useAddTrainingCentreMutation();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submittedCentreName, setSubmittedCentreName] = useState('');

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setErrors([]);

        const formData = new FormData(event.currentTarget);

        const data: AddTrainingCentreDto = {
            name: formData.get('name') as string,
            provinceId: parseInt(formData.get('provinceId') as string),
            address: formData.get('address') as string,
            contactEmail: formData.get('contactEmail') as string,
            contactPhone: formData.get('contactPhone') as string,
            accreditationNumber: formData.get('accreditationNumber') as string,
        };

        try {
            const response = await addTrainingCentre(data);

            if ('data' in response && response.data) {
                if ('data' in response && response.data) {
                    setSubmittedCentreName(data.name);
                    setShowSuccessModal(true);
                }
            } else if ('error' in response && response.error) {
                const { error } = response;

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
            console.error('Center registration error:', error);
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
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Register Training Center
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your training center details to register
                        </p>
                    </div>

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
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Training Center Name</Label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                disabled={isLoading}
                                className="flex h-10 w-full rounded-md border px-3"
                                placeholder="Enter training center name"
                                minLength={2}
                                maxLength={100}
                                required
                            />
                        </div>

                        {/* Province */}
                        <div className="space-y-2">
                            <Label htmlFor="provinceId">Province</Label>
                            <select
                                id="provinceId"
                                name="provinceId"
                                disabled={isLoading}
                                className="flex h-10 w-full rounded-md border px-3 bg-background text-sm"
                                required
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Select a province
                                </option>
                                {PROVINCES.map((province) => (
                                    <option key={province.id} value={province.id}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <textarea
                                id="address"
                                name="address"
                                rows={3}
                                disabled={isLoading}
                                className="flex w-full rounded-md border px-3 py-2"
                                placeholder="Enter full address"
                                minLength={10}
                                maxLength={500}
                                required
                            />
                        </div>

                        {/* Contact Email */}
                        <div className="space-y-2">
                            <Label htmlFor="contactEmail">Contact Email</Label>
                            <input
                                id="contactEmail"
                                name="contactEmail"
                                type="email"
                                disabled={isLoading}
                                className="flex h-10 w-full rounded-md border px-3"
                                placeholder="Enter contact email address"
                                maxLength={100}
                                required
                            />
                        </div>

                        {/* Contact Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="contactPhone">Contact Phone</Label>
                            <input
                                id="contactPhone"
                                name="contactPhone"
                                type="tel"
                                disabled={isLoading}
                                className="flex h-10 w-full rounded-md border px-3"
                                placeholder="e.g. +27 11 123 4567"
                                pattern="^[\+]?[0-9\s\-\(\)]{10,15}$"
                                title="10-15 digits, can contain +, spaces, hyphens, and parentheses"
                                required
                            />
                        </div>

                        {/* PSIRA Accreditation Number */}
                        <div className="space-y-2">
                            <Label htmlFor="accreditationNumber">PSIRA Accreditation Number</Label>
                            <input
                                id="accreditationNumber"
                                name="accreditationNumber"
                                type="text"
                                disabled={isLoading}
                                className="flex h-10 w-full rounded-md border px-3"
                                placeholder="Enter PSIRA accreditation number"
                                minLength={5}
                                maxLength={20}
                                pattern="^[A-Za-z0-9]+$"
                                title="PSIRA number can only contain letters and numbers"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                        >
                            {isLoading ? 'Registering...' : 'Register Training Center'}
                        </button>
                    </form>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="underline hover:text-primary">
                            Sign in
                        </Link>
                    </p>
                </div>

                <CentreRegistrationSuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    centreName={submittedCentreName}
                />
            </BaseCard>
        </div>
    );
}
