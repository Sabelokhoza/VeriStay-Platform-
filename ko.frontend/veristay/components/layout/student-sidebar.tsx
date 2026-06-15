'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';
import { BookOpen, User, CreditCard, GraduationCap, Map } from 'lucide-react';

const navigation = [
  {
    name: 'Learn',
    href: routes.student.learn,
    icon: BookOpen,
  },
  {
    name: 'Profile',
    href: routes.student.profile,
    icon: User,
  },
  {
    name: 'Billing',
    href: routes.student.billing,
    icon: CreditCard,
  },
  {
    name: 'Courses',
    href: routes.student.courses,
    icon: GraduationCap,
  },
  {
    name: 'Roadmap',
    href: routes.student.roadmap,
    icon: Map,
  },
];

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6" />
          <span>Trainers Council</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
