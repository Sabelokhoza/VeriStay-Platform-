'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useUser } from '@/hooks/use-user';
import { ChevronsUpDown, CreditCard, LogOut, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import ProfilePage from '../profile/edit-profile';
import NotificationsPopup from '../profile/notifications';
import Link from 'next/link';
import { persistor, useAppDispatch } from '@/app/store/store';
import { Avatar } from '@heroui/avatar';

export function NavUser() {
    const currentUser = useUser();
    const user = useMemo(() => currentUser, [currentUser]);
    const { isMobile } = useSidebar();
    const [profileDialogOpen, setProfileDialogOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const dispatch = useAppDispatch();
    if (!user) return null;

    const handleLogout = async () => {
        console.log('Logging out...');
        localStorage.removeItem('token');

        // Clear persisted storage and reset redux
        await persistor.purge();
        dispatch({ type: 'RESET_STORE' });

        // Redirect
        window.location.replace('/');
    };

    console.log('User in nav:', user);
    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Avatar />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {user.firstName} {user.lastName}
                                    </span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            side={isMobile ? 'bottom' : 'right'}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">
                                            {user.firstName} {user.lastName}
                                        </span>
                                        <span className="truncate text-xs">{user.email}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onSelect={() => setProfileDialogOpen(true)}>
                                    <User />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/billing" className="flex items-center gap-2">
                                        <CreditCard />
                                        Billing
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            <ProfilePage
                isOpen={profileDialogOpen}
                onClose={() => setProfileDialogOpen(false)}
                currentUser={user}
            />
            <NotificationsPopup open={notificationsOpen} onOpenChange={setNotificationsOpen} />
        </>
    );
}
