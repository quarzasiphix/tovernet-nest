// Everything goes through the KsięgaI gateway. It wraps responses as
// { data } or { error: { code, message } }.
// Local development: .env.local points this at wrangler dev (http://127.0.0.1:8787).
export const GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? 'https://api.ksiegai.pl';

export async function publicAction<T>(
  action: string,
  payload: Record<string, unknown>,
  accessToken?: string,
): Promise<T> {
  const res = await fetch(`${GATEWAY}/v1/public`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ action, ...payload }),
  });
  const envelope = await res.json().catch(() => null);
  if (!res.ok || !envelope || envelope.error) {
    throw new Error(envelope?.error?.message ?? 'Coś poszło nie tak. Spróbuj ponownie.');
  }
  return envelope.data as T;
}

export type DemoPackage = {
  key: string;
  name: string;
  description: string | null;
  kind: 'package' | 'addon' | 'recurring';
  tagline: string | null;
  net_price: number | null;
  gross_minor: number;
  vat_exempt: boolean;
  included_in: string[];
  max_quantity: number;
  currency: string;
  billing_interval: string | null;
  included: string[];
  exclusions: string[];
  recommended: boolean;
};

export type PublicDemo = {
  public_id: string;
  niche_key: string;
  template_version: number;
  config: {
    variant: VariantKey;
    company: { legal_name: string; display_name: string; city: string | null; krs: string | null; legal_form?: string | null; pkd?: { code: string; label: string } | null };
  };
  packages: DemoPackage[];
  attribution: { channel?: string; campaign?: string; variant?: string } | null;
  /** Instalment terms of enabled packages; absent or empty when instalments are off. */
  instalments?: { package: string; upfront_minor: number; count: number; amount_minor: number }[];
};

/** Construction variants (ConstructionSite, ElectricianSite, FinishingSite). */
export type ConstructionVariantKey = 'general' | 'infrastructure' | 'finishing' | 'electrical' | 'plumbing_hvac' | 'specialist';
/** Niche variants added 2026-11-03 (ksiegai docs/plans/tovernet/18-niche-expansion.md). Keep in sync with tovernet.niche_for_pkd. */
export type NicheVariantKey =
  | 'beauty_hair' | 'beauty_salon' | 'beauty_spa'
  | 'food_restaurant' | 'food_cafe' | 'food_catering'
  | 'transport_freight' | 'transport_moving' | 'transport_courier'
  | 'local_cleaning' | 'local_garden' | 'local_auto' | 'local_detailing'
  | 'pro_accounting' | 'pro_realestate' | 'pro_property'
  | 'business';
export type VariantKey = ConstructionVariantKey | NicheVariantKey;
