/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Lint is run separately; don't block production builds on it.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // Supasift has launched — any old waitlist links now lead straight to
      // signup rather than 404ing.
      { source: "/waitlist", destination: "/signup", permanent: true },
      { source: "/waitlist/:path*", destination: "/signup", permanent: true },
    ];
  },
};

export default nextConfig;
