/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.ignoreWarnings = config.ignoreWarnings || [];
    config.ignoreWarnings.push((warning) => {
      const message = typeof warning?.message === 'string' ? warning.message : '';
      const moduleName = warning?.module?.resource || '';
      return (
        message.includes('Critical dependency: the request of a dependency is an expression') &&
        typeof moduleName === 'string' &&
        moduleName.includes('@supabase/realtime-js')
      );
    });
    return config;
  },
};

module.exports = nextConfig;
