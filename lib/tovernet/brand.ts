import { IBM_Plex_Mono, Schibsted_Grotesk } from 'next/font/google';

// Tovernet's own frame: e-mail, offer page, pricing and panel. Client concepts bring their own type.
const sans = Schibsted_Grotesk({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700', '800'], display: 'swap', variable: '--tv-sans' });
const mono = IBM_Plex_Mono({ subsets: ['latin', 'latin-ext'], weight: ['400', '500'], display: 'swap', variable: '--tv-mono' });

// Owner's line for questions from prospects, shown in Tovernet's footer (not inside client concepts).
export const TOVERNET_PHONE = { label: '+48 690 975 231', href: 'tel:+48690975231' };

export const brandFonts = `${sans.variable} ${mono.variable}`;
