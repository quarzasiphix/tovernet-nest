const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
module.exports = withNextIntl({
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
});
