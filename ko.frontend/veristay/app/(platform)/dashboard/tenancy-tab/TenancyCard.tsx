import { Home, MapPin, Star, AlertCircle, CreditCard } from 'lucide-react';
import { TenancyDto } from '@/app/errors/listingsApi';
import { formatRent, formatDate, getTenancyStatusLabel, isPlaceholder } from './utils';
import { LeaseDocumentCard } from './LeaseDocumentCard';

export function TenancyCard({ tenancy }: { tenancy: TenancyDto }) {
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

            <LeaseDocumentCard tenancy={tenancy} />

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
