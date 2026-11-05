'use client';

import { SELLER, SELLER_BLOCK } from '@/lib/seller';
import { openConsentSettings } from '@/lib/consent';

/** Seller identification line under every footer, plus the consent settings link. */
export default function SellerFooter({ locale }: { locale: string }) {
  return (
    <div className="mt-6 space-y-2 text-xs leading-relaxed text-gray-500">
      <p>{SELLER_BLOCK}</p>
      <p className="flex flex-wrap gap-x-4 gap-y-1">
        <a href={`/${locale}/regulamin/`} className="hover:text-gray-300">Regulamin</a>
        <a href={`/${locale}/polityka-prywatnosci/`} className="hover:text-gray-300">Polityka prywatności</a>
        <a href={`/${locale}/umowa-powierzenia/`} className="hover:text-gray-300">Umowa powierzenia</a>
        <a href={`mailto:${SELLER.email}`} className="hover:text-gray-300">Zgłoś treść niezgodną z prawem</a>
        <button type="button" onClick={openConsentSettings} className="hover:text-gray-300 underline-offset-2">Ustawienia cookie</button>
      </p>
    </div>
  );
}
