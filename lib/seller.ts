// Seller identification (art. 206 § 1 KSH, art. 12 ust. 1 pkt 2-3 UPK). One source for the
// footer, legal pages, checkout and the client panel. The same text is in KsięgaI
// supabase/functions/_shared/notifications/email/templates/tovernet/seller.ts for e-mails;
// change both together.
export const SELLER = {
  name: 'Tovernet Sp. z o.o.',
  street: 'ul. Rafała Bratoszewskiego 1/92',
  postal: '95-070',
  city: 'Aleksandrów Łódzki',
  krs: '0001211630',
  court: 'Sąd Rejonowy dla Łodzi-Śródmieścia w Łodzi, XX Wydział Gospodarczy KRS',
  nip: '7322228540',
  regon: '543498784',
  capital: '5 000 zł (wniesiony w całości)',
  email: 'contact@tovernet.online',
  phone: '+48 690 975 231',
  phoneHref: 'tel:+48690975231',
} as const;

/** Full block, one paragraph. */
export const SELLER_BLOCK =
  `${SELLER.name} z siedzibą w Aleksandrowie Łódzkim, ${SELLER.street}, ${SELLER.postal} ${SELLER.city}, ` +
  `wpisana do rejestru przedsiębiorców KRS pod numerem ${SELLER.krs}, akta rejestrowe: ${SELLER.court}, ` +
  `NIP ${SELLER.nip}, REGON ${SELLER.regon}, kapitał zakładowy ${SELLER.capital}. ` +
  `Kontakt: ${SELLER.email}, tel. ${SELLER.phone}.`;

/** Short line for compact places (checkout summary). */
export const SELLER_SHORT = `${SELLER.name}, ${SELLER.street}, ${SELLER.postal} ${SELLER.city} · KRS ${SELLER.krs} · NIP ${SELLER.nip}`;

/** VAT wording with the legal basis (art. 106e ust. 1 pkt 19 VAT names it on the invoice too). */
export const VAT_LINE = 'Sprzedawca korzysta ze zwolnienia podmiotowego z VAT na podstawie art. 113 ust. 1 ustawy o VAT. Podane kwoty są kwotami do zapłaty.';
