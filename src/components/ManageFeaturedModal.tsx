import React, { useState } from 'react';
import { Compound, Language } from '../types';
import { X, Check, Sparkles, Building2, MapPin, Eye } from 'lucide-react';

interface ManageFeaturedModalProps {
  isOpen: boolean;
  onClose: () => void;
  compounds: Compound[];
  selectedFeaturedIds: string[];
  onSaveFeaturedIds: (newIds: string[]) => void;
  lang: Language;
}

export const ManageFeaturedModal: React.FC<ManageFeaturedModalProps> = ({
  isOpen,
  onClose,
  compounds,
  selectedFeaturedIds,
  onSaveFeaturedIds,
  lang
}) => {
  const isAr = lang === 'ar';
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedFeaturedIds);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      if (selectedIds.length >= 4) {
        // limit to 4 max so layout stays pristine
        alert(isAr ? 'يمكنك تحديد حتى 4 مشروعات كحد أقصى للواجهة' : 'You can select up to 4 projects for the landing showcase');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSave = () => {
    if (selectedIds.length === 0) {
      alert(isAr ? 'يرجى اختيار مشروعين أو ثلاثة على الأقل' : 'Please select at least 2 projects');
      return;
    }
    onSaveFeaturedIds(selectedIds);
    onClose();
  };

  const filtered = compounds.filter(c => 
    c.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.locationName && c.locationName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#110f0d] border border-[#3d3324] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#241f18] bg-[#16130f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e5252d]/15 border border-[#e5252d]/40 flex items-center justify-center text-[#e5252d]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                {isAr ? 'تحديد مشروعات الواجهة الرئيسية (Landing Page)' : 'Manage Landing Showcase Projects'}
              </h2>
              <p className="text-xs text-[#9c9284]">
                {isAr ? 'اختر 2 إلى 4 مشروعات ليتم عرضها للزوار في الصفحة الرئيسية قبل تسجيل الدخول' : 'Pick 2 to 4 projects to showcase to visitors on the landing page'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1d1914] hover:bg-[#28221a] border border-[#3d3324] text-[#9c9284] hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Selected Count */}
        <div className="p-4 sm:p-6 border-b border-[#241f18] bg-[#13100d] flex flex-col sm:flex-row items-center justify-between gap-3">
          <input
            type="text"
            placeholder={isAr ? 'بحث عن مشروع أو مطور...' : 'Search compound or developer...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 py-2 px-3.5 rounded-xl bg-[#0c0a08] border border-[#2e261c] text-xs text-white placeholder-[#756b5a] focus:outline-none focus:border-[#e5252d]"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9c9284]">
              {isAr ? 'المحدد حالياً:' : 'Selected:'}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#e5252d] text-white text-xs font-black">
              {selectedIds.length} {isAr ? 'مشروعات' : 'projects'}
            </span>
          </div>
        </div>

        {/* List of Compounds */}
        <div className="p-4 sm:p-6 max-h-[50vh] overflow-y-auto space-y-2.5">
          {filtered.map((compound) => {
            const isSelected = selectedIds.includes(compound.id);
            return (
              <div
                key={compound.id}
                onClick={() => handleToggle(compound.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#1e1712] border-[#e5252d] shadow-sm'
                    : 'bg-[#14120f] border-[#26211a] hover:border-[#3d3324]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    isSelected ? 'bg-[#e5252d] text-white' : 'border border-[#3d3324] bg-[#0c0a08]'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-white">
                      {compound.projectName}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-[#9c9284]">
                      <span>{compound.companyName}</span>
                      <span>•</span>
                      <span className="text-[#e3a23c]">{compound.locationName || 'موقع متميز'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left rtl:text-right">
                  {isSelected ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e5252d]/20 text-[#ff5a63] border border-[#e5252d]/30">
                      {isAr ? 'معروض في الواجهة' : 'Featured'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#756b5a]">
                      {isAr ? 'اضغط للإضافة' : 'Click to add'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-[#16130f] border-t border-[#241f18] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#1a1713] hover:bg-[#252019] text-xs font-bold text-[#c7bfb4]"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#e5252d] hover:bg-[#c91d24] text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{isAr ? 'حفظ وتحديث مشروعات الصفحة الرئيسية' : 'Save & Update Landing'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
