/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Only hosts listed here can be resized by /_next/image. A wildcard would
    // let anyone point the endpoint at any URL and make us fetch it, so new
    // image sources have to be added deliberately — keep this in sync with
    // OPTIMIZABLE_HOSTS in src/lib/images.ts.
    remotePatterns: [{ protocol: "https", hostname: "upload.wikimedia.org" }],
  },
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
