import React, { useState } from 'react';
import { Compound, Currency, Language } from '../types';
import { formatPrice } from '../utils/calculator';
import { PricingSection } from './PricingSection';
import { JLogo } from './JLogo';
import { 
  Building2, 
  Globe, 
  DollarSign, 
  Calculator, 
  LogIn, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenLogin: () => void;
  onOpenCalculator: () => void;
  onLoginDirect: (email: string, pass: string) => { success: boolean; error?: string };
  currency: Currency;
  setCurrency: (c: Currency) => void;
  lang: Language;
  setLang: (l: Language) => void;
  featuredCompounds: Compound[];
  currentUserEmail: string | null;
  isAdmin?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenLogin,
  onOpenCalculator,
  onLoginDirect,
  currency,
  setCurrency,
  lang,
  setLang,
  featuredCompounds,
  currentUserEmail,
  isAdmin = false
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = onLoginDirect(emailInput, passInput);
    if (!res.success) {
      setLoginError(res.error || (isAr ? 'فشل تسجيل الدخول، تحقق من البيانات' : 'Login failed'));
    }
  };

  const developers = [
    'Emaar Misr', 'SODIC', 'Palm Hills', 'Mountain View', 'TMG', 
    'ORA Developers', 'Tatweer Misr', 'Misr Italia', 'Hassan Allam', 'Al Ahly Sabbour'
  ];

  return (
    <div className="min-h-screen bg-[#0d0b09] text-[#f5f1ea] selection:bg-[#e3a23c]/30 selection:text-white flex flex-col">
      
      {/* 1. Top Navigation Bar - Luxury Gold & Warm Dark */}
      <nav className="sticky top-0 z-40 bg-[#120f0d]/90 backdrop-blur-md border-b border-[#262018]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Logo with J Emblem and Gold Installments Tag */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={onEnterApp}>
            <JLogo variant="inline" />
          </div>

          {/* Quick Menu Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#c7bfb4]">
            <a href="#projects" className="hover:text-[#e3a23c] transition-colors">
              {isAr ? 'المميزات' : 'Features'}
            </a>
            <a href="#pricing" className="hover:text-[#e3a23c] transition-colors font-bold text-white flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#e3a23c]" />
              <span>{isAr ? 'الاشتراكات' : 'Subscriptions'}</span>
            </a>
            <button
              onClick={onOpenCalculator}
              className="hover:text-[#e3a23c] transition-colors flex items-center gap-1"
            >
              <Calculator className="w-3.5 h-3.5 text-[#e3a23c]" />
              <span>{isAr ? 'حاسبة الأقساط' : 'Calculator'}</span>
            </button>
          </div>

          {/* Actions: Currency, Language & Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Currency Switcher */}
            <button
              onClick={() => setCurrency(currency === 'EGP' ? 'USD' : 'EGP')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#181410] hover:bg-[#221c16] border border-[#33271b] text-xs font-bold text-[#f5f1ea] transition-all hover:border-[#e3a23c]"
              title={isAr ? 'تغيير العملة' : 'Switch Currency'}
            >
              <DollarSign className="w-3.5 h-3.5 text-[#e3a23c]" />
              <span>{currency}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#181410] hover:bg-[#221c16] border border-[#33271b] text-xs font-bold text-[#f5f1ea] transition-all hover:border-[#e3a23c]"
              title={isAr ? 'تغيير اللغة' : 'Switch Language'}
            >
              <Globe className="w-3.5 h-3.5 text-[#e3a23c]" />
              <span>AR/EN</span>
            </button>

            {/* Portal Entry / Login CTA - Gold Pill Button */}
            {currentUserEmail ? (
              <button
                onClick={onEnterApp}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#e3a23c] hover:bg-[#c98a28] text-xs font-black text-black transition-all shadow-[0_0_15px_rgba(227,162,60,0.3)]"
              >
                <span>{isAr ? 'دخول المنصة' : 'Enter Portal'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#e3a23c] hover:bg-[#c98a28] text-xs font-black text-black transition-all shadow-[0_0_15px_rgba(227,162,60,0.3)]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            )}

          </div>

        </div>
      </nav>

      {/* 2. Hero Section - Luxury Gold & Dark Elegance */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#262018] bg-radial from-[#221a11] via-[#120f0d] to-[#0a0907]">
        
        {/* Soft Golden Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-[#e3a23c]/10 blur-[130px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* Authentic Centerpiece Logo: J BROKER ASSISTANT */}
          <div className="mb-6 w-full flex justify-center">
            <JLogo variant="hero" size="xl" />
          </div>

          {/* Subtitle text */}
          <p className="text-sm sm:text-base text-[#c7bfb4] max-w-2xl mx-auto leading-relaxed mb-8 font-medium">
            {isAr
              ? 'نظام سحابي متكامل لإدارة المشروعات العقارية، خطط السداد، الحاسبات الذكية، واستخراج الملفات وعروض الأسعار بضغطة زر. صُمم خصيصاً للوسطاء العقاريين المحترفين.'
              : 'A comprehensive cloud platform for managing real estate compounds, payment plans, smart calculators, and one-click proposal generation. Built for professional brokers.'}
          </p>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full">
            <button
              onClick={currentUserEmail ? onEnterApp : onOpenLogin}
              className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-[#e3a23c] hover:bg-[#c98a28] text-black font-extrabold text-sm sm:text-base shadow-[0_0_25px_rgba(227,162,60,0.35)] hover:shadow-[0_0_35px_rgba(227,162,60,0.5)] transition-all flex items-center justify-center gap-2"
            >
              <span>{isAr ? 'ابدأ الآن وتصفح المشروعات' : 'Get Started Now'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Login Card on Landing Page */}
          <div className="w-full max-w-md p-5 sm:p-6 rounded-3xl bg-[#14110e]/95 border border-[#2d251a] shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-start">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#262017]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#e3a23c]/15 border border-[#e3a23c]/30 flex items-center justify-center text-[#e3a23c]">
                  <LogIn className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-white">
                    {isAr ? 'تسجيل الدخول السريع للمنصة' : 'Direct Portal Sign In'}
                  </h3>
                  <p className="text-[10px] text-[#756b5a]">
                    {isAr ? 'أدخل بيانات حسابك للدخول للمنظومة' : 'Enter your credentials to enter'}
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono-num font-bold px-2 py-0.5 rounded-md bg-[#221c13] border border-[#e3a23c]/30 text-[#e3a23c]">
                SECURE
              </span>
            </div>

            <form onSubmit={handleQuickLogin} className="space-y-3">
              {loginError && (
                <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-[#9c9284] block mb-1">
                  {isAr ? 'البريد الإلكتروني (Email)' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setLoginError(null);
                  }}
                  placeholder="name@example.com"
                  required
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0d0b09] border border-[#2d251a] text-xs font-mono-num text-white focus:outline-none focus:border-[#e3a23c]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#9c9284] block mb-1">
                  {isAr ? 'كلمة المرور (Password)' : 'Password'}
                </label>
                <input
                  type="password"
                  value={passInput}
                  onChange={(e) => {
                    setPassInput(e.target.value);
                    setLoginError(null);
                  }}
                  placeholder="••••••••"
                  required
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0d0b09] border border-[#2d251a] text-xs font-mono-num text-white focus:outline-none focus:border-[#e3a23c]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#e3a23c] hover:bg-[#c98a28] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(227,162,60,0.25)] transition-all"
              >
                <span>{isAr ? 'تسجيل الدخول والدخول للمنظومة 🚀' : 'Sign In & Enter Dashboard 🚀'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 3. Developer Partners Ribbon */}
      <section className="py-6 border-b border-[#262018] bg-[#0f0d0a] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-xs font-bold text-[#756b5a] mb-4 uppercase tracking-wider">
            {isAr ? 'تغطية معتمدة لأهم المطورين العقاريين في مصر' : 'Coverage of Top Real Estate Developers'}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {developers.map((dev, i) => (
              <div
                key={i}
                className="px-3.5 py-1.5 rounded-lg bg-[#181410] border border-[#2d251a] text-xs font-bold text-[#9c9284] hover:text-[#e3a23c] hover:border-[#3d3324] transition-all cursor-default"
              >
                {dev}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Showcase Projects (Curated for Visitors with Admin Control) */}
      <section id="projects" className="py-16 sm:py-20 border-b border-[#262018] bg-[#0c0a08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e3a23c]/15 border border-[#e3a23c]/30 text-[#e3a23c] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'مشروعات مختارة للعرض' : 'Featured Showcase'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isAr ? 'عينة من مشروعات المنظومة وخطط السداد' : 'Featured Compounds & Live Payment Plans'}
              </h3>
              <p className="text-xs sm:text-sm text-[#9c9284] mt-1">
                {isAr 
                  ? 'نماذج لمشروعات حقيقية يمكنك تصفح تفاصيلها بالكامل فور الدخول' 
                  : 'Live preview of curated compounds available with full plans in your portal'}
              </p>
            </div>

            <div>
              {/* Enter app link */}
              <button
                onClick={onEnterApp}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#e3a23c] hover:bg-[#c98a28] text-black text-xs font-extrabold shadow-sm transition-all"
              >
                <span>{isAr ? 'عرض كافة المشروعات (500+)' : 'View All 500+ Projects'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Cards Grid - 3 projects side by side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCompounds.slice(0, 3).map((comp) => {
              const prices = comp.unitTypes.map(u => u.price).filter(p => p && p > 0);
              const minPrice = prices.length > 0 ? Math.min(...prices) : (comp.pricePerMeter ? comp.pricePerMeter * 100 : 0);
              const bestPlan = comp.paymentPlans[0] || { downPaymentPercent: 5, years: 8 };
              const deposit = minPrice * (bestPlan.downPaymentPercent / 100);
              const monthly = Math.round((minPrice - deposit) / (bestPlan.years * 12));

              return (
                <div
                  key={comp.id}
                  className="rounded-3xl bg-[#14110e] border border-[#2a241b] hover:border-[#e3a23c]/60 p-5 sm:p-6 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(227,162,60,0.15)] transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#1e1913] text-[#e3a23c] border border-[#382d20]">
                        <MapPin className="w-3 h-3 inline me-1" />
                        {comp.locationName || 'موقع متميز'}
                      </span>
                      <span className="text-[11px] text-[#9c9284] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#e3a23c]" />
                        {comp.deliveryDate === 'immediate' ? (isAr ? 'استلام فوري' : 'Ready') : (isAr ? `استلام ${comp.deliveryDate}` : comp.deliveryDate)}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-extrabold text-white line-clamp-1">
                      {comp.projectName}
                    </h4>
                    <p className="text-xs text-[#9c9284] line-clamp-1 mb-3">
                      {comp.companyName}
                    </p>

                    {/* Quick Units list */}
                    {comp.unitTypes && comp.unitTypes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {comp.unitTypes.slice(0, 2).map((u, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#1c1813] border border-[#2d251a] text-[#c7bfb4]">
                            {u.bedroomType.split('(')[0]} ({u.area}م²)
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price Block */}
                    <div className="p-3.5 rounded-2xl bg-[#0e0c0a] border border-[#262017] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#756b5a]">{isAr ? 'يبدأ من:' : 'Starting:'}</span>
                        <span className="text-sm font-black text-[#e3a23c] font-mono-num">
                          {formatPrice(minPrice, currency, lang)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#756b5a]">{isAr ? 'مقدم الحجز:' : 'Deposit:'}</span>
                        <span className="font-bold text-emerald-400 font-mono-num">
                          {bestPlan.downPaymentPercent}% ({formatPrice(deposit, currency, lang)})
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#756b5a]">{isAr ? 'القسط الشهري:' : 'Monthly:'}</span>
                        <span className="font-bold text-white font-mono-num">
                          ~{formatPrice(monthly, currency, lang)} / {isAr ? 'شهر' : 'mo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onEnterApp}
                      className="w-full py-2.5 rounded-xl bg-[#e3a23c] hover:bg-[#c98a28] text-black font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>{isAr ? 'عرض التفاصيل والخطط' : 'View Full Plans'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Pricing & Subscription Plans Section */}
      <PricingSection lang={lang} currency={currency} />

      {/* 6. Call to Action Banner */}
      <section className="py-16 bg-gradient-to-t from-[#16120d] to-[#0c0a08] border-b border-[#262018]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {isAr ? 'جاهز لتسريع مبيعاتك وحساباتك العقارية؟' : 'Ready to streamline your real estate workflow?'}
          </h2>
          <p className="text-xs sm:text-sm text-[#9c9284] max-w-xl mx-auto leading-relaxed">
            {isAr
              ? 'انضم لمنظومة الوسطاء المعتمدة واحصل على وصول فوري لأحدث المشروعات، خطط السداد، والحاسبات السحابية.'
              : 'Join the premier real estate brokerage portal with direct developer installment formulas and client-ready proposals.'}
          </p>
          <div className="pt-2">
            <button
              onClick={currentUserEmail ? onEnterApp : onOpenLogin}
              className="px-8 py-3.5 rounded-full bg-[#e3a23c] hover:bg-[#c98a28] text-black font-extrabold text-sm sm:text-base shadow-[0_0_25px_rgba(227,162,60,0.35)] transition-all"
            >
              {isAr ? 'ابدأ الآن وتصفح المنصة 🚀' : 'Get Started & Enter Platform 🚀'}
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="py-8 bg-[#080706] text-[#756b5a] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <JLogo size="sm" variant="mark" />
            <span className="text-[11px] text-[#756b5a]">© {new Date().getFullYear()} J Broker Assistant. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>{isAr ? 'القاهرة الجديدة، التجمع الخامس' : 'New Cairo, Egypt'}</span>
            <span>•</span>
            <span className="text-[#e3a23c]">{isAr ? 'دعم فني مباشر على الواتساب' : 'WhatsApp Support'}</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
