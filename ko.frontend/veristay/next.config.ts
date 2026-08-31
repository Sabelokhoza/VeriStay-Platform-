import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'xvqszpnxxlxbefjwzmiv.supabase.co',
                pathname: '/storage/v1/object/**',
            },
        ],
    },
};

export default nextConfig;