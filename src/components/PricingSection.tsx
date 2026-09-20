import React, { useState } from 'react';
import { Language, Currency } from '../types';
import { Check, Zap, Crown, Building2, Sparkles, MessageCircle, ShieldCheck } from 'lucide-react';
import { formatNumber, USD_RATE } from '../utils/calculator';

interface PricingSectionProps {
  lang: Language;
  currency: Currency;
  onSelectPlan?: (planId: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  lang,
  currency,
  onSelectPlan
}) => {
  const isAr = lang === 'ar';
  const isUSD = currency === 'USD';
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  // Convert EGP to USD if requested
  const getPrice = (egpAmount: number) => {
    if (isUSD) {
      return `$${Math.round(egpAmount / USD_RATE)}`;
    }
    return `${formatNumber(egpAmount)} ج.م`;
  };

  const plans = [
    {
      id: 'starter',
      nameAr: 'باقة الوسيط المستقل',
      nameEn: 'Solo Broker',
      tagAr: 'للبدء الفوري',
      tagEn: 'Quick Start',
      popular: false,
      icon: Zap,
      prices: {
        monthly: 500,
        quarterly: 1200, // 400/mo
        yearly: 4200     // 350/mo
      },
      featuresAr: [
        'تصفح كامل المشروعات والمطورين (500+ مشروع)',
        'محرك الفلترة بالأقساط والمقدم وسعر المتر',
        'حاسبة الأقساط الشاملة والدفعات السنوية (Bullets)',
        'تصدير ومشاركة العروض على واتساب للعملاء مباشرة',
        'تحديثات دورية لأسعار المشروعات وخطط السداد'
      ],
      featuresEn: [
        'Full access to 500+ compounds & top developers',
        'Advanced installment & down payment search engine',
        'Universal installment & annual bullets calculator',
        'Direct WhatsApp client quote sharing',
        'Regular developer price & plan updates'
      ],
      ctaAr: 'اشترك في باقة الوسيط',
      ctaEn: 'Start Solo Plan'
    },
    {
      id: 'pro',
      nameAr: 'باقة البرو الاحترافية',
      nameEn: 'Broker Pro',
      tagAr: 'الأكثر طلباً واختياراً ⭐',
      tagEn: 'Most Popular ⭐',
      popular: true,
      icon: Sparkles,
      prices: {
        monthly: 950,
        quarterly: 2400, // 800/mo
        yearly: 7800     // 650/mo
      },
      featuresAr: [
        'جميع مميزات باقة الوسيط المستقل',
        'حسابات غير محدودة لعروض الأسعار ومقارنة الكمبوندات',
        'تنزيل وطباعة بروشورات وملخصات المشاريع PDF',
        'أولوية الدعم الفني المباشر عبر واتساب',
        'حفظ المشروعات المفضلة والوحدات المخصصة',
        'تنبيهات فورية عند طرح مشروعات ومراحل جديدة (Launches)'
      ],
      featuresEn: [
        'All Solo Broker features included',
        'Unlimited quotes & compound comparison',
        'Export & print customized PDF project brochures',
        'Direct priority WhatsApp support',
        'Save favorite compounds & custom unit notes',
        'Instant alerts on new launches & phases'
      ],
      ctaAr: 'اشترك في باقة برو المتميزة 🚀',
      ctaEn: 'Upgrade to Pro 🚀'
    },
    {
      id: 'enterprise',
      nameAr: 'باقة الشركات والفرق (Team / Agency)',
      nameEn: 'Agencies & Teams',
      tagAr: 'للشركات العقارية',
      tagEn: 'For Brokerages',
      popular: false,
      icon: Crown,
      prices: {
        monthly: 2200,
        quarterly: 5500,
        yearly: 18000
      },
      featuresAr: [
        'كل مميزات برو لـ 5 إلى 15 وسيط ومستشار عقاري',
        'لوحة تحكم إدارية مركزية وتوزيع الصلاحيات',
        'إمكانية إضافة وتعديل المشروعات والمناطق حصرياً للشركة',
        'استيراد المشروعات والمخزون من ملفات Excel بضغطة زر',
        'شعار وهوية مخصصة لشركتك على عروض الأسعار والـ PDF',
        'تدريب ودعم مخصص للفريق'
      ],
      featuresEn: [
        'Everything in Pro for 5-15 agents & sales brokers',
        'Central admin dashboard & role management',
        'Custom private project & inventory entry',
        'One-click Excel inventory bulk import',
        'Custom branding & company logo on PDF exports',
        'Dedicated onboarding & priority team support'
      ],
      ctaAr: 'تواصل لاشتراك الشركات',
      ctaEn: 'Contact for Team Plan'
    }
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 border-b border-[#262422] bg-[#0d0c0a] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#e3a23c]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b1712] border border-[#e3a23c]/40 text-[#e3a23c] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAr ? 'خطط وباقات الاشتراك' : 'Subscription Plans'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {isAr ? 'اختر باقة الاشتراك المناسبة لعملك' : 'Invest in Faster Sales with J Broker'}
          </h2>
          <p className="text-xs sm:text-sm text-[#9c9284] leading-relaxed">
            {isAr
              ? 'اشترك الآن واحصل على وصول فوري لأقوى قاعدة بيانات لمشروعات مصر وحاسبة الأقساط الذكية لمضاعفة مبيعاتك وإغلاق الصفقات.'
              : 'Unlock full compound databases, instant bullet calculations, and client-ready proposals to scale your real estate brokerage.'}
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex p-1 rounded-2xl bg-[#14120f] border border-[#2a251e] shadow-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#221e19] text-white shadow-sm border border-[#3d3324]'
                  : 'text-[#9c9284] hover:text-white'
              }`}
            >
              {isAr ? 'شهري' : 'Monthly'}
            </button>
            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all relative ${
                billingCycle === 'quarterly'
                  ? 'bg-[#e3a23c] text-black shadow-md font-black'
                  : 'text-[#9c9284] hover:text-white'
              }`}
            >
              <span>{isAr ? '3 شهور (توفير 20%)' : '3 Months (Save 20%)'}</span>
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-[#221e19] text-white shadow-sm border border-[#3d3324]'
                  : 'text-[#9c9284] hover:text-white'
              }`}
            >
              {isAr ? 'سنوي (توفير 30%)' : 'Yearly (Save 30%)'}
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const currentPrice = plan.prices[billingCycle];
            const periodLabel = billingCycle === 'monthly'
              ? (isAr ? '/ شهر' : '/ mo')
              : billingCycle === 'quarterly'
              ? (isAr ? '/ 3 شهور' : '/ 3 mos')
              : (isAr ? '/ سنة' : '/ year');

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-[#1c1813] to-[#12100d] border-2 border-[#e3a23c] shadow-[0_0_35px_rgba(227,162,60,0.2)] scale-100 lg:-translate-y-2'
                    : 'bg-[#14120f] border border-[#2a251e] hover:border-[#3d3324]'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#e3a23c] text-black font-black text-[11px] uppercase tracking-wider shadow-md">
                    {isAr ? plan.tagAr : plan.tagEn}
                  </div>
                )}

                <div>
                  {/* Top row */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        plan.popular
                          ? 'bg-[#e3a23c] text-black shadow-md'
                          : 'bg-[#1c1914] text-[#e3a23c] border border-[#332b20]'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-white">
                          {isAr ? plan.nameAr : plan.nameEn}
                        </h3>
                        {!plan.popular && (
                          <span className="text-[10px] text-[#756b5a] font-medium">
                            {isAr ? plan.tagAr : plan.tagEn}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="my-6 p-4 rounded-2xl bg-[#0e0d0b] border border-[#221f19]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black font-mono-num text-white">
                        {getPrice(currentPrice)}
                      </span>
                      <span className="text-xs text-[#9c9284] font-medium">
                        {periodLabel}
                      </span>
                    </div>
                    {billingCycle !== 'monthly' && (
                      <p className="text-[11px] text-emerald-400 font-bold mt-1">
                        {isAr
                          ? `يعادل ${getPrice(Math.round(currentPrice / (billingCycle === 'quarterly' ? 3 : 12)))} شهرياً`
                          : `Equivalent to ${getPrice(Math.round(currentPrice / (billingCycle === 'quarterly' ? 3 : 12)))}/month`}
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-bold text-[#756b5a] uppercase tracking-wider block">
                      {isAr ? 'ما تتضمنه الباقة:' : 'What is included:'}
                    </span>
                    {(isAr ? plan.featuresAr : plan.featuresEn).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#c7bfb4] leading-relaxed">
                        <div className="w-4 h-4 rounded-full bg-[#e3a23c]/20 border border-[#e3a23c]/40 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#e3a23c]">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div>
                  <a
                    href={`https://wa.me/201273949392?text=${encodeURIComponent(
                      `مرحباً، أود الاشتراك في باقة: ${plan.nameAr} (${billingCycle}) لمنظومة J Broker Assistant`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-full py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                      plan.popular
                        ? 'bg-[#e3a23c] hover:bg-[#c98a2c] text-black shadow-[0_0_20px_rgba(227,162,60,0.35)]'
                        : 'bg-[#1c1813] hover:bg-[#28221a] text-white border border-[#3d3324] hover:border-[#e3a23c]'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isAr ? plan.ctaAr : plan.ctaEn}</span>
                  </a>
                  <p className="text-[10px] text-center text-[#756b5a] mt-2">
                    {isAr ? 'تفعيل فوري خلال دقائق عبر الواتساب' : 'Instant activation via WhatsApp'}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Enterprise Callout / Custom Inquiries */}
        <div className="mt-12 p-6 rounded-3xl bg-[#14120f] border border-[#2a251e] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e3a23c]/10 border border-[#e3a23c]/30 flex items-center justify-center text-[#e3a23c]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">
                {isAr ? 'هل لديك شركة أو فريق وساطة كبير؟' : 'Need custom enterprise setup for large teams?'}
              </h4>
              <p className="text-xs text-[#9c9284]">
                {isAr ? 'نقدم حلولاً مخصصة لربط قواعد البيانات وتدريب المستشارين' : 'We offer dedicated integration, custom branding, and hands-on staff training.'}
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/201273949392?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D9%86%D8%AD%D8%AA%D8%A7%D8%AC%20%D8%B9%D8%B1%D8%B6%20%D8%B3%D8%B9%D8%B1%20%D9%84%D8%B4%D8%B1%D9%83%D8%A9%20%D8%B9%D9%82%D8%A7%D8%B1%D9%8A%D8%A9%20%D8%B9%D9%84%D9%89%20J%20Broker%20Assistant"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#201d19] hover:bg-[#2a251e] border border-[#3d3324] text-xs font-bold text-[#e3a23c] flex items-center gap-2 transition-all whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isAr ? 'طلب عرض مخصص للشركات' : 'Get Custom Quote'}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
