export type LegalSection = { heading: string; paragraphs: string[]; list?: string[] };

export type LegalPage = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export const legalContent: Record<'pl' | 'en', { privacy: LegalPage; terms: LegalPage }> = {
  pl: {
    privacy: {
      title: 'Polityka Prywatności',
      updated: 'Ostatnia aktualizacja: sierpień 2026',
      intro: 'Niniejsza polityka opisuje, jakie dane zbieramy podczas korzystania ze strony tovernet.online, w jakim celu i na jakiej podstawie prawnej, oraz jakie prawa Ci przysługują.',
      sections: [
        {
          heading: 'Administrator danych',
          paragraphs: [
            'Administratorem danych jest TOVERNET. W sprawach związanych z ochroną danych osobowych możesz skontaktować się pod adresem contact@tovernet.online.',
          ],
        },
        {
          heading: 'Jakie dane zbieramy',
          paragraphs: [
            'Ta strona nie wymaga rejestracji ani logowania. Dane, które przetwarzamy, pochodzą z dwóch źródeł:',
          ],
          list: [
            'Analityka (PostHog) — anonimizowane statystyki odwiedzin, zdarzenia kliknięć i nagrania sesji (w tym elementów wyświetlanych na canvasie), pomagające nam rozumieć, jak strona jest używana i co warto poprawić.',
            'Formularz wyceny i kontakt — dane, które sam podajesz (np. nazwa hodowli, adres e-mail, telefon, wiadomość). Formularz wyceny na stronie „Dla Hodowców" nie zapisuje danych na naszym serwerze — otwiera wiadomość e-mail w Twoim programie pocztowym, którą sam wysyłasz na adres contact@tovernet.online.',
          ],
        },
        {
          heading: 'Cele i podstawa prawna przetwarzania',
          paragraphs: [
            'Dane analityczne przetwarzamy na podstawie naszego prawnie uzasadnionego interesu (art. 6 ust. 1 lit. f RODO) — rozwój i poprawa strony. Dane przesłane w wiadomości e-mail przetwarzamy w celu udzielenia odpowiedzi na Twoje zapytanie, na podstawie zgody wynikającej z samodzielnego wysłania wiadomości (art. 6 ust. 1 lit. a RODO) lub podjęcia działań przed zawarciem umowy (art. 6 ust. 1 lit. b RODO).',
          ],
        },
        {
          heading: 'Pliki cookie',
          paragraphs: [
            'Strona używa dwóch rodzajów plików cookie:',
          ],
          list: [
            'NEXT_LOCALE — cookie funkcjonalne, zapamiętujące wybrany język strony (ważność: 1 rok).',
            'Cookies PostHog — cookies analityczne, służące do rozpoznawania sesji i zdarzeń na stronie. Dane przetwarzane są na serwerach PostHog w Unii Europejskiej.',
          ],
        },
        {
          heading: 'Odbiorcy danych',
          paragraphs: [
            'Dane analityczne przetwarza w naszym imieniu PostHog (dostawca narzędzia analitycznego, infrastruktura w UE). Nie sprzedajemy ani nie udostępniamy Twoich danych podmiotom trzecim w celach marketingowych.',
          ],
        },
        {
          heading: 'Okres przechowywania',
          paragraphs: [
            'Dane analityczne przechowujemy tak długo, jak potrzebne jest to do analizy ruchu na stronie, zgodnie z ustawieniami retencji PostHog. Wiadomości e-mail przechowujemy tak długo, jak wymaga tego kontakt z Tobą lub obowiązujące przepisy.',
          ],
        },
        {
          heading: 'Twoje prawa',
          paragraphs: [
            'Zgodnie z RODO przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz sprzeciwu wobec przetwarzania. Przysługuje Ci również prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO).',
          ],
        },
      ],
    },
    terms: {
      title: 'Regulamin',
      updated: 'Ostatnia aktualizacja: sierpień 2026',
      intro: 'Niniejszy regulamin określa zasady korzystania ze strony internetowej tovernet.online.',
      sections: [
        {
          heading: 'Postanowienia ogólne',
          paragraphs: [
            'Właścicielem i operatorem strony tovernet.online jest TOVERNET. Strona ma charakter informacyjny i prezentuje ofertę oraz realizacje TOVERNET w zakresie stron internetowych, paneli administracyjnych i dedykowanych systemów.',
          ],
        },
        {
          heading: 'Charakter usług',
          paragraphs: [
            'Formularz wyceny oraz dane kontaktowe służą wyłącznie do rozpoczęcia rozmowy o możliwej współpracy. Wysłanie formularza lub wiadomości e-mail nie stanowi zawarcia umowy ani zamówienia usługi. Zakres, termin i wycena każdego projektu ustalane są indywidualnie i potwierdzane odrębnie, poza tą stroną.',
          ],
        },
        {
          heading: 'Własność intelektualna',
          paragraphs: [
            'Treści, grafiki i kod źródłowy strony tovernet.online stanowią własność TOVERNET lub są wykorzystywane na podstawie odpowiednich licencji. Kopiowanie i rozpowszechnianie treści bez zgody jest zabronione.',
          ],
        },
        {
          heading: 'Linki zewnętrzne',
          paragraphs: [
            'Strona zawiera odnośniki do serwisów klientów oraz produktów własnych (m.in. ksiegai.pl, globalpet.online oraz stron klienckich). TOVERNET nie ponosi odpowiedzialności za treści i działanie tych zewnętrznych serwisów.',
          ],
        },
        {
          heading: 'Odpowiedzialność',
          paragraphs: [
            'Dokładamy starań, aby informacje prezentowane na stronie były aktualne i rzetelne, jednak nie ponosimy odpowiedzialności za ewentualne błędy lub przerwy w dostępności strony.',
          ],
        },
        {
          heading: 'Zmiany regulaminu',
          paragraphs: [
            'Zastrzegamy sobie prawo do zmiany niniejszego regulaminu. Aktualna wersja jest zawsze dostępna pod tym adresem.',
          ],
        },
        {
          heading: 'Kontakt',
          paragraphs: [
            'W sprawach związanych z regulaminem skontaktuj się z nami pod adresem contact@tovernet.online.',
          ],
        },
      ],
    },
  },
  en: {
    privacy: {
      title: 'Privacy Policy',
      updated: 'Last updated: August 2026',
      intro: 'This policy explains what data we collect when you use tovernet.online, for what purpose, on what legal basis, and what rights you have.',
      sections: [
        {
          heading: 'Data controller',
          paragraphs: [
            'The data controller is TOVERNET. For any questions about personal data, contact us at contact@tovernet.online.',
          ],
        },
        {
          heading: 'What data we collect',
          paragraphs: [
            'This site doesn\'t require registration or login. The data we process comes from two sources:',
          ],
          list: [
            'Analytics (PostHog) — anonymized visit statistics, click events, and session recordings (including canvas elements shown on screen), helping us understand how the site is used and what to improve.',
            'Quote form and contact — data you provide yourself (e.g. kennel name, email, phone, message). The quote form on the "For Breeders" page doesn\'t save data on our server — it opens an email in your own mail app, which you send yourself to contact@tovernet.online.',
          ],
        },
        {
          heading: 'Purposes and legal basis',
          paragraphs: [
            'We process analytics data based on our legitimate interest (GDPR Art. 6(1)(f)) — improving and developing the site. We process data sent by email to respond to your enquiry, based on the consent implied by you sending the message yourself (GDPR Art. 6(1)(a)) or to take steps prior to entering into a contract (GDPR Art. 6(1)(b)).',
          ],
        },
        {
          heading: 'Cookies',
          paragraphs: [
            'The site uses two kinds of cookies:',
          ],
          list: [
            'NEXT_LOCALE — a functional cookie that remembers your chosen language (valid for 1 year).',
            'PostHog cookies — analytics cookies used to recognize sessions and events on the site. Data is processed on PostHog\'s servers in the European Union.',
          ],
        },
        {
          heading: 'Data recipients',
          paragraphs: [
            'Analytics data is processed on our behalf by PostHog (our analytics provider, EU-based infrastructure). We don\'t sell or share your data with third parties for marketing purposes.',
          ],
        },
        {
          heading: 'Retention period',
          paragraphs: [
            'We retain analytics data for as long as needed for site-traffic analysis, per PostHog\'s retention settings. We retain emails for as long as needed to respond to you or as required by law.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            'Under GDPR, you have the right to access, rectify, erase, restrict processing of, and object to processing of your data, as well as the right to data portability. You also have the right to lodge a complaint with your national data protection authority.',
          ],
        },
      ],
    },
    terms: {
      title: 'Terms of Use',
      updated: 'Last updated: August 2026',
      intro: 'These terms govern your use of the tovernet.online website.',
      sections: [
        {
          heading: 'General',
          paragraphs: [
            'tovernet.online is owned and operated by TOVERNET. The site is informational and presents TOVERNET\'s offer and portfolio of websites, admin panels, and dedicated systems.',
          ],
        },
        {
          heading: 'Nature of the services',
          paragraphs: [
            'The quote form and contact details exist solely to start a conversation about possible collaboration. Submitting the form or an email doesn\'t constitute a contract or a service order. The scope, timeline, and quote for each project are agreed individually and confirmed separately, outside this site.',
          ],
        },
        {
          heading: 'Intellectual property',
          paragraphs: [
            'The content, graphics, and source code of tovernet.online are the property of TOVERNET or used under appropriate licenses. Copying or redistributing content without permission is prohibited.',
          ],
        },
        {
          heading: 'External links',
          paragraphs: [
            'The site links to client projects and our own products (including ksiegai.pl, globalpet.online, and client websites). TOVERNET is not responsible for the content or operation of these external sites.',
          ],
        },
        {
          heading: 'Liability',
          paragraphs: [
            'We make reasonable efforts to keep the information on this site accurate and up to date, but we are not liable for errors or interruptions in the site\'s availability.',
          ],
        },
        {
          heading: 'Changes to these terms',
          paragraphs: [
            'We reserve the right to change these terms. The current version is always available at this address.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [
            'For questions about these terms, contact us at contact@tovernet.online.',
          ],
        },
      ],
    },
  },
};
