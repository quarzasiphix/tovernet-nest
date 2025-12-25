/** @type {import('next').NextConfig} */
module.exports = {
  output: "export",
  images: { unoptimized: true }, // avoids next/image export issues
};
