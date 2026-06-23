/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: []
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
