'use client';

import { useState } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { LandlordMaintenanceDto } from '@/app/errors/listingsApi';
import { formatDate, getMaintPriorityLabel, getMaintStatusLabel, isPlaceholder } from './utils';
import { StatusBadge } from './StatusBadge';

export function MaintenanceResponseModal({
    item, onClose, onResolve, isLoading,
}: {
    item: LandlordMaintenanceDto; onClose: () => void;
    onResolve: (response: string) => void; isLoading: boolean;
}) {
    const [response, setResponse] = useState('');
    const priority = getMaintPriorityLabel(item.priority);
    const status   = getMaintStatusLabel(item.status);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
                <div className="bg-orange-500 px-6 py-5 text-white">
                    <button onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Maintenance Request</h2>
                    <p className="text-sm text-orange-100 mt-0.5">
                        {isPlaceholder(item.propertyTitle) ? `Property #${item.propertyId}` : item.propertyTitle}
                    </p>
                </div>

                <div className="px-6 py-4 border-b bg-muted/30 space-y-2">
                    <p className="font-semibold">{isPlaceholder(item.title) ? 'Maintenance Issue' : item.title}</p>
                    {!isPlaceholder(item.description) && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-xs font-semibold ${priority.style}`}>{priority.label} Priority</span>
                        <StatusBadge label={status.label} style={status.style} />
                        <span className="text-xs text-muted-foreground">Submitted {formatDate(item.submittedAt)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Student ID: {item.studentId.slice(0, 8)}...</p>
                </div>

                <div className="px-6 py-5 space-y-3">
                    <label className="text-sm font-medium">Response / Resolution Note</label>
                    <textarea rows={3} value={response} onChange={e => setResponse(e.target.value)}
                        placeholder="Describe the action taken or planned response..."
                        className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none" />
                    <button onClick={() => onResolve(response)} disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        Mark as Resolved
                    </button>
                    <button onClick={onClose}
                        className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
