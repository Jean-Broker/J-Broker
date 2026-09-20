import React, { useState, useEffect } from 'react';
import { Compound, MainLocation, UnitType, PaymentPlan, Language } from '../types';
import { X, Sparkles, Plus, Trash2, Save } from 'lucide-react';

interface AddEditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (compound: Compound) => void;
  editingCompound: Compound | null;
  locations: MainLocation[];
  lang: Language;
}

export const AddEditProjectModal: React.FC<AddEditProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCompound,
  locations,
  lang
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const [projectName, setProjectName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phaseName, setPhaseName] = useState('');
  const [locationId, setLocationId] = useState('');
  const [projectType, setProjectType] = useState<'residential' | 'commercial' | 'hotel'>('residential');
  const [pricePerMeter, setPricePerMeter] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('2y');
  const [finishingStatus, setFinishingStatus] = useState('full');
  const [whatsapp, setWhatsapp] = useState('');
  const [projectPDF, setProjectPDF] = useState('');
  const [locationLink, setLocationLink] = useState('');
  const [cashDiscount, setCashDiscount] = useState('20');
  const [magicText, setMagicText] = useState('');
  const [units, setUnits] = useState<UnitType[]>([]);
  const [plans, setPlans] = useState<PaymentPlan[]>([]);

  useEffect(() => {
    if (editingCompound) {
      setProjectName(editingCompound.projectName);
      setCompanyName(editingCompound.companyName);
      setPhaseName(editingCompound.phaseName || '');
      setLocationId(editingCompound.locationId);
      setProjectType(editingCompound.projectType as any || 'residential');
      setPricePerMeter(editingCompound.pricePerMeter ? String(editingCompound.pricePerMeter) : '');
      setDeliveryDate(editingCompound.deliveryDate || '2y');
      setFinishingStatus(editingCompound.finishingStatus || 'full');
      setWhatsapp(editingCompound.whatsapp || '');
      setProjectPDF(editingCompound.projectPDF || '');
      setLocationLink(editingCompound.locationLink || '');
      setCashDiscount(String(editingCompound.cashDiscount || 20));
      setUnits(editingCompound.unitTypes || []);
      setPlans(editingCompound.paymentPlans || []);
    } else {
      setProjectName('');
      setCompanyName('');
      setPhaseName('');
      setLocationId(locations[0]?.subLocations[0]?.id || '');
      setProjectType('residential');
      setPricePerMeter('75000');
      setDeliveryDate('2y');
      setFinishingStatus('full');
      setWhatsapp('201012345678');
      setProjectPDF('');
      setLocationLink('');
      setCashDiscount('20');
      setUnits([
        { id: 'u_init_1', bedroomType: 'شقة (Apartment)', rooms: 2, area: 130, price: 9750000, finishing: 'full' },
        { id: 'u_init_2', bedroomType: 'شقة (Apartment)', rooms: 3, area: 175, price: 13125000, finishing: 'full' }
      ]);
      setPlans([
        { id: 'p_init_1', name: '5% مقدم وتقسيط 8 سنوات', downPaymentPercent: 5, years: 8 }
      ]);
    }
  }, [editingCompound, locations]);

  // Magic Paste Parser (from user's code)
  const handleMagicPaste = () => {
    if (!magicText.trim()) return;
    const lines = magicText.split('\n');
    let extractedDev = '';
    let extractedProj = '';

    lines.forEach((line) => {
      const clean = line.replace(/[*`•▫️▶️📍🏢]/g, '').trim();
      const lower = clean.toLowerCase();
      if (!extractedProj && (lower.includes('project') || lower.includes('مشروع') || clean.length > 5)) {
        extractedProj = clean.replace(/project:?|مشروع:?/i, '').trim();
      }
      if (!extractedDev && (lower.includes('developer') || lower.includes('مطور') || lower.includes('شركة'))) {
        extractedDev = clean.replace(/developer:?|مطور:?|شركة:?/i, '').trim();
      }
      if (lower.includes('discount') || lower.includes('خصم')) {
        const match = clean.match(/(\d+)%/);
        if (match) setCashDiscount(match[1]);
      }
    });

    if (extractedProj) setProjectName(extractedProj);
    if (extractedDev) setCompanyName(extractedDev);
    alert(isAr ? 'تم استخراج البيانات بنجاح من النص!' : 'Extracted data from text successfully!');
  };

  const handleAddUnit = () => {
    setUnits([
      ...units,
      {
        id: Date.now().toString(),
        bedroomType: 'شقة (Apartment)',
        rooms: 2,
        area: 140,
        price: (parseFloat(pricePerMeter) || 75000) * 140,
        finishing: finishingStatus
      }
    ]);
  };

  const handleAddPlan = () => {
    setPlans([
      ...plans,
      {
        id: Date.now().toString(),
        name: 'خطة سداد جديدة',
        downPaymentPercent: 10,
        years: 8
      }
    ]);
  };

  const handleSave = () => {
    if (!projectName.trim() || !companyName.trim()) {
      alert(isAr ? 'يرجى إدخال اسم المشروع والشركة المطورة' : 'Please enter project name and company');
      return;
    }

    const subLoc = locations.flatMap(m => m.subLocations).find(s => s.id === locationId);

    const compoundToSave: Compound = {
      id: editingCompound ? editingCompound.id : `comp_${Date.now()}`,
      locationId: locationId || 'sub_golden_square',
      locationName: subLoc ? subLoc.name : (isAr ? 'المربع الذهبي' : 'Golden Square'),
      projectType,
      companyName,
      projectName,
      phaseName,
      pricePerMeter: parseFloat(pricePerMeter) || 75000,
      pricePerMeterMin: parseFloat(pricePerMeter) || 75000,
      deliveryDate,
      finishingStatus,
      whatsapp,
      projectPDF,
      locationLink,
      cashDiscount: parseFloat(cashDiscount) || 0,
      unitTypes: units,
      paymentPlans: plans
    };

    onSave(compoundToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl my-auto rounded-3xl bg-[#14120f] border border-[#2a251e] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#24201a] bg-[#181511]">
          <h2 className="text-sm font-extrabold text-white">
            {editingCompound
              ? (isAr ? 'تعديل بيانات المشروع' : 'Edit Project Details')
              : (isAr ? 'إضافة مشروع جديد للسحابة' : 'Add New Project to Cloud')}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#201d19] hover:bg-[#2e2923] border border-[#302a22] flex items-center justify-center text-[#9c9284] hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Magic Paste Box */}
          <div className="p-4 rounded-2xl bg-[#191612] border border-[#e3a23c]/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#e3a23c]">
              <Sparkles className="w-4 h-4 text-[#e3a23c]" />
              <span>{isAr ? '✨ النسخ السحري (Magic Paste)' : '✨ Magic Paste Extractor'}</span>
            </div>
            <textarea
              rows={2}
              value={magicText}
              onChange={(e) => setMagicText(e.target.value)}
              placeholder={
                isAr
                  ? 'انسخ رسالة تفاصيل المشروع (واتساب أو تليجرام) والصقها هنا لاستخراج البيانات آلياً...'
                  : 'Paste WhatsApp / broker listing text here to auto extract details...'
              }
              className="w-full p-2.5 rounded-xl bg-[#110f0d] border border-[#2e271e] text-xs text-white placeholder-[#5c5447] focus:outline-none"
            />
            <button
              onClick={handleMagicPaste}
              className="py-1.5 px-3 rounded-lg bg-[#e3a23c] text-black text-xs font-bold hover:brightness-110 transition-all"
            >
              {isAr ? 'استخراج البيانات آلياً' : 'Extract Data'}
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="text-xs font-bold text-[#9c9284] block mb-1">
                {isAr ? 'اسم المشروع' : 'Project Name'}
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="مثال: هايد بارك التجمع"
                className="w-full py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs font-bold text-white focus:outline-none focus:border-[#e3a23c]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#9c9284] block mb-1">
                {isAr ? 'الشركة المطورة' : 'Developer'}
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="مثال: هايد بارك للتطوير العقاري"
                className="w-full py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs font-bold text-white focus:outline-none focus:border-[#e3a23c]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#9c9284] block mb-1">
                {isAr ? 'المنطقة' : 'District'}
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs font-bold text-white focus:outline-none focus:border-[#e3a23c]"
              >
                {locations.flatMap((m) =>
                  m.subLocations.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#9c9284] block mb-1">
                {isAr ? 'نوع المشروع' : 'Type'}
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as any)}
                className="w-full py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs font-bold text-white focus:outline-none focus:border-[#e3a23c]"
              >
                <option value="residential">{isAr ? 'سكني' : 'Residential'}</option>
                <option value="commercial">{isAr ? 'تجاري / إداري' : 'Commercial'}</option>
                <option value="hotel">{isAr ? 'شقق فندقية' : 'Hotel'}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#9c9284] block mb-1">
                {isAr ? 'سعر المتر التقديري (ج.م)' : 'Price per Meter'}
              </label>
              <input
                type="number"
                value={pricePerMeter}
                onChange={(e) => setPricePerMeter(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs font-bold font-mono-num text-white focus:outline-none focus:border-[#e3a23c]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#9c9284] block mb-1">
                {isAr ? 'ميعاد الاستلام' : 'Delivery'}
              </label>
              <select
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs font-bold text-white focus:outline-none focus:border-[#e3a23c]"
              >
                <option value="immediate">{isAr ? 'استلام فوري RTM' : 'Immediate'}</option>
                <option value="1y">{isAr ? 'سنة واحدة' : '1 Year'}</option>
                <option value="2y">{isAr ? 'سنتين' : '2 Years'}</option>
                <option value="3y">{isAr ? '3 سنوات' : '3 Years'}</option>
                <option value="4y">{isAr ? '4 سنوات+' : '4+ Years'}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#9c9284] block mb-1">
                {isAr ? 'رقم واتساب المبيعات' : 'Sales WhatsApp'}
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="2010xxxxxxxx"
                className="w-full py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs font-mono-num text-white focus:outline-none focus:border-[#e3a23c]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#9c9284] block mb-1">
                {isAr ? 'نسبة خصم الكاش (%)' : 'Cash Discount %'}
              </label>
              <input
                type="number"
                value={cashDiscount}
                onChange={(e) => setCashDiscount(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs font-mono-num text-white focus:outline-none focus:border-[#e3a23c]"
              />
            </div>

          </div>

          {/* Units Sub-table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">
                {isAr ? 'أنواع ومساحات الوحدات' : 'Units & Sizes'}
              </span>
              <button
                onClick={handleAddUnit}
                className="flex items-center gap-1 text-xs font-bold text-[#e3a23c] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة وحدة' : 'Add Unit'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {units.map((unit) => (
                <div key={unit.id} className="flex items-center gap-2 p-2 rounded-xl bg-[#0e0d0b] border border-[#26211a]">
                  <input
                    type="text"
                    value={unit.bedroomType}
                    onChange={(e) => {
                      const next = units.map(u => u.id === unit.id ? { ...u, bedroomType: e.target.value } : u);
                      setUnits(next);
                    }}
                    className="flex-1 p-1.5 rounded-lg bg-[#14120f] border border-[#2a251e] text-xs text-white"
                  />
                  <div className="flex items-center gap-1 w-24">
                    <input
                      type="number"
                      value={unit.area}
                      onChange={(e) => {
                        const areaVal = parseFloat(e.target.value) || 0;
                        const next = units.map(u => u.id === unit.id ? { ...u, area: areaVal, price: areaVal * (parseFloat(pricePerMeter) || 75000) } : u);
                        setUnits(next);
                      }}
                      className="w-full p-1.5 rounded-lg bg-[#14120f] border border-[#2a251e] text-xs text-center font-mono-num text-white"
                    />
                    <span className="text-[11px] text-[#756b5a]">م²</span>
                  </div>
                  <button
                    onClick={() => setUnits(units.filter(u => u.id !== unit.id))}
                    className="p-1.5 text-[#756b5a] hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Plans */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">
                {isAr ? 'خطط السداد' : 'Payment Plans'}
              </span>
              <button
                onClick={handleAddPlan}
                className="flex items-center gap-1 text-xs font-bold text-[#e3a23c] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة خطة' : 'Add Plan'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {plans.map((plan) => (
                <div key={plan.id} className="flex items-center gap-2 p-2 rounded-xl bg-[#0e0d0b] border border-[#26211a]">
                  <input
                    type="text"
                    value={plan.name}
                    onChange={(e) => {
                      const next = plans.map(p => p.id === plan.id ? { ...p, name: e.target.value } : p);
                      setPlans(next);
                    }}
                    className="flex-1 p-1.5 rounded-lg bg-[#14120f] border border-[#2a251e] text-xs text-white"
                  />
                  <div className="flex items-center gap-1 w-20">
                    <input
                      type="number"
                      value={plan.downPaymentPercent}
                      onChange={(e) => {
                        const next = plans.map(p => p.id === plan.id ? { ...p, downPaymentPercent: parseFloat(e.target.value) || 0 } : p);
                        setPlans(next);
                      }}
                      className="w-full p-1.5 rounded-lg bg-[#14120f] border border-[#2a251e] text-xs text-center font-mono-num text-white"
                    />
                    <span className="text-[11px] text-[#756b5a]">%</span>
                  </div>
                  <div className="flex items-center gap-1 w-20">
                    <input
                      type="number"
                      value={plan.years}
                      onChange={(e) => {
                        const next = plans.map(p => p.id === plan.id ? { ...p, years: parseFloat(e.target.value) || 1 } : p);
                        setPlans(next);
                      }}
                      className="w-full p-1.5 rounded-lg bg-[#14120f] border border-[#2a251e] text-xs text-center font-mono-num text-white"
                    />
                    <span className="text-[11px] text-[#756b5a]">{isAr ? 'سنوات' : 'yrs'}</span>
                  </div>
                  <button
                    onClick={() => setPlans(plans.filter(p => p.id !== plan.id))}
                    className="p-1.5 text-[#756b5a] hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#24201a] bg-[#181511]">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-[#2a251e] text-xs font-bold text-[#9c9284] hover:text-white"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="py-2.5 px-5 rounded-xl bg-[#e3a23c] hover:bg-[#c98a2c] text-black text-xs font-extrabold flex items-center gap-1.5 shadow-[0_0_12px_rgba(227,162,60,0.3)]"
          >
            <Save className="w-4 h-4" />
            <span>{isAr ? 'حفظ المشروع' : 'Save Project'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
