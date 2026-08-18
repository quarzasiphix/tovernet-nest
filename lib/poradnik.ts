export type PoradnikSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export type PoradnikFaq = { q: string; a: string };

export type PoradnikArticle = {
  /** Pairs the pl/en versions of the same article together for hreflang and cross-links. */
  key: string;
  locale: 'pl' | 'en';
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  sections: PoradnikSection[];
  faqs?: PoradnikFaq[];
};

export const poradnikArticles: PoradnikArticle[] = [
  // ---- 1. Independence: own site vs. renting a profile on a breeder platform ----
  {
    key: 'independence',
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
];

export function getArticle(locale: 'pl' | 'en', slug: string): PoradnikArticle | undefined {
  return poradnikArticles.find((a) => a.locale === locale && a.slug === slug);
}

export function getArticlesForLocale(locale: 'pl' | 'en'): PoradnikArticle[] {
  return poradnikArticles.filter((a) => a.locale === locale);
}

export function getOtherLocaleSlug(locale: 'pl' | 'en', key: string): string | undefined {
  const otherLocale = locale === 'pl' ? 'en' : 'pl';
  return poradnikArticles.find((a) => a.locale === otherLocale && a.key === key)?.slug;
}
