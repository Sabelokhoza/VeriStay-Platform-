'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import BaseCard from '@/components/shared/base-card';
import { useRegisterMutation } from '@/app/errors/authApi';
import { FileText, Upload, X, CheckCircle } from 'lucide-react';

interface RegisterStudentDto {
    fullName: string;
    email: string;
    studentNumber: string;
    phoneNumber: string;
    budget: number;
    password: string;
    confirmPassword: string;
    proofOfRegistration: File | null;
    proofOfIncome: File | null;
}

// =============================================
// File Upload Field Component
// =============================================

function FileUploadField({
    id,
    label,
    description,
    file,
    onFileChange,
    onClear,
    disabled,
    required,
}: {
    id: string;
    label: string;
    description: string;
    file: File | null;
    onFileChange: (file: File) => void;
    onClear: () => void;
    disabled: boolean;
    required?: boolean;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0];
        if (!selected) return;
        if (selected.type !== 'application/pdf') {
            toast.error(`${label} must be a PDF file`);
            return;
        }
        if (selected.size > 5 * 1024 * 1024) {
            toast.error(`${label} must be smaller than 5MB`);
            return;
        }
        onFileChange(selected);
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </label>
            <p className="text-xs text-muted-foreground">{description}</p>

            {file ? (
                // File selected — show preview
                <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-800 truncate">{file.name}</p>
                        <p className="text-xs text-green-600">
                            {(file.size / 1024).toFixed(1)} KB · PDF
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            onClear();
                            if (inputRef.current) inputRef.current.value = '';
                        }}
                        disabled={disabled}
                        className="shrink-0 rounded-full p-1 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
                        aria-label="Remove file"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                // No file — show upload zone
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={disabled}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-muted/30 px-4 py-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                        <Upload className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Click to upload PDF
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            PDF only · Max 5MB
                        </p>
                    </div>
                </button>
            )}

            <input
                ref={inputRef}
                id={id}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleChange}
                disabled={disabled}
            />
        </div>
    );
}

// =============================================
// Register Page
// =============================================

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors]       = useState<string[]>([]);
    const [registerStudent]         = useRegisterMutation();

    const [formData, setFormData] = useState<RegisterStudentDto>({
        fullName:            '',
        email:               '',
        studentNumber:       '',
        phoneNumber:         '',
        budget:              0,
        password:            '',
        confirmPassword:     '',
        proofOfRegistration: null,
        proofOfIncome:       null,
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'budget' ? parseFloat(value) || 0 : value,
        }));
    }

    function validate(): string[] {
        const errs: string[] = [];

        if (!formData.fullName.trim())
            errs.push('Full name is required');

        if (!formData.email.trim())
            errs.push('Email is required');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            errs.push('Please enter a valid email address');

        if (!formData.studentNumber.trim())
            errs.push('Student number is required');

        if (!formData.phoneNumber.trim())
            errs.push('Phone number is required');
        else if (!/^\+?[\d\s\-()]{7,15}$/.test(formData.phoneNumber))
            errs.push('Please enter a valid phone number');

        if (formData.budget <= 0)
            errs.push('Monthly budget must be a positive value');

        if (!formData.password)
            errs.push('Password is required');
        else if (formData.password.length < 8)
            errs.push('Password must be at least 8 characters');

        if (formData.password !== formData.confirmPassword)
            errs.push('Passwords do not match');

        if (!formData.proofOfRegistration)
            errs.push('Proof of registration (PDF) is required');

        if (!formData.proofOfIncome)
            errs.push('Proof of income / funding (PDF) is required');

        return errs;
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

        const { confirmPassword, proofOfRegistration, proofOfIncome, ...rest } = formData;

        try {
            const response = await registerStudent({
                ...rest,
                proofOfRegistration: proofOfRegistration!,
                proofOfIncome:       proofOfIncome!,
            });

            if ('data' in response && response.data) {
                toast.success('Account created successfully! Please sign in.');
                router.push('/login');
            } else if ('error' in response && response.error) {
                const error = response.error;
                if ('data' in error && error.data) {
                    const errorData = error.data as {
                        data: null;
                        success: boolean;
                        message: string;
                        Details: string[] | null;
                        details: string[] | null;
                        traceId: string | null;
                        timestamp: string;
                    };

                    const details = errorData.Details ?? errorData.details ?? [];
                    if (details.length > 0) {
                        setErrors(details);
                        details.forEach((d: string) => toast.error(d));
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
        } catch (err) {
            console.error('Registration error:', err);
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
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[440px]">

                    {/* Header */}
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your details below to create your student account
                        </p>
                    </div>

                    {/* Error list */}
                    {errors.length > 0 && (
                        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
                            <h3 className="text-sm font-medium text-destructive mb-2">
                                Please fix the following errors:
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">

                        {/* ── Personal Details ──────────────────────── */}
                        <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Personal Details
                            </p>

                            <div className="space-y-2">
                                <label htmlFor="fullName" className={labelClass}>Full Name</label>
                                <input
                                    id="fullName" name="fullName" type="text"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={inputClass} required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className={labelClass}>Institutional Email</label>
                                <input
                                    id="email" name="email" type="email"
                                    placeholder="student@university.ac.za"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={inputClass} required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="studentNumber" className={labelClass}>Student Number</label>
                                <input
                                    id="studentNumber" name="studentNumber" type="text"
                                    placeholder="e.g. 2021001234"
                                    value={formData.studentNumber}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={inputClass} required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phoneNumber" className={labelClass}>Phone Number</label>
                                <input
                                    id="phoneNumber" name="phoneNumber" type="tel"
                                    placeholder="+27 81 234 5678"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={inputClass} required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="budget" className={labelClass}>Monthly Budget (ZAR)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R</span>
                                    <input
                                        id="budget" name="budget" type="number"
                                        min="0" step="0.01" placeholder="0.00"
                                        value={formData.budget || ''}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className={`${inputClass} pl-7`} required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Documents ─────────────────────────────── */}
                        <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Required Documents
                                </p>
                            </div>

                            <FileUploadField
                                id="proofOfRegistration"
                                label="Proof of Registration"
                                description="Upload your current year academic registration document from your university."
                                file={formData.proofOfRegistration}
                                onFileChange={(file) =>
                                    setFormData((prev) => ({ ...prev, proofOfRegistration: file }))
                                }
                                onClear={() =>
                                    setFormData((prev) => ({ ...prev, proofOfRegistration: null }))
                                }
                                disabled={isLoading}
                                required
                            />

                            <FileUploadField
                                id="proofOfIncome"
                                label="Proof of Income / Funding"
                                description="Upload a bank statement, NSFAS letter, bursary letter, or parent income proof."
                                file={formData.proofOfIncome}
                                onFileChange={(file) =>
                                    setFormData((prev) => ({ ...prev, proofOfIncome: file }))
                                }
                                onClear={() =>
                                    setFormData((prev) => ({ ...prev, proofOfIncome: null }))
                                }
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* ── Password ──────────────────────────────── */}
                        <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Security
                            </p>

                            <div className="space-y-2">
                                <label htmlFor="password" className={labelClass}>Password</label>
                                <input
                                    id="password" name="password" type="password"
                                    placeholder="Min. 8 characters"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={inputClass} required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
                                <input
                                    id="confirmPassword" name="confirmPassword" type="password"
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={inputClass} required
                                />
                            </div>
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
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                            Sign in
                        </Link>
                    </p>
                </div>
            </BaseCard>
        </div>
    );
}