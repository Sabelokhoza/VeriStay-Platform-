import { BookOpenText, Settings, ReceiptText, User, GraduationCap, BookOpen } from 'lucide-react';
import { SidebarLink } from './platform.d';

export const studentSidebarItems: SidebarLink[] = [
  { icon: BookOpen, title: 'My Courses', href: '/learn/courses' },
  { icon: ReceiptText, title: 'Billing', href: '/learn/billing' },
  { icon: User, title: 'Profile', href: '/learn/profile' },
];

export const adminSidebarItems: SidebarLink[] = [
  { icon: GraduationCap, title: 'Students', href: '/manage/students' },
  { icon: BookOpenText, title: 'Courses', href: '/manage/courses' },
  { icon: Settings, title: 'Settings', href: '/manage/settings' },
];
