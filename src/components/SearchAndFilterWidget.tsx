import React, { useState } from 'react';
import { Currency, Language, FilterState, MainLocation } from '../types';
import { Search, X, SlidersHorizontal, MapPin, ChevronDown, ChevronRight, Settings, RotateCcw, ArrowLeftRight } from 'lucide-react';

interface SearchAndFilterWidgetProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  currency: Currency;
  lang: Language;
  locations: MainLocation[];
  totalResults: number;
  onOpenFilterDrawer: () => void;
  onOpenCompare?: () => void;
  onOpenLocationsManager?: () => void;
  isAdmin?: boolean;
}

export const SearchAndFilterWidget: React.FC<SearchAndFilterWidgetProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  currency,
  lang,
  locations,
  totalResults,
  onOpenFilterDrawer,
  onOpenCompare,
  onOpenLocationsManager,
  isAdmin = true
}) => {
  const isAr = lang === 'ar';

  // State to track which main region's sub-regions are expanded (starts null so nothing shows below until user clicks a region)
  const [expandedMainLocId, setExpandedMainLocId] = useState<string | null>(null);

  // Active filter count for badge
  const activeFiltersCount = [
    filters.propertyTypes.length,
    filters.bedrooms.length,
    filters.delivery.length,
    filters.minPricePerMeter || filters.maxPricePerMeter ? 1 : 0,
    filters.minPrice || filters.maxPrice ? 1 : 0,
    filters.maxDownPayment ? 1 : 0,
    filters.maxMonthlyInstallment ? 1 : 0,
    filters.durationYears ? 1 : 0,
    filters.finishing.length
  ].reduce((a, b) => a + b, 0);

  // Find currently selected location label
  let selectedLocationLabel = '';
  if (filters.selectedLocationId) {
    for (const main of locations) {
      if (main.id === filters.selectedLocationId) {
        selectedLocationLabel = main.name;
        break;
      }
      const sub = main.subLocations.find(s => s.id === filters.selectedLocationId);
      if (sub) {
        selectedLocationLabel = `${main.name} ➔ ${sub.name}`;
        break;
      }
    }
  }

  const toggleExpand = (locId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // don't trigger selection if arrow clicked
    setExpandedMainLocId(prev => (prev === locId ? null : locId));
  };

  const selectMainLocation = (mainId: string) => {
    const isCurrentlyActive = filters.selectedLocationId === mainId || 
      locations.find(m => m.id === mainId)?.subLocations.some(s => s.id === filters.selectedLocationId);

    if (isCurrentlyActive) {
      onFilterChange({ selectedLocationId: null });
      setExpandedMainLocId(null);
    } else {
      onFilterChange({ selectedLocationId: mainId });
      setExpandedMainLocId(mainId);
    }
  };

  const selectSubLocation = (subId: string) => {
    if (filters.selectedLocationId === subId) {
      onFilterChange({ selectedLocationId: null });
      setExpandedMainLocId(null);
    } else {
      onFilterChange({ selectedLocationId: subId });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative z-20">
      
      {/* Main Glass Search Card */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#14120f]/95 border border-[#2a251e] shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl space-y-5">
        
        {/* Top Search Input Row */}
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-[#756b5a]">
            <Search className="w-5 h-5 text-[#e3a23c]" />
          </div>
          <input
            type="text"
            value={filters.searchText}
            onChange={(e) => onFilterChange({ searchText: e.target.value })}
            placeholder={
              isAr
                ? 'ابحث باسم المشروع، المطور، المالك، المنطقة، أو الاستشاري...'
                : 'Search by project name, developer, district, or consultant...'
            }
            className="w-full ps-11 pe-28 py-3.5 rounded-2xl bg-[#0e0d0b] border border-[#262422] text-[#f5f1ea] placeholder-[#5c5447] text-sm focus:outline-none focus:border-[#e3a23c] focus:ring-1 focus:ring-[#e3a23c] transition-all"
          />
          <div className="absolute inset-y-0 end-0 flex items-center pe-2 gap-1.5">
            {filters.searchText && (
              <button
                onClick={() => onFilterChange({ searchText: '' })}
                className="p-1.5 rounded-full hover:bg-[#201d19] text-[#756b5a] hover:text-white transition-all"
                title={isAr ? 'مسح البحث' : 'Clear search'}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onOpenFilterDrawer}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1f1b16] hover:bg-[#2c261e] border border-[#3d3324] text-xs font-bold text-[#e3a23c] transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isAr ? 'الفلاتر' : 'Filters'}</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#e3a23c] text-black text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {onOpenCompare && (
              <button
                onClick={onOpenCompare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1f1b16] hover:bg-[#2c261e] border border-[#3d3324] hover:border-[#e3a23c] text-xs font-bold text-[#e3a23c] transition-all shadow-sm"
                title={isAr ? 'مقارنة المشروعات العقارية' : 'Compare Projects'}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>{isAr ? 'مقارنة المشروعات' : 'Compare'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Region & District Hierarchical Selector */}
        <div className="space-y-3 pt-1 border-t border-[#201d19]/80">
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#e3a23c]" />
              <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                {isAr ? 'تصفية حسب المنطقة والموقع الجغرافي:' : 'Filter by Location & District:'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && onOpenLocationsManager && (
                <button
                  onClick={onOpenLocationsManager}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1a1713] hover:bg-[#26211a] border border-[#3a3022] text-[11px] font-bold text-[#e3a23c] transition-all"
                  title={isAr ? 'إدارة وتقسيم المناطق الجغرافية' : 'Manage Regions & Sub-regions'}
                >
                  <Settings className="w-3 h-3" />
                  <span>{isAr ? 'إدارة وتقسيم المناطق ⚙️' : 'Manage Regions'}</span>
                </button>
              )}

              {filters.selectedLocationId && (
                <button
                  onClick={() => {
                    onFilterChange({ selectedLocationId: null });
                    setExpandedMainLocId(null);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#9c9284] hover:text-[#e3a23c]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isAr ? 'عرض كل المناطق' : 'All Regions'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Regions Tabs with Expand Arrow (Sahm) */}
          <div className="flex flex-wrap gap-2 items-center">
            
            {/* "All Areas" Button */}
            <button
              onClick={() => {
                onFilterChange({ selectedLocationId: null });
                setExpandedMainLocId(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                !filters.selectedLocationId
                  ? 'bg-[#e3a23c] text-black border-[#e3a23c] shadow-sm'
                  : 'bg-[#181511] text-[#9c9284] border-[#2a251e] hover:border-[#e3a23c]/50 hover:text-white'
              }`}
            >
              {isAr ? 'جميع المناطق' : 'All Areas'}
            </button>

            {/* Each Main Region Button with Chevron Arrow next to it */}
            {locations.map((main) => {
              const isSelected = filters.selectedLocationId === main.id || 
                main.subLocations.some(s => s.id === filters.selectedLocationId);
              const isExpanded = expandedMainLocId === main.id;

              return (
                <div
                  key={main.id}
                  className={`inline-flex items-stretch rounded-xl border transition-all overflow-hidden ${
                    isSelected
                      ? 'bg-[#e3a23c] text-black border-[#e3a23c] shadow-sm font-black'
                      : 'bg-[#181511] text-[#c7bfb4] border-[#2a251e] hover:border-[#e3a23c]/50'
                  }`}
                >
                  {/* Main Region Name Clickable */}
                  <button
                    onClick={() => selectMainLocation(main.id)}
                    className="px-3 py-2 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>{main.name}</span>
                  </button>

                  {/* Arrow Button (Sahm) to expand sub-regions */}
                  {main.subLocations.length > 0 && (
                    <button
                      onClick={(e) => toggleExpand(main.id, e)}
                      className={`px-2 flex items-center justify-center border-s transition-all ${
                        isSelected
                          ? 'border-black/20 hover:bg-black/10 text-black'
                          : 'border-[#2a251e] hover:bg-[#252019] text-[#e3a23c]'
                      }`}
                      title={isExpanded ? (isAr ? 'إخفاء المناطق الفرعية' : 'Collapse') : (isAr ? 'فتح المناطق الفرعية' : 'Expand sub-areas')}
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              );
            })}

          </div>

          {/* Sub-Regions Box (Opens when arrow is clicked) */}
          {expandedMainLocId && (
            <div className="p-3.5 rounded-2xl bg-[#181511] border border-[#2e271e] animate-fadeIn">
              {(() => {
                const currentExpanded = locations.find(m => m.id === expandedMainLocId);
                if (!currentExpanded) return null;

                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#756b5a] pb-1 border-b border-[#24201a]">
                      <span className="font-bold flex items-center gap-1 text-[#e3a23c]">
                        <span>📍</span>
                        <span>{isAr ? `المناطق الفرعية داخل: ${currentExpanded.name}` : `Sub-districts in ${currentExpanded.name}`}</span>
                      </span>
                      <button
                        onClick={() => selectMainLocation(currentExpanded.id)}
                        className="text-[10px] text-[#9c9284] hover:text-[#e3a23c] font-bold"
                      >
                        {isAr ? 'تحديد كل مناطقها' : 'Select all'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {currentExpanded.subLocations.map((sub) => {
                        const isSubSelected = filters.selectedLocationId === sub.id;

                        return (
                          <button
                            key={sub.id}
                            onClick={() => selectSubLocation(sub.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              isSubSelected
                                ? 'bg-[#e3a23c] text-black border-[#e3a23c] shadow-sm'
                                : 'bg-[#100e0c] text-[#9c9284] border-[#26211a] hover:border-[#e3a23c]/50 hover:text-white'
                            }`}
                          >
                            {sub.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Active Location Indicator */}
          {selectedLocationLabel && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#e3a23c] bg-[#1e1913] px-3 py-1.5 rounded-xl border border-[#3d3324] inline-flex">
              <span>📍 {isAr ? 'المنطقة المحددة:' : 'Active Location:'} <b>{selectedLocationLabel}</b></span>
              <button
                onClick={() => {
                  onFilterChange({ selectedLocationId: null });
                  setExpandedMainLocId(null);
                }}
                className="hover:text-white p-0.5"
                title={isAr ? 'إلغاء تصفية المنطقة' : 'Clear'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

        {/* Bottom Sorting and Counter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#201d19]">
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#756b5a] font-medium">{isAr ? 'ترتيب النتائج:' : 'Sort results:'}</span>
            <select
              value={filters.sortOrder}
              onChange={(e) => onFilterChange({ sortOrder: e.target.value as FilterState['sortOrder'] })}
              className="bg-[#181511] border border-[#2a251e] text-xs font-bold text-[#f5f1ea] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#e3a23c] cursor-pointer"
            >
              <option value="default">{isAr ? 'المشروعات المميزة (Featured)' : 'Featured Projects'}</option>
              <option value="lowest_monthly">{isAr ? 'الأقل قسطاً شهرياً' : 'Lowest Monthly'}</option>
              <option value="lowest_deposit">{isAr ? 'الأقل مقدم حجز' : 'Lowest Down Payment'}</option>
              <option value="price_asc">{isAr ? 'الأقل سعراً إجمالياً' : 'Lowest Total Price'}</option>
              <option value="price_desc">{isAr ? 'الأعلى سعراً' : 'Highest Total Price'}</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-bold text-[#e3a23c] font-mono-num">
              {isAr
                ? `تم العثور على ${totalResults} مشروع مطابق`
                : `Found ${totalResults} matching projects`}
            </div>
            {(filters.searchText || filters.selectedLocationId || activeFiltersCount > 0) && (
              <button
                onClick={() => {
                  onResetFilters();
                  setExpandedMainLocId(null);
                }}
                className="flex items-center gap-1 text-[11px] font-bold text-[#9c9284] hover:text-[#e3a23c] transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isAr ? 'إعادة ضبط الكل' : 'Reset All'}</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Project Type Filter Tabs (الكل، سكني، تجاري/إداري، شقق فندقية) */}
      <div className="flex items-center justify-center gap-2 mt-5 overflow-x-auto pb-1">
        {[
          { key: 'all', ar: 'الكل', en: 'All' },
          { key: 'residential', ar: 'سكني', en: 'Residential' },
          { key: 'commercial', ar: 'تجاري / إداري', en: 'Commercial' },
          { key: 'hotel', ar: 'شقق فندقية', en: 'Hotel Apartments' }
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => onFilterChange({ projectType: item.key as FilterState['projectType'] })}
            className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all border ${
              filters.projectType === item.key
                ? 'bg-[#e3a23c] text-[#14120f] border-[#e3a23c] shadow-[0_0_12px_rgba(227,162,60,0.3)]'
                : 'bg-[#14120f] text-[#9c9284] hover:text-white border-[#262422]'
            }`}
          >
            {isAr ? item.ar : item.en}
          </button>
        ))}
      </div>

    </div>
  );
};
