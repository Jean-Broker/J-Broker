import React, { useState } from 'react';
import { Currency, Language, CustomBullet } from '../types';
import { formatNumber, formatPrice, calcInstallmentWithDiscount } from '../utils/calculator';
import { X, Calculator, Plus, Trash2 } from 'lucide-react';

interface UniversalCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  lang: Language;
}

export const UniversalCalculatorModal: React.FC<UniversalCalculatorModalProps> = ({
  isOpen,
  onClose,
  currency,
  lang
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const [totalPrice, setTotalPrice] = useState<string>('9180000');
  const [discountPct, setDiscountPct] = useState<string>('0');
  const [downPct, setDownPct] = useState<string>('5');
  const [years, setYears] = useState<string>('8');
  const [bullets, setBullets] = useState<CustomBullet[]>([
    { id: 'b1', type: 'after_3m', percent: 5 }
  ]);

  const numTotal = parseFloat(totalPrice.replace(/,/g, '')) || 0;
  const numDiscount = parseFloat(discountPct) || 0;
  const numDown = parseFloat(downPct) || 0;
  const numYears = parseFloat(years) || 1;

  const result = calcInstallmentWithDiscount(
    numTotal,
    numDiscount,
    numDown,
    bullets,
    numYears,
    12
  );

  const addBullet = () => {
    setBullets([
      ...bullets,
      {
        id: Date.now().toString(),
        type: 'annual',
        percent: 5,
        selectedYears: [1, 2, 3]
      }
    ]);
  };

  const removeBullet = (id: string) => {
    setBullets(bullets.filter((b) => b.id !== id));
  };

  const toggleYear = (bId: string, yr: number) => {
    setBullets(
      bullets.map((b) => {
        if (b.id !== bId) return b;
        const current = b.selectedYears || [];
        const next = current.includes(yr)
          ? current.filter((y) => y !== yr)
          : [...current, yr].sort((x, y) => x - y);
        return { ...b, selectedYears: next };
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl my-auto rounded-3xl bg-[#14120f] border border-[#2a251e] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#24201a] bg-[#181511]">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#e3a23c]" />
            <h2 className="text-sm font-extrabold text-white">
              {isAr ? 'حاسبة الأقساط الشاملة (J Real Estate Calculator)' : 'Universal Real Estate Calculator'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#201d19] hover:bg-[#2e2923] border border-[#302a22] flex items-center justify-center text-[#9c9284] hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Total Price Input */}
          <div>
            <label className="text-xs font-bold text-[#f5f1ea] block mb-1.5">
              {isAr ? 'إجمالي سعر العقار' : 'Total Property Price'}
            </label>
            <input
              type="text"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              placeholder="0"
              className="w-full py-3 px-4 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xl font-black font-mono-num text-[#e3a23c] focus:outline-none focus:border-[#e3a23c]"
            />
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-[#9c9284] block mb-1">
                {isAr ? 'نسبة الخصم (%)' : 'Discount (%)'}
              </label>
              <input
                type="number"
                value={discountPct}
                onChange={(e) => setDiscountPct(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-sm font-bold font-mono-num text-white focus:outline-none focus:border-[#e3a23c]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#9c9284] block mb-1">
                {isAr ? 'نسبة المقدم (%)' : 'Down Payment (%)'}
              </label>
              <input
                type="number"
                value={downPct}
                onChange={(e) => setDownPct(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-sm font-bold font-mono-num text-white focus:outline-none focus:border-[#e3a23c]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#9c9284] block mb-1">
                {isAr ? 'سنوات التقسيط' : 'Tenure (Years)'}
              </label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-sm font-bold font-mono-num text-white focus:outline-none focus:border-[#e3a23c]"
              />
            </div>
          </div>

          {/* Custom Bullets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#e3a23c]">
                {isAr ? 'الدفعات الخاصة الإضافية (Bullets)' : 'Special Installment Bullets'}
              </span>
              <button
                onClick={addBullet}
                className="flex items-center gap-1 text-xs font-bold text-[#e3a23c] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة دفعة' : 'Add Bullet'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {bullets.map((b) => (
                <div key={b.id} className="p-3 rounded-xl bg-[#191612] border border-[#26211a] space-y-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={b.type}
                      onChange={(e) => {
                        const next = bullets.map((item) =>
                          item.id === b.id ? { ...item, type: e.target.value as CustomBullet['type'] } : item
                        );
                        setBullets(next);
                      }}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#12100d] border border-[#2e271e] text-xs font-bold text-white focus:outline-none"
                    >
                      <option value="annual">{isAr ? 'دفعة سنوية' : 'Annual Bullet'}</option>
                      <option value="delivery">{isAr ? 'عند الاستلام' : 'On Delivery'}</option>
                      <option value="after_3m">{isAr ? 'بعد 3 شهور' : 'After 3 Months'}</option>
                      <option value="after_6m">{isAr ? 'بعد 6 شهور' : 'After 6 Months'}</option>
                      <option value="after_9m">{isAr ? 'بعد 9 شهور' : 'After 9 Months'}</option>
                    </select>

                    <div className="flex items-center gap-1 w-24">
                      <input
                        type="number"
                        value={b.percent}
                        onChange={(e) => {
                          const next = bullets.map((item) =>
                            item.id === b.id ? { ...item, percent: parseFloat(e.target.value) || 0 } : item
                          );
                          setBullets(next);
                        }}
                        className="w-full py-1.5 px-2 rounded-lg bg-[#12100d] border border-[#2e271e] text-xs font-bold text-center font-mono-num text-white"
                      />
                      <span className="text-xs text-[#756b5a] font-bold">%</span>
                    </div>

                    <button
                      onClick={() => removeBullet(b.id)}
                      className="p-1.5 rounded-lg text-[#756b5a] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {b.type === 'annual' && (
                    <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                      <span className="text-[11px] text-[#756b5a]">{isAr ? 'في السنة:' : 'Years:'}</span>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((yr) => {
                        const isSel = (b.selectedYears || []).includes(yr);
                        return (
                          <button
                            key={yr}
                            onClick={() => toggleYear(b.id, yr)}
                            className={`w-6 h-6 rounded-md text-[11px] font-bold font-mono-num transition-all ${
                              isSel ? 'bg-[#e3a23c] text-black' : 'bg-[#12100d] text-[#756b5a] border border-[#2a251e]'
                            }`}
                          >
                            {yr}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#191612] to-[#12100d] border border-[#3d3324] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9c9284]">{isAr ? 'صافي السعر بعد الخصم:' : 'Net Price:'}</span>
              <span className="text-sm font-bold text-white font-mono-num">
                {formatPrice(result.netTotal, currency, lang)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9c9284]">{isAr ? 'مقدم الحجز المطلوب:' : 'Down Payment:'}</span>
              <span className="text-sm font-bold text-emerald-400 font-mono-num">
                {formatPrice(result.downPayment, currency, lang)}
              </span>
            </div>

            {result.bulletsSummary.length > 0 && (
              <div className="p-2.5 rounded-lg bg-[#14120f] border border-[#26211a] text-xs space-y-1 text-[#c7bfb4]">
                <div className="font-bold text-[#e3a23c] text-[11px]">{isAr ? 'الدفعات الإضافية:' : 'Bullets:'}</div>
                {result.bulletsSummary.map((b, i) => (
                  <div key={i} className="font-mono-num text-[11px]">• {b.label}</div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-[#26211a] flex items-baseline justify-between">
              <span className="text-xs font-bold text-[#f5f1ea]">
                {isAr ? 'القسط الشهري المكافئ:' : 'Monthly Equivalent:'}
              </span>
              <span className="text-2xl font-black text-[#e3a23c] font-mono-num">
                {formatPrice(result.monthlyEquivalent, currency, lang)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#9c9284] pt-1">
              <span>{isAr ? 'القسط ربع السنوي (كل 3 شهور):' : 'Quarterly Installment:'}</span>
              <span className="font-bold text-white font-mono-num">
                {formatPrice(result.quarterlyEquivalent, currency, lang)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#9c9284]">
              <span>{isAr ? 'القسط السنوي الإجمالي:' : 'Annual Installment:'}</span>
              <span className="font-bold text-white font-mono-num">
                {formatPrice(result.annualEquivalent, currency, lang)}
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
