import React, { useState, useEffect, useMemo } from 'react';
import { Compound, Currency, Language, FilterState, MainLocation } from './types';
import { initialCompounds, initialLocations } from './data/initialData';
import { normalizeArabic } from './utils/calculator';
import { Header } from './components/Header';
import { SearchAndFilterWidget } from './components/SearchAndFilterWidget';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { UniversalCalculatorModal } from './components/UniversalCalculatorModal';
import { AddEditProjectModal } from './components/AddEditProjectModal';
import { FilterDrawer } from './components/FilterDrawer';
import { UnitTypesModal } from './components/UnitTypesModal';
import { SubscribersModal } from './components/SubscribersModal';
import { LoginModal } from './components/LoginModal';
import { LandingPage } from './components/LandingPage';
import { LocationsManagerModal } from './components/LocationsManagerModal';
import { ProjectCompareModal } from './components/ProjectCompareModal';
import { ManageFeaturedModal } from './components/ManageFeaturedModal';
import { AlertCircle, ArrowLeftRight, Sparkles } from 'lucide-react';

export default function App() {
  // Localization & Currency
  const [currency, setCurrency] = useState<Currency>('EGP');
  const [lang, setLang] = useState<Language>('ar');

  // Navigation View Mode: 'landing' | 'app'
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Data State with Local Storage fallback
  const [compounds, setCompounds] = useState<Compound[]>(() => {
    try {
      const saved = localStorage.getItem('j_broker_compounds');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialCompounds;
  });

  // Locations state with Local Storage persistence for Jean (Owner)
  const [locations, setLocations] = useState<MainLocation[]>(() => {
    try {
      const saved = localStorage.getItem('j_broker_locations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return initialLocations;
  });

  useEffect(() => {
    try {
      localStorage.setItem('j_broker_compounds', JSON.stringify(compounds));
    } catch (e) {
      console.error(e);
    }
  }, [compounds]);

  useEffect(() => {
    try {
      localStorage.setItem('j_broker_locations', JSON.stringify(locations));
    } catch (e) {
      console.error(e);
    }
  }, [locations]);

  // User & Auth State - requires entering email and password to enter
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('j_broker_user_email');
    } catch {
      return null;
    }
  });

  const isAdmin = currentUserEmail?.toLowerCase() === 'jeanhany04@gmail.com';

  const handleLoginDirect = (email: string, pass: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = pass.trim();

    if (!trimmedEmail) {
      return { success: false, error: isAr ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter email' };
    }
    if (!trimmedPass) {
      return { success: false, error: isAr ? 'يرجى إدخال كلمة المرور' : 'Please enter password' };
    }

    // Owner check: jeanhany04@gmail.com
    if (trimmedEmail === 'jeanhany04@gmail.com') {
      if (trimmedPass !== 'admin123' && trimmedPass !== 'jean123' && trimmedPass !== '123456') {
        return { success: false, error: isAr ? 'كلمة المرور غير صحيحة لحساب المالك (Owner)' : 'Incorrect password for Owner' };
      }
      setCurrentUserEmail('jeanhany04@gmail.com');
      try {
        sessionStorage.setItem('j_broker_user_email', 'jeanhany04@gmail.com');
      } catch {}
      setViewMode('app');
      return { success: true };
    }

    // Standard broker check
    if (trimmedPass.length < 4) {
      return { success: false, error: isAr ? 'كلمة المرور يجب ألا تقل عن 4 خانات' : 'Password must be at least 4 characters' };
    }

    setCurrentUserEmail(trimmedEmail);
    try {
      sessionStorage.setItem('j_broker_user_email', trimmedEmail);
    } catch {}
    setViewMode('app');
    return { success: true };
  };

  const handleSignOut = () => {
    setCurrentUserEmail(null);
    try {
      sessionStorage.removeItem('j_broker_user_email');
    } catch {}
    setViewMode('landing');
  };

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    projectType: 'all',
    propertyTypes: [],
    bedrooms: [],
    delivery: [],
    finishing: [],
    minPrice: null,
    maxPrice: null,
    minPricePerMeter: null,
    maxPricePerMeter: null,
    maxDownPayment: null,
    maxMonthlyInstallment: null,
    durationYears: null,
    sortOrder: 'default',
    selectedLocationId: null
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchText: '',
      projectType: 'all',
      propertyTypes: [],
      bedrooms: [],
      delivery: [],
      finishing: [],
      minPrice: null,
      maxPrice: null,
      minPricePerMeter: null,
      maxPricePerMeter: null,
      maxDownPayment: null,
      maxMonthlyInstallment: null,
      durationYears: null,
      sortOrder: 'default',
      selectedLocationId: null
    });
  };

  // Modals & Tools
  const [selectedCompoundForDetail, setSelectedCompoundForDetail] = useState<Compound | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [comparedProjectIds, setComparedProjectIds] = useState<string[]>([]);
  const [isManageFeaturedOpen, setIsManageFeaturedOpen] = useState(false);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingCompound, setEditingCompound] = useState<Compound | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isUnitTypesOpen, setIsUnitTypesOpen] = useState(false);
  const [isSubscribersOpen, setIsSubscribersOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLocationsManagerOpen, setIsLocationsManagerOpen] = useState(false);

  // Featured projects on Landing Page (Persistent so owner/broker can change anytime)
  const [featuredLandingIds, setFeaturedLandingIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('j_broker_featured_landing_ids');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    const defaultFeat = initialCompounds.filter(c => c.isFeatured).map(c => c.id);
    return defaultFeat.length >= 2 ? defaultFeat.slice(0, 3) : initialCompounds.slice(0, 3).map(c => c.id);
  });

  const handleSaveFeaturedLandingIds = (newIds: string[]) => {
    setFeaturedLandingIds(newIds);
    try {
      localStorage.setItem('j_broker_featured_landing_ids', JSON.stringify(newIds));
    } catch (e) {
      console.error(e);
    }
  };

  // Compare handlers
  const handleOpenCompare = (project1Id?: string, project2Id?: string) => {
    if (project1Id) {
      const current = comparedProjectIds.filter(id => id !== project1Id);
      const secondId = project2Id || current[0] || (compounds.find(c => c.id !== project1Id)?.id || compounds[0]?.id || '');
      setComparedProjectIds([project1Id, secondId]);
    } else if (comparedProjectIds.length < 2) {
      setComparedProjectIds([compounds[0]?.id || '', compounds[1]?.id || compounds[0]?.id || '']);
    }
    setIsCompareOpen(true);
  };

  const handleToggleCompare = (compound: Compound) => {
    setComparedProjectIds(prev => {
      if (prev.includes(compound.id)) {
        return prev.filter(id => id !== compound.id);
      } else {
        const updated = [...prev, compound.id];
        if (updated.length >= 2) {
          setIsCompareOpen(true);
        }
        return updated.slice(-2); // keep 2
      }
    });
  };

  // Showcase compounds for the Landing Page
  const showcaseCompounds = useMemo(() => {
    const selected = compounds.filter(c => featuredLandingIds.includes(c.id));
    return selected.length > 0 ? selected : compounds.slice(0, 3);
  }, [compounds, featuredLandingIds]);

  // Filtered & Sorted Compounds
  const filteredCompounds = useMemo(() => {
    return compounds.filter((c) => {
      // 1. Project Type Filter
      if (filters.projectType !== 'all' && c.projectType !== filters.projectType) {
        return false;
      }

      // 2. Search Text
      if (filters.searchText.trim()) {
        const query = normalizeArabic(filters.searchText);
        const searchPool = normalizeArabic(
          `${c.projectName} ${c.companyName} ${c.phaseName || ''} ${c.locationName || ''} ${c.ownerName || ''} ${c.consultant || ''}`
        );
        if (!searchPool.includes(query)) return false;
      }

      // 3. Location Filter (Hierarchy Aware)
      if (filters.selectedLocationId) {
        const matchedMain = locations.find((m) => m.id === filters.selectedLocationId);
        if (matchedMain) {
          // Main region selected: match either main ID, any of its sublocation IDs, or locationName matching
          const subIds = matchedMain.subLocations.map((s) => s.id);
          const isMatch =
            c.locationId === matchedMain.id ||
            subIds.includes(c.locationId) ||
            Boolean(c.locationName && c.locationName.includes(matchedMain.name));
          if (!isMatch) return false;
        } else {
          // Specific sub-location selected
          let isSubMatch = c.locationId === filters.selectedLocationId;
          if (!isSubMatch) {
            let subName = '';
            for (const m of locations) {
              const sub = m.subLocations.find((s) => s.id === filters.selectedLocationId);
              if (sub) {
                subName = sub.name;
                break;
              }
            }
            if (subName && c.locationName && c.locationName.includes(subName)) {
              isSubMatch = true;
            }
          }
          if (!isSubMatch) return false;
        }
      }

      // 4. Delivery Timeline Filter
      if (filters.delivery.length > 0) {
        if (!c.deliveryDate || !filters.delivery.includes(c.deliveryDate)) {
          return false;
        }
      }

      // 5. Finishing Status Filter
      if (filters.finishing.length > 0) {
        if (!c.finishingStatus || !filters.finishing.includes(c.finishingStatus)) {
          return false;
        }
      }

      // 6. Bedroom Count Filter
      if (filters.bedrooms.length > 0) {
        const unitRooms = c.unitTypes.map((u) => String(u.rooms));
        const hasMatchingBed = filters.bedrooms.some((bed) => {
          if (bed === '5+') {
            return c.unitTypes.some((u) => typeof u.rooms === 'number' && u.rooms >= 5);
          }
          return unitRooms.includes(bed);
        });
        if (!hasMatchingBed) return false;
      }

      // 7. Property Types (e.g. apartment, villa, townhouse)
      if (filters.propertyTypes.length > 0) {
        const hasMatchingType = c.unitTypes.some((u) => {
          const lower = (u.bedroomType || '').toLowerCase();
          return filters.propertyTypes.some((pt) => {
            if (pt === 'apartment' && (lower.includes('شقة') || lower.includes('apartment'))) return true;
            if (pt === 'villa' && (lower.includes('فيلا') || lower.includes('villa'))) return true;
            if (pt === 'townhouse' && (lower.includes('تاون') || lower.includes('townhouse'))) return true;
            if (pt === 'twinhouse' && (lower.includes('توين') || lower.includes('twinhouse'))) return true;
            if (pt === 'duplex' && (lower.includes('دوبلكس') || lower.includes('duplex'))) return true;
            if (pt === 'penthouse' && (lower.includes('بنتهاوس') || lower.includes('penthouse'))) return true;
            if (pt === 'studio' && (lower.includes('استوديو') || lower.includes('studio'))) return true;
            if (pt === 'chalet' && (lower.includes('شاليه') || lower.includes('chalet'))) return true;
            if (pt === 'commercial' && (lower.includes('تجاري') || lower.includes('إداري') || lower.includes('commercial'))) return true;
            return false;
          });
        });
        if (!hasMatchingType) return false;
      }

      // 8. Installment Budget Filters
      const prices = c.unitTypes.map((u) => u.price).filter((p) => p && p > 0);
      const minUnit = prices.length > 0 ? Math.min(...prices) : (c.pricePerMeter ? c.pricePerMeter * 100 : 0);

      // Down Payment check
      if (filters.maxDownPayment !== null) {
        const bestPlan = c.paymentPlans[0];
        const dpPercent = bestPlan ? bestPlan.downPaymentPercent : 5;
        const requiredDeposit = minUnit * (dpPercent / 100);
        if (requiredDeposit > filters.maxDownPayment) return false;
      }

      // Monthly Installment check
      if (filters.maxMonthlyInstallment !== null) {
        const bestPlan = c.paymentPlans[0];
        const years = bestPlan ? bestPlan.years : 8;
        const dpPercent = bestPlan ? bestPlan.downPaymentPercent : 5;
        const remaining = minUnit * (1 - dpPercent / 100);
        const monthly = remaining / (years * 12);
        if (monthly > filters.maxMonthlyInstallment) return false;
      }

      // Duration Years check
      if (filters.durationYears !== null) {
        const hasPlanWithYears = c.paymentPlans.some((p) => p.years >= (filters.durationYears || 0));
        if (!hasPlanWithYears) return false;
      }

      // Price Per Meter Range Check (سعر المتر)
      if (filters.minPricePerMeter !== null || filters.maxPricePerMeter !== null) {
        const compPpm = c.pricePerMeter || (c.pricePerMeterMin ? c.pricePerMeterMin : 0);
        if (filters.minPricePerMeter !== null && compPpm < filters.minPricePerMeter) return false;
        if (filters.maxPricePerMeter !== null && compPpm > filters.maxPricePerMeter) return false;
      }

      // Total Unit Price Range Check (إجمالي سعر الوحدة)
      if (filters.minPrice !== null && minUnit < filters.minPrice) return false;
      if (filters.maxPrice !== null && minUnit > filters.maxPrice) return false;

      return true;
    }).sort((a, b) => {
      const getMinPrice = (comp: Compound) => {
        const pr = comp.unitTypes.map((u) => u.price).filter((p) => p && p > 0);
        return pr.length > 0 ? Math.min(...pr) : 0;
      };

      if (filters.sortOrder === 'price_asc') {
        return getMinPrice(a) - getMinPrice(b);
      }
      if (filters.sortOrder === 'price_desc') {
        return getMinPrice(b) - getMinPrice(a);
      }
      if (filters.sortOrder === 'lowest_monthly') {
        const getMonthly = (comp: Compound) => {
          const pr = getMinPrice(comp);
          const plan = comp.paymentPlans[0] || { years: 8, downPaymentPercent: 5 };
          return (pr * (1 - plan.downPaymentPercent / 100)) / (plan.years * 12);
        };
        return getMonthly(a) - getMonthly(b);
      }
      if (filters.sortOrder === 'lowest_deposit') {
        const getDeposit = (comp: Compound) => {
          const pr = getMinPrice(comp);
          const plan = comp.paymentPlans[0] || { downPaymentPercent: 5 };
          return pr * (plan.downPaymentPercent / 100);
        };
        return getDeposit(a) - getDeposit(b);
      }
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [compounds, filters, locations]);

  const handleSaveCompound = (compound: Compound) => {
    setCompounds((prev) => {
      const exists = prev.some((c) => c.id === compound.id);
      if (exists) {
        return prev.map((c) => (c.id === compound.id ? compound : c));
      }
      return [compound, ...prev];
    });
  };

  const handleDeleteCompound = (id: string) => {
    setCompounds((prev) => prev.filter((c) => c.id !== id));
  };

  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen bg-[#0b0a09] text-[#f5f1ea] flex flex-col selection:bg-[#e3a23c]/30 selection:text-white">
      
      {viewMode === 'landing' ? (
        <LandingPage
          onEnterApp={() => {
            if (!currentUserEmail) {
              setIsLoginOpen(true);
            } else {
              setViewMode('app');
            }
          }}
          onLoginDirect={handleLoginDirect}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          currency={currency}
          setCurrency={setCurrency}
          lang={lang}
          setLang={setLang}
          featuredCompounds={showcaseCompounds}
          currentUserEmail={currentUserEmail}
          isAdmin={isAdmin}
        />
      ) : (
        <>
          {/* Top Header */}
          <Header
            currency={currency}
            setCurrency={setCurrency}
            lang={lang}
            setLang={setLang}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onOpenCompare={() => handleOpenCompare()}
            onOpenManageFeatured={() => setIsManageFeaturedOpen(true)}
            onOpenAddProject={() => {
              setEditingCompound(null);
              setIsAddEditOpen(true);
            }}
            onOpenUnitTypes={() => setIsUnitTypesOpen(true)}
            onOpenLocationsManager={() => setIsLocationsManagerOpen(true)}
            onOpenSubscribers={() => setIsSubscribersOpen(true)}
            onOpenExcelImport={() => {
              alert(isAr ? 'يرجى اختيار ملف الإكسيل (.xlsx) للاستيراد السريع' : 'Select an Excel file to import');
            }}
            onOpenLogin={() => setIsLoginOpen(true)}
            onGoToLanding={() => setViewMode('landing')}
            isAdmin={isAdmin}
            currentUserEmail={currentUserEmail}
            onSignOut={handleSignOut}
          />

          {/* Search & Filter Widget (Hierarchical Regions & Clean View) */}
          <SearchAndFilterWidget
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            currency={currency}
            lang={lang}
            locations={locations}
            totalResults={filteredCompounds.length}
            onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
            onOpenLocationsManager={() => setIsLocationsManagerOpen(true)}
            isAdmin={isAdmin}
          />

          {/* Projects Grid Section */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 w-full">
            
            {filteredCompounds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {filteredCompounds.map((compound) => (
                  <ProjectCard
                    key={compound.id}
                    compound={compound}
                    currency={currency}
                    lang={lang}
                    onViewDetails={(comp) => setSelectedCompoundForDetail(comp)}
                    onToggleCompare={handleToggleCompare}
                    isCompared={comparedProjectIds.includes(compound.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 rounded-3xl bg-[#14120f] border border-[#2a251e] max-w-xl mx-auto space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#1e1a14] border border-[#3d3324] flex items-center justify-center text-[#e3a23c]">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-extrabold text-white">
                  {isAr ? 'لم نجد مشروعات مطابقة لمعايير البحث' : 'No matching projects found'}
                </h3>
                <p className="text-xs text-[#9c9284] max-w-sm mx-auto leading-relaxed">
                  {isAr
                    ? 'جرب زيادة سقف القسط الشهري أو المقدم، أو قم بمسح الفلاتر لعرض كل المشروعات المتاحة.'
                    : 'Try adjusting your monthly installment or down payment budget, or clear filters to view all projects.'}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="py-2.5 px-6 rounded-full bg-[#e3a23c] text-black font-extrabold text-xs shadow-sm hover:brightness-110 transition-all"
                >
                  {isAr ? 'مسح كل الفلاتر وعرض الكل' : 'Clear Filters & Show All'}
                </button>
              </div>
            )}

            {/* Floating Comparison Drawer / Quick Trigger */}
            {comparedProjectIds.length > 0 && (
              <div className="fixed bottom-6 end-6 z-30 flex items-center gap-3 p-3 px-4 rounded-2xl bg-[#181410] border border-[#e3a23c]/40 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(227,162,60,0.2)] animate-in fade-in slide-in-from-bottom-3 duration-200">
                <div className="w-8 h-8 rounded-xl bg-[#e3a23c] text-black flex items-center justify-center font-bold shadow-sm">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white">
                    {isAr ? `مقارنة المشروعات (${comparedProjectIds.length}/2)` : `Compare (${comparedProjectIds.length}/2)`}
                  </span>
                  <span className="text-[10px] text-[#9c9284]">
                    {comparedProjectIds.length === 1 
                      ? (isAr ? 'اختر مشروعاً ثانياً للمقارنة' : 'Select a 2nd project') 
                      : (isAr ? 'المشروعان جاهزان للمقارنة' : 'Ready to compare')}
                  </span>
                </div>
                <button
                  onClick={() => setIsCompareOpen(true)}
                  className="ms-2 px-3 py-1.5 rounded-xl bg-[#e3a23c] hover:bg-[#c98a28] text-black text-xs font-black transition-all shadow-sm"
                >
                  {isAr ? 'فتح المقارنة' : 'Open Compare'}
                </button>
                <button
                  onClick={() => setComparedProjectIds([])}
                  className="text-xs text-[#756b5a] hover:text-white px-1"
                  title={isAr ? 'إلغاء' : 'Clear'}
                >
                  ✕
                </button>
              </div>
            )}

          </main>

          {/* Footer */}
          <footer className="border-t border-[#262422] bg-[#0d0c0a] py-8 text-center text-xs text-[#756b5a]">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#e3a23c] flex items-center justify-center text-black font-black text-xs">
                  J
                </div>
                <span className="font-extrabold text-[#f5f1ea]">J BROKER ASSISTANT</span>
                <span className="text-[#5c5447]">|</span>
                <span>{isAr ? 'منظومة خطط السداد وإدارة المشروعات العقارية' : 'Real Estate Installment & Project Engine'}</span>
              </div>
              <div>
                © {new Date().getFullYear()} J Broker Assistant. {isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Modals */}
      <ProjectDetailModal
        compound={selectedCompoundForDetail}
        isOpen={!!selectedCompoundForDetail}
        onClose={() => setSelectedCompoundForDetail(null)}
        currency={currency}
        lang={lang}
        onEdit={(comp) => {
          setSelectedCompoundForDetail(null);
          setEditingCompound(comp);
          setIsAddEditOpen(true);
        }}
        onDelete={(id) => handleDeleteCompound(id)}
        isAdmin={isAdmin}
      />

      <UniversalCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        currency={currency}
        lang={lang}
      />

      <AddEditProjectModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingCompound(null);
        }}
        onSave={handleSaveCompound}
        editingCompound={editingCompound}
        locations={locations}
        lang={lang}
      />

      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        lang={lang}
        currency={currency}
      />

      <LocationsManagerModal
        isOpen={isLocationsManagerOpen}
        onClose={() => setIsLocationsManagerOpen(false)}
        locations={locations}
        onSaveLocations={(newLocs) => setLocations(newLocs)}
        lang={lang}
      />

      <UnitTypesModal
        isOpen={isUnitTypesOpen}
        onClose={() => setIsUnitTypesOpen(false)}
        lang={lang}
      />

      <SubscribersModal
        isOpen={isSubscribersOpen}
        onClose={() => setIsSubscribersOpen(false)}
        lang={lang}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        lang={lang}
        onLoginSuccess={(email) => {
          setCurrentUserEmail(email);
          try {
            sessionStorage.setItem('j_broker_user_email', email);
          } catch {}
          setViewMode('app');
          setIsLoginOpen(false);
        }}
        currentUserEmail={currentUserEmail}
        onSignOut={handleSignOut}
      />

      <ProjectCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        compounds={compounds}
        initialProjectIds={comparedProjectIds}
        currency={currency}
        lang={lang}
      />

      <ManageFeaturedModal
        isOpen={isManageFeaturedOpen}
        onClose={() => setIsManageFeaturedOpen(false)}
        compounds={compounds}
        selectedFeaturedIds={featuredLandingIds}
        onSaveFeaturedIds={handleSaveFeaturedLandingIds}
        lang={lang}
      />

    </div>
  );
}
