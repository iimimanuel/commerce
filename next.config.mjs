/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Allow both 'http' and 'https' protocols if needed
        hostname: "**", // Wildcard to allow any domain
      },
    ],
  },
};

export default nextConfig;
