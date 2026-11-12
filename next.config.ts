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
      // Funky Republic was replaced by HQD.
      {
        source: "/brands/funky-republic",
        destination: "/brands/hqd",
        permanent: true,
      },
      // Mr. Fog was replaced by Fume.
      {
        source: "/brands/mr-fog",
        destination: "/brands/fume",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
