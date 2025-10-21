// next.config.mjs
import withNextIntl from 'next-intl/plugin';

// Importa el archivo correcto
export default withNextIntl('./next-intl.config.ts')({
  reactStrictMode: true,
  experimental: {}
});
