import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';

// Type for the redesigned sales journey (owner review, 2026-11-02). All three cover
// Polish diacritics through latin-ext. Client concepts keep their own type.
const display = Plus_Jakarta_Sans({ subsets: ['latin', 'latin-ext'], weight: ['500', '600', '700', '800'], display: 'swap', variable: '--st-display' });
const sans = Inter({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--st-sans' });
const mono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], weight: ['500'], display: 'swap', variable: '--st-mono' });

export const studioFonts = `${display.variable} ${sans.variable} ${mono.variable}`;
