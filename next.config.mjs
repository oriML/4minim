/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['drive.google.com', 'lh3.googleusercontent.com', 'res.cloudinary.com'],
  },
};

export default nextConfig;