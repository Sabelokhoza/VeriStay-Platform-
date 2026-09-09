import { Users } from 'lucide-react';
import { StudentDto } from '@/app/errors/listingsApi';
import { isPlaceholder } from './utils';
import { StatusBadge } from './StatusBadge';

export function TenantsTab({ tenants }: { tenants: StudentDto[] }) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Active Tenants ({tenants.length})</h2>
            {tenants.length === 0 ? (
                <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>No active tenants yet.</p>
                    <p className="text-xs mt-1">Approve student applications to create tenancies.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tenants.map(tenant => (
                        <div key={tenant.id} className="rounded-xl border bg-background p-4 shadow-sm">
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
