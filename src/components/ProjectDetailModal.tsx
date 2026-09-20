import React, { useState, useMemo, useEffect } from 'react';
import { Compound, Currency, Language, UnitType } from '../types';
import { formatNumber, formatPrice, calcInstallmentWithDiscount } from '../utils/calculator';
import { X, MapPin, Building, Calendar, Phone, FileText, ExternalLink, Calculator, Percent, Car, Wrench, Edit3, Trash2, Check, Layers } from 'lucide-react';

interface ProjectDetailModalProps {
  compound: Compound | null;
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  lang: Language;
  onEdit?: (compound: Compound) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

interface UnitCategoryGroup {
  key: string;
  label: string;
  icon: string;
  units: UnitType[];
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  compound,
  isOpen,
  onClose,
  currency,
  lang,
  onEdit,
  onDelete,
  isAdmin = true
}) => {
  if (!isOpen || !compound) return null;

  const isAr = lang === 'ar';
  const units = compound.unitTypes || [];

  // Group units by category (e.g. 1 Bedroom, 2 Bedrooms, 3 Bedrooms, Townhouse, Villa, etc.)
  const categoryGroups = useMemo<UnitCategoryGroup[]>(() => {
    const map = new Map<string, { label: string; icon: string; units: UnitType[] }>();

    units.forEach((unit) => {
      const lower = (unit.bedroomType || '').toLowerCase();
      const rooms = Number(unit.rooms);

      let key = '';
      let label = '';
      let icon = '📐';

      if (rooms === 1 || lower.includes('1 bedroom') || lower.includes('غرفة واحدة') || lower.includes('1 غرفة')) {
        key = '1_bed';
        label = isAr ? '1 غرفة نوم (1 Bedroom)' : '1 Bedroom';
        icon = '🛏️';
      } else if (rooms === 2 || lower.includes('2 bedroom') || lower.includes('غرفتين') || lower.includes('2 غرفة')) {
        key = '2_bed';
        label = isAr ? '2 غرف نوم (2 Bedrooms)' : '2 Bedrooms';
        icon = '🛏️';
      } else if (rooms === 3 || lower.includes('3 bedroom') || lower.includes('3 غرف')) {
        key = '3_bed';
        label = isAr ? '3 غرف نوم (3 Bedrooms)' : '3 Bedrooms';
        icon = '🛏️';
      } else if (rooms === 4 || lower.includes('4 bedroom') || lower.includes('4 غرف')) {
        key = '4_bed';
        label = isAr ? '4 غرف نوم (4 Bedrooms)' : '4 Bedrooms';
        icon = '🛏️';
      } else if (rooms >= 5 || lower.includes('5 bedroom') || lower.includes('5 غرف')) {
        key = '5_bed';
        label = isAr ? '5+ غرف نوم (5+ Bedrooms)' : '5+ Bedrooms';
        icon = '🛏️';
      } else if (lower.includes('villa') || lower.includes('فيلا')) {
        key = 'villa';
        label = isAr ? 'فيلات مستقلة (Villa)' : 'Standalone Villa';
        icon = '🏡';
      } else if (lower.includes('town') || lower.includes('تاون')) {
        key = 'townhouse';
        label = isAr ? 'تاون هاوس (Townhouse)' : 'Townhouse';
        icon = '🏘️';
      } else if (lower.includes('twin') || lower.includes('توين')) {
        key = 'twinhouse';
        label = isAr ? 'توين هاوس (Twinhouse)' : 'Twinhouse';
        icon = '🏘️';
      } else if (lower.includes('duplex') || lower.includes('دوبلكس')) {
        key = 'duplex';
        label = isAr ? 'دوبلكس (Duplex)' : 'Duplex';
        icon = '🏢';
      } else if (lower.includes('studio') || lower.includes('استوديو')) {
        key = 'studio';
        label = isAr ? 'استوديو (Studio)' : 'Studio';
        icon = '🛋️';
      } else {
        key = unit.bedroomType || 'other';
        label = unit.bedroomType || (isAr ? 'وحدة سكنية' : 'Unit');
        icon = '🏠';
      }

      if (!map.has(key)) {
        map.set(key, { label, icon, units: [] });
      }
      map.get(key)!.units.push(unit);
    });

    return Array.from(map.entries()).map(([key, value]) => ({
      key,
      label: value.label,
      icon: value.icon,
      units: value.units
    }));
  }, [units, isAr]);

  // Active category & active unit
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>(
    categoryGroups[0]?.key || ''
  );
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    units[0]?.id || ''
  );

  // Sync category selection when compound changes
  useEffect(() => {
    if (categoryGroups.length > 0) {
      setActiveCategoryKey(categoryGroups[0].key);
      if (categoryGroups[0].units.length > 0) {
        setSelectedUnitId(categoryGroups[0].units[0].id);
      }
    }
  }, [compound?.id]);

  const activeCategory = categoryGroups.find(c => c.key === activeCategoryKey) || categoryGroups[0];
  const selectedUnit = units.find((u) => u.id === selectedUnitId) || activeCategory?.units[0] || units[0];

  // Mini-calculator state
  const [calcArea, setCalcArea] = useState<string>('');
  const [calcGarden, setCalcGarden] = useState<string>('');
  const [calcRoof, setCalcRoof] = useState<string>('');

  const numArea = parseFloat(calcArea) || 0;
  const numGarden = parseFloat(calcGarden) || 0;
  const numRoof = parseFloat(calcRoof) || 0;
  const customEffArea = numArea + numGarden / 3 + numRoof / 3;
  const customMeterPrice = compound.pricePerMeter || (compound.pricePerMeterMin ? compound.pricePerMeterMin : 70000);
  const customCalculatedPrice = customEffArea > 0 ? Math.round(customEffArea * customMeterPrice) : 0;

  // Selected unit calculations
  const unitPrice = selectedUnit ? selectedUnit.price : 0;
  const cashDiscount = compound.cashDiscount || 0;
  const cashDiscountAmount = Math.round(unitPrice * (cashDiscount / 100));
  const netCashPrice = unitPrice - cashDiscountAmount;

  const handleCategoryClick = (group: UnitCategoryGroup) => {
    setActiveCategoryKey(group.key);
    // If selected unit is not in this category, pick the first one
    if (!group.units.some(u => u.id === selectedUnitId)) {
      if (group.units[0]) {
        setSelectedUnitId(group.units[0].id);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl my-auto rounded-3xl bg-[#14120f] border border-[#2a251e] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#24201a] bg-[#181511]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e3a23c] shadow-[0_0_10px_rgba(227,162,60,0.8)]" />
            <span className="text-xs font-bold text-[#e3a23c] uppercase tracking-wider">
              {isAr ? 'تفاصيل المشروع، الوحدات وخطط السداد' : 'Project Details, Units & Payment Plans'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#201d19] hover:bg-[#2e2923] border border-[#302a22] flex items-center justify-center text-[#9c9284] hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-7">
          
          {/* Hero Section of Modal */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 pb-6 border-b border-[#24201a]">
            
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e1913] border border-[#e3a23c]/40 text-[#e3a23c] text-xs font-bold mb-3">
                <MapPin className="w-3.5 h-3.5" />
                <span>{compound.locationName || (isAr ? 'موقع متميز' : 'Prime Location')}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-snug">
                {compound.projectName}
                {compound.phaseName && (
                  <span className="ms-2 text-sm font-bold bg-[#e3a23c] text-[#14120f] px-3 py-0.5 rounded-full inline-block">
                    {compound.phaseName}
                  </span>
                )}
              </h1>
              <p className="text-sm text-[#9c9284] font-medium flex items-center gap-2 mb-4">
                <Building className="w-4 h-4 text-[#e3a23c]" />
                <span>{compound.companyName}</span>
              </p>

              {/* Price Callout */}
              <div className="p-4 rounded-2xl bg-[#1a1713] border border-[#2e271e] inline-block">
                <span className="text-xs text-[#756b5a] block font-medium mb-1">
                  {isAr ? 'يبدأ سعر المتر من:' : 'Price per meter starting from:'}
                </span>
                <div className="text-2xl font-black text-[#e3a23c] font-mono-num">
                  {formatPrice(compound.pricePerMeterMin || compound.pricePerMeter || 0, currency, lang)} / م²
                </div>
              </div>
            </div>

            {/* Quick Actions Card (WhatsApp, PDF, Maps) */}
            <div className="w-full lg:w-80 p-5 rounded-2xl bg-[#191612] border border-[#2e271e] space-y-3">
              <h4 className="text-xs font-extrabold text-[#f5f1ea] uppercase tracking-wider mb-2 text-center">
                {isAr ? 'تواصل مباشر مع إدارة المبيعات' : 'Direct Developer Contacts'}
              </h4>

              {compound.contactName && (
                <div className="text-xs text-center text-[#9c9284] font-medium">
                  {isAr ? 'المسؤول:' : 'Contact:'} <b className="text-white">{compound.contactName}</b>
                </div>
              )}

              {compound.whatsapp && (
                <a
                  href={`https://wa.me/${compound.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>{isAr ? 'تواصل عبر واتساب | WhatsApp' : 'Chat on WhatsApp'}</span>
                </a>
              )}

              {compound.projectPDF && (
                <a
                  href={compound.projectPDF}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#201d19] hover:bg-[#2b2721] border border-[#383025] text-[#f5f1ea] font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <FileText className="w-4 h-4 text-[#e3a23c]" />
                  <span>{isAr ? 'تحميل بروشور المشروع PDF' : 'Download Brochure PDF'}</span>
                </a>
              )}

              {compound.locationLink && (
                <a
                  href={compound.locationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#201d19] hover:bg-[#2b2721] border border-[#383025] text-[#f5f1ea] font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-[#e3a23c]" />
                  <span>{isAr ? 'موقع المشروع على خرائط جوجل' : 'View on Google Maps'}</span>
                </a>
              )}

              {isAdmin && (
                <div className="flex items-center gap-2 pt-2 border-t border-[#26211a]">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(compound)}
                      className="flex-1 py-2 rounded-lg bg-[#241f19] hover:bg-[#322c22] border border-[#3d3324] text-xs font-bold text-[#e3a23c] flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تعديل' : 'Edit'}</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        if (confirm(isAr ? 'هل أنت متأكد من حذف هذا المشروع؟' : 'Are you sure you want to delete this project?')) {
                          onDelete(compound.id);
                          onClose();
                        }
                      }}
                      className="p-2 rounded-lg bg-[#291313] hover:bg-[#3d1818] border border-[#4d1f1f] text-red-400 transition-all"
                      title={isAr ? 'حذف المشروع' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Specifications Grid */}
          <div>
            <h3 className="text-sm font-extrabold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#e3a23c]" />
              <span>{isAr ? 'المواصفات الفنية والهندسية' : 'Technical & Project Specifications'}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <div className="p-3.5 rounded-xl bg-[#191612] border border-[#28231c]">
                <span className="text-[11px] text-[#756b5a] block font-medium mb-1">
                  {isAr ? 'المطور العقاري' : 'Developer'}
                </span>
                <span className="text-xs font-bold text-white block">{compound.companyName}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#191612] border border-[#28231c]">
                <span className="text-[11px] text-[#756b5a] block font-medium mb-1">
                  {isAr ? 'الاستشاري الهندسي' : 'Consultant'}
                </span>
                <span className="text-xs font-bold text-white block">{compound.consultant || '-'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#191612] border border-[#28231c]">
                <span className="text-[11px] text-[#756b5a] block font-medium mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#e3a23c]" />
                  <span>{isAr ? 'ميعاد الاستلام' : 'Delivery Date'}</span>
                </span>
                <span className="text-xs font-bold text-white block">
                  {compound.deliveryDate ? (isAr ? `خلال ${compound.deliveryDate}` : compound.deliveryDate) : '-'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#191612] border border-[#28231c]">
                <span className="text-[11px] text-[#756b5a] block font-medium mb-1 flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-[#e3a23c]" />
                  <span>{isAr ? 'التشطيب' : 'Finishing'}</span>
                </span>
                <span className="text-xs font-bold text-white block">
                  {compound.finishingStatus === 'full' ? (isAr ? 'تشطيب كامل' : 'Fully Finished') :
                   compound.finishingStatus === 'semi' ? (isAr ? 'نصف تشطيب' : 'Semi Finished') :
                   compound.finishingStatus === 'core_shell' ? (isAr ? 'طوب أحمر' : 'Core & Shell') : (isAr ? 'متنوع' : 'Mixed')}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#191612] border border-[#28231c]">
                <span className="text-[11px] text-[#756b5a] block font-medium mb-1 flex items-center gap-1">
                  <Percent className="w-3 h-3 text-[#e3a23c]" />
                  <span>{isAr ? 'وديعة الصيانة' : 'Maintenance'}</span>
                </span>
                <span className="text-xs font-bold text-white block font-mono-num">
                  {compound.maintenanceValue ? `${compound.maintenanceValue}%` : '-'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#191612] border border-[#28231c]">
                <span className="text-[11px] text-[#756b5a] block font-medium mb-1 flex items-center gap-1">
                  <Car className="w-3 h-3 text-[#e3a23c]" />
                  <span>{isAr ? 'رسوم الجراج' : 'Parking'}</span>
                </span>
                <span className="text-xs font-bold text-white block">
                  {compound.parkingType === 'included' ? (isAr ? 'شامل السعر' : 'Included') :
                   compound.parkingFee ? `${formatNumber(compound.parkingFee)} ج.م` : (isAr ? 'رسوم إضافية' : 'Extra')}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#191612] border border-[#28231c]">
                <span className="text-[11px] text-[#756b5a] block font-medium mb-1">
                  {isAr ? 'المساحة الإجمالية' : 'Total Area'}
                </span>
                <span className="text-xs font-bold text-white block font-mono-num">
                  {compound.projectSize ? `${compound.projectSize} ${isAr ? 'فدان' : 'Acres'}` : '-'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#191612] border border-[#28231c]">
                <span className="text-[11px] text-[#756b5a] block font-medium mb-1">
                  {isAr ? 'ارتفاع المباني' : 'Floors'}
                </span>
                <span className="text-xs font-bold text-white block">{compound.floors || '-'}</span>
              </div>

            </div>
          </div>

          {/* NEW INTERACTIVE UNIT SELECTOR: 
              Step 1: Choose Bedroom Type / Category (e.g. 1 Bedroom, 2 Bedrooms, 3 Bedrooms...)
              Step 2: Choose Available Area in that type (e.g. 85 m², 105 m²...) 
          */}
          {units.length > 0 && (
            <div className="p-5 rounded-3xl bg-[#161411] border border-[#2e271e] space-y-5">
              
              <div className="flex items-center justify-between border-b border-[#26211a] pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#e3a23c]" />
                  <h3 className="text-sm font-extrabold text-white">
                    {isAr ? 'أنواع الوحدات والمساحات المتاحة بالمشروع' : 'Available Unit Types & Areas'}
                  </h3>
                </div>
                <span className="text-[11px] text-[#756b5a]">
                  {isAr ? 'اضغط على نوع الغرف لاختيار المساحة المطلوبة' : 'Click room type then select desired area'}
                </span>
              </div>

              {/* LEVEL 1: Category Chips (1 Bedroom, 2 Bedrooms, 3 Bedrooms, Villas...) */}
              <div>
                <span className="text-xs font-bold text-[#e3a23c] block mb-2.5">
                  {isAr ? '1. اختر نوع الوحدة / عدد غرف النوم:' : '1. Select Unit Type / Bedrooms:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {categoryGroups.map((group) => {
                    const isGroupActive = activeCategoryKey === group.key;

                    return (
                      <button
                        key={group.key}
                        onClick={() => handleCategoryClick(group)}
                        className={`py-2.5 px-4 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all border ${
                          isGroupActive
                            ? 'bg-[#e3a23c] text-black border-[#e3a23c] shadow-[0_0_15px_rgba(227,162,60,0.35)] scale-[1.02]'
                            : 'bg-[#1c1813] text-[#c7bfb4] border-[#2e271e] hover:border-[#e3a23c]/60 hover:text-white'
                        }`}
                      >
                        <span>{group.icon}</span>
                        <span>{group.label}</span>
                        <span className={`text-[10px] font-mono-num font-bold px-1.5 py-0.5 rounded-full ${
                          isGroupActive ? 'bg-black/20 text-black' : 'bg-[#28221a] text-[#e3a23c]'
                        }`}>
                          {group.units.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LEVEL 2: Available Areas for Active Category */}
              {activeCategory && (
                <div className="p-4 rounded-2xl bg-[#12100d] border border-[#2a241c] space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>📐</span>
                      <span>
                        {isAr
                          ? `2. المساحات المتاحة لـ (${activeCategory.label}):`
                          : `2. Available Areas for (${activeCategory.label}):`}
                      </span>
                    </span>
                    <span className="text-[11px] text-[#756b5a]">
                      {isAr ? 'اضغط على المساحة لحساب أقساطها فوراً' : 'Click area to view live payment plan'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {activeCategory.units.map((unit) => {
                      const isSelectedArea = selectedUnitId === unit.id;

                      return (
                        <div
                          key={unit.id}
                          onClick={() => setSelectedUnitId(unit.id)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                            isSelectedArea
                              ? 'bg-[#241e16] border-[#e3a23c] ring-1 ring-[#e3a23c] shadow-lg'
                              : 'bg-[#181511] border-[#28221a] hover:border-[#e3a23c]/50 text-[#c7bfb4]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black font-mono-num text-white">
                                {unit.area} م²
                              </span>
                              {unit.gardenArea ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium">
                                  +{unit.gardenArea}م² حديقة
                                </span>
                              ) : null}
                            </div>
                            {isSelectedArea ? (
                              <span className="w-5 h-5 rounded-full bg-[#e3a23c] text-black flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </span>
                            ) : null}
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-[#24201a]">
                            <span className="text-xs font-black text-[#e3a23c] font-mono-num">
                              {formatPrice(unit.price, currency, lang)}
                            </span>
                            <span className="text-[10px] text-[#756b5a] font-medium">
                              {unit.finishing === 'full' ? (isAr ? 'تشطيب كامل' : 'Full') :
                               unit.finishing === 'semi' ? (isAr ? 'نصف تشطيب' : 'Semi') : (isAr ? 'طوب أحمر' : 'Core')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Active Unit Live Pricing Banner */}
              {selectedUnit && (
                <div className="p-4 rounded-2xl bg-[#1e1913] border border-[#3d3324] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-[#756b5a] block font-bold">
                      {isAr ? 'الوحدة المحددة حالياً:' : 'Currently Selected Unit:'}
                    </span>
                    <span className="text-sm font-extrabold text-white">
                      {selectedUnit.bedroomType} — مساحة <b className="text-[#e3a23c]">{selectedUnit.area} م²</b>
                      {selectedUnit.gardenArea ? ` (+ ${selectedUnit.gardenArea} م² حديقة)` : ''}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-[#756b5a] block">
                      {isAr ? 'السعر الإجمالي للوحدة:' : 'Total Unit Price:'}
                    </span>
                    <span className="text-xl font-black text-[#e3a23c] font-mono-num">
                      {formatPrice(unitPrice, currency, lang)}
                    </span>
                  </div>
                </div>
              )}

              {/* Cash Discount Box if applicable */}
              {cashDiscount > 0 && unitPrice > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <span className="text-xs text-emerald-400 font-extrabold block">
                      {isAr ? `عرض خصم الكاش الفوري (${cashDiscount}%)` : `Instant Cash Discount Offer (${cashDiscount}%)`}
                    </span>
                    <span className="text-[11px] text-[#9c9284]">
                      {isAr ? 'السعر الأساسي: ' : 'Base Price: '}
                      <del className="font-mono-num">{formatPrice(unitPrice, currency, lang)}</del>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-emerald-300 block font-medium">
                      {isAr ? `وفر: ${formatPrice(cashDiscountAmount, currency, lang)}` : `Save: ${formatPrice(cashDiscountAmount, currency, lang)}`}
                    </span>
                    <span className="text-lg font-black text-white font-mono-num">
                      {formatPrice(netCashPrice, currency, lang)}
                    </span>
                  </div>
                </div>
              )}

              {/* Payment Plans Comparison Table */}
              <div className="rounded-2xl border border-[#2a251e] overflow-hidden bg-[#161411]">
                <div className="px-4 py-3 bg-[#1e1a14] border-b border-[#2a251e] flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#e3a23c]">
                    {isAr ? 'جدول خطط السداد والأقساط للوحدة المختارة' : 'Payment Plans & Installments Breakdown'}
                  </span>
                  <span className="text-[11px] text-[#9c9284] font-mono-num">
                    {selectedUnit?.area} م² — {formatPrice(unitPrice, currency, lang)}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead className="bg-[#14120f] text-[#756b5a] font-bold border-b border-[#26211a]">
                      <tr>
                        <th className="py-3 px-4 text-start">{isAr ? 'الخطة' : 'Plan'}</th>
                        <th className="py-3 px-4 text-start">{isAr ? 'المقدم' : 'Down Payment'}</th>
                        <th className="py-3 px-4 text-start">{isAr ? 'الدفعات' : 'Bullets'}</th>
                        <th className="py-3 px-4 text-start text-[#e3a23c]">{isAr ? 'القسط الشهري' : 'Monthly'}</th>
                        <th className="py-3 px-4 text-start">{isAr ? 'قسط ربع سنوي' : 'Quarterly'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#26211a] font-medium text-[#f5f1ea]">
                      {compound.paymentPlans.map((plan) => {
                        const r = calcInstallmentWithDiscount(
                          unitPrice,
                          plan.discountPercent || 0,
                          plan.downPaymentPercent || 0,
                          plan.customBullets || [],
                          plan.years,
                          12
                        );
                        return (
                          <tr key={plan.id} className="hover:bg-[#1f1b15] transition-colors">
                            <td className="py-3.5 px-4 font-bold">
                              <div>{plan.name}</div>
                              {plan.discountPercent ? (
                                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                                  خصم {plan.discountPercent}%
                                </span>
                              ) : null}
                            </td>
                            <td className="py-3.5 px-4 font-mono-num">
                              <span className="font-bold text-white block">
                                {formatPrice(r.downPayment, currency, lang)}
                              </span>
                              <span className="text-[11px] text-[#756b5a] font-bold">
                                ({plan.downPaymentPercent}%)
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[11px] text-[#9c9284]">
                              {r.bulletsSummary.length > 0 ? (
                                <div className="space-y-0.5">
                                  {r.bulletsSummary.map((b, i) => (
                                    <div key={i}>• {b.label}</div>
                                  ))}
                                </div>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono-num font-black text-sm text-[#e3a23c]">
                              {formatPrice(r.monthlyEquivalent, currency, lang)}
                            </td>
                            <td className="py-3.5 px-4 font-mono-num font-bold text-white">
                              {formatPrice(r.quarterlyEquivalent, currency, lang)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Project Mini-Calculator for Custom Areas */}
          <div className="p-5 rounded-2xl bg-[#191612] border border-[#2e271e]">
            <h3 className="text-sm font-extrabold text-emerald-400 mb-1 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'الحاسبة السريعة لأي مساحة مخصصة' : 'Quick Project Custom Area Calculator'}</span>
            </h3>
            <p className="text-xs text-[#756b5a] mb-4">
              {isAr
                ? 'اكتب أي مساحة إضافية لحساب أقساطها فوراً على كل خطط سداد هذا المشروع:'
                : 'Enter any custom area to calculate its pricing and installments across all project plans:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <input
                type="number"
                value={calcArea}
                onChange={(e) => setCalcArea(e.target.value)}
                placeholder={isAr ? 'مساحة المباني م²' : 'BUA Area m²'}
                className="py-2.5 px-3.5 rounded-xl bg-[#12100d] border border-[#2a251e] text-xs font-mono-num text-white placeholder-[#5c5447] focus:outline-none focus:border-[#e3a23c]"
              />
              <input
                type="number"
                value={calcGarden}
                onChange={(e) => setCalcGarden(e.target.value)}
                placeholder={isAr ? 'الحديقة م² (اختياري)' : 'Garden m²'}
                className="py-2.5 px-3.5 rounded-xl bg-[#12100d] border border-[#2a251e] text-xs font-mono-num text-white placeholder-[#5c5447] focus:outline-none focus:border-[#e3a23c]"
              />
              <input
                type="number"
                value={calcRoof}
                onChange={(e) => setCalcRoof(e.target.value)}
                placeholder={isAr ? 'الروف م² (اختياري)' : 'Roof m²'}
                className="py-2.5 px-3.5 rounded-xl bg-[#12100d] border border-[#2a251e] text-xs font-mono-num text-white placeholder-[#5c5447] focus:outline-none focus:border-[#e3a23c]"
              />
            </div>

            {customCalculatedPrice > 0 && (
              <div className="p-4 rounded-xl bg-[#12100d] border border-[#2e271e] animate-fadeIn">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#26211a]">
                  <span className="text-xs font-bold text-white">
                    {isAr ? 'السعر التقديري المحسوب للمساحة المخصصة:' : 'Estimated Custom Area Price:'}
                  </span>
                  <span className="text-base font-black text-[#e3a23c] font-mono-num">
                    {formatPrice(customCalculatedPrice, currency, lang)}
                  </span>
                </div>

                <div className="space-y-2">
                  {compound.paymentPlans.map((plan) => {
                    const r = calcInstallmentWithDiscount(
                      customCalculatedPrice,
                      plan.discountPercent || 0,
                      plan.downPaymentPercent || 0,
                      plan.customBullets || [],
                      plan.years,
                      12
                    );
                    return (
                      <div
                        key={plan.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#181511] text-xs"
                      >
                        <span className="font-bold text-white">{plan.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[#9c9284]">
                            {isAr ? 'مقدم:' : 'DP:'}{' '}
                            <b className="text-white font-mono-num">{formatPrice(r.downPayment, currency, lang)}</b>
                          </span>
                          <span className="text-[#e3a23c] font-black font-mono-num">
                            {formatPrice(r.monthlyEquivalent, currency, lang)}/شهر
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
