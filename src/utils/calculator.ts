import { CustomBullet, Currency } from '../types';

export interface CalculationResult {
  originalTotal: number;
  discountVal: number;
  netTotal: number;
  downPayment: number;
  extraPaymentsTotal: number;
  bulletsSummary: { type: string; label: string; val: number }[];
  remaining: number;
  monthlyEquivalent: number;
  quarterlyEquivalent: number;
  annualEquivalent: number;
}

export const USD_RATE = 50; // 1 USD = 50 EGP

export function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n)) return '';
  return Math.round(n).toLocaleString('en-US');
}

export function formatPrice(amountEGP: number | null | undefined, currency: Currency, lang: 'ar' | 'en' = 'ar'): string {
  if (amountEGP === null || amountEGP === undefined || isNaN(amountEGP) || amountEGP <= 0) return '-';
  
  if (currency === 'USD') {
    const usd = Math.round(amountEGP / USD_RATE);
    return `$${formatNumber(usd)}`;
  }

  const formatted = formatNumber(amountEGP);
  return lang === 'ar' ? `${formatted} ج.م` : `${formatted} EGP`;
}

export function calcInstallmentWithDiscount(
  originalTotal: number,
  discountPct: number = 0,
  downPct: number = 0,
  customBullets: CustomBullet[] = [],
  years: number = 1,
  _frequency: number = 12
): CalculationResult {
  const discountVal = (originalTotal || 0) * ((discountPct || 0) / 100);
  const netTotal = (originalTotal || 0) - discountVal;
  const downPayment = netTotal * ((downPct || 0) / 100);
  
  let extraPaymentsTotal = 0;
  const bulletsSummary: { type: string; label: string; val: number }[] = [];
  const validBullets = Array.isArray(customBullets) ? customBullets : [];

  validBullets.forEach(b => {
    const pct = parseFloat(String(b.percent)) || 0;
    if (pct > 0) {
      if (b.type === 'annual') {
        const sYears = Array.isArray(b.selectedYears) ? b.selectedYears : [];
        if (sYears.length > 0) {
          const perYearVal = netTotal * (pct / 100);
          const ordinals: Record<number, string> = {
            1: 'الأولى', 2: 'الثانية', 3: 'الثالثة', 4: 'الرابعة', 5: 'الخامسة',
            6: 'السادسة', 7: 'السابعة', 8: 'الثامنة', 9: 'التاسعة', 10: 'العاشرة'
          };
          [...sYears].sort((a, b) => a - b).forEach(yr => {
            const yName = ordinals[yr] || `سنة ${yr}`;
            bulletsSummary.push({
              type: 'annual',
              label: `سنة ${yName}: %${pct} = ${formatNumber(Math.round(perYearVal))} ج`,
              val: perYearVal
            });
            extraPaymentsTotal += perYearVal;
          });
        }
      } else {
        const val = netTotal * (pct / 100);
        extraPaymentsTotal += val;
        let name = 'مؤجلة';
        if (b.type === 'delivery') name = 'عند الاستلام';
        else if (b.type === 'after_3m') name = 'بعد 3 شهور';
        else if (b.type === 'after_6m') name = 'بعد 6 شهور';
        else if (b.type === 'after_9m') name = 'بعد 9 شهور';
        
        bulletsSummary.push({
          type: b.type,
          label: `${name}: %${pct} = ${formatNumber(Math.round(val))} ج`,
          val
        });
      }
    }
  });

  const remaining = Math.max(0, netTotal - (downPayment + extraPaymentsTotal));
  let yrs = parseFloat(String(years)) || 1;
  if (yrs <= 0) yrs = 1;

  const monthlyEquivalent = remaining / (yrs * 12);
  const quarterlyEquivalent = monthlyEquivalent * 3;
  const annualEquivalent = monthlyEquivalent * 12;

  return {
    originalTotal,
    discountVal,
    netTotal,
    downPayment,
    extraPaymentsTotal,
    bulletsSummary,
    remaining,
    monthlyEquivalent,
    quarterlyEquivalent,
    annualEquivalent
  };
}

export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[يى]/g, 'ي')
    .toLowerCase()
    .trim();
}
