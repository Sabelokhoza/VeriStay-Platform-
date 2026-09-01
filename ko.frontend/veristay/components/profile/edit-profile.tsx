'use client';

import { useState } from 'react';
import {
    useUpdateProfileMutation,
    useGetUserQuery,
} from '@/app/errors/authApi';
import { toast }       from 'react-toastify';
import { Loader2 }     from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { UserModel }           from '@/hooks/use-user';
import { useDispatch }         from 'react-redux';
import { updateUserProfile }   from '@/app/store/useAuthSlice';

interface UpdateProfileModalProps {
    isOpen:      boolean;
    onClose:     () => void;
    currentUser: UserModel | null;
}

export default function UpdateProfileModal({
    isOpen,
    onClose,
    currentUser,
}: UpdateProfileModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [errors,    setErrors]    = useState<string[]>([]);
    const [updateProfile]           = useUpdateProfileMutation();
    const dispatch                  = useDispatch();

    // ✅ Fetch fresh profile from backend when modal opens
    const {
        data:      userResponse,
        isLoading: isFetching,
        isError:   fetchError,
    } = useGetUserQuery(currentUser?.id ?? '', {
        skip: !currentUser?.id || !isOpen, // only fetch when modal is open
    });

    if (!currentUser) return null;

    // ✅ Use fetched data — fall back to currentUser while loading
    const user       = (userResponse?.data ?? currentUser) as any;
    const role       = (user.role ?? (currentUser as any).role ?? '').toLowerCase();
    const isStudent  = role === 'student';
    const isLandlord = role === 'landlord';

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!currentUser) return;

        setIsLoading(true);
        setErrors([]);

        const form = new FormData(e.currentTarget);

        const payload: any = {
            id:          currentUser.id,
            fullName:    form.get('fullName')    as string,
            email:       form.get('email')       as string,
            phoneNumber: form.get('phoneNumber') as string,
        };

        if (isStudent) {
            payload.studentNumber = form.get('studentNumber') as string;
            payload.university    = form.get('university')    as string;
            payload.budget        = Number(form.get('budget') ?? 0);
        }

        try {
            const response = await updateProfile(payload);

            if ('data' in response && response.data) {
                if (response.data.data) {
                    dispatch(updateUserProfile(response.data.data));
                }
                toast.success('Profile updated successfully');
                onClose();
            } else if ('error' in response) {
                const err      = (response.error as any)?.data;
                const messages = err?.details?.length
                    ? err.details
                    : [err?.message ?? 'Failed to update profile'];
                setErrors(messages);
                toast.error(messages[0]);
            }
        } catch {
            setErrors(['Something went wrong. Please try again.']);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                        Update Profile
                    </DialogTitle>
                </DialogHeader>

                {/* ── Role badge ─────────────────────────────── */}
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        isStudent  ? 'bg-blue-50  text-blue-700  border-blue-200'  :
                        isLandlord ? 'bg-green-50 text-green-700 border-green-200' :
                                     'bg-gray-50  text-gray-700  border-gray-200'
                    }`}>
                        {isStudent ? '🎓 Student' : isLandlord ? '🏠 Landlord' : '👤 Admin'}
                    </span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>

                {/* ── Loading state ──────────────────────────── */}
                {isFetching ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">
                            Loading profile...
                        </span>
                    </div>
                ) : fetchError ? (
                    <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                        Failed to load profile. Please close and try again.
                    </div>
                ) : (
                    <>
                        {/* ── Errors ───────────────────────────── */}
                        {errors.length > 0 && (
                            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
                                <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                                    {errors.map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-4">

                            {/* ── Full Name ────────────────────── */}
                            <div className="space-y-1.5">
                                <label htmlFor="fullName" className="text-sm font-medium">
                                    Full Name
                                </label>
                                <input
                                    id="fullName" name="fullName" type="text"
                                    disabled={isLoading}
                                    defaultValue={user.fullName ?? ''}
                                    placeholder="Enter your full name"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                                />
                            </div>

                            {/* ── Email ────────────────────────── */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    id="email" name="email" type="email"
                                    disabled={isLoading}
                                    defaultValue={user.email ?? ''}
                                    placeholder="Enter your email"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                                />
                            </div>

                            {/* ── Phone ────────────────────────── */}
                            <div className="space-y-1.5">
                                <label htmlFor="phoneNumber" className="text-sm font-medium">
                                    Phone Number
                                </label>
                                <input
                                    id="phoneNumber" name="phoneNumber" type="tel"
                                    disabled={isLoading}
                                    defaultValue={user.phoneNumber ?? ''}
                                    placeholder="Enter your phone number"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                                />
                            </div>

                            {/* ── Student only ─────────────────── */}
                            {isStudent && (
                                <>
                                    <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
                                        <p className="text-xs font-semibold text-blue-700 mb-0.5">
                                            Student Information
                                        </p>
                                        <p className="text-xs text-blue-600">
                                            These fields are only available for students.
                                        </p>
                                    </div>

                                    {/* Student Number */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="studentNumber" className="text-sm font-medium">
                                            Student Number
                                        </label>
                                        <input
                                            id="studentNumber" name="studentNumber" type="text"
                                            disabled={isLoading}
                                            defaultValue={user.studentNumber ?? ''}
                                            placeholder="Enter your student number"
                                            required
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                                        />
                                    </div>

                                    {/* University */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="university" className="text-sm font-medium">
                                            University
                                        </label>
                                        <input
                                            id="university" name="university" type="text"
                                            disabled={isLoading}
                                            defaultValue={user.university ?? 'University Of The Freestate'}
                                            placeholder="Enter your university"
                                            required
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                                        />
                                    </div>

                                    {/* Budget */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="budget" className="text-sm font-medium">
                                            Monthly Budget (ZAR)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                                                R
                                            </span>
                                            <input
                                                id="budget" name="budget" type="number"
                                                min={0} step={1}
                                                disabled={isLoading}
                                                defaultValue={user.budget ?? 0}
                                                placeholder="0"
                                                required
                                                className="flex h-10 w-full rounded-md border border-input bg-background pl-7 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Your maximum monthly accommodation budget
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* ── Landlord banner ───────────────── */}
                            {isLandlord && (
                                <div className="rounded-lg bg-green-50 border border-green-100 px-3 py-2">
                                    <p className="text-xs font-semibold text-green-700 mb-0.5">
                                        Landlord Account
                                    </p>
                                    <p className="text-xs text-green-600">
                                        Update your contact details above. Property
                                        information is managed per listing.
                                    </p>
                                </div>
                            )}

                            {/* ── Actions ───────────────────────── */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button" onClick={onClose} disabled={isLoading}
                                    className="inline-flex flex-1 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit" disabled={isLoading}
                                    className="inline-flex flex-1 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {isLoading
                                        ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Updating...</>
                                        : 'Update Profile'
                                    }
                                </button>
                            </div>

                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}