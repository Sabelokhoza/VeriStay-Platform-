'use client';

import { useState, useEffect } from 'react';
import { useUpdateProfileMutation } from '@/app/errors/authApi';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserModel } from '@/hooks/use-user';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '@/app/store/useAuthSlice';

interface UpdateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: UserModel | null;
}

export default function UpdateProfileModal({
    isOpen,
    onClose,
    currentUser,
}: UpdateProfileModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [citizenship, setCitizenship] = useState('south-african');
    const [updateProfile] = useUpdateProfileMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUser?.isSouthAfrican !== undefined) {
            setCitizenship(currentUser.isSouthAfrican ? 'south-african' : 'other');
        }
    }, [currentUser]);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!currentUser) {
            toast.error('User data is not available');
            return;
        }

        setIsLoading(true);
        setErrors([]);

        const formData = new FormData(event.currentTarget);

        const data = {
            id: currentUser.id,
            idNumber: formData.get('idNumber') as string,
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            isSouthAfrican: citizenship === 'south-african',
            address: formData.get('address') as string,
            phoneNumber: formData.get('phoneNumber') as string,
            email: formData.get('email') as string,
        };

        try {
            const response = await updateProfile(data);
            console.log('Update profile response:', response);

            if ('data' in response && response.data) {
                if (response.data.data) {
                    dispatch(updateUserProfile(response.data.data));
                }
                toast.success('Profile Updated Successfully');
                onClose();
            } else if ('error' in response && response.error) {
                const { error } = response;
                console.log('Update profile error:', error);

                if ('data' in error && error.data) {
                    const errorData = error.data as any;

                    if (
                        errorData.details &&
                        Array.isArray(errorData.details) &&
                        errorData.details.length > 0
                    ) {
                        setErrors(errorData.details);
                        toast.error('Please check the form for errors');
                    } else if (errorData.message) {
                        setErrors([errorData.message]);
                        toast.error(errorData.message);
                    } else {
                        setErrors(['Failed to update profile. Please try again.']);
                        toast.error('Failed to update profile. Please try again.');
                    }
                } else if ('message' in error) {
                    const errorMessage = (error as any).message || 'Failed to update profile';
                    setErrors([errorMessage]);
                    toast.error(errorMessage);
                } else {
                    setErrors(['Failed to update profile. Please try again.']);
                    toast.error('Failed to update profile. Please try again.');
                }
            }
        } catch (error) {
            console.error('Update profile catch error:', error);
            setErrors(['Something went wrong. Please try again.']);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    if (!currentUser) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">Update Profile</DialogTitle>
                </DialogHeader>

                {errors.length > 0 && (
                    <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <div className="mt-2">
                                    <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    <input type="hidden" name="id" value={currentUser.id} />
                    <input
                        type="hidden"
                        name="isSouthAfrican"
                        value={citizenship === 'south-african' ? 'true' : 'false'}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Citizenship</label>

                        <input
                            type="text"
                            value={
                                citizenship === 'south-african'
                                    ? 'South African'
                                    : 'Non-South African'
                            }
                            disabled
                            className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="idNumber"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            ID /Passport Number
                        </label>
                        <input
                            id="idNumber"
                            name="idNumber"
                            type="text"
                            disabled={isLoading}
                            defaultValue={currentUser.idNumber}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter your ID number"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="firstName"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                First Name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoCapitalize="words"
                                autoComplete="given-name"
                                autoCorrect="off"
                                disabled={isLoading}
                                defaultValue={currentUser.firstName}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="First name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="lastName"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoCapitalize="words"
                                autoComplete="family-name"
                                autoCorrect="off"
                                disabled={isLoading}
                                defaultValue={currentUser.lastName}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Last name"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="address"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Address
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            rows={3}
                            autoComplete="street-address"
                            disabled={isLoading}
                            defaultValue={currentUser.address}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                            placeholder="Enter your full address"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="phoneNumber"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Phone Number
                        </label>
                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            autoComplete="tel"
                            disabled={isLoading}
                            defaultValue={currentUser.phoneNumber}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            defaultValue={currentUser.email}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="inline-flex flex-1 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex flex-1 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                            {isLoading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
