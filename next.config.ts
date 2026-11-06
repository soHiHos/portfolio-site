import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.29.29"],
  // Files the lead route reads at runtime: fonts for the emailed estimate PDF, and the CV it attaches
  outputFileTracingIncludes: { "/api/lead": ["./public/fonts/**", "./public/cv-resume/**"] },
  async redirects() {
    // The case studies page became /projects (with a detail page per project)
    return [{ source: "/case-studies", destination: "/projects", permanent: true }];
  },
};

export default nextConfig;
