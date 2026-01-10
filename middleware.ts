import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales } from './i18n';
import type { Locale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'pl',
  localePrefix: 'always',
  localeDetection: false
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle root path - redirect based on country detection
  if (pathname === '/') {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value as Locale | undefined;
    const country = request.geo?.country || request.headers.get('cf-ipcountry') || 'US';
    
    // Check if user is from an English-speaking country
    const englishCountries = ['US', 'GB', 'CA', 'AU', 'NZ', 'IE', 'ZA', 'IN', 'PH', 'SG', 'MY', 'HK'];
    const isEnglishCountry = englishCountries.includes(country);
    
    const inferredLocale: Locale = isEnglishCountry ? 'en' : 'pl';
    const locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : inferredLocale;

    request.nextUrl.pathname = `/${locale}`;
    return Response.redirect(request.nextUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
