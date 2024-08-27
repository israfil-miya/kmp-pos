/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gravatar.com',
        pathname: '/avatar/*',
      },
    ],
  },
};

if (process.env.NODE_ENV === 'production')
  nextConfig.compiler = { removeConsole: true };

export default nextConfig;
