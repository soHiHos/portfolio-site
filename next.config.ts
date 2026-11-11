import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets client components (nav pill, hero, contact) read the server-side AVAILABLE_FOR_WORK switch
  env: { AVAILABLE_FOR_WORK: process.env.AVAILABLE_FOR_WORK ?? "" },
  allowedDevOrigins: ["192.168.29.29"],
  // Files the lead route reads at runtime: fonts for the emailed estimate PDF, the CV and the service guides it attaches
  outputFileTracingIncludes: { "/api/lead": ["./public/fonts/**", "./public/cv-resume/**", "./service-pdfs/**"] },
  async redirects() {
    // The case studies page became /projects (with a detail page per project)
    return [{ source: "/case-studies", destination: "/projects", permanent: true }];
  },
};

export default nextConfig;
