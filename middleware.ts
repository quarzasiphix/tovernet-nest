import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales } from './i18n';
import type { Locale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: false
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocale) {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value as Locale | undefined;
    const country = request.geo?.country || request.headers.get('cf-ipcountry') || 'US';
    const inferredLocale: Locale = country === 'PL' ? 'pl' : 'en';
    const locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : inferredLocale;

    request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    return Response.redirect(request.nextUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
