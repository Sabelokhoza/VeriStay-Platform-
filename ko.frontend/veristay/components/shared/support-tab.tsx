'use client';

import { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export default function SupportTab({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [message, setMessage] = useState('');
    const [status, setStatus]   = useState<'idle' | 'sending' | 'sent'>('idle');

    function handleOpenChange(next: boolean) {
        if (!next) {
            setMessage('');
            setStatus('idle');
        }
        onOpenChange(next);
    }

    // No support backend yet: simulate sending so the user gets confirmation.
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!message.trim()) return;
        setStatus('sending');
        await new Promise(r => setTimeout(r, 800));
        setStatus('sent');
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                {status === 'sent' ? (
                    <div className="flex flex-col items-center py-6 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-7 w-7 text-green-600" />
                        </div>
                        <DialogTitle>Message sent</DialogTitle>
                        <DialogDescription className="mt-2">
                            Thanks for reaching out. Our support team will get back to you as soon as possible.
                        </DialogDescription>
                        <Button className="mt-6" onClick={() => handleOpenChange(false)}>
                            Close
                        </Button>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Need Help? We are Here for You!</DialogTitle>
                            <DialogDescription>
                                Fill out the form below, and our team will get back to you as soon as
                                possible.
                            </DialogDescription>
                        </DialogHeader>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <Textarea
                                id="feedback"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Give us as much detail as possible"
                                aria-label="Message"
                                disabled={status === 'sending'}
                            />
                            <div className="flex flex-col sm:flex-row sm:justify-end">
                                <Button type="submit" disabled={!message.trim() || status === 'sending'}>
                                    {status === 'sending' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {status === 'sending' ? 'Sending...' : 'Send'}
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
