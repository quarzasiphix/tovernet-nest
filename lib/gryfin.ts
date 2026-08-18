// Real data from the GRYFIN YORK kennel (hodowlagryfinyork.pl), used as the
// case-study proof on /hodowcy. Pulled from their public, read-only Edge
// Function (RLS-gated, no keys exposed) — see /p/grif/supabase/functions/get-site-content.
const GRYFIN_CONTENT_URL = 'https://eqggerrzfwlfqibcdyjy.supabase.co/functions/v1/get-site-content';

export type GryfinSex = 'samiec' | 'suczka';

export type GryfinDog = {
  id: string;
  slug: string;
  name: string;
  sex: GryfinSex;
  color: string | null;
  status: 'aktywny' | 'emerytura' | 'nieaktywny';
  photo_url: string | null;
  featured: boolean;
  created_at: string;
};

export type GryfinLitter = {
  id: string;
  slug: string;
  name: string;
  mother_id: string | null;
  father_id: string | null;
  planned_date: string | null;
  puppies_count: number;
  status: 'planowany' | 'oczekujemy' | 'urodzone' | 'rezerwacje' | 'zakonczony';
  created_at: string;
};

export type GryfinPuppy = {
  id: string;
  slug: string;
  litter_id: string | null;
  name: string;
  sex: GryfinSex;
  color: string | null;
  status: 'dostepny' | 'wstepnie-zarezerwowany' | 'zarezerwowany' | 'w-nowym-domu';
  photo_url: string | null;
  featured: boolean;
  created_at: string;
};

export type GryfinTestimonial = {
  id: string;
  customer_name: string;
  dog_name: string | null;
  content: string;
  rating: number;
  published_at: string;
};

export type GryfinGalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
  category: string;
};

export type GryfinSiteContent = {
  dogs: GryfinDog[];
  litters: GryfinLitter[];
  puppies: GryfinPuppy[];
  testimonials: GryfinTestimonial[];
  gallery: GryfinGalleryImage[];
};

export async function getGryfinSiteContent(): Promise<GryfinSiteContent | null> {
  try {
    const res = await fetch(GRYFIN_CONTENT_URL);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      dogs: data.dogs ?? [],
      litters: data.litters ?? [],
      puppies: data.puppies ?? [],
      testimonials: data.testimonials ?? [],
      gallery: data.gallery ?? [],
    };
  } catch {
    return null;
  }
}

export function sexLabel(sex: GryfinSex): 'Suczka' | 'Reproduktor' {
  return sex === 'suczka' ? 'Suczka' : 'Reproduktor';
}

export function pickHeroPuppy(content: GryfinSiteContent | null) {
  if (!content) return null;
  const available = content.puppies.find((p) => p.status === 'dostepny' && p.photo_url);
  if (available) return available;
  const anyPuppyWithPhoto = content.puppies.find((p) => p.photo_url);
  if (anyPuppyWithPhoto) return anyPuppyWithPhoto;
  const featuredDog = content.dogs.find((d) => d.featured && d.photo_url);
  return featuredDog ?? content.dogs.find((d) => d.photo_url) ?? null;
}
