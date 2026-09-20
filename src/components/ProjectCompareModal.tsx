import React, { useState } from 'react';
import { Compound, Currency, Language } from '../types';
import { formatPrice } from '../utils/calculator';
import { 
  X, 
  ArrowLeftRight, 
  Check, 
  Calendar, 
  MapPin, 
  Building2, 
  Sparkles, 
  MessageCircle, 
  Printer, 
  Percent, 
  Clock, 
  Coins, 
  Layers, 
  Award,
  ChevronDown
} from 'lucide-react';

interface ProjectCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compounds: Compound[];
  initialProjectIds?: string[];
  currency: Currency;
  lang: Language;
  onViewProjectDetails?: (compound: Compound) => void;
}

export const ProjectCompareModal: React.FC<ProjectCompareModalProps> = ({
  isOpen,
  onClose,
  compounds,
  initialProjectIds = [],
  currency,
  lang,
  onViewProjectDetails
}) => {
  const isAr = lang === 'ar';

  // Selected project 1 and project 2 IDs
  const [project1Id, setProject1Id] = useState<string>(() => {
    return initialProjectIds[0] || compounds[0]?.id || '';
  });

  const [project2Id, setProject2Id] = useState<string>(() => {
    return initialProjectIds[1] || compounds[1]?.id || compounds[0]?.id || '';
  });

  if (!isOpen) return null;

  const project1 = compounds.find(c => c.id === project1Id) || compounds[0];
  const project2 = compounds.find(c => c.id === project2Id) || (compounds[1] || compounds[0]);

  // Helper calculations for a project
  const getProjectStats = (comp?: Compound) => {
    if (!comp) return null;
    const prices = comp.unitTypes.map(u => u.price).filter(p => p && p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : (comp.pricePerMeter ? comp.pricePerMeter * 100 : 0);
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    
    const bestPlan = comp.paymentPlans && comp.paymentPlans.length > 0 ? comp.paymentPlans[0] : null;
    const dpPercent = bestPlan ? bestPlan.downPaymentPercent : 5;
    const years = bestPlan ? bestPlan.years : 8;
    const dpAmount = minPrice * (dpPercent / 100);
    const monthly = Math.round((minPrice - dpAmount) / (years * 12));

    const pricePerMeterMin = comp.pricePerMeterMin || comp.pricePerMeter || 0;
    const pricePerMeterMax = comp.pricePerMeterMax || comp.pricePerMeter || 0;

    const deliveryMap: Record<string, string> = {
      immediate: isAr ? 'استلام فوري RTM' : 'Ready to Move',
      '6m': isAr ? '6 أشهر' : '6 Months',
      '1y': isAr ? 'سنة واحدة' : '1 Year',
      '1.5y': isAr ? 'سنة ونصف' : '1.5 Years',
      '2y': isAr ? 'سنتين' : '2 Years',
      '2.5y': isAr ? 'سنتين ونصف' : '2.5 Years',
      '3y': isAr ? '3 سنوات' : '3 Years',
      '4y': isAr ? '4 سنوات+' : '4+ Years'
    };

    const deliveryText = comp.deliveryDate && deliveryMap[comp.deliveryDate]
      ? deliveryMap[comp.deliveryDate]
      : (comp.deliveryDate || (isAr ? 'قيد الإنشاء' : 'Under Construction'));

    const finishMap: Record<string, string> = {
      core_shell: isAr ? 'طوب أحمر / محارة' : 'Core & Shell',
      semi: isAr ? 'نصف تشطيب' : 'Semi Finished',
      full: isAr ? 'تشطيب كامل بالتكييفات' : 'Fully Finished'
    };

    const finishText = comp.finishingStatus && finishMap[comp.finishingStatus]
      ? finishMap[comp.finishingStatus]
      : (comp.finishingStatus || (isAr ? 'حسب الوحدة' : 'Mixed'));

    return {
      minPrice,
      maxPrice,
      dpPercent,
      dpAmount,
      years,
      monthly,
      pricePerMeterMin,
      pricePerMeterMax,
      deliveryText,
      finishText,
      bestPlan
    };
  };

  const p1Stats = getProjectStats(project1);
  const p2Stats = getProjectStats(project2);

  // Swap projects
  const handleSwap = () => {
    const temp = project1Id;
    setProject1Id(project2Id);
    setProject2Id(temp);
  };

  // Generate WhatsApp comparison message
  const handleShareWhatsApp = () => {
    if (!project1 || !project2 || !p1Stats || !p2Stats) return;

    const text = isAr
      ? `📊 *مقارنة مشروعات عقارية خاصة بك - J Broker Assistant*
---------------------------------------
🏢 *1. ${project1.projectName}* (${project1.companyName})
📍 الموقع: ${project1.locationName || 'متميز'}
💰 يبدأ من: ${formatPrice(p1Stats.minPrice, currency, lang)}
💳 المقدم: ${p1Stats.dpPercent}% (${formatPrice(p1Stats.dpAmount, currency, lang)})
⏳ التقسيط: حتى ${p1Stats.years} سنوات (قسط شهري ~${formatPrice(p1Stats.monthly, currency, lang)})
🔑 الاستلام: ${p1Stats.deliveryText}
🎨 التشطيب: ${p1Stats.finishText}

---------------------------------------
🏢 *2. ${project2.projectName}* (${project2.companyName})
📍 الموقع: ${project2.locationName || 'متميز'}
💰 يبدأ من: ${formatPrice(p2Stats.minPrice, currency, lang)}
💳 المقدم: ${p2Stats.dpPercent}% (${formatPrice(p2Stats.dpAmount, currency, lang)})
⏳ التقسيط: حتى ${p2Stats.years} سنوات (قسط شهري ~${formatPrice(p2Stats.monthly, currency, lang)})
🔑 الاستلام: ${p2Stats.deliveryText}
🎨 التشطيب: ${p2Stats.finishText}
---------------------------------------
📞 أرسل لي لمناقشة كافة التفاصيل وحجز موعد المعاينة.`
      : `📊 *Property Comparison by J Broker Assistant*
1. ${project1.projectName} (${project1.companyName}) - Starting: ${formatPrice(p1Stats.minPrice, currency, lang)} | ${p1Stats.dpPercent}% DP | ${p1Stats.years} Yrs
2. ${project2.projectName} (${project2.companyName}) - Starting: ${formatPrice(p2Stats.minPrice, currency, lang)} | ${p2Stats.dpPercent}% DP | ${p2Stats.years} Yrs`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#110f0d] border border-[#2e261c] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-5 border-b border-[#241f18] bg-[#16130f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e5252d]/15 border border-[#e5252d]/40 flex items-center justify-center text-[#e5252d] shadow-sm">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-extrabold text-white">
                  {isAr ? 'مقارنة المشروعات العقارية' : 'Project Side-by-Side Comparison'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e5252d]/20 text-[#ff5a63] border border-[#e5252d]/30">
                  {isAr ? 'مباشر' : 'Live'}
                </span>
              </div>
              <p className="text-xs text-[#9c9284]">
                {isAr ? 'قارن خطط السداد، الأسعار، ميعاد الاستلام والمواصفات لاختيار الأنسب لعميلك' : 'Compare pricing, down payment, installment years and delivery status'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1d1914] hover:bg-[#252019] border border-[#3d3324] hover:border-[#25d366] text-xs font-bold text-white transition-all"
              title={isAr ? 'إرسال المقارنة للعميل على واتساب' : 'Share to client via WhatsApp'}
            >
              <MessageCircle className="w-4 h-4 text-[#25d366]" />
              <span>{isAr ? 'مشاركة واتساب' : 'WhatsApp'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-xl bg-[#1d1914] hover:bg-[#252019] border border-[#3d3324] text-[#9c9284] hover:text-white transition-all"
              title={isAr ? 'طباعة المقارنة' : 'Print'}
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[#1d1914] hover:bg-[#28221a] border border-[#3d3324] text-[#9c9284] hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Project Selectors Row */}
        <div className="p-4 sm:p-6 bg-[#14110d] border-b border-[#241f18] grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
          
          {/* Project 1 Picker */}
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-[11px] font-bold text-[#e3a23c] uppercase tracking-wider block">
              {isAr ? 'المشروع الأول (A)' : 'Project 1 (A)'}
            </label>
            <div className="relative">
              <select
                value={project1Id}
                onChange={(e) => setProject1Id(e.target.value)}
                className="w-full py-2.5 px-3.5 pr-8 rounded-xl bg-[#0c0a08] border border-[#362e22] text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-[#e3a23c] appearance-none"
              >
                {compounds.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.projectName} - {c.companyName} ({c.locationName || 'موقع عام'})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#9c9284] absolute left-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Swap Button */}
          <div className="sm:col-span-1 flex justify-center py-1 sm:py-0">
            <button
              onClick={handleSwap}
              className="p-2.5 rounded-xl bg-[#1c1813] hover:bg-[#262018] border border-[#3d3324] text-[#e3a23c] hover:text-white transition-all shadow-sm"
              title={isAr ? 'تبديل المشروعين' : 'Swap'}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Project 2 Picker */}
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-[11px] font-bold text-[#e3a23c] uppercase tracking-wider block">
              {isAr ? 'المشروع الثاني (B)' : 'Project 2 (B)'}
            </label>
            <div className="relative">
              <select
                value={project2Id}
                onChange={(e) => setProject2Id(e.target.value)}
                className="w-full py-2.5 px-3.5 pr-8 rounded-xl bg-[#0c0a08] border border-[#362e22] text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-[#e3a23c] appearance-none"
              >
                {compounds.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.projectName} - {c.companyName} ({c.locationName || 'موقع عام'})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#9c9284] absolute left-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Comparison Content Table / Cards */}
        <div className="p-4 sm:p-8 max-h-[65vh] overflow-y-auto space-y-6">
          
          {/* 1. Comparison Header Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            
            {/* Card 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#16130f] border-2 border-[#e3a23c]/40 space-y-2 relative">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#e3a23c] text-black uppercase tracking-wider inline-block">
                {isAr ? 'المشروع الأول (A)' : 'Project A'}
              </span>
              <h3 className="text-base sm:text-xl font-extrabold text-white">
                {project1?.projectName}
              </h3>
              <p className="text-xs text-[#9c9284] font-medium">
                {project1?.companyName}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#e3a23c]">
                <MapPin className="w-3.5 h-3.5" />
                <span>{project1?.locationName || 'موقع متميز'}</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#16130f] border-2 border-[#c58624]/40 space-y-2 relative">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#c58624] text-white uppercase tracking-wider inline-block">
                {isAr ? 'المشروع الثاني (B)' : 'Project B'}
              </span>
              <h3 className="text-base sm:text-xl font-extrabold text-white">
                {project2?.projectName}
              </h3>
              <p className="text-xs text-[#9c9284] font-medium">
                {project2?.companyName}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#c58624]">
                <MapPin className="w-3.5 h-3.5" />
                <span>{project2?.locationName || 'موقع متميز'}</span>
              </div>
            </div>

          </div>

          {/* 2. Side-by-Side Comparison Metrics */}
          <div className="border border-[#282117] rounded-2xl overflow-hidden bg-[#0e0c0a]">
            
            {/* Row: Starting Price */}
            <div className="grid grid-cols-2 p-3 sm:p-4 border-b border-[#211a12] hover:bg-[#14110d] transition-colors">
              <div className="space-y-1">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'سعر يبدأ من:' : 'Starting Price:'}</span>
                <span className="text-base sm:text-xl font-black text-[#e3a23c] font-mono-num">
                  {formatPrice(p1Stats?.minPrice || 0, currency, lang)}
                </span>
              </div>
              <div className="space-y-1 border-r rtl:border-r-0 rtl:border-l border-[#241d14] px-3 sm:px-4">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'سعر يبدأ من:' : 'Starting Price:'}</span>
                <span className="text-base sm:text-xl font-black text-[#c58624] font-mono-num">
                  {formatPrice(p2Stats?.minPrice || 0, currency, lang)}
                </span>
              </div>
            </div>

            {/* Row: Down payment */}
            <div className="grid grid-cols-2 p-3 sm:p-4 border-b border-[#211a12] hover:bg-[#14110d] transition-colors bg-[#110e0b]">
              <div className="space-y-1">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'المقدم المطلوب:' : 'Down Payment:'}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono-num">
                    {p1Stats?.dpPercent}%
                  </span>
                  <span className="text-xs text-[#9c9284]">
                    ({formatPrice(p1Stats?.dpAmount || 0, currency, lang)})
                  </span>
                </div>
              </div>
              <div className="space-y-1 border-r rtl:border-r-0 rtl:border-l border-[#241d14] px-3 sm:px-4">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'المقدم المطلوب:' : 'Down Payment:'}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono-num">
                    {p2Stats?.dpPercent}%
                  </span>
                  <span className="text-xs text-[#9c9284]">
                    ({formatPrice(p2Stats?.dpAmount || 0, currency, lang)})
                  </span>
                </div>
              </div>
            </div>

            {/* Row: Installment Years */}
            <div className="grid grid-cols-2 p-3 sm:p-4 border-b border-[#211a12] hover:bg-[#14110d] transition-colors">
              <div className="space-y-1">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'أطول فترة تقسيط:' : 'Installment Years:'}</span>
                <span className="text-sm sm:text-base font-extrabold text-white">
                  {p1Stats?.years} {isAr ? 'سنوات' : 'Years'}
                </span>
              </div>
              <div className="space-y-1 border-r rtl:border-r-0 rtl:border-l border-[#241d14] px-3 sm:px-4">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'أطول فترة تقسيط:' : 'Installment Years:'}</span>
                <span className="text-sm sm:text-base font-extrabold text-white">
                  {p2Stats?.years} {isAr ? 'سنوات' : 'Years'}
                </span>
              </div>
            </div>

            {/* Row: Estimated Monthly */}
            <div className="grid grid-cols-2 p-3 sm:p-4 border-b border-[#211a12] hover:bg-[#14110d] transition-colors bg-[#110e0b]">
              <div className="space-y-1">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'القسط الشهري التقريبي:' : 'Approx Monthly:'}</span>
                <span className="text-sm sm:text-base font-bold text-white font-mono-num">
                  ~{formatPrice(p1Stats?.monthly || 0, currency, lang)} / {isAr ? 'شهر' : 'mo'}
                </span>
              </div>
              <div className="space-y-1 border-r rtl:border-r-0 rtl:border-l border-[#241d14] px-3 sm:px-4">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'القسط الشهري التقريبي:' : 'Approx Monthly:'}</span>
                <span className="text-sm sm:text-base font-bold text-white font-mono-num">
                  ~{formatPrice(p2Stats?.monthly || 0, currency, lang)} / {isAr ? 'شهر' : 'mo'}
                </span>
              </div>
            </div>

            {/* Row: Price Per Meter */}
            <div className="grid grid-cols-2 p-3 sm:p-4 border-b border-[#211a12] hover:bg-[#14110d] transition-colors">
              <div className="space-y-1">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'سعر المتر:' : 'Price / m²:'}</span>
                <span className="text-xs sm:text-sm font-bold text-[#c7bfb4] font-mono-num">
                  {p1Stats?.pricePerMeterMin ? `${formatPrice(p1Stats.pricePerMeterMin, currency, lang)} ${p1Stats.pricePerMeterMax > p1Stats.pricePerMeterMin ? `- ${formatPrice(p1Stats.pricePerMeterMax, currency, lang)}` : ''}` : (isAr ? 'غير محدد' : 'N/A')}
                </span>
              </div>
              <div className="space-y-1 border-r rtl:border-r-0 rtl:border-l border-[#241d14] px-3 sm:px-4">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'سعر المتر:' : 'Price / m²:'}</span>
                <span className="text-xs sm:text-sm font-bold text-[#c7bfb4] font-mono-num">
                  {p2Stats?.pricePerMeterMin ? `${formatPrice(p2Stats.pricePerMeterMin, currency, lang)} ${p2Stats.pricePerMeterMax > p2Stats.pricePerMeterMin ? `- ${formatPrice(p2Stats.pricePerMeterMax, currency, lang)}` : ''}` : (isAr ? 'غير محدد' : 'N/A')}
                </span>
              </div>
            </div>

            {/* Row: Delivery Status */}
            <div className="grid grid-cols-2 p-3 sm:p-4 border-b border-[#211a12] hover:bg-[#14110d] transition-colors bg-[#110e0b]">
              <div className="space-y-1">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'ميعاد الاستلام:' : 'Delivery:'}</span>
                <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#e3a23c]" />
                  <span>{p1Stats?.deliveryText}</span>
                </span>
              </div>
              <div className="space-y-1 border-r rtl:border-r-0 rtl:border-l border-[#241d14] px-3 sm:px-4">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'ميعاد الاستلام:' : 'Delivery:'}</span>
                <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#e3a23c]" />
                  <span>{p2Stats?.deliveryText}</span>
                </span>
              </div>
            </div>

            {/* Row: Finishing */}
            <div className="grid grid-cols-2 p-3 sm:p-4 border-b border-[#211a12] hover:bg-[#14110d] transition-colors">
              <div className="space-y-1">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'نوع التشطيب:' : 'Finishing:'}</span>
                <span className="text-xs sm:text-sm font-bold text-[#d4ccbf]">
                  {p1Stats?.finishText}
                </span>
              </div>
              <div className="space-y-1 border-r rtl:border-r-0 rtl:border-l border-[#241d14] px-3 sm:px-4">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'نوع التشطيب:' : 'Finishing:'}</span>
                <span className="text-xs sm:text-sm font-bold text-[#d4ccbf]">
                  {p2Stats?.finishText}
                </span>
              </div>
            </div>

            {/* Row: Unit Types */}
            <div className="grid grid-cols-2 p-3 sm:p-4 hover:bg-[#14110d] transition-colors bg-[#110e0b]">
              <div className="space-y-1.5">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'الوحدات المتوفرة:' : 'Available Units:'}</span>
                <div className="flex flex-wrap gap-1">
                  {project1?.unitTypes?.map((u, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#1c1813] text-[#c7bfb4] border border-[#2e261c]">
                      {u.bedroomType} ({u.area}م²)
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5 border-r rtl:border-r-0 rtl:border-l border-[#241d14] px-3 sm:px-4">
                <span className="text-[11px] text-[#756b5a] font-bold block">{isAr ? 'الوحدات المتوفرة:' : 'Available Units:'}</span>
                <div className="flex flex-wrap gap-1">
                  {project2?.unitTypes?.map((u, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#1c1813] text-[#c7bfb4] border border-[#2e261c]">
                      {u.bedroomType} ({u.area}م²)
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={handleShareWhatsApp}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isAr ? 'إرسال المقارنة المفصلة للعميل على الواتساب' : 'Send Comparison to Client via WhatsApp'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1c1813] hover:bg-[#28221a] border border-[#3d3324] text-xs font-bold text-white transition-all"
            >
              {isAr ? 'إغلاق نافذة المقارنة' : 'Close'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
