/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
    NEXT_PUBLIC_CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
    CLERK_API_KEY: process.env.CLERK_API_KEY,
  },
  // webpack(config, { dev }) {
  //   if (dev) {
  //     config.devtool = 'cheap-module-source-map'; // Ensure correct source map is used in development
  //   }
  //   return config;
  // },
};

export default nextConfig;
