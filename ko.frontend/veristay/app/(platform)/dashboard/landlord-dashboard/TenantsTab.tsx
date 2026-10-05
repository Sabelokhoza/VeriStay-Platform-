import { Users, FileText, FileCheck, FileClock, Eye } from 'lucide-react';
import { StudentDto, TenancyDto, useGetTenanciesByLandlordIdQuery } from '@/app/errors/listingsApi';
import { isPlaceholder, formatDate } from './utils';
import { StatusBadge } from './StatusBadge';

function LeaseStatus({ tenancy, isLoading }: { tenancy?: TenancyDto; isLoading: boolean }) {
    if (isLoading) {
        return <div className="h-10 rounded-lg bg-muted animate-pulse" />;
    }

    if (!tenancy) {
        return (
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                <FileText className="h-4 w-4 shrink-0" />
                No tenancy record found for this tenant.
            </div>
        );
    }

    const hasDocument = !isPlaceholder(tenancy.leaseDocument);
    const isSigned    = !!tenancy.signedLeaseUploadedAt;
    const property    = isPlaceholder(tenancy.propertyTitle) ? `Property #${tenancy.propertyId}` : tenancy.propertyTitle;

    const tone = isSigned
        ? 'border-green-200 bg-green-50 text-green-800'
        : hasDocument
            ? 'border-yellow-200 bg-yellow-50 text-yellow-800'
            : 'border-gray-200 bg-gray-50 text-gray-700';

    return (
        <div className={`flex flex-col gap-2 rounded-lg border px-3 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between ${tone}`}>
            <div className="flex items-start gap-2 min-w-0">
                {isSigned
                    ? <FileCheck className="h-4 w-4 shrink-0 mt-0.5" />
                    : <FileClock className="h-4 w-4 shrink-0 mt-0.5" />}
                <div className="min-w-0">
                    <p className="font-semibold">
                        {isSigned
                            ? `Signed lease uploaded on ${formatDate(tenancy.signedLeaseUploadedAt)}`
                            : hasDocument
                                ? 'Awaiting signed lease from student'
                                : 'No lease document yet'}
                    </p>
                    <p className="truncate opacity-80">
                        {property} · {formatDate(tenancy.leaseStartDate)} to {formatDate(tenancy.leaseEndDate)}
                    </p>
                </div>
            </div>
            {hasDocument && (
                <a
                    href={tenancy.leaseDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border bg-background px-3 py-1.5 font-medium text-foreground hover:bg-muted transition-colors"
                >
                    <Eye className="h-3.5 w-3.5 text-blue-600" />
                    {isSigned ? 'View signed lease' : 'View unsigned lease'}
                </a>
            )}
        </div>
    );
}

export function TenantsTab({ tenants, landlordId }: { tenants: StudentDto[]; landlordId: string }) {
    const { data: tenancies = [], isLoading } =
        useGetTenanciesByLandlordIdQuery(landlordId, { skip: !landlordId });

    const signedCount = tenants.filter(t =>
        tenancies.find(x => x.studentId === t.id)?.signedLeaseUploadedAt,
    ).length;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">Active Tenants ({tenants.length})</h2>
                {tenants.length > 0 && !isLoading && (
                    <span className="text-xs text-muted-foreground">
                        {signedCount} of {tenants.length} signed leases received
                    </span>
                )}
            </div>
            {tenants.length === 0 ? (
                <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>No active tenants yet.</p>
                    <p className="text-xs mt-1">Approve student applications to create tenancies.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tenants.map(tenant => (
                        <div key={tenant.id} className="rounded-xl border bg-background p-4 shadow-sm space-y-3">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white shrink-0">
                                    {(isPlaceholder(tenant.fullName) ? tenant.id : tenant.fullName).charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold">
                                        {isPlaceholder(tenant.fullName) ? `Tenant #${tenant.id.slice(0, 8)}` : tenant.fullName}
                                    </p>
                                    {!isPlaceholder(tenant.email) && (
                                        <p className="text-sm text-muted-foreground truncate">{tenant.email}</p>
                                    )}
                                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                        {!isPlaceholder(tenant.phoneNumber) && <span>{tenant.phoneNumber}</span>}
                                        {!isPlaceholder(tenant.university) && <span>{tenant.university}</span>}
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <StatusBadge label="Active Tenant" style="bg-green-100 text-green-800 border-green-200" />
                                </div>
                            </div>
                            {/* Tenancies come newest first, so find() picks the student's current lease. */}
                            <LeaseStatus
                                tenancy={tenancies.find(t => t.studentId === tenant.id)}
                                isLoading={isLoading}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
