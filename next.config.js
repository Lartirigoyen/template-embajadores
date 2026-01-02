/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // Configuración para tRPC
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'pg-native'];
    return config;
  },
};

module.exports = nextConfig;
