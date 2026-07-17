// components/auth/LandlordRegisterPage.tsx

'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import BaseCard from '@/components/shared/base-card';
import { useRegisterLandlordMutation } from '@/app/errors/authApi';
import {
    FileText,
    Upload,
    X,
    CheckCircle,
    Home,
    ShieldCheck,
    Eye,
    EyeOff,
} from 'lucide-react';

// =============================================
// Types
// =============================================

interface RegisterLandlordDto {
    fullName:               string;
    email:                  string;
    phoneNumber:            string;
    password:               string;
    confirmPassword:        string;
    identificationDocument: File | null;
}

// =============================================
// File Upload Field
// =============================================

function FileUploadField({
    id,
    label,
    description,
    file,
    onFileChange,
    onClear,
    disabled,
}: {
    id:           string;
    label:        string;
    description:  string;
    file:         File | null;
    onFileChange: (file: File) => void;
    onClear:      () => void;
    disabled:     boolean;
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
                <span className="text-destructive ml-1">*</span>
            </label>
            <p className="text-xs text-muted-foreground">{description}</p>

            {file ? (
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
                        <p className="text-sm font-medium text-foreground">Click to upload PDF</p>
                        <p className="text-xs text-muted-foreground mt-0.5">PDF only · Max 5MB</p>
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
// Password Input with show/hide toggle
// =============================================

function PasswordInput({
    id,
    name,
    placeholder,
    value,
    onChange,
    disabled,
    autoComplete,
}: {
    id:           string;
    name:         string;
    placeholder:  string;
    value:        string;
    onChange:     (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled:     boolean;
    autoComplete?: string;
}) {
    const [show, setShow] = useState(false);

    const inputClass =
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    return (
        <div className="relative">
            <input
                id={id}
                name={name}
                type={show ? 'text' : 'password'}
                placeholder={placeholder}
                autoComplete={autoComplete}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={inputClass}
                required
            />
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
            >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    );
}

// =============================================
// Main Page
// =============================================

export default function LandlordRegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading]           = useState(false);
    const [errors, setErrors]                 = useState<string[]>([]);
    const [registerLandlord]                  = useRegisterLandlordMutation();

    const [formData, setFormData] = useState<RegisterLandlordDto>({
        fullName:               '',
        email:                  '',
        phoneNumber:            '',
        password:               '',
        confirmPassword:        '',
        identificationDocument: null,
    });

    const inputClass =
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    const labelClass =
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function validate(): string[] {
        const errs: string[] = [];

        if (!formData.fullName.trim())
            errs.push('Full name is required');

        if (!formData.email.trim())
            errs.push('Email is required');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            errs.push('Please enter a valid email address');

        if (!formData.phoneNumber.trim())
            errs.push('Phone number is required');
        else if (!/^\+?[\d\s\-()]{7,15}$/.test(formData.phoneNumber))
            errs.push('Please enter a valid phone number');

        if (!formData.password)
            errs.push('Password is required');
        else if (formData.password.length < 8)
            errs.push('Password must be at least 8 characters');

        if (formData.password !== formData.confirmPassword)
            errs.push('Passwords do not match');

        if (!formData.identificationDocument)
            errs.push('Identification document (PDF) is required');

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

        const { confirmPassword, identificationDocument, ...rest } = formData;

        try {
            const response = await registerLandlord({
                ...rest,
                identificationDocument: identificationDocument!,
            });

            if ('data' in response && response.data) {
                toast.success(
                    'Registration submitted! A VeriStay admin will review your application.',
                    { autoClose: 5000 }
                );
                router.push('/login');
            } else if ('error' in response && response.error) {
                const error = response.error;
                if ('data' in error && error.data) {
                    const errorData = error.data as {
                        data:      null;
                        success:   boolean;
                        message:   string;
                        Details:   string[] | null;
                        details:   string[] | null;
                        traceId:   string | null;
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

    return (
        <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-10">
            <BaseCard>
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[440px]">

                    {/* Header */}
                    <div className="flex flex-col items-center space-y-3 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                            <Home className="h-7 w-7 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Become a VeriStay Landlord
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Register your account and get verified to list your properties
                            </p>
                        </div>
                    </div>

                    {/* Info notice */}
                    <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                        <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-blue-800">
                            <p className="font-semibold mb-0.5">Verification Required</p>
                            <p>
                                After registration, a VeriStay administrator will review your
                                identification document and approve your account before you can
                                list properties. This typically takes 2–3 business days.
                            </p>
                        </div>
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

                        {/* ── Personal Details ──────────────────── */}
                        <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Personal Details
                            </p>

                            <div className="space-y-2">
                                <label htmlFor="fullName" className={labelClass}>
                                    Full Name
                                </label>
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
                                <label htmlFor="email" className={labelClass}>
                                    Email Address
                                </label>
                                <input
                                    id="email" name="email" type="email"
                                    placeholder="landlord@example.com"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={inputClass} required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phoneNumber" className={labelClass}>
                                    Phone Number
                                </label>
                                <input
                                    id="phoneNumber" name="phoneNumber" type="tel"
                                    placeholder="+27 81 234 5678"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={inputClass} required
                                />
                            </div>
                        </div>

                        {/* ── Identification Document ────────────── */}
                        <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Identification Document
                                </p>
                            </div>

                            <FileUploadField
                                id="identificationDocument"
                                label="ID / Passport Document"
                                description="Upload a clear copy of your South African ID, Smart Card, or Passport. This will be used to verify your identity before your account is approved."
                                file={formData.identificationDocument}
                                onFileChange={(file) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        identificationDocument: file,
                                    }))
                                }
                                onClear={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        identificationDocument: null,
                                    }))
                                }
                                disabled={isLoading}
                            />

                            <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs text-yellow-800">
                                <p className="font-semibold mb-0.5">Accepted documents</p>
                                <ul className="list-disc list-inside space-y-0.5">
                                    <li>South African ID Book or Smart Card</li>
                                    <li>Valid Passport</li>
                                    <li>Must be clearly legible and unexpired</li>
                                </ul>
                            </div>
                        </div>

                        {/* ── Security ──────────────────────────── */}
                        <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Security
                            </p>

                            <div className="space-y-2">
                                <label htmlFor="password" className={labelClass}>
                                    Password
                                </label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    placeholder="Min. 8 characters"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className={labelClass}>
                                    Confirm Password
                                </label>
                                <PasswordInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                {/* Password match indicator */}
                                {formData.confirmPassword.length > 0 && (
                                    <p className={`text-xs flex items-center gap-1 ${
                                        formData.password === formData.confirmPassword
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}>
                                        {formData.password === formData.confirmPassword ? (
                                            <><CheckCircle className="h-3 w-3" /> Passwords match</>
                                        ) : (
                                            <><X className="h-3 w-3" /> Passwords do not match</>
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Terms note */}
                        <p className="text-xs text-muted-foreground text-center px-2">
                            By registering, you agree to VeriStay's terms of service. Your
                            identification document will only be used for verification purposes
                            and will not be shared with third parties.
                        </p>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="h-4 w-4" />
                                    Submit for Verification
                                </>
                            )}
                        </button>
                    </form>

                    <div className="space-y-2 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                                Sign in
                            </Link>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Looking for accommodation instead?{' '}
                            <Link href="/register" className="underline underline-offset-4 hover:text-primary">
                                Register as a student
                            </Link>
                        </p>
                    </div>
                </div>
            </BaseCard>
        </div>
    );
}