'use client';

import { UserModel } from '@/hooks/use-user';
import UpdateProfileModal from './edit-profile';

interface ProfilePageProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentUser: UserModel | null;
}

export default function ProfilePage({ open, onOpenChange, currentUser }: ProfilePageProps) {
    return (
        <UpdateProfileModal
            isOpen={open}
            onClose={() => onOpenChange(false)}
            currentUser={currentUser}
        />
    );
}
