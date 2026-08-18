export type AuditGuideSection = { heading: string; paragraphs: string[]; list?: string[] };
export type AuditGuideFaq = { q: string; a: string };

export type AuditGuide = {
  /** Pairs the pl/en versions of the same guide for hreflang and cross-links. */
  key: string;
  locale: 'pl' | 'en';
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  sections: AuditGuideSection[];
  faqs?: AuditGuideFaq[];
  ctaLabel: string;
};

export const auditGuides: AuditGuide[] = [
  // ---- 1. SEO agency not delivering ----
  {
    key: 'seo-not-delivering',
    locale: 'pl',
    slug: 'agencja-seo-nie-wykonuje-umowy',
    title: 'Agencja SEO nie wywiązuje się z umowy — jak to sprawdzić',
    description: 'Jak niezależnie zweryfikować, czy agencja SEO faktycznie wykonuje zamówione prace: audyt techniczny, optymalizacja, treści, linki i analityka.',
    keywords: ['agencja SEO nie wywiązuje się z umowy', 'jak sprawdzić czy agencja robi SEO', 'czy agencja SEO mnie oszukuje', 'weryfikacja pracy agencji SEO'],
    intro: 'Wielu właścicieli firm płaci agencji SEO miesiąc po miesiącu, otrzymuje raport pełen wykresów i terminów fachowych — i nie ma technicznej możliwości sprawdzenia, czy cokolwiek z tego faktycznie się wydarzyło. To pytanie da się sprawdzić technicznie, bez zgadywania.',
    sections: [
      {
        heading: 'Co da się zweryfikować niezależnie od raportu',
        paragraphs: [
          'Raport to interpretacja agencji. Dane źródłowe — kod strony, konfiguracja, historia zmian, publikacje — są od tej interpretacji niezależne i da się je sprawdzić bez pytania agencji o zgodę.',
        ],
        list: [
          'Czy deklarowany audyt techniczny SEO faktycznie znajduje odzwierciedlenie w kodzie strony (meta dane, struktura nagłówków, dane strukturalne, szybkość ładowania)',
          'Czy wskazana „comiesięczna optymalizacja” pozostawia ślad w historii zmian strony',
          'Czy publikowane treści rzeczywiście istnieją i są dostępne publicznie',
          'Czy deklarowane linki pozycjonujące faktycznie prowadzą do strony klienta i pochodzą z realnych, aktywnych publikacji',
          'Czy dostęp do Google Search Console i Analytics rzeczywiście należy do klienta, nie tylko do agencji',
        ],
      },
      {
        heading: 'Czego raport sam w sobie nie dowodzi',
        paragraphs: [
          'Ładnie sformatowany PDF z wykresami nie jest dowodem wykonania pracy — jest dowodem, że ktoś umie sformatować PDF. Dopiero porównanie raportu z rzeczywistym stanem strony, kontem Search Console i historią publikacji pokazuje, co faktycznie się wydarzyło.',
        ],
      },
      {
        heading: 'Jak wygląda niezależna weryfikacja',
        paragraphs: [
          'Tovernet porównuje ustalony zakres umowy z obserwowalnymi dowodami technicznymi — kodem strony, konfiguracją, danymi z Search Console i Analytics (gdy klient ma do nich dostęp), historią publikacji i faktur — i przedstawia jasny obraz tego, co jest potwierdzone, co częściowo potwierdzone, a co wymaga wyjaśnienia ze strony agencji.',
        ],
      },
    ],
    faqs: [
      { q: 'Czy potrzebuję dostępu do panelu agencji, żeby to sprawdzić?', a: 'Część weryfikacji da się przeprowadzić z zewnątrz (kod strony, publiczne treści, linki). Pełniejszy obraz wymaga dostępu do Search Console, Analytics i historii faktur — jeśli go nie masz, to samo w sobie jest ważnym ustaleniem.' },
      { q: 'Czy to oznacza, że agencja oszukuje?', a: 'Nie zakładamy tego z góry. Część rozbieżności wynika z opóźnień w indeksacji, złej komunikacji albo niejasno zdefiniowanego zakresu, nie z nieuczciwości. Weryfikacja pokazuje fakty, nie intencje.' },
    ],
    ctaLabel: 'Zweryfikuj pracę swojej agencji',
  },
  {
    key: 'seo-not-delivering',
    locale: 'en',
    slug: 'seo-agency-not-delivering',
    title: 'SEO Agency Not Delivering? How to Actually Check',
    description: 'How to independently verify whether an SEO agency is actually doing the contracted work — technical audits, optimization, content, links, and analytics.',
    keywords: ['SEO agency not delivering', 'how to check if my SEO agency is working', 'is my SEO agency scamming me', 'verify SEO agency work'],
    intro: "Plenty of business owners pay an SEO agency month after month, get a report full of charts and technical-sounding terms — and have no real way to check whether any of it actually happened. That question is technically checkable, without guessing.",
    sections: [
      {
        heading: "What you can verify independently of the report",
        paragraphs: [
          "A report is the agency's own interpretation. The underlying evidence — site code, configuration, change history, publications — is independent of that interpretation and can be checked without needing the agency's permission.",
        ],
        list: [
          "Whether a claimed technical SEO audit actually shows up in the site's code (meta tags, heading structure, structured data, load speed)",
          "Whether claimed 'monthly optimization' leaves a trace in the site's change history",
          "Whether published content actually exists and is publicly accessible",
          "Whether claimed backlinks actually point to the client's site and come from real, active publications",
          "Whether Search Console and Analytics access genuinely belongs to the client, not just the agency",
        ],
      },
      {
        heading: "What a report alone doesn't prove",
        paragraphs: [
          "A nicely formatted PDF full of charts isn't proof work was done — it's proof someone can format a PDF. Only comparing the report against the site's actual state, Search Console data, and publication history shows what really happened.",
        ],
      },
      {
        heading: "What independent verification looks like",
        paragraphs: [
          "Tovernet compares the agreed contract scope against observable technical evidence — site code, configuration, Search Console and Analytics data (where the client has access), publication and invoice history — and lays out clearly what's confirmed, what's partially confirmed, and what needs an explanation from the agency.",
        ],
      },
    ],
    faqs: [
      { q: 'Do I need access to the agency\'s own dashboard to check this?', a: "Some of it can be verified from the outside (site code, public content, backlinks). A fuller picture needs Search Console, Analytics, and invoice history access — if you don't have that, that's itself a meaningful finding." },
      { q: 'Does this mean the agency is scamming me?', a: "We don't assume that going in. A lot of gaps come from indexing delays, poor communication, or a loosely defined scope, not dishonesty. Verification shows the facts, not intent." },
    ],
    ctaLabel: 'Verify your agency\'s work',
  },

  // ---- 2. Recovering domain and website ----
  {
    key: 'domain-recovery',
    locale: 'pl',
    slug: 'odzyskanie-domeny-i-strony',
    title: 'Odzyskanie domeny i strony internetowej — co technicznie trzeba wiedzieć',
    description: 'Jak odzyskać kontrolę nad domeną i stroną internetową: rejestrator, kod authinfo, hosting, DNS, CMS, kopie zapasowe i planowanie ciągłości.',
    keywords: ['jak odzyskać domenę od agencji', 'nie mam dostępu do domeny', 'jak odzyskać stronę internetową', 'odzyskanie domeny transfer'],
    intro: 'Brak dostępu do własnej domeny lub strony to jeden z najczęstszych skutków źle zakończonej współpracy z wykonawcą. Zanim sięgnie się po środki prawne, warto zrozumieć, co technicznie da się odzyskać i jak.',
    sections: [
      {
        heading: 'Kto naprawdę jest właścicielem domeny',
        paragraphs: [
          'Właścicielem domeny jest podmiot wskazany jako abonent (registrant) u rejestratora — nie osoba, która ją kiedyś zarejestrowała w czyimś imieniu. Warto zacząć od sprawdzenia danych WHOIS i porównania ich z tym, kto faktycznie ma dostęp do konta u rejestratora.',
        ],
      },
      {
        heading: 'Kod authinfo i transfer domeny',
        paragraphs: [
          'Transfer domeny do innego rejestratora (lub odzyskanie panelu u tego samego) zwykle wymaga kodu authinfo (EPP code) — jeśli abonentem jest właściciel firmy, ma prawo go otrzymać od rejestratora niezależnie od tego, kto administrował kontem na co dzień.',
        ],
      },
      {
        heading: 'Hosting, DNS i CMS — trzy osobne rzeczy',
        paragraphs: [
          'Domena, hosting i system zarządzania treścią (CMS) to często trzy różne konta u trzech różnych dostawców, nawet jeśli wykonawca prezentował to jako jedną usługę. Odzyskanie każdego z nich to osobny proces techniczny — pomylenie ich prowadzi do niepotrzebnych opóźnień.',
        ],
        list: [
          'Domena — rejestrator, konto abonenta, kod authinfo',
          'Hosting / serwer — dostawca hostingu, dostęp do panelu lub FTP/SSH',
          'DNS — kto kontroluje rekordy DNS (mogą być u rejestratora lub osobnego dostawcy)',
          'CMS — dostęp administracyjny do samej strony (WordPress, własny system itd.)',
          'Kopie zapasowe — czy istnieją, gdzie są przechowywane i kto ma do nich dostęp',
        ],
      },
      {
        heading: 'Odzyskiwanie techniczne a spór prawny',
        paragraphs: [
          'Wiele przypadków rozwiązuje się czysto technicznie — poprzez rejestratora, dostawcę hostingu lub bezpośrednią, udokumentowaną prośbę o dostęp. Spór prawny (np. o naruszenie umowy) to osobna ścieżka, którą prowadzi prawnik — Tovernet dostarcza w tej sytuacji techniczny stan faktyczny, nie reprezentuje klienta prawnie.',
        ],
      },
    ],
    faqs: [
      { q: 'Co jeśli wykonawca nie odpowiada na prośby o dostęp?', a: 'Rejestrator domeny i dostawca hostingu mają własne procedury weryfikacji właściciela konta, niezależne od tego, czy poprzedni administrator odpowiada. To zwykle pierwszy, szybszy krok niż eskalacja prawna.' },
      { q: 'Czy da się odzyskać stronę bez dostępu do CMS?', a: 'Czasem tak — jeśli istnieje aktualna kopia zapasowa lub strona jest dostępna publicznie do zarchiwizowania. Zakres zależy od konkretnej sytuacji, dlatego pierwszym krokiem jest inwentaryzacja tego, co faktycznie istnieje.' },
    ],
    ctaLabel: 'Pomóż mi odzyskać kontrolę',
  },
  {
    key: 'domain-recovery',
    locale: 'en',
    slug: 'recovering-your-domain-and-website',
    title: 'Recovering Your Domain and Website — What You Need to Know',
    description: 'How to regain control of your domain and website: registrar ownership, the authinfo/EPP code, hosting, DNS, CMS access, backups, and continuity planning.',
    keywords: ['how to recover a domain from an agency', "I don't have access to my domain", 'how to get my website back', 'domain transfer recovery'],
    intro: "Losing access to your own domain or website is one of the most common outcomes of a vendor relationship that ended badly. Before reaching for legal remedies, it helps to understand what can actually be recovered technically, and how.",
    sections: [
      {
        heading: "Who actually owns the domain",
        paragraphs: [
          "The domain's owner is whoever is listed as the registrant with the registrar — not whoever registered it on someone else's behalf. Start by checking the WHOIS record and comparing it against who actually has access to the registrar account today.",
        ],
      },
      {
        heading: "The authinfo code and domain transfer",
        paragraphs: [
          "Transferring a domain to another registrar (or reclaiming the panel at the same one) usually requires an authinfo code (EPP code) — if the business owner is the registrant, they're entitled to it from the registrar regardless of who administered the account day to day.",
        ],
      },
      {
        heading: "Hosting, DNS, and CMS — three separate things",
        paragraphs: [
          "The domain, hosting, and content management system are often three separate accounts with three separate providers, even if the vendor presented it as one bundled service. Recovering each one is its own technical process — conflating them usually just causes unnecessary delays.",
        ],
        list: [
          "Domain — registrar, registrant account, authinfo code",
          "Hosting / server — hosting provider, panel or FTP/SSH access",
          "DNS — who actually controls the DNS records (can sit with the registrar or a separate provider)",
          "CMS — administrative access to the site itself (WordPress, a custom system, etc.)",
          "Backups — whether they exist, where they're stored, and who has access",
        ],
      },
      {
        heading: "Technical recovery vs. a legal dispute",
        paragraphs: [
          "Many cases resolve purely technically — through the registrar, the hosting provider, or a direct, documented access request. A legal dispute (e.g. breach of contract) is a separate path handled by a lawyer — Tovernet provides the technical facts in that situation, it doesn't represent the client legally.",
        ],
      },
    ],
    faqs: [
      { q: "What if the vendor doesn't respond to access requests?", a: "The domain registrar and hosting provider both have their own account-owner verification procedures, independent of whether the previous administrator responds. That's usually a faster first step than legal escalation." },
      { q: 'Can a website be recovered without CMS access?', a: "Sometimes — if a current backup exists, or the site is publicly accessible and can be archived. It depends on the specific situation, which is why the first step is always inventorying what actually exists." },
    ],
    ctaLabel: 'Help me regain control',
  },

  // ---- 3. Vendor won't hand over website ----
  {
    key: 'vendor-wont-handover',
    locale: 'pl',
    slug: 'wykonawca-nie-chce-wydac-strony',
    title: 'Wykonawca nie chce wydać strony — co zrobić w pierwszej kolejności',
    description: 'Techniczna inwentaryzacja przed eskalacją: umowy, faktury, konta, repozytoria, hosting, kopie zapasowe, licencje i dostępy.',
    keywords: ['wykonawca nie chce wydać strony', 'firma nie chce przekazać kodu strony', 'agencja blokuje dostęp do strony'],
    intro: 'Zanim sprawa trafi do prawnika, warto zrobić coś, co można zrobić samodzielnie i od razu: uporządkować, co się faktycznie ma, czego brakuje, i gdzie realnie leży problem.',
    sections: [
      {
        heading: 'Inwentaryzacja przed eskalacją',
        paragraphs: [
          'Najczęstszy błąd to eskalacja sporu, zanim ktokolwiek sprawdził, co faktycznie jest do odzyskania. Pełna inwentaryzacja pokazuje realny zakres problemu — czasem jest mniejszy, niż się wydaje, czasem większy.',
        ],
        list: [
          'Umowa i jej faktyczny zakres — co strona zamawiająca miała otrzymać',
          'Faktury i historia płatności — co zostało opłacone, za jaki okres',
          'Konta — kto jest właścicielem domeny, hostingu, CMS, poczty',
          'Repozytorium kodu — czy istnieje, gdzie, kto ma do niego dostęp',
          'Kopie zapasowe — czy są, jak aktualne, gdzie przechowywane',
          'Licencje — czy użyte wtyczki, motywy lub oprogramowanie są licencjonowane na klienta czy na wykonawcę',
          'Dotychczasowa korespondencja dotycząca przekazania',
        ],
      },
      {
        heading: 'Co dają aktualne dostępy, nawet częściowe',
        paragraphs: [
          'Nawet częściowy dostęp — np. do panelu hostingowego bez dostępu do CMS — pozwala ustalić, co technicznie istnieje i jak wygląda realna ścieżka odzyskania, zamiast działać na domysłach.',
        ],
      },
      {
        heading: 'Kiedy sprawa staje się prawna',
        paragraphs: [
          'Jeśli wykonawca odmawia wydania mimo udokumentowanego prawa własności i braku zaległości płatniczych, to punkt, w którym warto skonsultować się z prawnikiem. Tovernet w tym momencie przygotowuje uporządkowaną dokumentację techniczną, którą pełnomocnik może wykorzystać — nie prowadzi sprawy prawnej.',
        ],
      },
    ],
    faqs: [
      { q: 'Czy mam prawo żądać kodu strony?', a: 'Zależy od umowy — kto jest właścicielem praw do kodu, czy było to wliczone w cenę, i czy wszystkie płatności zostały uregulowane. To pytanie prawne; Tovernet może natomiast ustalić, co technicznie istnieje i jest do przekazania.' },
      { q: 'Co jeśli nie mam podpisanej umowy?', a: 'Brak formalnej umowy nie oznacza braku możliwości działania — faktury, korespondencja e-mailowa i historia płatności też stanowią dokumentację, którą da się uporządkować.' },
    ],
    ctaLabel: 'Sprawdź, co można odzyskać',
  },
  {
    key: 'vendor-wont-handover',
    locale: 'en',
    slug: 'vendor-wont-hand-over-your-website',
    title: "Vendor Won't Hand Over Your Website? What to Do First",
    description: 'A technical inventory to run before escalating: contracts, invoices, accounts, repositories, hosting, backups, licenses, and existing access.',
    keywords: ["vendor won't hand over website", 'agency blocking access to my website', "developer won't give me the code"],
    intro: "Before a case ever reaches a lawyer, there's something you can do yourself, right away: get a clear picture of what you actually have, what's missing, and where the real problem sits.",
    sections: [
      {
        heading: "Inventory before escalation",
        paragraphs: [
          "The most common mistake is escalating a dispute before anyone has checked what's actually recoverable. A full inventory shows the real scope of the problem — sometimes it's smaller than it looks, sometimes bigger.",
        ],
        list: [
          "The contract and its actual scope — what the client was supposed to receive",
          "Invoices and payment history — what's been paid, for what period",
          "Accounts — who owns the domain, hosting, CMS, and email",
          "Code repository — does it exist, where, who has access",
          "Backups — do they exist, how current, where stored",
          "Licenses — are the plugins, themes, or software licensed to the client or the vendor",
          "Any existing correspondence about handover",
        ],
      },
      {
        heading: "What even partial access gets you",
        paragraphs: [
          "Even partial access — say, hosting panel access without CMS access — is enough to establish what technically exists and what a realistic recovery path looks like, instead of working from guesses.",
        ],
      },
      {
        heading: "When it becomes a legal matter",
        paragraphs: [
          "If a vendor refuses to hand things over despite documented ownership and no outstanding payments, that's the point to consult a lawyer. At that stage, Tovernet prepares organized technical documentation counsel can use — it doesn't run the legal case itself.",
        ],
      },
    ],
    faqs: [
      { q: 'Am I entitled to demand the site code?', a: "It depends on the contract — who owns the code rights, whether that was included in the price, and whether all payments were settled. That's a legal question; what Tovernet can do is establish what technically exists and is available to hand over." },
      { q: "What if I never signed a formal contract?", a: 'No formal contract doesn\'t mean no path forward — invoices, email correspondence, and payment history are all documentation that can be organized too.' },
    ],
    ctaLabel: 'Check what can be recovered',
  },

  // ---- 4. SEO/IT services valuation ----
  {
    key: 'services-valuation',
    locale: 'pl',
    slug: 'wycena-uslug-seo-it',
    title: 'Ile powinna kosztować usługa SEO lub IT — jak to ocenić',
    description: 'Różnica między ceną z umowy, obserwowalnym wykonaniem, rynkowym przedziałem cenowym a kosztem odtworzenia wykonanej pracy.',
    keywords: ['ile powinna kosztować usługa SEO', 'ile była warta wykonana strona', 'czy agencja pobiera za dużo', 'wycena wykonanych usług IT'],
    intro: 'Pytanie „czy płacę za dużo" ma sens tylko wtedy, gdy wiadomo, za co się w ogóle płaci. Zanim porówna się cenę do rynku, trzeba ustalić, co faktycznie zostało dostarczone.',
    sections: [
      {
        heading: 'Cztery różne liczby, które łatwo pomylić',
        paragraphs: [
          'Rozmowa o „czy to za drogo" często miesza ze sobą cztery różne rzeczy, które warto rozdzielić, zanim padnie jakakolwiek ocena.',
        ],
        list: [
          'Cena z umowy — co zostało uzgodnione na papierze',
          'Obserwowalne wykonanie — co faktycznie da się potwierdzić technicznie',
          'Rynkowy przedział cenowy — ile podobny zakres kosztuje typowo na rynku',
          'Koszt odtworzenia — ile kosztowałoby zbudowanie tego samego od zera dzisiaj',
        ],
      },
      {
        heading: 'Dlaczego to nie jest wycena prawnie wiążąca',
        paragraphs: [
          'Szacunek rynkowej wartości wykonanych prac to ocena techniczna i rynkowa, oparta na obserwowalnym zakresie i typowych stawkach branżowych — nie biegła wycena sądowa ani opinia rzeczoznawcy. Jeśli sprawa wymaga wyceny prawnie wiążącej, to rola dla uprawnionego biegłego, nie dla Tovernet.',
        ],
      },
      {
        heading: 'Jak wygląda taka ocena w praktyce',
        paragraphs: [
          'Tovernet ustala, co faktycznie zostało dostarczone (na podstawie dowodów technicznych), a następnie porównuje to z typowymi stawkami rynkowymi za porównywalny zakres — wynik to szacunkowy przedział, nie jedna sztywna liczba.',
        ],
      },
    ],
    faqs: [
      { q: 'Czy wycena obejmuje analizę umowy?', a: 'Tak, w zakresie technicznym — sprawdzamy, czy uzgodniony zakres znajduje potwierdzenie w wykonaniu. Interpretację prawną zapisów umownych pozostawiamy uprawnionemu prawnikowi.' },
      { q: 'Czy mogę użyć tej wyceny w sporze sądowym?', a: 'Może stanowić materiał pomocniczy, ale nie zastępuje opinii biegłego sądowego, jeśli sprawa tego wymaga — o to, czy i jak ją wykorzystać, decyduje pełnomocnik prowadzący sprawę.' },
    ],
    ctaLabel: 'Zamów niezależną ocenę wartości',
  },
  {
    key: 'services-valuation',
    locale: 'en',
    slug: 'what-should-seo-it-services-cost',
    title: 'What Should an SEO or IT Service Actually Cost?',
    description: 'The difference between the contract price, observable delivery, the market price range, and the cost of replacing the work that was actually done.',
    keywords: ['what should SEO cost', 'was my website worth what I paid', 'is my agency overcharging me', 'valuation of delivered IT services'],
    intro: '"Am I overpaying" only makes sense once you know what you\'re actually paying for. Before comparing a price to the market, you need to establish what was actually delivered.',
    sections: [
      {
        heading: "Four different numbers that get conflated",
        paragraphs: [
          'A conversation about "is this too expensive" usually blends four separate things that are worth pulling apart before making any judgment.',
        ],
        list: [
          "Contract price — what was agreed on paper",
          "Observable delivery — what can actually be technically confirmed",
          "Market price range — what a comparable scope typically costs",
          "Replacement cost — what it would cost to build the same thing from scratch today",
        ],
      },
      {
        heading: "Why this isn't a legally binding valuation",
        paragraphs: [
          "An estimated market value for delivered work is a technical and market-based assessment, grounded in observable scope and typical industry rates — not a court-appointed expert valuation. If a case needs a legally binding valuation, that's a role for a licensed expert, not Tovernet.",
        ],
      },
      {
        heading: "What this assessment looks like in practice",
        paragraphs: [
          "Tovernet establishes what was actually delivered (based on technical evidence), then compares it against typical market rates for comparable work — the result is an estimated range, not a single fixed number.",
        ],
      },
    ],
    faqs: [
      { q: 'Does the valuation include reviewing the contract?', a: "Yes, on the technical side — we check whether the agreed scope holds up against what was delivered. Legal interpretation of contract terms is left to a licensed lawyer." },
      { q: 'Can I use this valuation in a legal dispute?', a: "It can serve as supporting material, but it doesn't replace a court-appointed expert opinion where one is required — whether and how to use it is a decision for the lawyer handling the case." },
    ],
    ctaLabel: 'Order an independent valuation',
  },

  // ---- 5. Technical report for disputes ----
  {
    key: 'technical-report',
    locale: 'pl',
    slug: 'raport-techniczny-do-sporu',
    title: 'Raport techniczny do sporu z wykonawcą',
    description: 'Jak wygląda dokumentacja technicznego stanu faktycznego, którą można wykorzystać w rozmowie z wykonawcą lub przekazać profesjonalnemu pełnomocnikowi.',
    keywords: ['raport techniczny do sporu z wykonawcą', 'ekspertyza wykonania strony internetowej', 'weryfikacja wykonania umowy IT'],
    intro: 'W sporze z wykonawcą najsłabszym punktem po stronie klienta zwykle nie jest brak racji, tylko brak uporządkowanych faktów technicznych. Ten dokument to sposób, żeby ten brak wypełnić.',
    sections: [
      {
        heading: 'Czym jest, a czym nie jest ten raport',
        paragraphs: [
          'To dokumentacja obserwowalnego stanu technicznego — co istnieje, co da się potwierdzić, co jest niezgodne z deklarowanym zakresem — przygotowana w sposób uporządkowany i chronologiczny. To nie opinia biegłego sądowego ani dokument prawny sam w sobie.',
        ],
      },
      {
        heading: 'Co zwykle zawiera',
        paragraphs: [
          'Zakres raportu dopasowuje się do konkretnej sytuacji, ale typowo obejmuje kilka stałych elementów.',
        ],
        list: [
          'Chronologię zdarzeń — co, kiedy i na jakiej podstawie się wydarzyło',
          'Zestawienie ustalonego zakresu z obserwowalnym wykonaniem',
          'Zrzuty ekranu i inne dowody techniczne z opisem kontekstu',
          'Mapę dostępów — kto ma dostęp do czego, na dziś',
          'Listę elementów potwierdzonych, niepotwierdzonych i wymagających wyjaśnienia',
        ],
      },
      {
        heading: 'Do kogo trafia taki raport',
        paragraphs: [
          'Materiał trafia do właściciela firmy — i, jeśli sprawa tego wymaga, do jego prawnika lub pełnomocnika, który decyduje, jak go wykorzystać w dalszym postępowaniu. Tovernet nie reprezentuje klienta prawnie i nie składa dokumentu w żadnym postępowaniu w jego imieniu.',
        ],
      },
    ],
    faqs: [
      { q: 'Czy to jest opinia biegłego sądowego?', a: 'Nie. To dokumentacja techniczna przygotowana przez Tovernet — jeśli sprawa wymaga formalnej opinii biegłego sądowego, to osobna, dodatkowa ścieżka prowadzona przez uprawnionego biegłego.' },
      { q: 'Czy mogę przekazać raport prawnikowi?', a: 'Tak, dokładnie do tego jest przeznaczony — uporządkowany materiał techniczny, który prawnik może wykorzystać we własnej ocenie sprawy.' },
    ],
    ctaLabel: 'Przygotuj dokumentację techniczną',
  },
  {
    key: 'technical-report',
    locale: 'en',
    slug: 'technical-report-for-vendor-disputes',
    title: 'Technical Reports for Vendor Disputes',
    description: 'What a documented technical record actually looks like — material you can use in a conversation with a vendor or hand to your legal counsel.',
    keywords: ['technical report for vendor dispute', 'website delivery expert assessment', 'IT contract delivery verification'],
    intro: "In a dispute with a vendor, the weakest point on the client's side usually isn't being wrong — it's not having organized technical facts. This document exists to fill that gap.",
    sections: [
      {
        heading: "What this report is, and isn't",
        paragraphs: [
          "It's documentation of the observable technical state — what exists, what can be confirmed, what doesn't match the claimed scope — prepared in an organized, chronological way. It's not a court-appointed expert opinion, and it isn't a legal document in itself.",
        ],
      },
      {
        heading: "What it typically includes",
        paragraphs: [
          "The scope adapts to the specific situation, but it typically covers a few consistent elements.",
        ],
        list: [
          "A timeline of events — what happened, when, and on what basis",
          "A comparison of the agreed scope against observable delivery",
          "Screenshots and other technical evidence with context",
          "An access map — who currently has access to what",
          "A list of items confirmed, unconfirmed, and needing explanation",
        ],
      },
      {
        heading: "Who this report goes to",
        paragraphs: [
          "The material goes to the business owner — and, where needed, to their lawyer or legal counsel, who decides how to use it going forward. Tovernet doesn't represent the client legally and doesn't file the document in any proceeding on their behalf.",
        ],
      },
    ],
    faqs: [
      { q: 'Is this a court-appointed expert opinion?', a: "No. It's technical documentation prepared by Tovernet — if a case requires a formal court-appointed expert opinion, that's a separate, additional path handled by a licensed expert." },
      { q: 'Can I hand this report to my lawyer?', a: "Yes — that's exactly what it's for: organized technical material a lawyer can use in their own assessment of the case." },
    ],
    ctaLabel: 'Prepare technical documentation',
  },
];

export function getAuditGuide(locale: 'pl' | 'en', slug: string): AuditGuide | undefined {
  return auditGuides.find((g) => g.locale === locale && g.slug === slug);
}

export function getAuditGuidesForLocale(locale: 'pl' | 'en'): AuditGuide[] {
  return auditGuides.filter((g) => g.locale === locale);
}

export function getOtherLocaleGuideSlug(locale: 'pl' | 'en', key: string): string | undefined {
  const otherLocale = locale === 'pl' ? 'en' : 'pl';
  return auditGuides.find((g) => g.locale === otherLocale && g.key === key)?.slug;
}

// Main service page + SEO hub — literal per-locale slugs (unlike most
// top-level pages on this site, these follow the poradnik precedent: real,
// distinct search-intent slugs per locale, not a reused Polish word).
export const PROVIDER_AUDIT_MAIN_PATH: Record<'pl' | 'en', string> = {
  pl: '/audyt-dostawcy-uslug-cyfrowych',
  en: '/digital-provider-audit',
};
export const PROVIDER_AUDIT_HUB_PATH: Record<'pl' | 'en', string> = {
  pl: '/odzyskaj-kontrole-cyfrowa',
  en: '/regain-digital-control',
};
