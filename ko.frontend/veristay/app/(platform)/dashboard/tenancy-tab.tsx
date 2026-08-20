// =============================================
// tenancy-tab.tsx
// =============================================

'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
    Home, MapPin, Star, FileText, Download, Upload,
    CheckCircle, AlertCircle, Clock, Search, Loader2,
    X, Eye, Calendar, CreditCard, ExternalLink,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
    useGetTenancyInfoQuery,
    useUploadLeaseDocumentMutation,
    TenancyDto,
} from '@/app/errors/listingsApi';
import { useAppSelector } from '@/app/store/store';

// =============================================
// Helpers
// =============================================

function formatRent(amount: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount);
}

function formatDate(date: string | null) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

function getTenancyStatusLabel(status: number) {
    switch (status) {
        case 0:  return { label: 'Active',      style: 'bg-green-100 text-green-800 border-green-200',  icon: CheckCircle  };
        case 1:  return { label: 'Ended',       style: 'bg-gray-100  text-gray-700  border-gray-200',   icon: Clock        };
        case 2:  return { label: 'Terminated',  style: 'bg-red-100   text-red-800   border-red-200',    icon: AlertCircle  };
        default: return { label: 'Unknown',     style: 'bg-gray-100  text-gray-700  border-gray-200',   icon: AlertCircle  };
    }
}

function isPlaceholder(v: string | null | undefined) {
    if (!v) return true;
    const l = v.trim().toLowerCase();
    return l === 'string' || l === 'string - string' || l === '';
}

// =============================================
// Lease Document Card
// =============================================

function LeaseDocumentCard({ tenancy }: { tenancy: TenancyDto }) {
    const fileRef  = useRef<HTMLInputElement>(null);
    const [uploadLeaseDocument, { isLoading: isUploading }] = useUploadLeaseDocumentMutation();

    const hasDocument = !isPlaceholder(tenancy.leaseDocument);

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate
        const allowed = ['application/pdf'];
        if (!allowed.includes(file.type)) {
            toast.error('Only PDF files are accepted for lease documents.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Lease document must be smaller than 10MB.');
            return;
        }

        try {
            await uploadLeaseDocument({ tenancyId: tenancy.id, file }).unwrap();
            toast.success('Lease document uploaded successfully!');
            if (fileRef.current) fileRef.current.value = '';
        } catch (err: any) {
            const msg = err?.data?.Message ?? err?.data?.message ?? 'Failed to upload document.';
            toast.error(msg);
        }
    }

    return (
        <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 border-b px-5 py-4 font-semibold">
                <FileText className="h-4 w-4 text-blue-600" />
                Lease Document
            </div>

            <div className="p-5 space-y-4">
                {hasDocument ? (
                    <>
                        {/* Document preview card */}
                        <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
                                <FileText className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-green-800 truncate">
                                    Lease Agreement — {isPlaceholder(tenancy.propertyTitle) ? `Property #${tenancy.propertyId}` : tenancy.propertyTitle}
                                </p>
                                <p className="text-xs text-green-600 mt-0.5">
                                    PDF · Signed · Valid until {formatDate(tenancy.leaseEndDate)}
                                </p>
                                <div className="mt-1 flex items-center gap-1">
                                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                    <span className="text-xs font-medium text-green-700">Document available</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {/* View */}
                            <a
                                href={tenancy.leaseDocument}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                            >
                                <Eye className="h-4 w-4 text-blue-600" />
                                View
                            </a>

                            {/* Download */}
                            <a
                                href={tenancy.leaseDocument}
                                download={`lease-${tenancy.id}.pdf`}
                                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </a>

                            {/* Replace */}
                            <button
                                onClick={() => fileRef.current?.click()}
                                disabled={isUploading}
                                className="flex items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-700 hover:bg-orange-100 transition-colors disabled:opacity-50"
                            >
                                {isUploading
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : <Upload className="h-4 w-4" />
                                }
                                {isUploading ? 'Uploading...' : 'Replace'}
                            </button>
                        </div>

                        {/* Info note */}
                        <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 text-xs text-blue-800">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>
                                This is your signed lease agreement.
                                Download a copy for your records.
                                If you need to upload a signed version, use the Replace button.
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        {/* No document — upload zone */}
                        <div className="rounded-xl border-2 border-dashed border-input bg-muted/30 p-8 text-center">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                                <Upload className="h-7 w-7 text-blue-600" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">
                                No lease document yet
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Your landlord will upload your lease agreement here, or you can
                                upload your signed copy below.
                            </p>
                            <button
                                onClick={() => fileRef.current?.click()}
                                disabled={isUploading}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isUploading
                                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                                    : <><Upload className="h-4 w-4" /> Upload Signed Lease</>
                                }
                            </button>
                        </div>

                        <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-xs text-yellow-800">
                            <p className="font-semibold mb-0.5">📋 How lease documents work</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Your landlord uploads the lease agreement for you to sign.</li>
                                <li>Download it, sign it, and upload the signed copy here.</li>
                                <li>Only PDF files are accepted · Max 10MB.</li>
                            </ul>
                        </div>
                    </>
                )}

                {/* Hidden file input */}
                <input
                    ref={fileRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={isUploading}
                />
            </div>
        </div>
    );
}

// =============================================
// Single Tenancy Card
// =============================================

function TenancyCard({ tenancy }: { tenancy: TenancyDto }) {
    const statusInfo = getTenancyStatusLabel(tenancy.status);
    const StatusIcon = statusInfo.icon;

    const today        = new Date();
    const leaseEnd     = new Date(tenancy.leaseEndDate);
    const daysLeft     = Math.max(0, Math.ceil((leaseEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const leaseStart   = new Date(tenancy.leaseStartDate);
    const leaseProgress = (() => {
        const start = leaseStart.getTime();
        const end   = leaseEnd.getTime();
        const now   = today.getTime();
        return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
    })();

    return (
        <div className="space-y-4">
            {/* Main card */}
            <div className="rounded-xl border bg-background p-5 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-blue-50 p-3 shrink-0">
                        <Home className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold truncate">
                            {isPlaceholder(tenancy.propertyTitle)
                                ? `Property #${tenancy.propertyId}`
                                : tenancy.propertyTitle}
                        </p>
                        {!isPlaceholder(tenancy.location) && (
                            <p className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                                {tenancy.location}
                            </p>
                        )}
                        {!isPlaceholder(tenancy.landlordName) && (
                            <p className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                                <Star className="h-3.5 w-3.5 text-blue-600" />
                                Landlord: <span className="font-medium text-foreground ml-1">{tenancy.landlordName}</span>
                            </p>
                        )}
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold shrink-0 ${statusInfo.style}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                    </span>
                </div>

                {/* Key stats */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Monthly Rent</p>
                        <p className="text-lg font-bold text-blue-600">R {formatRent(tenancy.monthlyRent)}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Lease Start</p>
                        <p className="text-sm font-semibold">{formatDate(tenancy.leaseStartDate)}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Lease End</p>
                        <p className="text-sm font-semibold">{formatDate(tenancy.leaseEndDate)}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Days Remaining</p>
                        <p className={`text-lg font-bold ${daysLeft <= 30 ? 'text-red-600' : 'text-foreground'}`}>
                            {daysLeft}
                        </p>
                    </div>
                </div>

                {/* Lease progress bar */}
                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Lease Progress</span>
                        <span>{leaseProgress}% complete</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${
                                leaseProgress >= 80 ? 'bg-red-500' :
                                leaseProgress >= 50 ? 'bg-yellow-500' :
                                'bg-blue-600'
                            }`}
                            style={{ width: `${leaseProgress}%` }}
                        />
                    </div>
                    <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                        <span>{formatDate(tenancy.leaseStartDate)}</span>
                        <span>{formatDate(tenancy.leaseEndDate)}</span>
                    </div>
                </div>

                {/* Expiry warnings */}
                {daysLeft <= 30 && daysLeft > 0 && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-800">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Your lease expires in <strong className="mx-1">{daysLeft} days</strong>.
                        Please contact your landlord about renewal.
                    </div>
                )}
                {daysLeft === 0 && tenancy.status === 0 && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-700">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Your lease has ended. Please contact your landlord or browse new properties.
                    </div>
                )}
            </div>

            

            {/* Lease Document */}
            <LeaseDocumentCard tenancy={tenancy} />

            {/* Tenancy summary */}
            <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 border-b px-5 py-4 font-semibold">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    Tenancy Summary
                </div>
                <div className="divide-y px-5">
                    {[
                        { label: 'Tenant',         value: tenancy.studentName },
                        { label: 'Property ID',    value: `#${tenancy.propertyId}` },
                        { label: 'Monthly Rent',   value: `R ${formatRent(tenancy.monthlyRent)}`, bold: true, blue: true },
                        { label: 'Lease Duration', value: `${formatDate(tenancy.leaseStartDate)} → ${formatDate(tenancy.leaseEndDate)}` },
                        { label: 'Days Remaining', value: `${daysLeft} days`, red: daysLeft <= 30 },
                    ].map(row => (
                        <div key={row.label} className="flex items-center justify-between py-3 text-sm">
                            <span className="text-muted-foreground">{row.label}</span>
                            <span className={`font-medium ${row.blue ? 'font-bold text-blue-600' : ''} ${row.red ? 'text-red-600 font-semibold' : ''}`}>
                                {row.value ?? '—'}
                            </span>
                        </div>
                    ))}
                    <div className="flex items-center justify-between py-3 text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.style}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =============================================
// Skeleton
// =============================================

function TenancySkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-8 w-40 rounded bg-muted" />
            <div className="h-52 rounded-xl bg-muted" />
            <div className="h-40 rounded-xl bg-muted" />
            <div className="h-36 rounded-xl bg-muted" />
        </div>
    );
}

// =============================================
// Main TenancyTab
// =============================================

// =============================================
// Updated TenancyTab — single tenancy
// =============================================

export function TenancyTab({ studentId }: { studentId: string }) {
    const {
        data:      tenancy,
        isLoading,
        isError,
        isFetching,
    } = useGetTenancyInfoQuery(studentId, { skip: !studentId });

    if (isLoading || isFetching) return <TenancySkeleton />;

    if (isError || !tenancy) {
        return (
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">My Tenancy</h2>
                <div className="rounded-xl border bg-background p-10 text-center">
                    <Home className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-sm font-medium text-muted-foreground">
                        No active tenancy found.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Once your application is approved and a tenancy is created,
                        your lease details will appear here.
                    </p>
                    <Link
                        href="/listings"
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                        <Search className="h-4 w-4" />
                        Browse Properties
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">My Tenancy</h2>
            <TenancyCard tenancy={tenancy} />
        </div>
    );
}