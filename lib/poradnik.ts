export type PoradnikSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export type PoradnikFaq = { q: string; a: string };

export type PoradnikCategory = 'breeders' | 'kennel-clubs' | 'animal-industry' | 'finance';

export type PoradnikArticle = {
  /** Pairs the pl/en versions of the same article together for hreflang and cross-links. */
  key: string;
  category: PoradnikCategory;
  locale: 'pl' | 'en';
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  sections: PoradnikSection[];
  faqs?: PoradnikFaq[];
  /** Optional link to an external resource for deeper reading (e.g. ksef.support for KSeF articles). */
  externalResource?: { label: string; description: string; url: string };
};

type CategoryMeta = {
  offerPath: string;
  offerExternal?: boolean;
  color: 'pink' | 'lavender' | 'teal' | 'yellow';
  label: { pl: string; en: string };
  description: { pl: string; en: string };
};

export const poradnikCategories: Record<PoradnikCategory, CategoryMeta> = {
  breeders: {
    offerPath: '/hodowcy',
    color: 'pink',
    label: { pl: 'Dla hodowców', en: 'For breeders' },
    description: {
      pl: 'Strony, panele i niezależność od portali dla hodowców psów.',
      en: 'Websites, panels, and independence from platforms for dog breeders.',
    },
  },
  'kennel-clubs': {
    offerPath: '/zwiazki-kynologiczne',
    color: 'lavender',
    label: { pl: 'Dla związków kynologicznych', en: 'For kennel clubs' },
    description: {
      pl: 'Elektroniczne księgi rodowodowe, panele hodowców i współpraca biura z hodowcami.',
      en: 'Electronic pedigree registries, breeder panels, and office-to-breeder collaboration.',
    },
  },
  'animal-industry': {
    offerPath: '/#solutions',
    color: 'teal',
    label: { pl: 'Dla firm z branży zwierzęcej', en: 'For animal-industry companies' },
    description: {
      pl: 'Rezerwacje, dokumenty i systemy dla transportu zwierząt, hoteli i groomerów.',
      en: 'Reservations, documents, and systems for animal transport, boarding, and grooming businesses.',
    },
  },
  finance: {
    offerPath: '/projekty/ksiegai',
    color: 'yellow',
    label: { pl: 'Finanse i automatyzacja', en: 'Finance and automation' },
    description: {
      pl: 'KSeF, fakturowanie i systemy finansowe zamiast wynajętego oprogramowania.',
      en: 'KSeF, invoicing, and financial systems instead of rented software.',
    },
  },
};

export const poradnikCtas: Record<PoradnikCategory, { offerPath: string; label: { pl: string; en: string }; message: { pl: string; en: string } }> = {
  breeders: {
    offerPath: '/hodowcy#quote',
    label: { pl: 'Poproś o bezpłatną wycenę', en: 'Request a free quote' },
    message: { pl: 'Prowadzisz hodowlę i chcesz własną stronę oraz panel?', en: 'Run a kennel and want your own website and panel?' },
  },
  'kennel-clubs': {
    offerPath: '#contact',
    label: { pl: 'Porozmawiajmy o Twoim związku', en: "Let's talk about your club" },
    message: { pl: 'Prowadzisz związek kynologiczny i chcesz nowoczesny system?', en: 'Run a kennel club and want a modern system?' },
  },
  'animal-industry': {
    offerPath: '#contact',
    label: { pl: 'Porozmawiajmy o Twoim projekcie', en: "Let's talk about your project" },
    message: { pl: 'Prowadzisz firmę z branży zwierzęcej i potrzebujesz systemu?', en: 'Run an animal-industry business and need a system?' },
  },
  finance: {
    offerPath: '/projekty/ksiegai',
    label: { pl: 'Zobacz KsięgaI', en: 'See KsięgaI' },
    message: { pl: 'Szukasz systemu do fakturowania i KSeF?', en: 'Looking for an invoicing and KSeF system?' },
  },
};

export const poradnikArticles: PoradnikArticle[] = [
  // ---- 1. Independence: own site vs. renting a profile on a breeder platform ----
  {
    key: 'independence',
    category: 'breeders',
    locale: 'pl',
    slug: 'wlasna-strona-czy-portal-dla-hodowcow',
    title: 'Własna strona hodowli czy portal dla hodowców? Co się bardziej opłaca',
    description: 'Hodowca.pl, portale związków kynologicznych, Facebook — czy warto budować obecność hodowli na cudzej platformie? Porównanie z własną stroną i panelem.',
    keywords: ['własna strona dla hodowcy', 'portal dla hodowców psów', 'Hodowca.pl alternatywa', 'niezależna strona hodowli', 'panel hodowcy'],
    intro: 'Portale dla hodowców — jak Hodowca.pl czy panele hodowców przy związkach kynologicznych — są wygodnym punktem startu: zakładasz konto, wypełniasz profil, dodajesz miot. Problem pojawia się później, kiedy hodowla rośnie i zaczyna zależeć od platformy, nad którą nie masz żadnej kontroli.',
    sections: [
      {
        heading: 'Czym różni się portal od własnej strony',
        paragraphs: [
          'Portal dla hodowców to cudza platforma — Ty jesteś tam użytkownikiem, nie właścicielem. Adres, wygląd, dostępność funkcji i zasady wyświetlania Twojego profilu ustala operator portalu, nie Ty.',
          'Własna strona i panel administracyjny działają na Twojej domenie, z Twoimi danymi w Twojej bazie. Nikt nie może zmienić zasad w połowie sezonu ani przenieść Twojego profilu niżej w wynikach na rzecz płacących więcej konkurentów.',
        ],
      },
      {
        heading: 'Co realnie tracisz, mając tylko profil na portalu lub Facebooku',
        paragraphs: [
          'Jeśli cała Twoja obecność w internecie to profil na portalu i strona na Facebooku, w praktyce wynajmujesz widoczność. Zmiana algorytmu, zawieszenie konta albo zamknięcie usługi przez operatora — i tracisz jedyny kanał kontaktu z klientami z dnia na dzień.',
        ],
        list: [
          'Brak kontroli nad tym, jak i gdzie wyświetla się Twoja hodowla',
          'Zależność od zasad i cennika, które może zmienić operator platformy',
          'Dane o klientach i historii miotów zostają na cudzym serwerze',
          'Adres profilu (np. subdomena portalu) nie buduje marki Twojej hodowli',
        ],
      },
      {
        heading: 'Kiedy portal ma sens',
        paragraphs: [
          'Portale dla hodowców nie są złe — jako dodatkowy kanał dotarcia do kupujących, którzy akurat tam szukają psa, mogą realnie pomóc. Sensowne jest jednak traktowanie ich jako dodatku, nie fundamentu — dokładnie tak, jak robi to hodowla Gryfin York, która ma własną stronę i panel, a dodatkowo bywa widoczna w innych miejscach.',
        ],
      },
      {
        heading: 'Jak wygląda rozwiązanie, które łączy oba światy',
        paragraphs: [
          'Własna strona nie musi oznaczać rezygnacji z niczego innego. Chodzi o to, żeby fundament — strona, panel, baza psów i miotów, historia klientów — należał do Ciebie, a portale i social media zostały tym, czym powinny być: dodatkowymi kanałami, a nie jedynym miejscem, w którym istniejesz.',
        ],
      },
    ],
    faqs: [
      { q: 'Czy mogę mieć własną stronę i jednocześnie profil na Hodowca.pl lub Facebooku?', a: 'Tak, i to naturalny model. Własna strona jest Twoim fundamentem — resztę kanałów traktujesz jako dodatkowe źródła kontaktu, nie jedyne.' },
      { q: 'Czy muszę zrezygnować z Facebooka, zakładając własną stronę?', a: 'Nie. Facebook dobrze buduje zasięg i uwagę — problem pojawia się dopiero wtedy, gdy to Twój jedyny kanał, a konto zostaje zablokowane lub ograniczone.' },
      { q: 'Czy dane z portalu dla hodowców da się przenieść na własną stronę?', a: 'Zwykle tak — profile psów, mioty i zdjęcia da się ręcznie odtworzyć lub zaimportować przy budowie nowej strony. To jedna z pierwszych rzeczy, które sprawdzamy przy wycenie.' },
    ],
  },
  {
    key: 'independence',
    category: 'breeders',
    locale: 'en',
    slug: 'independent-website-vs-breeder-platform',
    title: 'Independent Kennel Website vs. Breeder Platforms: What Do You Actually Own?',
    description: 'Breeder platforms and kennel-management SaaS are convenient, but you never own the profile. Comparing rented platforms with an independent kennel website and panel.',
    keywords: ['independent kennel website', 'breeder platform alternative', 'own your kennel data', 'dog breeder website vs software', 'kennel admin panel'],
    intro: 'Breeder-profile platforms and kennel-management SaaS tools are a convenient starting point — create an account, fill in a profile, list a litter. The problem shows up later, once your kennel grows and depends entirely on a platform you don\'t control.',
    sections: [
      {
        heading: 'A rented profile vs. something you own',
        paragraphs: [
          'On a breeder platform or subscription kennel-management tool, you\'re a user, not an owner. The domain, the design, which features you get, and how your profile is ranked against other breeders are all decided by the platform operator — not you.',
          'An independent website and admin panel run on your own domain, with your data in your own database. No one can change the rules mid-season or bury your listing under a competitor who pays for a higher tier.',
        ],
      },
      {
        heading: 'What you actually give up with a platform-only presence',
        paragraphs: [
          'If your entire online presence is a platform profile plus a Facebook page, you\'re effectively renting your visibility. A policy change, an account suspension, or the platform shutting down a feature, and your only channel to buyers disappears overnight.',
        ],
        list: [
          'No control over how and where your kennel is shown',
          'Dependent on pricing and rules set by the platform operator',
          'Client and litter history data lives on someone else\'s server',
          'A subdomain or profile URL does nothing for your own kennel\'s brand',
        ],
      },
      {
        heading: 'When a platform still makes sense',
        paragraphs: [
          'Breeder platforms and directories aren\'t bad — as an extra channel to reach buyers who search there specifically, they genuinely help. The sensible approach is treating them as an addition, not the foundation — the same way Gryfin York runs its own site and panel while still showing up elsewhere.',
        ],
      },
      {
        heading: 'A model that combines both',
        paragraphs: [
          'Owning your foundation doesn\'t mean giving up everything else. The site, the panel, your dog and litter database, your client history — that should belong to you. Platforms and social media stay what they should be: extra channels, not the only place you exist.',
        ],
      },
    ],
    faqs: [
      { q: 'Can I have my own website and still keep a profile on a breeder platform?', a: 'Yes — that\'s the natural setup. Your own site is the foundation; everything else becomes an additional channel, not your only one.' },
      { q: 'Do I need to give up Facebook once I have my own website?', a: 'No. Facebook is good for reach and attention — the risk only shows up when it\'s your one and only channel and the account gets restricted.' },
      { q: 'Can data from a breeder platform be moved to my own website?', a: 'Usually, yes. Dog profiles, litters, and photos can typically be rebuilt or imported when we build the new site — it\'s one of the first things we check during a quote.' },
    ],
  },

  // ---- 2. Pricing ----
  {
    key: 'pricing',
    category: 'breeders',
    locale: 'pl',
    slug: 'ile-kosztuje-strona-dla-hodowli-psow',
    title: 'Ile kosztuje strona internetowa dla hodowli psów?',
    description: 'Od czego zależy cena strony i panelu dla hodowli psów, co wchodzi w zakres i dlaczego sensowna wycena zawsze jest indywidualna, nie z cennika.',
    keywords: ['ile kosztuje strona dla hodowli', 'cena strony dla hodowcy psów', 'koszt panelu dla hodowli', 'wycena strony hodowli'],
    intro: 'To jedno z pierwszych pytań, jakie zadają hodowcy — i słusznie. Problem w tym, że uczciwa odpowiedź nigdy nie brzmi „X złotych", bo zakres pracy przy każdej hodowli wygląda inaczej.',
    sections: [
      {
        heading: 'Od czego zależy cena',
        paragraphs: [
          'Hodowla zaczynająca od zera (bez strony, bez zdjęć w jednym miejscu, bez opisanych psów) to inny zakres pracy niż hodowla z istniejącą stroną, dziesiątkami profili psów i setkami zdjęć do przeniesienia.',
        ],
        list: [
          'Nowa strona od zera czy migracja istniejącej',
          'Liczba psów, miotów i szczeniąt do wprowadzenia na start',
          'Czy potrzebny jest panel administracyjny, czy tylko strona wizytówkowa',
          'Liczba wersji językowych (polska, angielska, niemiecka, niderlandzka)',
          'Dodatkowe funkcje — rodowody, wnioski od kupujących, niestandardowe rezerwacje',
        ],
      },
      {
        heading: 'Co standardowo wchodzi w zakres',
        paragraphs: [
          'Niezależnie od skali, pełny projekt (jak referencyjny system Gryfin York) obejmuje stronę publiczną, panel administracyjny, własną domenę i bazę psów, miotów oraz szczeniąt — nie tylko wizytówkę z tekstem.',
        ],
      },
      {
        heading: 'Dlaczego nie publikujemy sztywnego cennika',
        paragraphs: [
          'Sztywny cennik przy takiej rozpiętości zakresu prowadzi do dwóch złych scenariuszy: albo hodowca z prostymi potrzebami płaci za funkcje, których nie użyje, albo hodowla z dużymi potrzebami dostaje wycenę nieadekwatną do realnej pracy. Zamiast tego najpierw sprawdzamy, co już masz i czego potrzebujesz.',
        ],
      },
      {
        heading: 'Jak wygląda proces wyceny',
        paragraphs: [
          'Krótka rozmowa o hodowli, przegląd tego, co już istnieje (stara strona, zdjęcia, dane psów), a na końcu jasny zakres, termin i wycena — zanim cokolwiek zaczniemy budować.',
        ],
      },
    ],
    faqs: [
      { q: 'Czy muszę mieć gotowe zdjęcia i opisy psów przed wyceną?', a: 'Nie. Wystarczy orientacyjna liczba psów i miotów — resztę ustalimy razem, a materiały można uzupełniać w trakcie budowy strony.' },
      { q: 'Czy migracja starej strony jest droższa niż strona od zera?', a: 'To zależy od tego, ile treści jest do przeniesienia — czasem migracja jest szybsza, bo materiały już istnieją, a czasem wolniejsza, jeśli wymaga uporządkowania starych danych.' },
      { q: 'Czy wycena jest płatna?', a: 'Nie — pierwsza wycena jest bezpłatna i niezobowiązująca.' },
    ],
  },
  {
    key: 'pricing',
    category: 'breeders',
    locale: 'en',
    slug: 'kennel-website-cost',
    title: 'How Much Does a Kennel Website Cost?',
    description: 'What actually drives the cost of a kennel website and admin panel, what a full build includes, and why a fair quote is always tailored, not a fixed price list.',
    keywords: ['kennel website cost', 'dog breeder website price', 'breeder admin panel cost', 'kennel website quote'],
    intro: 'It\'s one of the first questions breeders ask — fairly so. The honest answer is never a flat number, because the scope of work looks completely different from one kennel to the next.',
    sections: [
      {
        heading: 'What actually drives the price',
        paragraphs: [
          'A kennel starting from zero — no website, no photos in one place, no dog profiles written up — is a different scope than a kennel with an existing site, dozens of dog profiles, and hundreds of photos to migrate.',
        ],
        list: [
          'A brand-new website vs. migrating an existing one',
          'How many dogs, litters, and puppies need to go in at launch',
          'Whether you need a full admin panel or a simpler storefront site',
          'How many language versions (English, German, Dutch, and so on)',
          'Extra functions — pedigrees, buyer applications, custom reservations',
        ],
      },
      {
        heading: 'What a full build typically includes',
        paragraphs: [
          'Regardless of scale, a complete system — like the reference build running for Gryfin York — includes a public website, an admin panel, your own domain, and a database of dogs, litters, and puppies, not just a text-and-photos brochure page.',
        ],
      },
      {
        heading: 'Why we don\'t publish a fixed price list',
        paragraphs: [
          'A flat price list across that range of scope leads to two bad outcomes: a breeder with simple needs overpays for features they\'ll never use, or a breeder with large needs gets a quote that doesn\'t match the real work. Instead, we first check what you already have and what you actually need.',
        ],
      },
      {
        heading: 'How the quote process works',
        paragraphs: [
          'A short conversation about your kennel, a review of what already exists (an old site, photos, dog records), then a clear scope, timeline, and quote — before any work begins.',
        ],
      },
    ],
    faqs: [
      { q: 'Do I need finished photos and dog descriptions before getting a quote?', a: 'No. A rough count of dogs and litters is enough — we work out the rest together, and materials can be filled in while the site is being built.' },
      { q: 'Is migrating an old site more expensive than building from scratch?', a: 'It depends on how much content needs to move — sometimes migration is faster because the material already exists, sometimes slower if old data needs cleaning up first.' },
      { q: 'Does the quote cost anything?', a: 'No — the first quote is free and comes with no obligation.' },
    ],
  },

  // ---- 3. Choosing a panel ----
  {
    key: 'panel-choice',
    category: 'breeders',
    locale: 'pl',
    slug: 'panel-administracyjny-dla-hodowcy-psow',
    title: 'Panel administracyjny dla hodowcy psów — jak wybrać system do zarządzania miotami i szczeniętami',
    description: 'Na co zwrócić uwagę, wybierając panel administracyjny dla hodowli psów: zarządzanie miotami, szczeniętami, statusami rezerwacji, zdjęciami i zapytaniami.',
    keywords: ['panel administracyjny hodowla psów', 'system do zarządzania miotem', 'program dla hodowcy psów', 'zarządzanie szczeniętami online'],
    intro: 'Dobry panel administracyjny to taki, o którym po tygodniu przestajesz myśleć — po prostu działa, tak jak działa Twoja hodowla. Poniżej funkcje, których warto oczekiwać, zanim zdecydujesz się na konkretne rozwiązanie.',
    sections: [
      {
        heading: 'Zarządzanie psami, miotami i szczeniętami w jednym miejscu',
        paragraphs: [
          'Podstawa to jedna baza: psy hodowlane, mioty, które ich łączą, i szczenięta w każdym miocie — bez ręcznego powielania danych między arkuszem, Facebookiem i pamięcią.',
        ],
      },
      {
        heading: 'Statusy rezerwacji, które aktualizują się od razu na stronie',
        paragraphs: [
          'Zmiana statusu szczenięcia z „Dostępny" na „Zarezerwowany" powinna zajmować jedno kliknięcie w panelu — i pojawiać się na publicznej stronie natychmiast, bez proszenia kogokolwiek o aktualizację.',
        ],
      },
      {
        heading: 'Zdjęcia dodawane wprost z telefonu',
        paragraphs: [
          'Najlepsze zdjęcia szczeniąt powstają spontanicznie, nie przy komputerze. Panel wart wyboru pozwala wgrać zdjęcie z telefonu w kilka sekund, bez przesiadania się na laptopa.',
        ],
      },
      {
        heading: 'Zapytania i opinie klientów bez skrzynki mailowej jako jedynego kanału',
        paragraphs: [
          'Zapytania o konkretnego szczeniaka i opinie klientów warto mieć w tym samym panelu co psy i mioty — łatwiej wtedy nic nie przeoczyć.',
        ],
      },
      {
        heading: 'Kto ma dostęp i na czyich warunkach',
        paragraphs: [
          'Ostatnie, najważniejsze pytanie: czy panel i dane w nim są Twoją własnością, czy zależą od dostawcy, który w każdej chwili może zmienić zasady, cennik albo zniknąć z rynku.',
        ],
      },
    ],
  },
  {
    key: 'panel-choice',
    category: 'breeders',
    locale: 'en',
    slug: 'admin-panel-for-dog-breeders',
    title: 'Choosing an Admin Panel for Your Kennel: What to Look For',
    description: 'What to look for in a dog breeder admin panel: managing litters and puppies, reservation statuses, photos, and enquiries — before picking a system.',
    keywords: ['dog breeder admin panel', 'kennel management panel', 'litter management software', 'puppy status tracking'],
    intro: 'A good admin panel is one you stop thinking about after a week — it just works, the way your kennel works. Here\'s what to expect before committing to a specific system.',
    sections: [
      {
        heading: 'Dogs, litters, and puppies in one place',
        paragraphs: [
          'The baseline is a single database: breeding dogs, the litters that connect them, and the puppies in each litter — no manually duplicating data across a spreadsheet, Facebook, and memory.',
        ],
      },
      {
        heading: 'Reservation statuses that update the public site instantly',
        paragraphs: [
          'Changing a puppy\'s status from "Available" to "Reserved" should take one click in the panel — and show up on the public website immediately, without asking anyone to update anything.',
        ],
      },
      {
        heading: 'Photos you can add straight from your phone',
        paragraphs: [
          'The best puppy photos happen spontaneously, not at a desk. A panel worth choosing lets you upload a photo from your phone in seconds, without switching to a laptop.',
        ],
      },
      {
        heading: 'Enquiries and reviews without email as the only channel',
        paragraphs: [
          'Enquiries about a specific puppy and customer reviews belong in the same panel as your dogs and litters — it\'s much harder to miss something that way.',
        ],
      },
      {
        heading: 'Who owns the access, and on whose terms',
        paragraphs: [
          'The last and most important question: is the panel and the data in it yours, or does it depend on a vendor who can change the rules, the pricing, or disappear from the market at any time.',
        ],
      },
    ],
  },

  // ---- 4. Presenting puppies online ----
  {
    key: 'puppy-presentation',
    category: 'breeders',
    locale: 'pl',
    slug: 'jak-zaprezentowac-szczeniaki-w-internecie',
    title: 'Jak zaprezentować szczenięta w internecie, żeby szybciej znalazły nowy dom',
    description: 'Praktyczne wskazówki dla hodowców: zdjęcia, opisy i statusy dostępności, które realnie pomagają szczeniętom szybciej znaleźć nowy dom.',
    keywords: ['jak sprzedać szczenięta', 'prezentacja szczeniąt online', 'zdjęcia szczeniąt do ogłoszenia', 'opis szczenięcia na stronę'],
    intro: 'Kupujący szczenię decyduje się często w kilka sekund, przewijając zdjęcia. Kilka prostych zmian w tym, jak prezentujesz miot, potrafi realnie skrócić czas do znalezienia nowego domu.',
    sections: [
      {
        heading: 'Zdjęcia, które sprzedają',
        paragraphs: [
          'Naturalne światło dzienne, zbliżenie na pyszczek i całą sylwetkę, kilka ujęć zamiast jednego — to działa lepiej niż jedno idealne zdjęcie studyjne. Warto pokazywać szczenię w ruchu, nie tylko w spoczynku.',
        ],
      },
      {
        heading: 'Co napisać w opisie szczenięcia',
        paragraphs: [
          'Imię, płeć, kolor, data urodzenia, rodzice (najlepiej z linkiem do ich profili) i status — to minimum. Krótka notatka o charakterze szczenięcia, jeśli już go zauważyłaś, dodaje więcej niż długi opis rasy, który kupujący i tak zna.',
        ],
      },
      {
        heading: 'Status dostępności — dlaczego to ważne',
        paragraphs: [
          'Nic nie zniechęca bardziej niż pytanie o szczenię, które od tygodnia jest już sprzedane. Aktualny status („Dostępny", „Zarezerwowany", „Sprzedany") widoczny od razu na stronie oszczędza czas Tobie i kupującym.',
        ],
      },
      {
        heading: 'Gdzie publikować ogłoszenie',
        paragraphs: [
          'Własna strona jako główne źródło prawdy, a social media i portale dla hodowców jako dodatkowe kanały prowadzące do tej samej, aktualnej strony — to prostszy model niż aktualizowanie tej samej informacji w pięciu różnych miejscach.',
        ],
      },
    ],
  },
  {
    key: 'puppy-presentation',
    category: 'breeders',
    locale: 'en',
    slug: 'how-to-present-puppies-online',
    title: 'How to Present Puppies Online So They Find Homes Faster',
    description: 'Practical advice for breeders: photos, descriptions, and availability statuses that genuinely help puppies find new homes faster.',
    keywords: ['how to sell puppies online', 'presenting puppies online', 'puppy listing photos', 'puppy profile description'],
    intro: 'Buyers often decide within seconds while scrolling through photos. A few simple changes to how you present a litter can genuinely shorten the time to finding a new home.',
    sections: [
      {
        heading: 'Photos that sell',
        paragraphs: [
          'Natural daylight, a close-up on the face plus a full-body shot, several angles instead of one — this works better than a single "perfect" studio photo. Show the puppy in motion, not only at rest.',
        ],
      },
      {
        heading: 'What to include in a puppy description',
        paragraphs: [
          'Name, sex, color, date of birth, parents (ideally linked to their profiles), and status — that\'s the minimum. A short note on temperament, if you\'ve already noticed something, adds more than a long breed description the buyer already knows.',
        ],
      },
      {
        heading: 'Availability status — why it matters',
        paragraphs: [
          'Nothing frustrates a buyer more than asking about a puppy that\'s been sold for a week. A status ("Available", "Reserved", "Sold") visible instantly on the site saves time for both you and the buyer.',
        ],
      },
      {
        heading: 'Where to publish the listing',
        paragraphs: [
          'Your own website as the single source of truth, with social media and breeder platforms as extra channels pointing back to that same up-to-date page — simpler than updating the same information in five different places.',
        ],
      },
    ],
  },

  // ---- 5. Facebook risk / ownership ----
  {
    key: 'facebook-risk',
    category: 'breeders',
    locale: 'pl',
    slug: 'facebook-zablokowal-profil-hodowli-co-teraz',
    title: 'Facebook zablokował profil hodowli — co teraz?',
    description: 'Co robić, gdy stracisz dostęp do profilu hodowli na Facebooku, i jak zbudować obecność w internecie, która nie zniknie razem z jedną platformą.',
    keywords: ['Facebook zablokował stronę', 'utrata profilu hodowli', 'niezależność od Facebooka', 'kopia zapasowa kontaktów hodowla'],
    intro: 'To nie jest rzadki scenariusz — profile firmowe na Facebooku bywają blokowane lub ograniczane bez ostrzeżenia, czasem przez pomyłkę algorytmu, czasem przez zgłoszenie konkurencji. Jeśli to jedyne miejsce, gdzie istnieje Twoja hodowla, tracisz wszystko naraz.',
    sections: [
      {
        heading: 'Dlaczego blokady się zdarzają',
        paragraphs: [
          'Automatyczne systemy moderacji Facebooka działają masowo i popełniają błędy. Zgłoszenie przez inną osobę, nawet bezpodstawne, potrafi zablokować profil na czas odwołania — które może trwać tygodniami.',
        ],
      },
      {
        heading: 'Co tracisz razem z profilem',
        paragraphs: [
          'Historię postów, zdjęcia miotów, wiadomości od zainteresowanych kupujących, opinie klientów, a często też jedyny widoczny numer kontaktowy do hodowli. Odtworzenie tego od zera kosztuje więcej czasu niż zbudowanie niezależnej strony.',
        ],
      },
      {
        heading: 'Jak zbudować niezależność, zanim będzie potrzebna',
        paragraphs: [
          'Własna strona z panelem administracyjnym, na własnej domenie, z bazą psów i miotów, do której masz pełny dostęp niezależnie od tego, co dzieje się z jakąkolwiek platformą społecznościową.',
        ],
      },
      {
        heading: 'Co zrobić już dziś',
        paragraphs: [
          'Nawet bez pełnego systemu warto już teraz mieć kopię zdjęć i opisów psów poza Facebookiem, oraz alternatywny sposób kontaktu (e-mail, telefon) widoczny w więcej niż jednym miejscu.',
        ],
      },
    ],
  },
  {
    key: 'facebook-risk',
    category: 'breeders',
    locale: 'en',
    slug: 'what-if-facebook-blocks-your-kennel-page',
    title: 'What If Facebook Blocks Your Kennel Page? Owning Your Audience',
    description: 'What to do if you lose access to your kennel\'s Facebook page, and how to build an online presence that doesn\'t disappear with one platform.',
    keywords: ['Facebook page blocked', 'kennel page suspended', 'independence from Facebook', 'own your kennel audience'],
    intro: 'It\'s not a rare scenario — business Facebook pages get blocked or restricted without warning, sometimes from an algorithm mistake, sometimes from a competitor\'s report. If that\'s the only place your kennel exists online, you lose everything at once.',
    sections: [
      {
        heading: 'Why blocks happen',
        paragraphs: [
          'Facebook\'s automated moderation operates at massive scale and makes mistakes. A report from someone else, even a baseless one, can lock a page for the duration of an appeal — which can take weeks.',
        ],
      },
      {
        heading: 'What disappears along with the page',
        paragraphs: [
          'Your post history, litter photos, messages from interested buyers, customer reviews, and often the only visible contact number for your kennel. Rebuilding that from scratch costs more time than building an independent website in the first place.',
        ],
      },
      {
        heading: 'How to build independence before you need it',
        paragraphs: [
          'An independent website with an admin panel, on your own domain, with a dog and litter database you have full access to — regardless of what happens on any social platform.',
        ],
      },
      {
        heading: 'What to do today',
        paragraphs: [
          'Even without a full system, keep a backup of dog photos and descriptions outside Facebook, and make an alternative way to get in touch (email, phone) visible in more than one place.',
        ],
      },
    ],
  },

  // ---- 6. Google Business Profile / local SEO ----
  {
    key: 'google-business',
    category: 'breeders',
    locale: 'pl',
    slug: 'wizytowka-google-dla-hodowli-psow-lokalne-seo',
    title: 'Wizytówka Google dla hodowli psów — jak zdobyć klientów w lokalnym wyszukiwaniu',
    description: 'Czym jest wizytówka Google Firma, dlaczego to nie to samo co strona internetowa, i jak razem pomagają hodowli pojawiać się w lokalnych wynikach wyszukiwania.',
    keywords: ['wizytówka Google dla hodowli', 'Google moja firma hodowla psów', 'lokalne SEO hodowla', 'jak zdobyć klientów lokalnie hodowla'],
    intro: 'Kiedy ktoś szuka „hodowla [rasa] [miasto]", Google najpierw pokazuje mapę z wizytówkami firm, a dopiero niżej wyniki organiczne. Bez wizytówki Google Twoja hodowla jest w tym miejscu niewidoczna, nawet jeśli masz świetną stronę.',
    sections: [
      {
        heading: 'Czym jest wizytówka Google i dlaczego to nie to samo co strona',
        paragraphs: [
          'Wizytówka Google Firma (Google Business Profile) to darmowy wpis w Mapach Google i lokalnych wynikach wyszukiwania — nazwa, lokalizacja, godziny, opinie, zdjęcia. Strona internetowa i wizytówka pełnią różne role i działają najlepiej razem, nie zamiast siebie.',
        ],
      },
      {
        heading: 'Jak założyć i zweryfikować wizytówkę',
        paragraphs: [
          'Zakładanie wizytówki jest bezpłatne, ale weryfikacja (zwykle listem z kodem lub telefonicznie) bywa czasochłonna i łatwo popełnić błąd w kategorii działalności lub obszarze obsługi — co potem trudno poprawić bez utraty historii opinii.',
        ],
      },
      {
        heading: 'Co publikować w wizytówce',
        paragraphs: [
          'Aktualne zdjęcia psów i hodowli, odpowiedzi na opinie klientów i regularne krótkie posty o dostępnych szczeniętach — wizytówka, która „żyje", jest wyżej w lokalnych wynikach niż założona i zapomniana.',
        ],
      },
      {
        heading: 'Jak wizytówka i strona współpracują ze sobą',
        paragraphs: [
          'Link z wizytówki prowadzący do aktualnej strony z dostępnymi miotami zamienia kliknięcie w Mapach w realne zapytanie — pod warunkiem, że strona, do której trafia klient, faktycznie jest aktualna.',
        ],
      },
    ],
  },
  {
    key: 'google-business',
    category: 'breeders',
    locale: 'en',
    slug: 'google-business-profile-for-kennels',
    title: 'Google Business Profile for Kennels: Local SEO That Brings Buyers',
    description: 'What a Google Business Profile is, why it\'s not the same as a website, and how the two work together to get a kennel found in local search.',
    keywords: ['Google Business Profile for breeders', 'kennel local SEO', 'Google Maps kennel listing', 'local search for dog breeders'],
    intro: 'When someone searches "[breed] breeder near [city]", Google shows a map with business listings first, organic results further down. Without a Google Business Profile, your kennel is invisible in that spot, even with a great website.',
    sections: [
      {
        heading: 'What a Google Business Profile is, and why it\'s not the same as a website',
        paragraphs: [
          'A Google Business Profile is a free listing in Google Maps and local search results — name, location, hours, reviews, photos. A website and a Business Profile play different roles and work best together, not as substitutes for one another.',
        ],
      },
      {
        heading: 'Setting up and verifying the listing',
        paragraphs: [
          'Creating the profile is free, but verification (usually by mail code or phone) can take time, and it\'s easy to get the business category or service area wrong — a mistake that\'s hard to fix later without losing your review history.',
        ],
      },
      {
        heading: 'What to publish on the profile',
        paragraphs: [
          'Current photos of your dogs and kennel, replies to customer reviews, and regular short posts about available puppies — a profile that stays "alive" ranks higher in local results than one that\'s created and forgotten.',
        ],
      },
      {
        heading: 'How the profile and your website work together',
        paragraphs: [
          'A link from the profile to a current page of available litters turns a Maps click into a real enquiry — as long as the page the buyer lands on is actually up to date.',
        ],
      },
    ],
  },

  // ---- 7. Kennel clubs: electronic pedigree registry ----
  {
    key: 'pedigree-registry',
    category: 'kennel-clubs',
    locale: 'pl',
    slug: 'elektroniczna-ksiega-rodowodowa-dla-zwiazku-kynologicznego',
    title: 'Elektroniczna księga rodowodowa dla związku kynologicznego — czego naprawdę potrzeba',
    description: 'Jak powinna wyglądać nowoczesna elektroniczna księga rodowodowa: podział ról biuro/hodowca/publiczna weryfikacja, pełny audyt zmian i zabezpieczenie przed podrabianiem dokumentów.',
    keywords: ['elektroniczna księga rodowodowa', 'system dla związku kynologicznego', 'PKR online', 'weryfikacja rodowodu QR', 'oprogramowanie dla biura związku'],
    intro: 'Wiele związków kynologicznych wciąż prowadzi księgę rodowodową w formie papierowej lub w systemie, który nie nadąża za tym, jak faktycznie pracuje biuro i hodowcy. Elektroniczna księga to nie tylko skan papierowego rejestru — to inny podział ról i inny poziom kontroli.',
    sections: [
      {
        heading: 'Dlaczego sam PDF lub arkusz to za mało',
        paragraphs: [
          'Rejestr w arkuszu lub luźnych dokumentach PDF nie ma historii zmian, nie rozróżnia, kto i kiedy coś zmienił, i nie da się go bezpiecznie udostępnić hodowcom bez ryzyka nadpisania cudzych danych.',
        ],
      },
      {
        heading: 'Trzy role, trzy różne potrzeby',
        paragraphs: [
          'Biuro związku potrzebuje pełnego dostępu do rejestru, rozliczeń i historii zmian. Hodowca potrzebuje własnego panelu — swoje psy, mioty, wnioski o rodowód ze śledzeniem statusu. Kupujący potrzebuje tylko jednej rzeczy: sprawdzić, czy dokument, który trzyma w ręku, jest prawdziwy — bez logowania się do czegokolwiek.',
        ],
        list: [
          'Panel biura — pełny rejestr, rozliczenia, audyt zmian',
          'Panel hodowcy — własne psy, mioty, wnioski o rodowód',
          'Publiczna weryfikacja — kod QR na dokumencie, bez logowania',
        ],
      },
      {
        heading: 'Weryfikacja kodem QR jako zabezpieczenie',
        paragraphs: [
          'Każdy wydany rodowód z kodem QR prowadzącym do publicznej, ograniczonej strony weryfikacyjnej utrudnia sprzedaż podrobionych lub niepokrytych dokumentów — kupujący może to sprawdzić sam, w kilka sekund, telefonem.',
        ],
      },
      {
        heading: 'Pełny dziennik zmian',
        paragraphs: [
          'Kto, co i kiedy zmienił w rejestrze — to podstawowe pytanie w razie sporu lub kontroli. System bez dziennika zmian nie daje na nie odpowiedzi.',
        ],
      },
      {
        heading: 'Jak wygląda to w praktyce',
        paragraphs: [
          'Dokładnie taki podział — panel biura, panel hodowcy i publiczna weryfikacja QR na osobnej, zabezpieczonej domenie — zbudowaliśmy dla POKIU. To nie teoria; to działający system.',
        ],
      },
    ],
  },
  {
    key: 'pedigree-registry',
    category: 'kennel-clubs',
    locale: 'en',
    slug: 'electronic-pedigree-registry-for-kennel-clubs',
    title: 'Electronic Pedigree Registry for Kennel Clubs — What It Actually Needs',
    description: 'What a modern electronic pedigree registry needs: role separation between office, breeders, and public verification, a full change audit trail, and protection against document forgery.',
    keywords: ['electronic pedigree registry', 'kennel club software', 'online pedigree book', 'QR pedigree verification', 'kennel club office software'],
    intro: 'Many kennel clubs still run their pedigree registry on paper, or on a system that hasn\'t kept up with how the office and breeders actually work. An electronic registry isn\'t just a scanned paper record — it\'s a different split of roles and a different level of control.',
    sections: [
      {
        heading: 'Why a spreadsheet or PDF isn\'t enough',
        paragraphs: [
          'A registry kept in a spreadsheet or loose PDF files has no change history, doesn\'t distinguish who changed what and when, and can\'t safely be shared with breeders without risking someone overwriting someone else\'s data.',
        ],
      },
      {
        heading: 'Three roles, three different needs',
        paragraphs: [
          'The club office needs full access to the registry, billing, and change history. Breeders need their own panel — their dogs, litters, and pedigree requests with status tracking. Buyers need exactly one thing: to check whether the document in their hand is genuine — without logging into anything.',
        ],
        list: [
          'Office panel — full registry, billing, change audit',
          'Breeder panel — own dogs, litters, pedigree requests',
          'Public verification — QR code on the document, no login required',
        ],
      },
      {
        heading: 'QR verification as a safeguard',
        paragraphs: [
          'Every issued pedigree carrying a QR code to a limited public verification page makes it much harder to sell forged or unbacked documents — a buyer can check it themselves, in seconds, with a phone.',
        ],
      },
      {
        heading: 'A full change log',
        paragraphs: [
          'Who changed what in the registry, and when — that\'s the basic question in any dispute or audit. A system without a change log has no answer to it.',
        ],
      },
      {
        heading: 'What this looks like in practice',
        paragraphs: [
          'Exactly this split — an office panel, a breeder panel, and public QR verification on a separate, locked-down domain — is what we built for POKIU. Not a theory; a running system.',
        ],
      },
    ],
  },

  // ---- 8. Kennel clubs: breeder-office collaboration ----
  {
    key: 'breeder-office-collab',
    category: 'kennel-clubs',
    locale: 'pl',
    slug: 'wspolpraca-biura-zwiazku-z-hodowcami-online',
    title: 'Współpraca biura związku z hodowcami online — koniec z e-mailami i papierem',
    description: 'Jak przenieść wnioski o rodowód, rejestrację miotów i komunikację z hodowcami z e-maila i papieru do wspólnego panelu ze śledzeniem statusu.',
    keywords: ['panel hodowcy online', 'wnioski o rodowód online', 'komunikacja biuro hodowca', 'rejestracja miotu online'],
    intro: 'Wniosek o rodowód wysłany e-mailem ginie w skrzynce, dokument papierowy trzeba zeskanować, a status sprawy hodowca poznaje dopiero, dzwoniąc do biura. Wspólny panel dla biura i hodowców rozwiązuje wszystkie trzy problemy naraz.',
    sections: [
      {
        heading: 'Gdzie najczęściej grzęźnie komunikacja',
        paragraphs: [
          'Wnioski o rodowód, zgłoszenia miotów i pytania o status dokumentów — to najczęstsza korespondencja między hodowcą a biurem związku, i najczęściej ginie w e-mailach, wiadomościach na Facebooku albo telefonach.',
        ],
      },
      {
        heading: 'Co zyskuje hodowca z własnym panelem',
        paragraphs: [
          'Panel hodowcy z widokiem własnych psów, miotów i wniosków o rodowód ze statusem (oczekuje / zatwierdzone / odrzucone) eliminuje pytanie „na jakim etapie jest mój wniosek" — bo odpowiedź jest widoczna od razu.',
        ],
      },
      {
        heading: 'Co zyskuje biuro',
        paragraphs: [
          'Zamiast rozproszonej korespondencji — jedna kolejka wniosków, filtrowana po statusie, z notatkami biura przy każdej sprawie. Mniej telefonów z pytaniem o status oznacza więcej czasu na samą pracę merytoryczną.',
        ],
      },
      {
        heading: 'Jak to wygląda w działającym systemie',
        paragraphs: [
          'Dokładnie taki panel — z filtrowaniem wniosków po statusie i notatkami biura — działa dziś w systemie zbudowanym dla POKIU, jako osobna domena `hodowca.pokiu.pl`, oddzielona od panelu biura.',
        ],
      },
    ],
  },
  {
    key: 'breeder-office-collab',
    category: 'kennel-clubs',
    locale: 'en',
    slug: 'kennel-club-breeder-collaboration-online',
    title: 'Kennel Club Breeder Collaboration Online — Beyond Email and Paper',
    description: 'How to move pedigree requests, litter registrations, and breeder communication out of email and paper into a shared panel with status tracking.',
    keywords: ['online breeder panel', 'pedigree requests online', 'office breeder communication', 'online litter registration'],
    intro: 'A pedigree request sent by email gets lost in an inbox, a paper document has to be scanned, and a breeder only learns the status of their case by calling the office. A shared panel for the office and breeders solves all three problems at once.',
    sections: [
      {
        heading: 'Where communication usually gets stuck',
        paragraphs: [
          'Pedigree requests, litter registrations, and status questions are the most common correspondence between a breeder and the club office — and the most common place it gets lost, in email, Facebook messages, or phone calls.',
        ],
      },
      {
        heading: 'What a breeder gains from their own panel',
        paragraphs: [
          'A breeder panel showing their own dogs, litters, and pedigree requests with a status (pending / approved / rejected) eliminates the "what stage is my request at" question — the answer is visible instantly.',
        ],
      },
      {
        heading: 'What the office gains',
        paragraphs: [
          'Instead of scattered correspondence — one queue of requests, filterable by status, with office notes attached to each case. Fewer status-check phone calls means more time for the actual work.',
        ],
      },
      {
        heading: 'What this looks like in a running system',
        paragraphs: [
          'Exactly this panel — with status-filtered requests and office notes — runs today in the system we built for POKIU, as a separate domain, `hodowca.pokiu.pl`, kept apart from the office panel.',
        ],
      },
    ],
  },

  // ---- 9. Animal industry: booking system ownership ----
  {
    key: 'booking-system-ownership',
    category: 'animal-industry',
    locale: 'pl',
    slug: 'system-rezerwacji-dla-hotelu-dla-zwierzat-czy-warto-miec-wlasny',
    title: 'System rezerwacji dla hotelu dla zwierząt, groomera lub transportu — czy warto mieć własny',
    description: 'Gotowe systemy rezerwacji dla hoteli dla zwierząt i groomerów kontra dedykowany system zbudowany pod konkretną firmę — co się bardziej opłaca w dłuższej perspektywie.',
    keywords: ['system rezerwacji hotel dla psów', 'program dla groomera', 'oprogramowanie dla transportu zwierząt', 'własny system rezerwacji czy gotowe SaaS'],
    intro: 'Gotowe systemy rezerwacji dla hoteli dla zwierząt, groomerów czy firm transportowych są szybkie do wdrożenia — konto, szablon, gotowe. Problem pojawia się, gdy Twoja firma robi coś, czego szablon nie przewidział, albo gdy miesięczny koszt subskrypcji rośnie razem ze skalą.',
    sections: [
      {
        heading: 'Co dają gotowe systemy rezerwacji',
        paragraphs: [
          'Szybkie wdrożenie, gotowy kalendarz, automatyczne przypomnienia SMS — dla firmy zaczynającej od zera to sensowny, tani start.',
        ],
      },
      {
        heading: 'Gdzie szablon przestaje wystarczać',
        paragraphs: [
          'Transport zwierząt między krajami, niestandardowe pakiety usług w hotelu dla zwierząt, integracja rezerwacji z fakturowaniem czy dokumentacją zdrowotną — to funkcje, których gotowy szablon rezerwacyjny zwykle nie przewiduje, bo musi pasować do tysięcy różnych firm naraz.',
        ],
        list: [
          'Miesięczna opłata rośnie wraz z liczbą rezerwacji lub pracowników',
          'Twoje dane klientów zostają na cudzej platformie',
          'Niestandardowy proces trzeba obchodzić ręcznie, poza systemem',
          'Zmiana dostawcy oznacza migrację wszystkiego od zera',
        ],
      },
      {
        heading: 'Kiedy dedykowany system się opłaca',
        paragraphs: [
          'Jeśli Twoja firma ma proces, który realnie różni się od standardowego — wielojęzyczna obsługa klientów międzynarodowych, dokumenty i zgodność prawna przy transporcie zwierząt, płatności powiązane z rozliczeniami — dedykowany system przestaje być luksusem, a zaczyna być oszczędnością czasu.',
        ],
      },
      {
        heading: 'Model pośredni',
        paragraphs: [
          'Nie trzeba wybierać skrajności. Sensowne jest zaczynanie od gotowego narzędzia do prostych rezerwacji, a budowanie dedykowanego systemu dopiero tam, gdzie proces firmy faktycznie odróżnia ją od konkurencji.',
        ],
      },
    ],
  },
  {
    key: 'booking-system-ownership',
    category: 'animal-industry',
    locale: 'en',
    slug: 'pet-business-booking-system-owned-vs-rented',
    title: 'Booking Systems for Pet Hotels, Groomers, and Transport — Owned or Rented?',
    description: 'Off-the-shelf booking software for pet hotels and groomers vs. a dedicated system built around your specific business — what pays off in the long run.',
    keywords: ['pet hotel booking system', 'grooming salon software', 'animal transport software', 'own booking system vs SaaS'],
    intro: 'Off-the-shelf booking systems for pet hotels, groomers, or transport businesses are fast to set up — create an account, pick a template, done. The problem shows up when your business does something the template didn\'t anticipate, or when the monthly subscription cost grows along with your scale.',
    sections: [
      {
        heading: 'What ready-made booking systems get you',
        paragraphs: [
          'Fast setup, a ready calendar, automatic SMS reminders — for a business starting from zero, that\'s a sensible, cheap start.',
        ],
      },
      {
        heading: 'Where the template stops being enough',
        paragraphs: [
          'Cross-border animal transport, custom service packages at a pet hotel, tying bookings into invoicing or health documentation — these are the kinds of features a generic booking template usually doesn\'t cover, because it has to fit thousands of different businesses at once.',
        ],
        list: [
          'Monthly fees scale with bookings or staff count',
          'Your client data lives on someone else\'s platform',
          'A non-standard process has to be handled manually, outside the system',
          'Switching providers means migrating everything from scratch',
        ],
      },
      {
        heading: 'When a dedicated system pays off',
        paragraphs: [
          'If your business has a process genuinely different from the standard — multilingual service for international clients, legal compliance documents for animal transport, payments tied to internal accounting — a dedicated system stops being a luxury and starts saving real time.',
        ],
      },
      {
        heading: 'A middle path',
        paragraphs: [
          'You don\'t have to pick an extreme. It\'s sensible to start with a ready-made tool for simple bookings, and build a dedicated system only where the business\'s process actually sets it apart from competitors.',
        ],
      },
    ],
  },

  // ---- 10. Animal industry: transport compliance ----
  {
    key: 'animal-transport-compliance',
    category: 'animal-industry',
    locale: 'pl',
    slug: 'system-dla-transportu-zwierzat-dokumenty-i-zgodnosc',
    title: 'System dla transportu zwierząt — dokumenty i zgodność w wielu jurysdykcjach UE',
    description: 'Jak dedykowany system pomaga licencjonowanym firmom transportującym zwierzęta zarządzać dokumentacją i zgodnością prawną w różnych krajach UE.',
    keywords: ['transport zwierząt system', 'zgodność prawna transport zwierząt UE', 'licencjonowany transport zwierząt oprogramowanie', 'dokumenty transport zwierząt'],
    intro: 'Transport zwierząt przez granice UE to nie tylko logistyka — to komplet dokumentów, licencji i wymogów, które różnią się między krajami i muszą być zawsze aktualne i możliwe do udowodnienia w razie kontroli.',
    sections: [
      {
        heading: 'Dlaczego arkusz i folder z dokumentami nie wystarczą',
        paragraphs: [
          'Przy transporcie w jednym kraju arkusz kalkulacyjny może wystarczyć. Przy operacjach w kilku jurysdykcjach jednocześnie — z różnymi wymogami dokumentacyjnymi w każdej — ręczne śledzenie zaczyna generować błędy, których konsekwencją bywa zatrzymanie transportu na granicy.',
        ],
      },
      {
        heading: 'Co powinien śledzić dedykowany system',
        paragraphs: [
          'Ważność licencji i certyfikatów, komplet dokumentów wymaganych w każdej jurysdykcji na trasie, oraz historię przewozów możliwą do przedstawienia podczas kontroli.',
        ],
        list: [
          'Śledzenie zgodności w wielu jurysdykcjach jednocześnie',
          'Automatyczne przypomnienia o wygasających licencjach i certyfikatach',
          'Koordynacja w czasie rzeczywistym między kierowcą, biurem i klientem',
          'Pełna historia przewozów jako dowód zgodności',
        ],
      },
      {
        heading: 'Dlaczego to akurat obszar, gdzie dedykowany system się broni',
        paragraphs: [
          'Ogólne systemy logistyczne nie są projektowane pod specyfikę transportu żywych zwierząt — inne wymogi dokumentacyjne, inny reżim kontroli. To dokładnie ten przypadek, w którym gotowe narzędzie kosztuje więcej w obejściach niż zbudowanie systemu dopasowanego do realnych wymogów.',
        ],
      },
    ],
  },
  {
    key: 'animal-transport-compliance',
    category: 'animal-industry',
    locale: 'en',
    slug: 'animal-transport-compliance-systems',
    title: 'Systems for Animal Transport — Documents and Compliance Across EU Jurisdictions',
    description: 'How a dedicated system helps licensed animal transport companies manage documentation and legal compliance across different EU countries.',
    keywords: ['animal transport system', 'EU animal transport compliance', 'licensed animal transport software', 'animal transport documents'],
    intro: 'Transporting animals across EU borders isn\'t just logistics — it\'s a full set of documents, licenses, and requirements that differ between countries and must always be current and provable during an inspection.',
    sections: [
      {
        heading: 'Why a spreadsheet and a folder of documents fall short',
        paragraphs: [
          'For transport within a single country, a spreadsheet might be enough. Operating across several jurisdictions at once — each with different documentation requirements — turns manual tracking into a source of errors, and the consequence is often a transport stopped at the border.',
        ],
      },
      {
        heading: 'What a dedicated system should track',
        paragraphs: [
          'License and certificate validity, the full set of documents required in each jurisdiction along the route, and a transport history that can be presented during an inspection.',
        ],
        list: [
          'Compliance tracking across multiple jurisdictions at once',
          'Automatic reminders for expiring licenses and certificates',
          'Real-time coordination between driver, office, and client',
          'A full transport history as proof of compliance',
        ],
      },
      {
        heading: 'Why this is exactly where a dedicated system earns its cost',
        paragraphs: [
          'Generic logistics software isn\'t designed around the specifics of live animal transport — different documentation requirements, a different inspection regime. This is exactly the case where a ready-made tool costs more in workarounds than building a system matched to the real requirements.',
        ],
      },
    ],
  },

  // ---- 11. Finance: choosing KSeF software ----
  {
    key: 'ksef-software-choice',
    category: 'finance',
    locale: 'pl',
    slug: 'jak-wybrac-program-do-ksef-dla-malej-firmy',
    title: 'Jak wybrać program do KSeF dla małej firmy',
    description: 'Na co zwrócić uwagę, wybierając oprogramowanie do KSeF: automatyczne wysyłanie faktur, brak ręcznego przepisywania danych i integracja z resztą firmowych systemów.',
    keywords: ['program do KSeF dla małej firmy', 'automatyzacja fakturowania KSeF', 'wybór oprogramowania KSeF', 'system fakturowania zgodny z KSeF'],
    intro: 'Właściciel małej firmy zwykle łączy kilka ról naraz i nie ma czasu na ręczne przepisywanie danych między systemami. Dobry program do KSeF powinien to rozumieć — reszta to kwestia tego, jak daleko sięga automatyzacja.',
    sections: [
      {
        heading: 'Automatyczna komunikacja z KSeF',
        paragraphs: [
          'Wystawiona faktura powinna trafiać do Krajowego Systemu e-Faktur automatycznie, bez dodatkowego logowania się do osobnej strony czy aplikacji. Jeśli program tego nie robi, i tak wykonujesz pracę ręcznie — tylko w innym miejscu.',
        ],
      },
      {
        heading: 'Brak ręcznego przepisywania danych',
        paragraphs: [
          'Dane kontrahenta, pozycje faktur, faktury zakupowe pobierane automatycznie — każde miejsce, gdzie trzeba coś ręcznie przepisać, to potencjalny błąd i strata czasu, które się kumulują przy większej liczbie dokumentów.',
        ],
      },
      {
        heading: 'Prostota interfejsu ma znaczenie',
        paragraphs: [
          'Program do KSeF dla małej firmy nie powinien wymagać wiedzy księgowej ani skomplikowanej konfiguracji. Szybkie wystawienie faktury bez przechodzenia przez dziesięć ekranów to nie luksus, tylko podstawa.',
        ],
      },
      {
        heading: 'Kiedy warto wyjść poza gotowy program do faktur',
        paragraphs: [
          'Gotowe programy do KSeF dobrze radzą sobie z samym fakturowaniem. Jeśli faktury to tylko jeden element szerszego procesu — uzgadnianie dokumentów przed wysyłką, role i decyzje w firmie, pełna ścieżka audytu — wtedy potrzebny jest system szerszy niż sama zgodność z KSeF. Dokładnie to jest podejście, na którym zbudowaliśmy KsięgaI.',
        ],
      },
    ],
    faqs: [
      { q: 'Czy program do KSeF musi być płatny w abonamencie?', a: 'Większość dostępnych na rynku rozwiązań działa w modelu subskrypcyjnym. Alternatywą jest dedykowany system wewnętrzny, który integruje fakturowanie z resztą procesów firmy — bez comiesięcznej opłaty za samo wystawianie faktur.' },
      { q: 'Czy KSeF jest obowiązkowy dla małych firm?', a: 'Zakres i terminy wdrożenia KSeF zmieniają się w czasie — warto sprawdzić aktualny stan przepisów, ale kierunek jest jasny: obowiązkowe fakturowanie elektroniczne obejmie z czasem większość firm.' },
      { q: 'Czy da się zintegrować KSeF z własnym systemem firmowym?', a: 'Tak — to dokładnie ten przypadek, w którym dedykowany system ma przewagę nad gotowym programem: KSeF staje się jedną z funkcji szerszego systemu, a nie osobnym narzędziem, do którego trzeba się logować.' },
    ],
    externalResource: {
      label: 'ksef.support',
      description: 'Niezależny przewodnik po KSeF — jak przygotować firmę krok po kroku, zanim e-faktury staną się obowiązkowe.',
      url: 'https://ksef.support',
    },
  },
  {
    key: 'ksef-software-choice',
    category: 'finance',
    locale: 'en',
    slug: 'choosing-ksef-invoicing-software-for-small-business',
    title: 'Choosing KSeF Invoicing Software for a Small Business',
    description: 'What to look for in KSeF-compliant invoicing software: automatic invoice submission, no manual data re-entry, and integration with the rest of your business systems.',
    keywords: ['KSeF software small business', 'invoicing automation KSeF', 'choosing KSeF software', 'KSeF-compliant invoicing system'],
    intro: 'A small business owner usually juggles several roles at once and doesn\'t have time to manually re-enter data between systems. Good KSeF software should account for that — the rest comes down to how far the automation actually reaches.',
    sections: [
      {
        heading: 'Automatic communication with KSeF',
        paragraphs: [
          'An issued invoice should reach Poland\'s National e-Invoice System automatically, without an extra login to a separate site or app. If the software doesn\'t do this, you\'re still doing the work manually — just in a different place.',
        ],
      },
      {
        heading: 'No manual re-entry of data',
        paragraphs: [
          'Contractor details, invoice line items, purchase invoices pulled in automatically — every place where something has to be manually retyped is a potential error and a time cost that compounds as document volume grows.',
        ],
      },
      {
        heading: 'Interface simplicity matters',
        paragraphs: [
          'KSeF software for a small business shouldn\'t require accounting expertise or complicated setup. Issuing an invoice quickly without clicking through ten screens isn\'t a luxury, it\'s the baseline.',
        ],
      },
      {
        heading: 'When it makes sense to go beyond a ready-made invoicing app',
        paragraphs: [
          'Off-the-shelf KSeF software handles invoicing itself well. If invoicing is just one piece of a bigger process — reconciling documents before submission, roles and decisions inside the business, a full audit trail — then you need a system broader than KSeF compliance alone. That\'s exactly the approach we built KsięgaI on.',
        ],
      },
    ],
    faqs: [
      { q: 'Does KSeF software have to be a paid subscription?', a: 'Most solutions on the market run on a subscription model. The alternative is a dedicated internal system that integrates invoicing with the rest of the business\'s processes — without a recurring fee just to issue invoices.' },
      { q: 'Is KSeF mandatory for small businesses?', a: 'The scope and rollout timeline for KSeF changes over time — check the current regulations, but the direction is clear: mandatory e-invoicing will eventually cover most businesses.' },
      { q: 'Can KSeF be integrated into a company\'s own internal system?', a: 'Yes — this is exactly where a dedicated system has an edge over off-the-shelf software: KSeF becomes one function of a broader system, not a separate tool you have to log into.' },
    ],
    externalResource: {
      label: 'ksef.support',
      description: 'An independent guide to KSeF — how to prepare your business step by step before e-invoicing becomes mandatory.',
      url: 'https://ksef.support',
    },
  },

  // ---- 12. Cross-vertical: custom software vs. SaaS ----
  {
    key: 'custom-vs-saas',
    category: 'finance',
    locale: 'pl',
    slug: 'wlasny-system-czy-gotowe-saas-kiedy-sie-oplaca',
    title: 'Własny system czy gotowe SaaS? Kiedy budowa dedykowanego oprogramowania się opłaca',
    description: 'Różnica między wynajmowaniem gotowego oprogramowania a posiadaniem własnego systemu — kontrola nad danymi, koszt w czasie i kiedy dedykowane rozwiązanie faktycznie się opłaca.',
    keywords: ['własny system czy SaaS', 'dedykowane oprogramowanie dla firmy', 'kiedy budować własny system', 'kontrola nad danymi firmy'],
    intro: 'To pytanie wraca w każdej branży, którą obsługujemy — hodowla, związek kynologiczny, firma transportowa czy biuro rachunkowe. Odpowiedź nie brzmi „zawsze buduj własne" ani „zawsze wynajmuj gotowe" — zależy od tego, co faktycznie odróżnia Twoją firmę od innych.',
    sections: [
      {
        heading: 'Różnica jest w tym, kto ma kontrolę',
        paragraphs: [
          'Płacąc za gotowe SaaS, wynajmujesz dostęp do narzędzia — przestajesz płacić, tracisz dostęp. Budując własny system, jesteś właścicielem kodu i danych, które mieszkają w Twojej bazie, nie u dostawcy.',
        ],
      },
      {
        heading: 'Kiedy gotowe SaaS wystarczy',
        paragraphs: [
          'Dla potrzeb standardowych — prosta rezerwacja, podstawowe fakturowanie, typowa strona wizytówkowa — gotowe narzędzie jest szybsze i tańsze na start. Nie ma sensu budować od zera czegoś, co tysiące innych firm już rozwiązało.',
        ],
      },
      {
        heading: 'Kiedy dedykowany system zaczyna się opłacać',
        paragraphs: [
          'Gdy proces Twojej firmy jest naprawdę inny niż standardowy, gdy koszty subskrypcji rosną wraz ze skalą szybciej niż korzyści, gdy potrzebujesz integracji, których gotowe narzędzie nie oferuje, albo gdy kontrola nad danymi ma znaczenie prawne lub biznesowe.',
        ],
        list: [
          'Proces firmy różni się od standardowego szablonu',
          'Koszt subskrypcji rośnie szybciej niż realna wartość',
          'Potrzebna integracja z innymi systemami firmy',
          'Dane muszą zostać pod pełną kontrolą firmy',
        ],
      },
      {
        heading: 'Model hybrydowy, nie skrajność',
        paragraphs: [
          'Najbardziej sensowne podejście — używane dziś przez większość dojrzałych firm — to gotowe narzędzia do rzeczy standardowych i dedykowane systemy do tego, co faktycznie stanowi przewagę firmy.',
        ],
      },
      {
        heading: 'Dowód, że to nie tylko teoria',
        paragraphs: [
          'Sami stosujemy tę zasadę: KsięgaI (finanse) i Global Pet (transport zwierząt) to nasze własne, prowadzone na co dzień systemy — a nie tylko przykłady, które sprzedajemy klientom. Ten sam standard budujemy dla hodowli (Gryfin York), związków kynologicznych (POKIU) i firm z branży zwierzęcej.',
        ],
      },
    ],
  },
  {
    key: 'custom-vs-saas',
    category: 'finance',
    locale: 'en',
    slug: 'custom-software-vs-saas-when-it-pays-off',
    title: 'Custom Software vs. SaaS: When Building Your Own System Pays Off',
    description: 'The difference between renting off-the-shelf software and owning your own system — control over data, cost over time, and when a dedicated build actually pays off.',
    keywords: ['custom software vs SaaS', 'dedicated business software', 'when to build custom software', 'own your business data'],
    intro: 'This question comes up in every industry we work in — kennels, kennel clubs, transport companies, accounting offices. The answer isn\'t "always build custom" or "always rent off-the-shelf" — it depends on what actually sets your business apart.',
    sections: [
      {
        heading: 'The difference is who\'s in control',
        paragraphs: [
          'Paying for SaaS means renting access to a tool — stop paying, lose access. Building your own system means owning the code and the data, which lives in your own database, not a vendor\'s.',
        ],
      },
      {
        heading: 'When off-the-shelf SaaS is enough',
        paragraphs: [
          'For standard needs — simple bookings, basic invoicing, a typical storefront site — a ready-made tool is faster and cheaper to start with. There\'s no point building from scratch something thousands of other businesses have already solved.',
        ],
      },
      {
        heading: 'When a dedicated system starts to pay off',
        paragraphs: [
          'When your business\'s process is genuinely different from the standard, when subscription costs scale faster than the benefit, when you need integrations no ready-made tool offers, or when control over your data has legal or business weight.',
        ],
        list: [
          'Your process differs from the standard template',
          'Subscription cost grows faster than the real value',
          'You need integration with other business systems',
          'Data needs to stay under full company control',
        ],
      },
      {
        heading: 'A hybrid model, not an extreme',
        paragraphs: [
          'The most sensible approach — used today by most mature businesses — is ready-made tools for standard things and dedicated systems for whatever actually gives the business its edge.',
        ],
      },
      {
        heading: 'Proof this isn\'t just theory',
        paragraphs: [
          'We apply this ourselves: KsięgaI (finance) and Global Pet (animal transport) are our own systems, run day to day — not just examples we sell to clients. We build the same standard for kennels (Gryfin York), kennel clubs (POKIU), and animal-industry companies.',
        ],
      },
    ],
  },
];

export function getArticle(locale: 'pl' | 'en', slug: string): PoradnikArticle | undefined {
  return poradnikArticles.find((a) => a.locale === locale && a.slug === slug);
}

export function getArticlesForLocale(locale: 'pl' | 'en'): PoradnikArticle[] {
  return poradnikArticles.filter((a) => a.locale === locale);
}

export function getArticlesByCategory(locale: 'pl' | 'en', category: PoradnikCategory): PoradnikArticle[] {
  return poradnikArticles.filter((a) => a.locale === locale && a.category === category);
}

export function getOtherLocaleSlug(locale: 'pl' | 'en', key: string): string | undefined {
  const otherLocale = locale === 'pl' ? 'en' : 'pl';
  return poradnikArticles.find((a) => a.locale === otherLocale && a.key === key)?.slug;
}
