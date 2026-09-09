'use client';

import { useState } from 'react';
import { X, Loader2, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSendPaymentReminderMutation, LandlordPaymentSummaryDto } from '@/app/errors/listingsApi';
import { formatRent, isPlaceholder } from './utils';

export function SendReminderModal({
    summary,
    onClose,
}: {
    summary: LandlordPaymentSummaryDto;
    onClose: () => void;
}) {
    const [message, setMessage] = useState('');
    const [sendReminder, { isLoading }] = useSendPaymentReminderMutation();

    async function handleSend() {
        try {
            await sendReminder({
                tenancyId:    summary.tenancyId,
                studentId:    summary.studentId,
                studentEmail: '',
                message:      message.trim(),
            }).unwrap();
            toast.success(`Reminder sent to ${summary.studentName}`);
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.Message ?? 'Failed to send reminder.');
        }
    }

    const overdueCount = summary.payments.filter(p => p.status === 2).length;
    const pendingCount = summary.payments.filter(p => p.status === 0).length;
    const totalOwed    = summary.totalOwed;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
                <div className="bg-orange-500 px-6 py-5 text-white">
                    <button onClick={onClose} disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Send Payment Reminder</h2>
                    <p className="text-sm text-orange-100 mt-0.5">{summary.studentName}</p>
                </div>

                <div className="px-6 py-4 border-b bg-muted/30 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Property</span>
                        <span className="font-medium text-right max-w-[220px] truncate">
                            {isPlaceholder(summary.propertyTitle)
                                ? `Tenancy #${summary.tenancyId}`
                                : summary.propertyTitle}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Outstanding</span>
                        <span className="font-bold text-red-600">R {formatRent(totalOwed)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Overdue</span>
                        <span className={`font-semibold ${overdueCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {overdueCount} payment{overdueCount !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Pending</span>
                        <span className="font-semibold text-yellow-600">
                            {pendingCount} payment{pendingCount !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <div>
                        <label className="text-sm font-semibold">
                            Personal Message
                            <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
                        </label>
                        <textarea
                            rows={3}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            disabled={isLoading}
                            placeholder="Add a personal note to the reminder email..."
                            maxLength={500}
                            className="mt-1.5 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none disabled:opacity-50"
                        />
                        <p className="text-right text-xs text-muted-foreground mt-1">
                            {message.length}/500
                        </p>
                    </div>

                    <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800">
                        A reminder email will be sent to the student listing all overdue and
                        pending payments with a link to their dashboard to pay.
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                        {isLoading
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                            : <><Send className="h-4 w-4" /> Send Reminder</>
                        }
                    </button>
                    <button onClick={onClose} disabled={isLoading}
                        className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
