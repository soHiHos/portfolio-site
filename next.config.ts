import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.29.29"],
  async redirects() {
    // The case studies page became /projects (with a detail page per project)
    return [{ source: "/case-studies", destination: "/projects", permanent: true }];
  },
};

export default nextConfig;
