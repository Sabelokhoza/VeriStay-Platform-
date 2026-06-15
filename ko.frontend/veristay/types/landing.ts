import { ReactNode } from 'react';
import { NavLink } from './landing.d';

export const navlinks: NavLink[] = [
    { key: 'process', href: '#process', label: 'Process' },
    { key: 'reasons', href: '#reasons', label: 'Why Us?' },
];

export type Item = {
    name: string;
    description: string;
    icon?: ReactNode;
    color?: string;
    time?: string;
};
