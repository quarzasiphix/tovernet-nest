import { Instrument_Serif } from 'next/font/google';
import { brandFonts } from '@/lib/tovernet/brand';

// The site's type: Schibsted Grotesk (display and text) and IBM Plex Mono (labels), shared
// with the niche pages and the offer, plus Instrument Serif italic for one emphasised phrase
// per headline. One family of voices from the first letter to the invoice.
const serif = Instrument_Serif({ subsets: ['latin', 'latin-ext'], weight: '400', style: ['normal', 'italic'], display: 'swap', variable: '--tv-serif' });

export const siteFonts = `${brandFonts} ${serif.variable}`;
