export const routes = {
    // Public routes
    home: '/',
    login: '/login',
    register: '/register',

    // Student routes
    student: {
        learn: '/learn',
        profile: '/profile',
        billing: '/billing',
        checkout: '/checkout',
        courses: '/courses',
        roadmap: '/roadmap',
    },

    // Partner routes
    partner: {
        dashboard: '/dashboard',
        manage: '/manage',
        profile: '/profile',
        courses: {
            list: '/courses',
        },
        students: '/students',
        reports: '/reports',
        compliance: '/compliance',
    },

    // Admin routes
    admin: {
        partners: '/partners',
        reports: '/reports',
        audit: '/audit',
    },

    // Shared platform routes
    platform: {
        certifications: {
            list: '/certifications',
            manage: '/certifications/manage',
        },
        notifications: '/notifications',
    },
} as const;

export type RouteKey = keyof typeof routes;
export type StudentRouteKey = keyof typeof routes.student;
export type PartnerRouteKey = keyof typeof routes.partner;
export type AdminRouteKey = keyof typeof routes.admin;
export type PlatformRouteKey = keyof typeof routes.platform;
