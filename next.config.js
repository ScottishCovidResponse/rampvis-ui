/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },

  // Workaround for h5wasm (it expects fs module to be defined in browser)
  // h5wasm is used in gridded glyphs tool
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};
