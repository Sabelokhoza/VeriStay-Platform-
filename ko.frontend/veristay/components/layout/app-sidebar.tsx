import {
    Award,
    BarChart,
    BookOpenCheck,
    ChartAreaIcon,
    ClipboardCheck,
    ContactRound,
    Folders,
    GraduationCap,
    GraduationCapIcon,
    HandCoins,
    LayoutDashboard,
    LifeBuoy,
    Pen,
    User2Icon,
    Users,
    UsersRound,
} from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/layout/nav-main';
import { NavSecondary } from '@/components/layout/nav-secondary';
import { NavUser } from '@/components/layout/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Role, useUser } from '@/hooks/use-user';
import { redirect } from 'next/navigation';

const navMainStudent = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
   
];

const navMainPartner = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    // {
    //     title: 'Manage',
    //     url: '/manage',
    //     icon: ContactRound,
    //     items: [
    //         { title: 'Compliance', url: '/manage/compliance', icon: ClipboardCheck },
    //         { title: 'Students', url: '/manage/students', icon: GraduationCap },
    //         { title: 'Reports', url: '/manage/reports', icon: BarChart },
    //     ],
    // },
    { title: 'Students', url: '/students', icon: GraduationCap },
    { title: 'Team', url: '/team', icon: UsersRound },
    { title: 'Enrollments', url: '/enrollments', icon: BookOpenCheck },
    { title: 'Courses', url: '/courses', icon: Folders },
    { title: 'Certificates', url: '/certifications', icon: Award },
    { title: 'Billing', url: '/billing', icon: HandCoins },
];

const navMainAdmin = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Manage Students', url: '/students', icon: GraduationCap },
    { title: 'Manage Courses', url: 'courses/', icon: Folders },
    { title: 'Enrollments', url: 'enrollments/', icon: BookOpenCheck },
    { title: 'Certificates', url: 'certifications/', icon: Award },
    { title: 'Billing', url: 'billing/', icon: HandCoins },
];

const navSecondary = [
    {
        title: 'Support',
        url: '/support',
        icon: LifeBuoy,
    },
];

export function AppSidebar() {
    const currentUser = useUser();
    function getNavMainByRole(role: Role) {
        switch (role) {
            case Role.Student:
                return navMainStudent;
            case Role.Partner:
                return navMainPartner;
            case Role.Admin:
                return navMainAdmin;
            default:
                redirect('/login');
        }
    }
    const navmenu = getNavMainByRole(currentUser.role);
    return (
        <Sidebar variant={'sidebar'} className="bg-secondary/50 border-r border-secondary/20">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="#">
                                <GraduationCapIcon className="size-5" />
                                <div className="text-lg leading-tight">
                                    <span className="font-bold text-primary">Veristay</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navmenu} />
                <NavSecondary items={navSecondary} className="mt-auto bg-primary/20" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
