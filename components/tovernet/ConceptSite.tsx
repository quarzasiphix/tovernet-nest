import dynamic from 'next/dynamic';
import ElectricianSite from './ElectricianSite';
import FinishingSite from './FinishingSite';
import ConstructionSite from './ConstructionSite';
import type { ConstructionVariantKey, PublicDemo, VariantKey } from '@/lib/tovernet/api';
import { familyOf } from '@/lib/tovernet/niches/index';

// Niches added 2026-11-03 load on demand, so a page only ships the concept it shows.
type Props = { company: PublicDemo['config']['company']; variant: string; embedded?: boolean; preview?: boolean };
const BeautySite = dynamic<Props>(() => import('./niches/BeautySite'));
const FoodSite = dynamic<Props>(() => import('./niches/FoodSite'));
const TransportSite = dynamic<Props>(() => import('./niches/TransportSite'));
const LocalSite = dynamic<Props>(() => import('./niches/LocalSite'));
const ProfessionalSite = dynamic<Props>(() => import('./niches/ProfessionalSite'));
const TechSite = dynamic<Props>(() => import('./niches/TechSite'));
const EstateSite = dynamic<Props>(() => import('./niches/EstateSite'));
const EngineeringSite = dynamic<Props>(() => import('./niches/EngineeringSite'));
const ConsultingSite = dynamic<Props>(() => import('./niches/ConsultingSite'));
const RentalSite = dynamic<Props>(() => import('./niches/RentalSite'));
const EnergySite = dynamic<Props>(() => import('./niches/EnergySite'));
const LawSite = dynamic<Props>(() => import('./niches/LawSite'));
const BusinessSite = dynamic<Props & { pkd?: { code: string; label: string } | null }>(() => import('./niches/BusinessSite'));

/** Picks the concept for a demo. Trades share `niche_key`, so the variant decides. */
export default function ConceptSite({ company, variant, embedded = false, preview = false }: { company: PublicDemo['config']['company']; variant: VariantKey | string; embedded?: boolean; preview?: boolean }) {
  const props = { company, variant, embedded, preview };
  switch (familyOf(variant)) {
    case 'beauty': return <BeautySite {...props} />;
    case 'food': return <FoodSite {...props} />;
    case 'transport': return <TransportSite {...props} />;
    case 'local': return <LocalSite {...props} />;
    case 'professional': return <ProfessionalSite {...props} />;
    case 'tech': return <TechSite {...props} />;
    case 'estate': return <EstateSite {...props} />;
    case 'engineering': return <EngineeringSite {...props} />;
    case 'consulting': return <ConsultingSite {...props} />;
    case 'rental': return <RentalSite {...props} />;
    case 'energy': return <EnergySite {...props} />;
    case 'law': return <LawSite {...props} />;
    case 'business': return <BusinessSite {...props} pkd={company.pkd ?? null} />;
    default: break;
  }
  if (variant === 'electrical') return <ElectricianSite company={company} embedded={embedded} preview={preview} />;
  if (variant === 'finishing') return <FinishingSite company={company} embedded={embedded} preview={preview} />;
  return <ConstructionSite company={company} variant={(variant as ConstructionVariantKey) || 'general'} embedded={embedded} />;
}
