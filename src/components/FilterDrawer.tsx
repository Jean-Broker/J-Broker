import React from 'react';
import { FilterState, Language, Currency } from '../types';
import { formatNumber, USD_RATE } from '../utils/calculator';
import { X, RotateCcw, SlidersHorizontal, Calendar, Home, Check, DollarSign, ArrowLeftRight } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  lang: Language;
  currency: Currency;
  onOpenCompare?: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  lang,
  currency,
  onOpenCompare
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';
  const isUSD = currency === 'USD';

  // Slider Limits as requested:
  // Down payment: 100,000 EGP to 3,000,000 EGP (or USD equivalent ~ $2,000 to $60,000)
  const depositMin = isUSD ? 2000 : 100000;
  const depositMax = isUSD ? 60000 : 3000000;
  const depositStep = isUSD ? 1000 : 50000;

  // Monthly Installment: 10,000 EGP to 200,000 EGP (or USD equivalent ~ $200 to $4,000)
  const monthlyMin = isUSD ? 200 : 10000;
  const monthlyMax = isUSD ? 4000 : 200000;
  const monthlyStep = isUSD ? 100 : 5000;

  // Current display values
  const currentDepositVal = filters.maxDownPayment 
    ? (isUSD ? Math.round(filters.maxDownPayment / USD_RATE) : Math.round(filters.maxDownPayment))
    : '';

  const currentMonthlyVal = filters.maxMonthlyInstallment 
    ? (isUSD ? Math.round(filters.maxMonthlyInstallment / USD_RATE) : Math.round(filters.maxMonthlyInstallment))
    : '';

  const handleDepositInput = (valStr: string) => {
    if (!valStr || isNaN(Number(valStr))) {
      onFilterChange({ maxDownPayment: null });
      return;
    }
    const num = Number(valStr);
    const egpVal = isUSD ? num * USD_RATE : num;
    onFilterChange({ maxDownPayment: egpVal });
  };

  const handleMonthlyInput = (valStr: string) => {
    if (!valStr || isNaN(Number(valStr))) {
      onFilterChange({ maxMonthlyInstallment: null });
      return;
    }
    const num = Number(valStr);
    const egpVal = isUSD ? num * USD_RATE : num;
    onFilterChange({ maxMonthlyInstallment: egpVal });
  };

  const propertyTypesList = [
    { key: 'apartment', ar: 'شقق سكنية', en: 'Apartments' },
    { key: 'villa', ar: 'فيلات مستقلة', en: 'Villas' },
    { key: 'twinhouse', ar: 'توين هاوس', en: 'Twinhouse' },
    { key: 'townhouse', ar: 'تاون هاوس', en: 'Townhouse' },
    { key: 'duplex', ar: 'دوبلكس', en: 'Duplex' },
    { key: 'penthouse', ar: 'بنتهاوس', en: 'Penthouse' },
    { key: 'studio', ar: 'استوديو', en: 'Studio' },
    { key: 'chalet', ar: 'شاليهات', en: 'Chalets' },
    { key: 'commercial', ar: 'تجاري وإداري', en: 'Commercial' }
  ];

  const deliveryList = [
    { key: 'immediate', ar: 'استلام فوري RTM', en: 'Immediate RTM' },
    { key: '1y', ar: 'خلال سنة واحدة', en: 'Within 1 Year' },
    { key: '2y', ar: 'خلال سنتين', en: 'Within 2 Years' },
    { key: '3y', ar: 'خلال 3 سنوات', en: 'Within 3 Years' },
    { key: '4y', ar: 'خلال 4 سنوات+', en: '4+ Years' }
  ];

  const finishingList = [
    { key: 'full', ar: 'تشطيب كامل', en: 'Fully Finished' },
    { key: 'semi', ar: 'نصف تشطيب', en: 'Semi Finished' },
    { key: 'core_shell', ar: 'طوب أحمر', en: 'Core & Shell' }
  ];

  const togglePropertyType = (key: string) => {
    const next = filters.propertyTypes.includes(key)
      ? filters.propertyTypes.filter(k => k !== key)
      : [...filters.propertyTypes, key];
    onFilterChange({ propertyTypes: next });
  };

  const toggleDelivery = (key: string) => {
    const next = filters.delivery.includes(key)
      ? filters.delivery.filter(k => k !== key)
      : [...filters.delivery, key];
    onFilterChange({ delivery: next });
  };

  const toggleFinishing = (key: string) => {
    const next = filters.finishing.includes(key)
      ? filters.finishing.filter(k => k !== key)
      : [...filters.finishing, key];
    onFilterChange({ finishing: next });
  };

  const toggleBedroom = (bed: string) => {
    const isSelected = filters.bedrooms.includes(bed);
    const next = isSelected
      ? filters.bedrooms.filter(b => b !== bed)
      : [...filters.bedrooms, bed];
    onFilterChange({ bedrooms: next });
  };

  // Count active filters
  const activeCount = [
    filters.propertyTypes.length,
    filters.bedrooms.length,
    filters.delivery.length,
    filters.durationYears ? 1 : 0,
    filters.finishing.length,
    filters.minPricePerMeter || filters.maxPricePerMeter ? 1 : 0,
    filters.minPrice || filters.maxPrice ? 1 : 0,
    filters.maxDownPayment ? 1 : 0,
    filters.maxMonthlyInstallment ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container: slides in on the LEFT */}
      <div className="fixed inset-y-0 start-0 max-w-full flex">
        <div className="w-screen max-w-md bg-[#14120f] border-e border-[#2a251e] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-[#24201a] bg-[#181511] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#e3a23c]/20 border border-[#e3a23c]/40 flex items-center justify-center text-[#e3a23c]">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span>{isAr ? 'فلاتر البحث والمواصفات' : 'Search & Filters'}</span>
                  {activeCount > 0 && (
                    <span className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded-full bg-[#e3a23c] text-black">
                      {activeCount}
                    </span>
                  )}
                </h3>
                <span className="text-[10px] text-[#756b5a]">
                  {isAr ? 'حدد مواصفات وميزانية الوحدة العقارية' : 'Customize unit criteria and budget'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenCompare && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCompare();
                  }}
                  className="flex items-center gap-1 text-xs text-[#e3a23c] hover:text-white px-2.5 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] border border-[#3d3324] transition-all"
                  title={isAr ? 'مقارنة المشروعات العقارية' : 'Compare Projects'}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAr ? 'مقارنة المشروعات' : 'Compare'}</span>
                </button>
              )}
              {activeCount > 0 && (
                <button
                  onClick={onResetFilters}
                  className="flex items-center gap-1 text-xs text-[#9c9284] hover:text-[#e3a23c] px-2 py-1 rounded-lg hover:bg-[#201d19]"
                  title={isAr ? 'إعادة ضبط' : 'Reset'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAr ? 'مسح' : 'Reset'}</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#9c9284] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body with exact requested sequential order */}
          <div className="p-5 overflow-y-auto space-y-6 flex-1">
            
            {/* 1. نوع الوحدة (Unit Type) */}
            <div>
              <h4 className="text-xs font-bold text-[#e3a23c] mb-2 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" />
                <span>{isAr ? '1. نوع الوحدة' : '1. Unit Type'}</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {propertyTypesList.map((item) => {
                  const isChecked = filters.propertyTypes.includes(item.key);
                  return (
                    <button
                      key={item.key}
                      onClick={() => togglePropertyType(item.key)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium text-start border flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-[#e3a23c]/20 border-[#e3a23c] text-white font-bold'
                          : 'bg-[#181511] border-[#262422] text-[#9c9284] hover:text-white'
                      }`}
                    >
                      <span>{isAr ? item.ar : item.en}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#e3a23c]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. كام Bedroom (عدد غرف النوم) */}
            <div>
              <h4 className="text-xs font-bold text-[#e3a23c] mb-2">
                {isAr ? '2. كام Bedroom (عدد الغرف)' : '2. Bedroom Count'}
              </h4>
              <div className="flex items-center gap-2">
                {['1', '2', '3', '4', '5+'].map((bed) => {
                  const isSelected = filters.bedrooms.includes(bed);
                  return (
                    <button
                      key={bed}
                      onClick={() => toggleBedroom(bed)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black font-mono-num border transition-all ${
                        isSelected
                          ? 'bg-[#e3a23c] text-black border-[#e3a23c] shadow-sm'
                          : 'bg-[#181511] text-[#9c9284] border-[#262422] hover:text-white'
                      }`}
                    >
                      {bed}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. هيستلم إمتى (Delivery Timeline) */}
            <div>
              <h4 className="text-xs font-bold text-[#e3a23c] mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{isAr ? '3. هيستلم إمتى (ميعاد الاستلام)' : '3. Delivery Timeline'}</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {deliveryList.map((item) => {
                  const isChecked = filters.delivery.includes(item.key);
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleDelivery(item.key)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                        isChecked
                          ? 'bg-[#e3a23c] text-black border-[#e3a23c] font-bold'
                          : 'bg-[#181511] border-[#262422] text-[#9c9284] hover:text-white'
                      }`}
                    >
                      {isAr ? item.ar : item.en}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. سنوات التقسيط (Installment Years) - تم تقديمها هنا حسب الطلب */}
            <div>
              <h4 className="text-xs font-bold text-[#e3a23c] mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{isAr ? '4. عدد سنوات التقسيط' : '4. Installment Years'}</span>
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: isAr ? 'أي مدة' : 'Any', val: null },
                  { label: isAr ? '4+ سنوات' : '4+ Years', val: 4 },
                  { label: isAr ? '5+ سنوات' : '5+ Years', val: 5 },
                  { label: isAr ? '7+ سنوات' : '7+ Years', val: 7 },
                  { label: isAr ? '8+ سنوات' : '8+ Years', val: 8 },
                  { label: isAr ? '10 سنوات' : '10 Years', val: 10 }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onFilterChange({ durationYears: item.val })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                      filters.durationYears === item.val
                        ? 'bg-[#e3a23c] text-black border-[#e3a23c] shadow-sm'
                        : 'bg-[#181511] text-[#9c9284] hover:text-white border-[#262422]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. التشطيب (Finishing Type) - تم تقديمها هنا حسب الطلب */}
            <div>
              <h4 className="text-xs font-bold text-[#e3a23c] mb-2">
                {isAr ? '5. نوع التشطيب' : '5. Finishing Type'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {finishingList.map((item) => {
                  const isChecked = filters.finishing.includes(item.key);
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleFinishing(item.key)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                        isChecked
                          ? 'bg-[#e3a23c] text-black border-[#e3a23c] font-bold'
                          : 'bg-[#181511] border-[#262422] text-[#9c9284] hover:text-white'
                      }`}
                    >
                      {isAr ? item.ar : item.en}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. سعر المتر (Price Per Meter) */}
            <div className="p-4 rounded-2xl bg-[#191612] border border-[#2e271e] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#e3a23c]">
                  {isAr ? '6. سعر المتر (ج.م / م²)' : '6. Price Per Meter'}
                </span>
                {(filters.minPricePerMeter || filters.maxPricePerMeter) && (
                  <button
                    onClick={() => onFilterChange({ minPricePerMeter: null, maxPricePerMeter: null })}
                    className="text-[10px] text-[#9c9284] hover:text-[#e3a23c]"
                  >
                    {isAr ? 'مسح' : 'Clear'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#756b5a] block mb-1">
                    {isAr ? 'أقل سعر للمتر' : 'Min Price/m²'}
                  </label>
                  <input
                    type="number"
                    value={filters.minPricePerMeter ?? ''}
                    onChange={(e) => onFilterChange({ minPricePerMeter: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder={isAr ? 'مثال: 25000' : 'e.g. 25,000'}
                    className="w-full py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs font-mono-num text-white focus:outline-none focus:border-[#e3a23c]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#756b5a] block mb-1">
                    {isAr ? 'أقصى سعر للمتر' : 'Max Price/m²'}
                  </label>
                  <input
                    type="number"
                    value={filters.maxPricePerMeter ?? ''}
                    onChange={(e) => onFilterChange({ maxPricePerMeter: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder={isAr ? 'مثال: 75000' : 'e.g. 75,000'}
                    className="w-full py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs font-mono-num text-white focus:outline-none focus:border-[#e3a23c]"
                  />
                </div>
              </div>
              {/* Presets for price per meter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                <span className="text-[#756b5a]">{isAr ? 'سريع:' : 'Presets:'}</span>
                <button
                  onClick={() => onFilterChange({ minPricePerMeter: null, maxPricePerMeter: 35000 })}
                  className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num"
                >
                  &lt; 35 ألف
                </button>
                <button
                  onClick={() => onFilterChange({ minPricePerMeter: 35000, maxPricePerMeter: 60000 })}
                  className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num"
                >
                  35k - 60k
                </button>
                <button
                  onClick={() => onFilterChange({ minPricePerMeter: 60000, maxPricePerMeter: null })}
                  className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num"
                >
                  &gt; 60 ألف
                </button>
              </div>
            </div>

            {/* 7. توتال الوحدة (Total Unit Price Range) */}
            <div className="p-4 rounded-2xl bg-[#191612] border border-[#2e271e] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#e3a23c]">
                  {isAr ? '7. توتال الوحدة (إجمالي السعر)' : '7. Total Unit Price'}
                </span>
                {(filters.minPrice || filters.maxPrice) && (
                  <button
                    onClick={() => onFilterChange({ minPrice: null, maxPrice: null })}
                    className="text-[10px] text-[#9c9284] hover:text-[#e3a23c]"
                  >
                    {isAr ? 'مسح' : 'Clear'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#756b5a] block mb-1">
                    {isAr ? `الحد الأدنى (${currency})` : 'Min Price'}
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice || ''}
                    onChange={(e) => onFilterChange({ minPrice: parseFloat(e.target.value) || null })}
                    placeholder="0"
                    className="w-full py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs font-mono-num text-white focus:outline-none focus:border-[#e3a23c]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#756b5a] block mb-1">
                    {isAr ? `الحد الأقصى (${currency})` : 'Max Price'}
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice || ''}
                    onChange={(e) => onFilterChange({ maxPrice: parseFloat(e.target.value) || null })}
                    placeholder="30000000"
                    className="w-full py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs font-mono-num text-white focus:outline-none focus:border-[#e3a23c]"
                  />
                </div>
              </div>
            </div>

            {/* 8. المقدم (Down Payment): كتابة عادية + البار من 100 ألف لـ 3 مليون */}
            <div className="p-4 rounded-2xl bg-[#191612] border border-[#2e271e] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e3a23c] shadow-[0_0_8px_rgba(227,162,60,0.8)]" />
                  <span className="text-xs font-bold text-white">
                    {isAr ? '8. المقدم' : '8. Down Payment'}
                  </span>
                </div>
                {filters.maxDownPayment && (
                  <button
                    onClick={() => onFilterChange({ maxDownPayment: null })}
                    className="text-[10px] text-[#9c9284] hover:text-[#e3a23c]"
                  >
                    {isAr ? 'مسح' : 'Clear'}
                  </button>
                )}
              </div>

              {/* Input for writing the amount directly */}
              <div>
                <label className="text-[10px] text-[#756b5a] block mb-1">
                  {isAr ? 'اكتب قيمة المقدم مباشرةً أو استخدم شريط التمرير:' : 'Type down payment or use slider:'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={currentDepositVal}
                    onChange={(e) => handleDepositInput(e.target.value)}
                    placeholder={isAr ? (isUSD ? 'مثال: 30000' : 'مثال: 500000') : 'e.g. 500,000'}
                    className="w-full py-2 px-3 pe-16 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs font-mono-num font-bold text-[#e3a23c] focus:outline-none focus:border-[#e3a23c]"
                  />
                  <span className="absolute inset-y-0 end-0 pe-3 flex items-center text-[10px] text-[#756b5a] font-bold">
                    {currency}
                  </span>
                </div>
              </div>

              {/* Slider Bar: من 100 ألف لحد 3 مليون */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono-num text-[#9c9284]">
                  <span>{isUSD ? '$2k' : '100 ألف'}</span>
                  <span className="text-[#e3a23c] font-bold">
                    {filters.maxDownPayment 
                      ? (isUSD ? `$${formatNumber(Number(currentDepositVal))}` : `${formatNumber(Number(currentDepositVal))} ج.م`) 
                      : (isAr ? 'بدون حد (الكل)' : 'No Limit')}
                  </span>
                  <span>{isUSD ? '$60k' : '3 مليون'}</span>
                </div>
                <input
                  type="range"
                  min={depositMin}
                  max={depositMax}
                  step={depositStep}
                  value={Number(currentDepositVal) || depositMin}
                  onChange={(e) => handleDepositInput(e.target.value)}
                  className="w-full slider-amber cursor-pointer"
                />
              </div>

              {/* Presets for Down Payment */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                <span className="text-[#756b5a]">{isAr ? 'سريع:' : 'Quick:'}</span>
                {isUSD ? (
                  <>
                    <button onClick={() => handleDepositInput('10000')} className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num">$10k</button>
                    <button onClick={() => handleDepositInput('25000')} className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num">$25k</button>
                    <button onClick={() => handleDepositInput('50000')} className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num">$50k</button>
                    <button onClick={() => handleDepositInput('')} className="px-2 py-1 rounded-lg bg-[#201d19] text-[#e3a23c]">{isAr ? 'الكل' : 'Any'}</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleDepositInput('250000')} className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num">250 ألف</button>
                    <button onClick={() => handleDepositInput('500000')} className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num">500 ألف</button>
                    <button onClick={() => handleDepositInput('1000000')} className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num">1 مليون</button>
                    <button onClick={() => handleDepositInput('2000000')} className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num">2 مليون</button>
                    <button onClick={() => handleDepositInput('')} className="px-2 py-1 rounded-lg bg-[#201d19] text-[#e3a23c]">{isAr ? 'الكل' : 'Any'}</button>
                  </>
                )}
              </div>
            </div>

            {/* 9. القسط (Installment): كتابة عادية + البار من 10 تلاف لـ 200 ألف */}
            <div className="p-4 rounded-2xl bg-[#191612] border border-[#2e271e] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                  <span className="text-xs font-bold text-white">
                    {isAr ? '9. القسط الشهري' : '9. Monthly Installment'}
                  </span>
                </div>
                {filters.maxMonthlyInstallment && (
                  <button
                    onClick={() => onFilterChange({ maxMonthlyInstallment: null })}
                    className="text-[10px] text-[#9c9284] hover:text-[#22c55e]"
                  >
                    {isAr ? 'مسح' : 'Clear'}
                  </button>
                )}
              </div>

              {/* Input for writing monthly installment directly */}
              <div>
                <label className="text-[10px] text-[#756b5a] block mb-1">
                  {isAr ? 'اكتب قيمة القسط الشهري أو استخدم شريط التمرير:' : 'Type monthly installment or use slider:'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={currentMonthlyVal}
                    onChange={(e) => handleMonthlyInput(e.target.value)}
                    placeholder={isAr ? (isUSD ? 'مثال: 1500' : 'مثال: 35000') : 'e.g. 35,000'}
                    className="w-full py-2 px-3 pe-16 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs font-mono-num font-bold text-[#22c55e] focus:outline-none focus:border-[#22c55e]"
                  />
                  <span className="absolute inset-y-0 end-0 pe-3 flex items-center text-[10px] text-[#756b5a] font-bold">
                    {currency}/شهر
                  </span>
                </div>
              </div>

              {/* Slider Bar: من 10 تلاف لحد 200 ألف */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono-num text-[#9c9284]">
                  <span>{isUSD ? '$200' : '10 آلاف'}</span>
                  <span className="text-[#22c55e] font-bold">
                    {filters.maxMonthlyInstallment 
                      ? (isUSD ? `$${formatNumber(Number(currentMonthlyVal))}/mo` : `${formatNumber(Number(currentMonthlyVal))} ج.م/شهر`) 
                      : (isAr ? 'بدون حد (الكل)' : 'No Limit')}
                  </span>
                  <span>{isUSD ? '$4k' : '200 ألف'}</span>
                </div>
                <input
                  type="range"
                  min={monthlyMin}
                  max={monthlyMax}
                  step={monthlyStep}
                  value={Number(currentMonthlyVal) || monthlyMin}
                  onChange={(e) => handleMonthlyInput(e.target.value)}
                  className="w-full slider-emerald cursor-pointer"
                />
              </div>

              {/* Presets for Monthly Installment */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                <span className="text-[#756b5a]">{isAr ? 'سريع:' : 'Quick:'}</span>
                {isUSD ? (
                  <>
                    <button onClick={() => handleMonthlyInput('500')} className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num">$500</button>
                    <button onClick={() => handleMonthlyInput('1500')} className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num">$1.5k</button>
                    <button onClick={() => handleMonthlyInput('3000')} className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num">$3k</button>
                    <button onClick={() => handleMonthlyInput('')} className="px-2 py-1 rounded-lg bg-[#201d19] text-[#22c55e]">{isAr ? 'الكل' : 'Any'}</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleMonthlyInput('25000')} className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num">25 ألف</button>
                    <button onClick={() => handleMonthlyInput('50000')} className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num">50 ألف</button>
                    <button onClick={() => handleMonthlyInput('75000')} className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num">75 ألف</button>
                    <button onClick={() => handleMonthlyInput('120000')} className="px-2 py-1 rounded-lg bg-[#201d19] hover:bg-[#2e2923] text-[#c7bfb4] font-mono-num">120 ألف</button>
                    <button onClick={() => handleMonthlyInput('')} className="px-2 py-1 rounded-lg bg-[#201d19] text-[#22c55e]">{isAr ? 'الكل' : 'Any'}</button>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#24201a] bg-[#181511] flex items-center gap-3">
            <button
              onClick={onResetFilters}
              className="py-3 px-4 rounded-xl bg-[#201d19] hover:bg-[#2a241c] text-[#9c9284] hover:text-white text-xs font-bold transition-all"
            >
              {isAr ? 'إعادة ضبط' : 'Reset'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-[#e3a23c] hover:bg-[#c98a2c] text-black font-extrabold text-xs shadow-[0_0_15px_rgba(227,162,60,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <span>{isAr ? 'تطبيق الفلاتر وعرض النتائج 🚀' : 'Apply & Show Results'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
