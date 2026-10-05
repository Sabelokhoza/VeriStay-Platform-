'use client';

import { useRef } from 'react';
import {
    FileText, Download, Upload,
    CheckCircle, AlertCircle, Loader2, Eye,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUploadLeaseDocumentMutation, TenancyDto } from '@/app/errors/listingsApi';
import { isPlaceholder, formatDate } from './utils';

export function LeaseDocumentCard({ tenancy }: { tenancy: TenancyDto }) {
    const fileRef  = useRef<HTMLInputElement>(null);
    const [uploadLeaseDocument, { isLoading: isUploading }] = useUploadLeaseDocumentMutation();

    const hasDocument = !isPlaceholder(tenancy.leaseDocument);
    const isSigned    = !!tenancy.signedLeaseUploadedAt;

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

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
            toast.success('Signed lease uploaded. Your landlord can now see it.');
            if (fileRef.current) fileRef.current.value = '';
        } catch (err: any) {
            const msg = err?.data?.Message ?? err?.data?.message ?? 'Failed to upload document.';
            toast.error(msg);
        }
    }

    return (
        <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 border-b px-5 py-4 font-semibold">
                <FileText className="h-4 w-4 text-blue-600" />
                Lease Document
            </div>

            <div className="p-5 space-y-4">
                {hasDocument ? (
                    <>
                        <div className={`flex items-center gap-4 rounded-xl border p-4 ${isSigned ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isSigned ? 'bg-green-100' : 'bg-yellow-100'}`}>
                                <FileText className={`h-6 w-6 ${isSigned ? 'text-green-600' : 'text-yellow-600'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold truncate ${isSigned ? 'text-green-800' : 'text-yellow-800'}`}>
                                    Lease Agreement — {isPlaceholder(tenancy.propertyTitle) ? `Property #${tenancy.propertyId}` : tenancy.propertyTitle}
                                </p>
                                <p className={`text-xs mt-0.5 ${isSigned ? 'text-green-600' : 'text-yellow-700'}`}>
                                    PDF · {isSigned ? 'Signed' : 'Not signed yet'} · Valid until {formatDate(tenancy.leaseEndDate)}
                                </p>
                                <div className="mt-1 flex items-center gap-1">
                                    {isSigned ? (
                                        <>
                                            <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                            <span className="text-xs font-medium text-green-700">
                                                Signed copy uploaded on {formatDate(tenancy.signedLeaseUploadedAt)}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="h-3.5 w-3.5 text-yellow-600" />
                                            <span className="text-xs font-medium text-yellow-700">
                                                Download, sign and upload your signed copy
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <a
                                href={tenancy.leaseDocument}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                            >
                                <Eye className="h-4 w-4 text-blue-600" />
                                View
                            </a>

                            <a
                                href={tenancy.leaseDocument}
                                download={`lease-${tenancy.id}.pdf`}
                                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </a>

                            <button
                                onClick={() => fileRef.current?.click()}
                                disabled={isUploading}
                                className="flex items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-700 hover:bg-orange-100 transition-colors disabled:opacity-50"
                            >
                                {isUploading
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : <Upload className="h-4 w-4" />
                                }
                                {isUploading ? 'Uploading...' : isSigned ? 'Replace' : 'Upload Signed'}
                            </button>
                        </div>

                        <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 text-xs text-blue-800">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>
                                {isSigned
                                    ? 'This is your signed lease agreement. Download a copy for your records. Use Replace if you need to upload a corrected version.'
                                    : 'Download the lease, sign it, then use Upload Signed to send the signed PDF back. Your landlord will see when it has been uploaded.'}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
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
