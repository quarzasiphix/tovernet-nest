import type { DemoPackage, PublicDemo } from '@/lib/tovernet/api';

// Preview-only data. Fictional companies; the catalogue mirrors the local
// tovernet.catalog_entries after migration 20261102140000 (offer v2) (prices are owner hypotheses, VAT-exempt).
const pkg = (p: Partial<DemoPackage> & Pick<DemoPackage, 'key' | 'name' | 'kind' | 'gross_minor'>): DemoPackage => ({
  description: null, tagline: null, net_price: null, vat_exempt: true, included_in: [], max_quantity: 1,
  currency: 'PLN', billing_interval: null, included: [], exclusions: [], recommended: false, ...p,
});

const CATALOGUE: DemoPackage[] = [
  pkg({ key: 'tovernet.web.start', name: 'Strona Start', kind: 'package', gross_minor: 149000, description: 'Wiarygodna firma w sieci: kim jesteś, co robisz i jak się skontaktować',
    included: ['Strona jednostronicowa na bazie konceptu, który już widziałeś', 'Czytelna na telefonie, z przyciskiem „Zadzwoń”', 'Formularz kontaktowy', 'Konfiguracja Google Search Console', 'Domena .pl rejestrowana na Twoją firmę', '1 runda poprawek przed publikacją'],
    exclusions: ['Pisanie tekstów od podstaw (redagujemy Twoje)', 'Sesja zdjęciowa i projekt logo', 'Gwarancja pozycji w Google'] }),
  pkg({ key: 'tovernet.web.firma', name: 'Strona Firma', kind: 'package', gross_minor: 299000, description: 'Strona, z której przychodzą konkretne zapytania', recommended: true,
    included: ['Do 5 podstron: osobna podstrona dla każdej głównej usługi', 'Formularz wyceny dopasowany do Twojej branży', 'Teksty piszemy my, na podstawie krótkiej ankiety. Ty akceptujesz', 'Poczta firmowa w Twojej domenie, np. kontakt@twojafirma.pl', 'Konfiguracja Google Search Console', 'Domena .pl rejestrowana na Twoją firmę', '2 rundy poprawek przed publikacją'],
    exclusions: ['Sklep internetowy i logowanie dla klientów', 'Sesja zdjęciowa i projekt logo', 'Opłaty dostawcy poczty', 'Gwarancja pozycji w Google'] }),
  pkg({ key: 'tovernet.web.pro', name: 'Strona Pro', kind: 'package', gross_minor: 590000, description: 'Strona i pierwsze 3 miesiące pracy nad widocznością w okolicy',
    included: ['Wszystko z pakietu Firma', 'Do 12 podstron, np. usługi w poszczególnych miastach', 'Jedna integracja: rezerwacje, mapa zasięgu lub formularz do CRM', 'Założenie i uzupełnienie wizytówki Google', '3 miesiące pracy nad widocznością: 3 nowe podstrony lub artykuły i comiesięczny raport', 'Pierwszeństwo w kolejce realizacji', '3 rundy poprawek przed publikacją'],
    exclusions: ['Aplikacje dedykowane i sklep internetowy', 'Sesja zdjęciowa i projekt logo', 'Opłaty dostawców narzędzi i poczty', 'Gwarancja pozycji w Google'] }),
  pkg({ key: 'tovernet.plan.hosting', name: 'Utrzymanie', kind: 'recurring', gross_minor: 4900, billing_interval: 'month',
    description: 'Strona działa, zmiany zamawiasz osobno', tagline: 'Strona działa. Zmiany zamawiasz osobno',
    included: ['Hosting i certyfikat SSL', 'Codzienna kopia zapasowa', 'Aktualizacje bezpieczeństwa', 'Odnowienie domeny .pl, .com.pl lub .eu', 'Pomoc przy awarii w następnym dniu roboczym'],
    exclusions: ['Zmiany w treści i wyglądzie', 'Domeny w innych rozszerzeniach'] }),
  pkg({ key: 'tovernet.care.monthly', name: 'Opieka', kind: 'recurring', gross_minor: 9900, billing_interval: 'month',
    description: 'Strona zawsze aktualna, bez szukania informatyka', tagline: 'Strona zawsze aktualna, bez szukania informatyka',
    included: ['Hosting, certyfikat SSL, codzienne kopie zapasowe i aktualizacje', 'Odnowienie domeny .pl, .com.pl lub .eu', 'Do 30 minut zmian co miesiąc: zgłaszasz w panelu, my wprowadzamy', 'Miesięczne podsumowanie: odwiedziny i zapytania z formularza'],
    exclusions: ['Nowe podstrony i nowe funkcje', 'Usługi SEO', 'Domeny w innych rozszerzeniach'] }),
  pkg({ key: 'tovernet.plan.growth', name: 'Widoczność lokalna', kind: 'recurring', gross_minor: 39900, billing_interval: 'month',
    description: 'Systematyczna praca nad tym, żeby klienci z okolicy Cię znajdowali', tagline: 'Systematyczna praca nad tym, żeby klienci z okolicy Cię znajdowali',
    included: ['Wszystko z planu Opieka', 'Prowadzenie wizytówki Google: wpisy i zdjęcia od Ciebie', 'Co miesiąc nowa podstrona usługi lub artykuł', 'Raport z Google: wyświetlenia, kliknięcia, zapytania'],
    exclusions: ['Gwarancja pozycji w Google lub liczby zapytań', 'Reklamy płatne i ich budżet', 'Domeny w innych rozszerzeniach'] }),
  // PROPOSAL, not in the catalogue (16-offer-redesign.md): shown in the preview so the owner can judge it.
  pkg({ key: 'tovernet.plan.develop', name: 'Rozwój', kind: 'recurring', gross_minor: 69900, billing_interval: 'month',
    description: 'Co miesiąc aktywnie rozwijamy Twoją stronę', tagline: 'Co miesiąc aktywnie rozwijamy Twoją stronę',
    included: ['Wszystko z planu Widoczność lokalna', 'Do 2 godzin prac rozwojowych co miesiąc', 'Jedna uzgodniona poprawka strony lub formularza w miesiącu, w ramach tych 2 godzin', 'Miesięczna analiza: co działa i co warto zmienić', 'Prace rozwojowe zaczynamy w ciągu 2 dni roboczych'],
    exclusions: ['Nowe integracje i duże funkcje (wycena osobno)', 'Gwarancja pozycji w Google lub liczby zapytań', 'Reklamy płatne i ich budżet'] }),
  pkg({ key: 'tovernet.addon.page', name: 'Dodatkowa podstrona', kind: 'addon', gross_minor: 19000, description: 'Jedna dodatkowa podstrona z dostarczonych treści', max_quantity: 10 }),
  pkg({ key: 'tovernet.addon.email', name: 'Konfiguracja poczty firmowej', kind: 'addon', gross_minor: 29000, description: 'Konfiguracja domeny do poczty u wybranego dostawcy', exclusions: ['Opłaty dostawcy poczty'], included_in: ['tovernet.web.firma', 'tovernet.web.pro'] }),
  pkg({ key: 'tovernet.addon.gsc', name: 'Konfiguracja Google Search Console', kind: 'addon', gross_minor: 19000, description: 'Weryfikacja strony i przesłanie mapy witryny', included_in: ['tovernet.web.firma', 'tovernet.web.pro'] }),
];

export type Scenario = 'invite' | 'view' | 'long';

export const SCENARIOS: { key: Scenario; label: string; note: string }[] = [
  { key: 'invite', label: 'Link osobisty z e-maila', note: 'Ważne zaproszenie: konto jednym kliknięciem.' },
  { key: 'view', label: 'Link bez zaproszenia', note: 'Np. przekazany dalej. Konto kodem z e-maila.' },
  { key: 'long', label: 'Długa nazwa, bez miasta', note: 'Przypadek brzegowy z KRS.' },
];

export const INVITE_EMAIL = 'biuro@przyklad.test';

export type Trade = 'elektryk' | 'wykonczenia';

export const TRADES: { key: Trade; label: string }[] = [
  { key: 'elektryk', label: 'Elektryk (43.21)' },
  { key: 'wykonczenia', label: 'Wykończenia wnętrz (43.3x)' },
];

const COMPANIES: Record<Trade, { normal: PublicDemo['config']['company']; long: PublicDemo['config']['company']; variant: PublicDemo['config']['variant'] }> = {
  elektryk: {
    variant: 'electrical',
    normal: { legal_name: 'PRZYKŁADOWY ELEKTRYK SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', display_name: 'PRZYKŁADOWY ELEKTRYK', city: 'KRAKÓW', krs: '0000000000' },
    long: { legal_name: 'PRZYKŁADOWE PRZEDSIĘBIORSTWO USŁUG ELEKTROINSTALACYJNYCH I TELETECHNICZNYCH SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
            display_name: 'PRZYKŁADOWE PRZEDSIĘBIORSTWO USŁUG ELEKTROINSTALACYJNYCH I TELETECHNICZNYCH', city: null, krs: '0000000000' },
  },
  wykonczenia: {
    variant: 'finishing',
    normal: { legal_name: 'PRZYKŁADOWE WYKOŃCZENIA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', display_name: 'PRZYKŁADOWE WYKOŃCZENIA', city: 'POZNAŃ', krs: '0000000000' },
    long: { legal_name: 'PRZYKŁADOWE PRZEDSIĘBIORSTWO REMONTOWO-WYKOŃCZENIOWE I USŁUG OGÓLNOBUDOWLANYCH SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
            display_name: 'PRZYKŁADOWE PRZEDSIĘBIORSTWO REMONTOWO-WYKOŃCZENIOWE I USŁUG OGÓLNOBUDOWLANYCH', city: null, krs: '0000000000' },
  },
};

export function fixtureDemo(scenario: Scenario, trade: Trade = 'elektryk'): PublicDemo {
  const t = COMPANIES[trade];
  return {
    public_id: '000000000000000000000000000000000000',
    niche_key: 'construction',
    template_version: 1,
    config: { variant: t.variant, company: scenario === 'long' ? t.long : t.normal },
    packages: CATALOGUE,
    attribution: { channel: 'email', campaign: 'podglad' },
  };
}
