const fmt = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 2, minimumFractionDigits: 0 });
export const money = (minor: number) => fmt.format(minor / 100);
