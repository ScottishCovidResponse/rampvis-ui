/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
      return [
          {
              source: '/',
              destination: '/development/example',
              permanent: false,
          }
      ]
  }

}