import React from 'react';
import { Currency, Language } from '../types';
import { JLogo } from './JLogo';
import { Building2, Globe, DollarSign, Calculator, Plus, Sliders, Users, FileSpreadsheet, LogIn, Home, MapPin, ArrowLeftRight, Sparkles } from 'lucide-react';

interface HeaderProps {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  lang: Language;
  setLang: (l: Language) => void;
  onOpenCalculator: () => void;
  onOpenCompare?: () => void;
  onOpenManageFeatured?: () => void;
  onOpenAddProject: () => void;
  onOpenUnitTypes: () => void;
  onOpenLocationsManager?: () => void;
  onOpenSubscribers: () => void;
  onOpenExcelImport: () => void;
  onOpenLogin: () => void;
  onGoToLanding?: () => void;
  isAdmin?: boolean;
  currentUserEmail?: string | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  setCurrency,
  lang,
  setLang,
  onOpenCalculator,
  onOpenCompare,
  onOpenManageFeatured,
  onOpenAddProject,
  onOpenUnitTypes,
  onOpenLocationsManager,
  onOpenSubscribers,
  onOpenExcelImport,
  onOpenLogin,
  onGoToLanding,
  isAdmin = true,
  currentUserEmail,
  onSignOut
}) => {
  const isAr = lang === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-[#0d0c0a]/90 backdrop-blur-md border-b border-[#262422]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand Logo with Luxury Gold Emblem */}
          <div 
            onClick={onGoToLanding}
            className="flex items-center gap-3 cursor-pointer group"
            title={isAr ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
          >
            <JLogo variant="inline" />
          </div>

          {/* Controls: Currency, Language & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Landing Page Button */}
            {onGoToLanding && (
              <button
                onClick={onGoToLanding}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161412] hover:bg-[#201d19] border border-[#2a251e] text-xs font-bold text-[#c7bfb4] hover:text-[#e3a23c] hover:border-[#e3a23c] transition-all"
                title={isAr ? 'الرئيسية' : 'Home'}
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isAr ? 'الرئيسية' : 'Landing'}</span>
              </button>
            )}

            {/* Currency Switcher */}
            <button
              onClick={() => setCurrency(currency === 'EGP' ? 'USD' : 'EGP')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161412] hover:bg-[#201d19] border border-[#2a251e] text-xs font-bold text-[#f5f1ea] transition-all hover:border-[#e3a23c]"
              title={isAr ? 'تغيير العملة' : 'Switch Currency'}
            >
              <DollarSign className="w-3.5 h-3.5 text-[#e3a23c]" />
              <span>{currency}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161412] hover:bg-[#201d19] border border-[#2a251e] text-xs font-bold text-[#f5f1ea] transition-all hover:border-[#e3a23c]"
              title={isAr ? 'تغيير اللغة' : 'Switch Language'}
            >
              <Globe className="w-3.5 h-3.5 text-[#e3a23c]" />
              <span>{isAr ? 'English' : 'عربي'}</span>
            </button>

            {/* Project Comparison Button */}
            {onOpenCompare && (
              <button
                onClick={onOpenCompare}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1c1813] hover:bg-[#252019] border border-[#3d3324] text-xs font-bold text-[#e3a23c] hover:text-white transition-all shadow-sm"
                title={isAr ? 'مقارنة المشروعات العقارية' : 'Compare Projects'}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'مقارنة المشروعات' : 'Compare'}</span>
              </button>
            )}

            {/* Quick Calculator Action */}
            <button
              onClick={onOpenCalculator}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1b1712] hover:bg-[#252019] border border-[#3d3324] text-xs font-bold text-[#e3a23c] transition-all shadow-sm"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{isAr ? 'حاسبة الأقساط' : 'Calculator'}</span>
            </button>

            {/* Manage Landing Showcase (Admin) */}
            {isAdmin && onOpenManageFeatured && (
              <button
                onClick={onOpenManageFeatured}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c1914] hover:bg-[#292218] border border-[#3d3324] text-xs font-bold text-[#e3a23c] transition-all shadow-sm"
                title={isAr ? 'تحديد المشروعات المعروضة في الصفحة الرئيسية' : 'Manage Landing Showcase'}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'مشروعات الواجهة' : 'Showcase'}</span>
              </button>
            )}

            {/* Add Project (Admin) */}
            {isAdmin && (
              <button
                onClick={onOpenAddProject}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#e3a23c] to-[#c98a2c] hover:brightness-110 text-xs font-extrabold text-[#14120f] transition-all shadow-[0_0_12px_rgba(227,162,60,0.25)]"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{isAr ? 'إضافة مشروع' : 'Add Project'}</span>
              </button>
            )}

            {/* User Account / Login & Sign Out */}
            {currentUserEmail ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c1813] hover:bg-[#262018] border border-[#3d3324] text-xs font-bold text-white transition-all"
                  title={currentUserEmail}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="max-w-[100px] truncate text-[11px] font-mono-num">{currentUserEmail.split('@')[0]}</span>
                </button>
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="p-2 rounded-full bg-[#161412] hover:bg-red-950/50 border border-[#2a251e] text-[#9c9284] hover:text-red-400 transition-all"
                    title={isAr ? 'تسجيل الخروج' : 'Sign Out'}
                  >
                    <LogIn className="w-4 h-4 rotate-180" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161412] hover:bg-[#221e19] border border-[#2a251e] text-xs font-bold text-[#e3a23c] transition-all"
                title={isAr ? 'تسجيل الدخول' : 'Sign In'}
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">{isAr ? 'دخول' : 'Sign In'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-bar with secondary admin shortcuts */}
        {isAdmin && (
          <div className="py-2.5 border-t border-[#1f1c18] flex items-center justify-between gap-2 overflow-x-auto text-xs scrollbar-none">
            <div className="flex items-center gap-2">
              {onOpenLocationsManager && (
                <button
                  onClick={onOpenLocationsManager}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#14120f] hover:bg-[#1f1b16] border border-[#262422] text-[#c7bfb4] hover:text-[#e3a23c] transition-all font-bold"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#e3a23c]" />
                  <span>{isAr ? 'إدارة المناطق والمواقع 📍' : 'Locations & Districts'}</span>
                </button>
              )}

              <button
                onClick={onOpenUnitTypes}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#14120f] hover:bg-[#1f1b16] border border-[#262422] text-[#c7bfb4] hover:text-[#e3a23c] transition-all"
              >
                <Sliders className="w-3.5 h-3.5 text-[#e3a23c]" />
                <span>{isAr ? 'إدارة أنواع الوحدات' : 'Unit Types'}</span>
              </button>
              
              <button
                onClick={onOpenSubscribers}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#14120f] hover:bg-[#1f1b16] border border-[#262422] text-[#c7bfb4] hover:text-[#e3a23c] transition-all"
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>{isAr ? 'إدارة المشتركين' : 'Subscribers'}</span>
              </button>

              <button
                onClick={onOpenExcelImport}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#14120f] hover:bg-[#1f1b16] border border-[#262422] text-[#c7bfb4] hover:text-emerald-400 transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'استيراد إكسيل' : 'Excel Import'}</span>
              </button>
            </div>

            <div className="text-[11px] text-[#756b5a] hidden lg:block font-medium">
              {isAr ? 'لوحة تحكم جان (المالك) — تحكم كامل بالمشروعات والمناطق والوحدات' : 'Jean (Owner) Control Panel — Full Data Management'}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
