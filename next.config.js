/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        // https://github.com/vercel/next.js/issues/50870
        ignoreBuildErrors: true,
    },
}

module.exports = nextConfig
