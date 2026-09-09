import { ShieldCheck, AlertTriangle, Eye, ChevronRight, Clock, CheckCircle, XCircle, ShieldX } from 'lucide-react';
import { AdminLandlordDto } from '@/app/errors/listingsApi';
import { formatDate, getLandlordStatusLabel } from './utils';
import { StatusBadge } from './StatusBadge';

export function LandlordsTab({
    pendingLandlords,
    onSelectLandlord,
}: {
    pendingLandlords: AdminLandlordDto[];
    onSelectLandlord: (landlord: AdminLandlordDto) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Landlord Verification ({pendingLandlords.length} pending)
                </h2>
                {pendingLandlords.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 border border-red-200 px-3 py-1 text-xs font-semibold text-red-800">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {pendingLandlords.length} require review
                    </span>
                )}
            </div>

            {pendingLandlords.length === 0 ? (
                <div className="rounded-xl border bg-background p-10 text-center">
                    <ShieldCheck className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-60" />
                    <p className="font-medium">All landlords verified</p>
                    <p className="text-sm text-muted-foreground mt-1">No pending applications to review.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {pendingLandlords.map(l => (
                        <div key={l.id}
                            onClick={() => onSelectLandlord(l)}
                            className="rounded-xl border bg-background p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300 ring-1 ring-yellow-100 transition-all">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white shrink-0">
                                        {l.fullName?.charAt(0)?.toUpperCase() ?? 'L'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold">{l.fullName ?? 'Landlord'}</p>
                                        <p className="text-sm text-muted-foreground">{l.email}</p>
                                        {l.phoneNumber && (
                                            <p className="text-xs text-muted-foreground">{l.phoneNumber}</p>
                                        )}
                                        <div className="mt-1 flex items-center gap-3 flex-wrap">
                                            <span className="text-xs text-muted-foreground">
                                                Registered {formatDate(l.createdAt)}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {l.propertiesCount} {l.propertiesCount === 1 ? 'property' : 'properties'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <StatusBadge
                                        label={getLandlordStatusLabel(l.verificationStatus).label}
                                        style={getLandlordStatusLabel(l.verificationStatus).style}
                                    />
                                    {l.documentsUrl && (
                                        <a href={l.documentsUrl} target="_blank" rel="noopener noreferrer"
                                            onClick={e => e.stopPropagation()}
                                            className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium hover:bg-muted transition-colors">
                                            <Eye className="h-3.5 w-3.5" /> ID Doc
                                        </a>
                                    )}
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>

                            <div className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs border ${
                                l.verificationStatus === 0 ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                l.verificationStatus === 1 ? 'bg-green-50  border-green-200  text-green-800'  :
                                l.verificationStatus === 2 ? 'bg-red-50    border-red-200    text-red-800'    :
                                                             'bg-gray-50   border-gray-200   text-gray-700'
                            }`}>
                                {l.verificationStatus === 0 && (
                                    <>
                                        <Clock className="h-4 w-4 shrink-0" />
                                        <span>
                                            <strong>Awaiting verification.</strong> This landlord's
                                            identity documents are pending review. Tap to approve or reject.
                                        </span>
                                    </>
                                )}
                                {l.verificationStatus === 1 && (
                                    <>
                                        <CheckCircle className="h-4 w-4 shrink-0" />
                                        <span>
                                            <strong>Verified landlord. ✅</strong> This landlord has
                                            been approved and can list properties on VeriStay.
                                        </span>
                                    </>
                                )}
                                {l.verificationStatus === 2 && (
                                    <>
                                        <XCircle className="h-4 w-4 shrink-0" />
                                        <span>
                                            <strong>Verification rejected.</strong> This landlord was
                                            not approved and cannot list properties on VeriStay.
                                        </span>
                                    </>
                                )}
                                {l.verificationStatus === 3 && (
                                    <>
                                        <ShieldX className="h-4 w-4 shrink-0" />
                                        <span>
                                            <strong>Account suspended.</strong> This landlord has been
                                            suspended and their listings are hidden from students.
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
