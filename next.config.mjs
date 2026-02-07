/** @type {import('next').NextConfig} */
const nextConfig = {
  // Isso permite carregar imagens de qualquer lugar (útil para desenvolvimento)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;