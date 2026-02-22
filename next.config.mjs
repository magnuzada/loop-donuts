/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Isso permite qualquer site (Pexels, Unsplash, Freepik)
      },
    ],
  },
};

export default nextConfig;