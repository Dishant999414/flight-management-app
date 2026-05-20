import nextPwa from "next-pwa";

const withPWA = nextPwa({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {};

export default withPWA(nextConfig);