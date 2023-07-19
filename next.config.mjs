import "./src/lib/env.js";

/** @type {import('next').NextConfig} */
const config = {
  images: {
    domains: ["pbs.twimg.com"],
  },
  experimental: {
    serverActions: true,
  },
};

export default config;
