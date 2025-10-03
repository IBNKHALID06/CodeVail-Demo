/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const nextConfig = {
  reactStrictMode: false, // Slightly faster dev refresh (remove if you rely on double invoke checks)
  output: 'export', // produce static assets in out/ for Electron
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}'
    }
  },
  // Temporarily disable experimental & import optimization features while
  // investigating truncated manifest generation under Node 22 on Windows.
  // (esmExternals false + optimizePackageImports can be re-enabled later.)
  // experimental: {
  //   esmExternals: false,
  //   optimizePackageImports: ['lucide-react']
  // },
  webpack: (config, { isServer, dev }) => {
    // Handle Monaco Editor
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }

    // Handle Monaco Editor workers
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' },
    })

    // Speed: enable persistent filesystem cache in dev
    // Disable persistent filesystem cache during investigation to avoid
    // partial/corrupted manifest writes being reused.
    // if (dev) {
    //   config.cache = {
    //     type: 'filesystem',
    //     buildDependencies: { config: [__filename] }
    //   }
    // }

    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
