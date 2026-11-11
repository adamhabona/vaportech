import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Elf Bar was replaced by Yovo; keep old links and search results working.
      {
        source: "/brands/elf-bar",
        destination: "/brands/yovo",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
