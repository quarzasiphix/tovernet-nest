// Registry of the niches added 2026-11-03 (ksiegai docs/plans/tovernet/18-niche-expansion.md).
// Each niche owns its files: <key>.ts (content), <key>.landing.ts (landing pages, PKD map),
// <key>.journey.ts (offer journey copy) and components/tovernet/niches/<Key>Site.tsx.
// The PKD maps must match tovernet.pkd_niche_map in the KsięgaI database.

import { LANDING as BEAUTY, PKD_MAP as BEAUTY_PKD } from './beauty.landing';
import { LANDING as FOOD, PKD_MAP as FOOD_PKD } from './food.landing';
import { LANDING as TRANSPORT, PKD_MAP as TRANSPORT_PKD } from './transport.landing';
import { LANDING as LOCAL, PKD_MAP as LOCAL_PKD } from './local.landing';
import { LANDING as PROFESSIONAL, PKD_MAP as PROFESSIONAL_PKD } from './professional.landing';
import { LANDING as BUSINESS } from './business.landing';
import { JOURNEY as BEAUTY_J } from './beauty.journey';
import { JOURNEY as FOOD_J } from './food.journey';
import { JOURNEY as TRANSPORT_J } from './transport.journey';
import { JOURNEY as LOCAL_J } from './local.journey';
import { JOURNEY as PROFESSIONAL_J } from './professional.journey';
import { JOURNEY as BUSINESS_J } from './business.journey';

/** Landing entries, in the order they appear in navigation lists. */
export const NICHE_LANDINGS = [...BEAUTY, ...FOOD, ...LOCAL, ...TRANSPORT, ...PROFESSIONAL, ...BUSINESS];

/** Journey copy per variant (welcome screen, concept notes, offer stage). */
export const NICHE_JOURNEY = { ...BEAUTY_J, ...FOOD_J, ...TRANSPORT_J, ...LOCAL_J, ...PROFESSIONAL_J, ...BUSINESS_J };

/** PKD prefix to variant, for reference and tests (the database decides). */
export const NICHE_PKD = { ...BEAUTY_PKD, ...FOOD_PKD, ...TRANSPORT_PKD, ...LOCAL_PKD, ...PROFESSIONAL_PKD };

/** Niche family of a variant: which concept component renders it. */
export type NicheFamily = 'beauty' | 'food' | 'transport' | 'local' | 'professional' | 'business';
export function familyOf(variant: string | null | undefined): NicheFamily | null {
  if (!variant) return null;
  if (variant.startsWith('beauty_')) return 'beauty';
  if (variant.startsWith('food_')) return 'food';
  if (variant.startsWith('transport_')) return 'transport';
  if (variant.startsWith('local_')) return 'local';
  if (variant.startsWith('pro_')) return 'professional';
  if (variant === 'business') return 'business';
  return null;
}
