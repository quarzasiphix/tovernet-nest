// Tovernet's verified work: one registry for the credibility drawer in the personal offer
// (components/tovernet/credibility/) and, later, the public /pl/projekty page
// (ksiegai docs/plans/tovernet/26-credibility-portfolio.md).
//
// Rules for every entry:
// - Only work Tovernet did, with evidence a stranger can check (a credit on the live site,
//   Tovernet named as the operator, or a case study already published on tovernet.online).
// - No invented clients, results, metrics, dates or testimonials. Descriptions say what was
//   built, never what it achieved.
// - Client material only when the client is already shown publicly on tovernet.online/pl/projekty.
//   Anything else: clearance 'needs_approval', and it never renders.
// - Screenshots show public pages or demo data only (never a client's real records).
// - `unlisted`: prepared but not public yet (Anemalo, GlobalPet). Never listed, never in the
//   sitemap or structured data; their routes are noindex. Data stays for a later launch.
//
// Plain TypeScript with no imports, so `node --test` runs its tests without a build step.

/** What the project is to Tovernet. */
export type ProjectKind =
  | 'client_site'    // a client's public website
  | 'client_system'  // a client's application or online tool
  | 'own_product'    // Tovernet's own product, run under its own name
  | 'concept';       // an example or design, not delivered work

/** Where it stands today, as last checked (VERIFIED_ON). */
export type ProjectStatus =
  | 'live'            // public and working
  | 'early_access'    // public, sign-ups limited
  | 'in_preparation'  // announced, not usable yet
  | 'concept';

/** May this be shown? */
export type Clearance =
  | 'own'             // Tovernet's own product
  | 'listed_public'   // already shown on tovernet.online/pl/projekty (published by the owner)
  | 'needs_approval'; // never rendered until the client agrees

export type EvidenceKind =
  | 'site_credit'     // the live site names Tovernet (footer, credit page)
  | 'operator'        // the live site names Tovernet as operator or publisher
  | 'case_study'      // published case study on tovernet.online
  | 'live_url';       // the project answers at its own address (no visible credit)

export type Evidence = { kind: EvidenceKind; label: string; url?: string };

export type Locale = 'pl' | 'en';

export type Shot = { src: string; alt: string; altEn?: string; width: number; height: number; note?: string };

/** English copy; Polish is the source in the main fields. */
export type ProjectText = {
  category: string;
  summary: string;
  role: string;
  built: string[];
  /** Evidence labels, same order as `evidence`. */
  evidence: string[];
  /** One-line statement for the showcase. */
  headline: string;
};

/** What a project demonstrates, for the service index on the homepage. */
export type Capability = 'website' | 'panel' | 'system' | 'payments' | 'integration' | 'product';

/** Colours sampled from the live project, used to stage it in the showcase. */
export type Palette = { bg: string; fg: string; accent: string };

export type PortfolioProject = {
  slug: string;
  name: string;
  kind: ProjectKind;
  status: ProjectStatus;
  clearance: Clearance;
  /** Industry or type, short. */
  category: string;
  /** One line: what was built. Never outcomes. */
  summary: string;
  /** What Tovernet does for it. */
  role: string;
  /** 2–4 facts about what was built, each checkable on the live project or case study. */
  built: string[];
  url?: string;
  /** 'private': an internal system behind a login. Never linked; shown through screenshots only. */
  access?: 'public' | 'private';
  /** Case study on tovernet.online, without locale: /projekty/<slug>. */
  caseStudy?: string;
  shots: Shot[];
  evidence: Evidence[];
  /** Order in the offer drawer; absent = not shown there (kept for the public page). */
  offerRank?: number;
  /** Order on the public site (homepage, /projekty); absent = not shown there. */
  siteRank?: number;
  /** Prepared, not public: never listed or indexed. */
  unlisted?: boolean;
  /** Showcase statement (Polish). */
  headline?: string;
  en?: ProjectText;
  capabilities?: Capability[];
  palette?: Palette;
  /** Immersive preview: the page top to bottom (desktop) and the first phone screen. */
  preview?: { full?: Shot; phone?: Shot };
};

/** When the statuses and credits below were last checked against the live sites. */
export const VERIFIED_ON = '2026-11-16';

export const PROJECTS: PortfolioProject[] = [
  {
    slug: 'nekrolog-lodz',
    name: 'Nekrolog Łódź',
    kind: 'client_site',
    status: 'live',
    clearance: 'listed_public',
    category: 'Zakład pogrzebowy, Łódź',
    summary: 'Strona lokalnej firmy usługowej: pełna oferta, asortyment i kontakt całą dobę.',
    role: 'Zaprojektowaliśmy, zbudowaliśmy i utrzymujemy stronę: treści, SEO lokalne, domenę i hosting.',
    built: [
      'Oferta usług z osobnymi podstronami',
      'Strony asortymentu: trumny, urny, wieńce, oprawa muzyczna',
      'SEO lokalne pod usługi w Łodzi',
      'Kontakt 24/7 widoczny na każdej podstronie',
    ],
    url: 'https://nekrolog-lodz.com',
    caseStudy: '/projekty/nekrolog-lodz',
    shots: [{ src: '/portfolio/nekrolog-lodz.webp', alt: 'Strona główna nekrolog-lodz.com na komputerze', width: 1200, height: 750 }],
    evidence: [
      { kind: 'site_credit', label: 'W stopce strony: „Partner technologiczny” prowadzi do Tovernet', url: 'https://nekrolog-lodz.com/tovernet' },
      { kind: 'case_study', label: 'Opis realizacji na tovernet.online', url: '/projekty/nekrolog-lodz' },
    ],
    offerRank: 1,
    siteRank: 1,
    headline: 'Spokojna, czytelna strona na najtrudniejszy dzień: telefon 24/7 zawsze pod ręką.',
    capabilities: ['website', 'integration'],
    palette: { bg: '#0B0B0B', fg: '#F5F1E6', accent: '#E2B33C' },
    en: {
      category: 'Funeral home, Łódź',
      summary: 'A local service business website: the full offer, products and round-the-clock contact.',
      role: 'We designed, built and run the site: content, local SEO, domain and hosting.',
      built: ['Service offer with dedicated subpages', 'Product pages: coffins, urns, wreaths, music', 'Local SEO for services in Łódź', '24/7 contact on every page'],
      evidence: ['Site footer: “Partner technologiczny” links to Tovernet', 'Case study on tovernet.online'],
      headline: 'A calm, clear site for the hardest day: the 24/7 phone line always in reach.',
    },
    preview: {
      full: { src: '/portfolio/nekrolog-lodz-full.webp', alt: 'Cała strona główna, od góry do dołu', altEn: 'The whole homepage, top to bottom', width: 960, height: 3600 },
      phone: { src: '/portfolio/nekrolog-lodz-phone.webp', alt: 'Pierwszy ekran na telefonie', altEn: 'The first screen on a phone', width: 390, height: 844 },
    },
  },
  {
    slug: 'gryfin-york',
    name: 'Gryfin York',
    kind: 'client_site',
    status: 'live',
    clearance: 'listed_public',
    category: 'Hodowla psów, Łódź',
    summary: 'Strona z panelem, w którym właścicielka sama dodaje mioty, szczenięta i zdjęcia.',
    role: 'Przenieśliśmy stronę ze starego WordPressa, zbudowaliśmy nową stronę z panelem i prowadzimy ją.',
    built: [
      'Strona publiczna: mioty, dostępne szczenięta, galeria, opinie',
      'Panel do samodzielnej zmiany treści, bez programisty',
      'Formularz zapytań od klientów',
      'Przeniesienie treści i zdjęć ze starej strony',
    ],
    url: 'https://hodowlagryfinyork.pl',
    caseStudy: '/projekty/gryfin-york',
    shots: [{ src: '/portfolio/gryfin-york.webp', alt: 'Strona główna hodowlagryfinyork.pl na komputerze', width: 1200, height: 750 }],
    evidence: [
      { kind: 'site_credit', label: 'W stopce strony: „Tovernet — twórca strony”', url: 'https://hodowlagryfinyork.pl/tovernet' },
      { kind: 'case_study', label: 'Opis realizacji na tovernet.online', url: '/projekty/gryfin-york' },
    ],
    offerRank: 2,
    siteRank: 2,
    headline: 'Strona i panel, w którym hodowczyni sama prowadzi mioty, szczenięta i galerię.',
    capabilities: ['website', 'panel'],
    palette: { bg: '#EAF8FB', fg: '#2A2140', accent: '#E3348C' },
    en: {
      category: 'Dog breeder, Łódź',
      summary: 'A website with a panel where the owner adds litters, puppies and photos herself.',
      role: 'We moved the site off an old WordPress install, built a new site with a panel and run it.',
      built: ['Public site: litters, available puppies, gallery, reviews', 'A panel for content changes without a developer', 'Enquiry form', 'Content and photos carried over from the old site'],
      evidence: ['Site footer: “Tovernet — twórca strony”', 'Case study on tovernet.online'],
      headline: 'A website and a panel where the breeder runs litters, puppies and the gallery herself.',
    },
    preview: {
      full: { src: '/portfolio/gryfin-york-full.webp', alt: 'Cała strona główna, od góry do dołu', altEn: 'The whole homepage, top to bottom', width: 960, height: 3600 },
      phone: { src: '/portfolio/gryfin-york-phone.webp', alt: 'Pierwszy ekran na telefonie', altEn: 'The first screen on a phone', width: 390, height: 844 },
    },
  },
  {
    slug: 'kolorowa-pasja',
    name: 'Kolorowa Pasja',
    kind: 'client_site',
    status: 'live',
    clearance: 'listed_public',
    category: 'Hodowla psów',
    summary: 'Prosta strona wizytówka z prezentacją hodowli i formularzem zapytań.',
    role: 'Zbudowaliśmy stronę i zajmujemy się jej utrzymaniem oraz drobnymi zmianami treści.',
    built: [
      'Strona wizytówka z prezentacją hodowli',
      'Prezentacja miotów i dostępnych szczeniąt',
      'Formularz zapytań',
    ],
    url: 'https://kolorowapasja.pl',
    caseStudy: '/projekty/kolorowa-pasja',
    shots: [{ src: '/portfolio/kolorowa-pasja.webp', alt: 'Strona główna kolorowapasja.pl na komputerze', width: 1200, height: 750 }],
    evidence: [
      { kind: 'site_credit', label: 'W stopce strony: „Strona stworzona przez Tovernet”', url: 'https://kolorowapasja.pl/tovernet' },
      { kind: 'case_study', label: 'Opis realizacji na tovernet.online', url: '/projekty/kolorowa-pasja' },
    ],
    offerRank: 3,
    siteRank: 5,
    headline: 'Elegancka wizytówka butikowej hodowli: mniej treści, więcej charakteru.',
    capabilities: ['website'],
    palette: { bg: '#161616', fg: '#F2E6C9', accent: '#D4A93A' },
    en: {
      category: 'Dog breeder',
      summary: 'A simple showcase site presenting the kennel, with an enquiry form.',
      role: 'We built the site and look after its upkeep and small content changes.',
      built: ['Showcase site presenting the kennel', 'Litters and available puppies', 'Enquiry form'],
      evidence: ['Site footer: “Strona stworzona przez Tovernet”', 'Case study on tovernet.online'],
      headline: 'An elegant showcase for a boutique kennel: less copy, more character.',
    },
    preview: {
      full: { src: '/portfolio/kolorowa-pasja-full.webp', alt: 'Cała strona główna, od góry do dołu', altEn: 'The whole homepage, top to bottom', width: 960, height: 2087 },
      phone: { src: '/portfolio/kolorowa-pasja-phone.webp', alt: 'Pierwszy ekran na telefonie', altEn: 'The first screen on a phone', width: 390, height: 844 },
    },
  },
  {
    slug: 'pokiu',
    name: 'POKIU',
    kind: 'client_system',
    status: 'live',
    clearance: 'listed_public',
    access: 'private',
    category: 'Związek kynologiczny',
    summary: 'Program biura związku: rejestr psów, rodowody, panel hodowcy i weryfikacja dokumentów kodem QR.',
    role: 'Zbudowaliśmy i prowadzimy program biura, panel hodowcy i publiczną weryfikację dokumentów. Publiczna strona związku to osobny projekt, nie nasz.',
    built: [
      'Księga rodowodowa i kartoteka hodowców',
      'Panel hodowcy z wnioskami o rodowód i ich statusem',
      'Weryfikacja rodowodu kodem QR',
      'Dziennik zmian: kto, co i kiedy zmienił',
    ],
    caseStudy: '/projekty/pokiu',
    shots: [
      { src: '/portfolio/pok-dogs.webp', alt: 'Program biura POK: księga psów z filtrami i statusem dokumentów', altEn: 'POK office software: the dog registry with filters and document status', width: 1200, height: 750, note: 'Dane testowe' },
      { src: '/portfolio/pok-dashboard.webp', alt: 'Program biura POK: pulpit z szybkimi akcjami i liczbami księgi', altEn: 'POK office software: dashboard with quick actions and registry figures', width: 1200, height: 750, note: 'Dane testowe' },
      { src: '/portfolio/pok-pedigrees.webp', alt: 'Program biura POK: rodowody gotowe do wystawienia', altEn: 'POK office software: pedigrees ready to issue', width: 1200, height: 750, note: 'Dane testowe' },
      { src: '/portfolio/pok-breeder.webp', alt: 'Panel hodowcy: psy, mioty i wnioski', altEn: 'Breeder panel: dogs, litters and requests', width: 1200, height: 750, note: 'Dane testowe' },
    ],
    evidence: [
      { kind: 'case_study', label: 'Opis realizacji na tovernet.online', url: '/projekty/pokiu' },
    ],
    offerRank: 4,
    siteRank: 3,
    headline: 'Rejestr psów, rodowody i weryfikacja dokumentu kodem QR: program, w którym pracuje całe biuro związku.',
    capabilities: ['system', 'panel', 'integration'],
    palette: { bg: '#0F2347', fg: '#F4F1E8', accent: '#C9A24A' },
    en: {
      category: 'Kennel club',
      summary: 'The club office software: dog registry, pedigrees, a breeder panel and QR document verification.',
      role: 'We built and run the office software, the breeder panel and public document verification. The club’s public website is a separate project, not ours.',
      built: ['Stud book and breeder records', 'Breeder panel with pedigree requests and their status', 'Pedigree verification by QR code', 'Change log: who changed what, and when'],
      evidence: ['Case study on tovernet.online'],
      headline: 'Dog registry, pedigrees and QR document checks: the system that runs the whole club office.',
    },
    preview: {
      full: { src: '/portfolio/pok-dogs.webp', alt: 'Program biura POK: księga psów', altEn: 'POK office software: the dog registry', width: 1200, height: 750 },
      phone: { src: '/portfolio/pok-phone.webp', alt: 'Program biura na telefonie: księga psów', altEn: 'The office software on a phone: the dog registry', width: 390, height: 844 },
    },
  },
  {
    slug: 'klepsydra',
    name: 'Klepsydra',
    kind: 'client_system',
    status: 'live',
    clearance: 'listed_public',
    category: 'Narzędzie online dla zakładu pogrzebowego',
    summary: 'Generator klepsydry w przeglądarce: formularz, podgląd A4 i wydruk lub PDF.',
    role: 'Stworzyliśmy i prowadzimy usługę na zlecenie Nekrolog Łódź: technologię, płatności i rozwój.',
    built: [
      'Generator bez instalacji i rejestracji',
      'Podgląd układu A4 na żywo',
      'Wydruk albo zapis do PDF',
      'Płatne konto dla innych zakładów (Stripe)',
    ],
    url: 'https://klepsydra.nekrolog-lodz.com',
    caseStudy: '/projekty/klepsydra',
    shots: [
      { src: '/portfolio/klepsydra-generator.webp', alt: 'Generator klepsydry: formularz i podgląd', width: 1200, height: 833 },
      { src: '/portfolio/klepsydra-print-a4.webp', alt: 'Przykładowa klepsydra w formacie A4', width: 1200, height: 848, note: 'Dane przykładowe' },
    ],
    evidence: [
      { kind: 'site_credit', label: 'W stopce: „Tovernet — twórca generatora”', url: 'https://klepsydra.nekrolog-lodz.com/tovernet' },
      { kind: 'case_study', label: 'Opis realizacji na tovernet.online', url: '/projekty/klepsydra' },
    ],
    offerRank: 5,
    siteRank: 4,
    headline: 'Narzędzie, z którego rodzina korzysta bez konta: formularz, podgląd A4, wydruk.',
    capabilities: ['product', 'payments'],
    palette: { bg: '#151311', fg: '#F3ECDD', accent: '#F4B43A' },
    en: {
      category: 'Online tool for a funeral home',
      summary: 'A browser-based funeral notice generator: form, live A4 preview, print or PDF.',
      role: 'We created and run the service for Nekrolog Łódź: technology, payments and development.',
      built: ['No install, no sign-up', 'Live A4 layout preview', 'Print or save as PDF', 'Paid accounts for other funeral homes (Stripe)'],
      evidence: ['Site footer: “Tovernet — twórca generatora”', 'Case study on tovernet.online'],
      headline: 'A tool families use without an account: a form, an A4 preview, a print.',
    },
    preview: {
      full: { src: '/portfolio/klepsydra-full.webp', alt: 'Cała strona główna, od góry do dołu', altEn: 'The whole homepage, top to bottom', width: 960, height: 2021 },
      phone: { src: '/portfolio/klepsydra-phone.webp', alt: 'Pierwszy ekran na telefonie', altEn: 'The first screen on a phone', width: 390, height: 844 },
    },
  },
  {
    slug: 'ksiegai',
    name: 'Księgai',
    kind: 'own_product',
    status: 'live',
    clearance: 'own',
    category: 'Program do faktur i KSeF',
    summary: 'Nasz własny program do faktur, KSeF i wyciągów bankowych dla polskich firm.',
    role: 'Nasz produkt: projektujemy go, rozwijamy i utrzymujemy sami.',
    built: [
      'Wystawianie faktur i wysyłka do KSeF',
      'Wczytywanie wyciągów i dopasowanie przelewów',
      'Konta dla wielu firm i ról',
    ],
    url: 'https://www.ksiegai.pl',
    caseStudy: '/projekty/ksiegai',
    shots: [{ src: '/portfolio/ksiegai.webp', alt: 'Strona główna ksiegai.pl na komputerze', width: 1200, height: 750 }],
    evidence: [
      { kind: 'operator', label: 'Na stronie: „Księgai tworzy i prowadzi Tovernet sp. z o.o.”', url: 'https://www.ksiegai.pl' },
      { kind: 'case_study', label: 'Opis produktu na tovernet.online', url: '/projekty/ksiegai' },
    ],
    offerRank: 6,
    siteRank: 6,
    headline: 'Nasz własny program do faktur i KSeF: dowód, że prowadzimy oprogramowanie pod prawdziwymi przepisami.',
    capabilities: ['product', 'system', 'integration', 'payments'],
    palette: { bg: '#060A13', fg: '#EEF3FC', accent: '#2F6BFF' },
    en: {
      category: 'Invoicing and KSeF software',
      summary: 'Our own invoicing, KSeF and bank statement software for Polish companies.',
      role: 'Our product: we design, develop and run it ourselves.',
      built: ['Invoices sent to KSeF, the national e-invoicing system', 'Bank statement import and payment matching', 'Accounts for several companies and roles'],
      evidence: ['On the site: “Księgai tworzy i prowadzi Tovernet sp. z o.o.”', 'Product case study on tovernet.online'],
      headline: 'Our own invoicing and KSeF software: proof we run software under real regulation.',
    },
    preview: {
      full: { src: '/portfolio/ksiegai-full.webp', alt: 'Cała strona główna, od góry do dołu', altEn: 'The whole homepage, top to bottom', width: 960, height: 3600 },
      phone: { src: '/portfolio/ksiegai-phone.webp', alt: 'Pierwszy ekran na telefonie', altEn: 'The first screen on a phone', width: 390, height: 844 },
    },
  },
  {
    slug: 'dalvo',
    name: 'Dalvo',
    kind: 'own_product',
    status: 'early_access',
    clearance: 'own',
    category: 'Firma w kilku krajach: faktury, wydatki, dokumenty',
    summary: 'Międzynarodowa wersja naszego oprogramowania dla firm, po angielsku, holendersku i polsku.',
    role: 'Nasz produkt, rozwijany przez zespół Księgai.',
    built: [
      'Wiele firm w różnych krajach i walutach w jednym koncie',
      'Strona w trzech językach: EN, NL, PL',
    ],
    url: 'https://dalvo.work',
    shots: [{ src: '/portfolio/dalvo.webp', alt: 'Strona główna dalvo.work na komputerze', width: 1200, height: 750 }],
    evidence: [
      { kind: 'operator', label: 'Na stronie: „Operatorem serwisu Dalvo jest Tovernet sp. z o.o.”', url: 'https://dalvo.work/pl' },
    ],
    // Not in the offer: off-topic for a Polish website buyer. Kept for the public page.
  },
  {
    slug: 'anemalo',
    unlisted: true,
    name: 'Anemalo',
    kind: 'own_product',
    status: 'live',
    clearance: 'own',
    category: 'Platforma dla hodowców i fundacji',
    summary: 'Nasza platforma z publicznym API, na którym działają strony hodowli.',
    role: 'Nasz produkt: architektura, API i interfejs.',
    built: ['Profile hodowców, mioty i szczenięta', 'Wspólne API dla stron hodowli'],
    url: 'https://anemalo.com',
    caseStudy: '/projekty/anemalo',
    shots: [],
    evidence: [{ kind: 'case_study', label: 'Opis produktu na tovernet.online', url: '/projekty/anemalo' }],
  },
  {
    slug: 'globalpet',
    unlisted: true,
    name: 'GlobalPet Transport',
    kind: 'own_product',
    status: 'in_preparation',
    clearance: 'own',
    category: 'Transport zwierząt',
    summary: 'Zapowiedziany serwis transportu zwierząt w UE.',
    role: 'Nasz produkt w przygotowaniu.',
    built: [],
    url: 'https://globalpet.online',
    shots: [],
    evidence: [{ kind: 'live_url', label: 'Strona zapowiedzi pod globalpet.online', url: 'https://globalpet.online' }],
  },
];

export const KIND_LABEL: Record<ProjectKind, string> = {
  client_site: 'Strona klienta',
  client_system: 'System dla klienta',
  own_product: 'Nasz produkt',
  concept: 'Koncept',
};

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: 'Działa',
  early_access: 'Wczesny dostęp',
  in_preparation: 'W przygotowaniu',
  concept: 'Koncept',
};

/** Shown anywhere: cleared, public, and real delivered or running work. */
export function isPublishable(p: PortfolioProject): boolean {
  return !p.unlisted && p.clearance !== 'needs_approval' && p.kind !== 'concept' && p.status !== 'concept';
}

/** Slugs whose routes exist but must not be indexed or linked (prepared, unpublished). */
export const UNLISTED_SLUGS = PROJECTS.filter((p) => p.unlisted).map((p) => p.slug);

/** The public site's selection, in siteRank order. */
export function siteProjects(list: PortfolioProject[] = PROJECTS): PortfolioProject[] {
  return list
    .filter((p) => p.siteRank !== undefined && isPublishable(p) && p.shots.length > 0)
    .sort((a, b) => (a.siteRank ?? 0) - (b.siteRank ?? 0));
}

/** A project's text in the visitor's language (Polish is the source). */
export function localize(p: PortfolioProject, locale: Locale) {
  const en = locale === 'en' ? p.en : undefined;
  const alt = (s: Shot) => (locale === 'en' && s.altEn ? s.altEn : s.alt);
  return {
    category: en?.category ?? p.category,
    summary: en?.summary ?? p.summary,
    role: en?.role ?? p.role,
    built: en?.built ?? p.built,
    headline: en?.headline ?? p.headline ?? p.summary,
    evidence: p.evidence.map((e, i) => ({ ...e, label: en?.evidence[i] ?? e.label })),
    alt,
  };
}

export const KIND_LABEL_EN: Record<ProjectKind, string> = {
  client_site: 'Client website',
  client_system: 'Client system',
  own_product: 'Our product',
  concept: 'Concept',
};

export const STATUS_LABEL_EN: Record<ProjectStatus, string> = {
  live: 'Live',
  early_access: 'Early access',
  in_preparation: 'In preparation',
  concept: 'Concept',
};

/** The offer drawer: live work with a screenshot and evidence, in offerRank order. */
export function offerProjects(list: PortfolioProject[] = PROJECTS): PortfolioProject[] {
  return list
    .filter((p) => p.offerRank !== undefined && isPublishable(p) && p.status === 'live' && p.shots.length > 0 && p.evidence.length > 0)
    .sort((a, b) => (a.offerRank ?? 0) - (b.offerRank ?? 0));
}

export type OfferGroup = { key: 'sites' | 'systems' | 'own'; title: string; projects: PortfolioProject[] };

/** The drawer's sections: client websites first (closest to what the visitor buys). */
export function offerGroups(list: PortfolioProject[] = PROJECTS): OfferGroup[] {
  const shown = offerProjects(list);
  const groups: OfferGroup[] = [
    { key: 'sites', title: 'Strony dla firm', projects: shown.filter((p) => p.kind === 'client_site') },
    { key: 'systems', title: 'Systemy dla klientów', projects: shown.filter((p) => p.kind === 'client_system') },
    { key: 'own', title: 'Nasze produkty', projects: shown.filter((p) => p.kind === 'own_product') },
  ];
  return groups.filter((g) => g.projects.length > 0);
}

/** Evidence links: absolute for external sites, locale-prefixed for tovernet.online paths. */
export function evidenceHref(url: string, locale = 'pl'): string {
  return /^https?:\/\//.test(url) ? url : `/${locale}${url}`;
}

/** "1 działający projekt", "3 działające projekty", "6 działających projektów". */
export function projectsLabel(n: number) {
  const few = n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14);
  return n === 1 ? '1 działający projekt' : few ? `${n} działające projekty` : `${n} działających projektów`;
}

/** "nekrolog-lodz.com" from "https://nekrolog-lodz.com/x". */
export function hostOf(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
}
