import React, { useState } from 'react';
import { Compound, Currency, Language } from '../types';
import { formatPrice } from '../utils/calculator';
import { MapPin, Calendar, Bookmark, BookmarkCheck, ArrowLeft, ArrowRight, Share2, ArrowLeftRight } from 'lucide-react';

interface ProjectCardProps {
  compound: Compound;
  currency: Currency;
  lang: Language;
  onViewDetails: (compound: Compound) => void;
  onToggleCompare?: (compound: Compound) => void;
  isCompared?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  compound,
  currency,
  lang,
  onViewDetails,
  onToggleCompare,
  isCompared = false
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const [bookmarked, setBookmarked] = useState(compound.bookmarked || false);
  const [copied, setCopied] = useState(false);

  // Compute starting price
  const validPrices = compound.unitTypes
    .map((u) => u.price)
    .filter((p) => p && p > 0);
  const startingPrice = validPrices.length > 0 ? Math.min(...validPrices) : (compound.pricePerMeter ? compound.pricePerMeter * 100 : 0);

  // Best payment plan (lowest down payment or primary plan)
  const bestPlan = compound.paymentPlans && compound.paymentPlans.length > 0 ? compound.paymentPlans[0] : null;
  const downPaymentPercent = bestPlan ? bestPlan.downPaymentPercent : 5;
  const planYears = bestPlan ? bestPlan.years : 8;

  // Approximate monthly installment on starting price
  const netAfterDiscount = startingPrice * (1 - (bestPlan?.discountPercent || 0) / 100);
  const downPaymentAmount = netAfterDiscount * (downPaymentPercent / 100);
  const remaining = Math.max(0, netAfterDiscount - downPaymentAmount);
  const approxMonthly = Math.round(remaining / (planYears * 12));

  // Delivery label
  const deliveryMap: Record<string, { ar: string; en: string }> = {
    immediate: { ar: 'استلام فوري RTM', en: 'Ready to Move' },
    '6m': { ar: '6 أشهر', en: '6 Months' },
    '1y': { ar: 'سنة واحدة', en: '1 Year' },
    '1.5y': { ar: 'سنة ونصف', en: '1.5 Years' },
    '2y': { ar: 'سنتين', en: '2 Years' },
    '2.5y': { ar: 'سنتين ونصف', en: '2.5 Years' },
    '3y': { ar: '3 سنوات', en: '3 Years' },
    '4y': { ar: '4 سنوات+', en: '4+ Years' }
  };
  const deliveryText = compound.deliveryDate && deliveryMap[compound.deliveryDate]
    ? (isAr ? deliveryMap[compound.deliveryDate].ar : deliveryMap[compound.deliveryDate].en)
    : (isAr ? 'قيد الإنشاء' : 'Under Construction');

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  return (
    <div
      onClick={() => onViewDetails(compound)}
      className="group relative rounded-2xl bg-[#131215] border border-[#262422] hover:border-[#e3a23c]/60 p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(227,162,60,0.15)] hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
    >
      
      {/* Top Badges Row (Matches Image 1) */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          
          {/* Timeline Badge (Left in RTL, Right in LTR) */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1915] border border-[#2e2820] text-xs font-semibold text-[#c7bfb4]">
            <Calendar className="w-3.5 h-3.5 text-[#e3a23c]" />
            <span>{deliveryText}</span>
          </div>

          {/* District Badge (e.g. Golden Square) */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f1a13] border border-[#e3a23c]/40 text-xs font-bold text-[#e3a23c] shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#e3a23c]" />
            <span>{compound.locationName || (isAr ? 'موقع متميز' : 'Prime Location')}</span>
          </div>

        </div>

        {/* Project Title & Phase */}
        <div className="mb-2">
          <h2 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-[#e3a23c] transition-colors leading-snug">
            {compound.projectName}
          </h2>
          {compound.phaseName && (
            <span className="text-[11px] font-bold text-[#e3a23c] bg-[#1d1812] px-2 py-0.5 rounded-md inline-block mt-1">
              {compound.phaseName}
            </span>
          )}
        </div>

        {/* Developer Name */}
        <p className="text-xs text-[#9c9284] font-medium mb-4">
          {compound.companyName}
        </p>

        {/* Unit Chips (As seen in Image 1: شقة 135م², شقة 185م², تاون هاوس 240م², +1) */}
        {compound.unitTypes && compound.unitTypes.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-5">
            {compound.unitTypes.slice(0, 3).map((unit) => (
              <span
                key={unit.id}
                className="px-2.5 py-1 rounded-lg bg-[#1a1714] border border-[#2b241c] text-[11px] font-semibold text-[#d4ccbf]"
              >
                {unit.bedroomType.split('(')[0].trim()} ({unit.area} م²)
              </span>
            ))}
            {compound.unitTypes.length > 3 && (
              <span className="px-2 py-1 rounded-lg bg-[#1f1b16] border border-[#3d3324] text-[11px] font-bold text-[#e3a23c]">
                +{compound.unitTypes.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Pricing and Installment Section (Exact match from Image 1) */}
      <div className="pt-4 border-t border-[#201d19]">
        
        {/* Row 1: Starting Price */}
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs text-[#9c9284] font-medium">
            {isAr ? 'يبدأ من:' : 'Starting from:'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#e3a23c] font-mono-num">
            {formatPrice(startingPrice, currency, lang)}
          </span>
        </div>

        {/* Row 2: Down Payment */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#9c9284] font-medium">
            {isAr ? 'المقدم:' : 'Down Payment:'}
          </span>
          <span className="text-xs sm:text-sm font-bold text-[#22c55e] font-mono-num bg-[#0f2316] px-2 py-0.5 rounded border border-[#1b4326]">
            {downPaymentPercent}% {isAr ? 'مقدم' : 'Deposit'}
          </span>
        </div>

        {/* Row 3: Monthly Installment */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-[#9c9284] font-medium">
            {isAr ? 'القسط الشهري:' : 'Monthly Installment:'}
          </span>
          <span className="text-xs sm:text-sm font-bold text-[#f5f1ea] font-mono-num">
            ~{formatPrice(approxMonthly, currency, lang)}
          </span>
        </div>

        {/* Bottom Actions Row: Large CTA + Compare + Bookmark */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(compound)}
            className="flex-1 py-3 px-4 rounded-xl bg-[#1d1a16] hover:bg-[#e3a23c] text-[#f5f1ea] hover:text-[#14120f] border border-[#362f25] hover:border-[#e3a23c] text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 group/btn shadow-sm"
          >
            <span>{isAr ? 'عرض التفاصيل والخطط' : 'View Details & Plans'}</span>
            <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </button>

          {onToggleCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(compound);
              }}
              className={`p-3 rounded-xl border transition-all ${
                isCompared
                  ? 'bg-[#e3a23c] border-[#e3a23c] text-black shadow-[0_0_12px_rgba(227,162,60,0.4)]'
                  : 'bg-[#181511] border-[#2a251e] text-[#9c9284] hover:text-white hover:border-[#e3a23c]'
              }`}
              title={isCompared ? (isAr ? 'مُضاف للمقارنة' : 'Added to compare') : (isAr ? 'إضافة للمقارنة' : 'Add to compare')}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleBookmark}
            className={`p-3 rounded-xl border transition-all ${
              bookmarked
                ? 'bg-[#e3a23c]/20 border-[#e3a23c] text-[#e3a23c]'
                : 'bg-[#181511] border-[#2a251e] text-[#9c9284] hover:text-white hover:border-[#e3a23c]/50'
            }`}
            title={isAr ? 'حفظ في المفضلة' : 'Bookmark'}
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            onClick={handleShare}
            className="p-3 rounded-xl bg-[#181511] border border-[#2a251e] text-[#9c9284] hover:text-white hover:border-[#e3a23c]/50 transition-all"
            title={copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'مشاركة' : 'Share')}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
