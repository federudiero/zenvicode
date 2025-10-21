import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always' // fuerza /en, /es
});

export const config = {
  matcher: [
    // Aplica i18n a todo menos assets, APIs y caminos de cliente
    '/((?!_next|@vite|.*\\..*|api).*)'
  ]
};
