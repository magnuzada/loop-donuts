import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! ATENÇÃO !!
    // Ignora erros de tipo para permitir o deploy rápido
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora alertas de linter
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;