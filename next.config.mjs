/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  redirects: () => {
    return [
      {
        source: "/buy-now",
        destination: "/pricing",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
