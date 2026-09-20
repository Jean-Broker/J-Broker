import React, { useState } from 'react';
import { Language } from '../types';
import { X, Save, Sliders } from 'lucide-react';

interface UnitTypesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const UnitTypesModal: React.FC<UnitTypesModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const [resTypes, setResTypes] = useState(
    'استوديو، 1 غرفة نوم، 2 غرفة نوم، 3 غرف نوم، 4 غرف نوم، 5 غرف نوم، دوبلكس، بنتهاوس، تاون هاوس، توين هاوس، فيلا، شاليه، شقة'
  );
  const [commTypes, setCommTypes] = useState('تجاري، إداري، عيادة، ترفيهي');

  const handleSave = () => {
    alert(isAr ? 'تم حفظ أنواع الوحدات بنجاح 💾' : 'Unit types saved successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#14120f] border border-[#2a251e] shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#24201a] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#e3a23c]" />
            <h3 className="text-sm font-extrabold text-white">
              {isAr ? 'إدارة أنواع الوحدات والعقارات' : 'Manage Unit Types'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-[#756b5a] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#9c9284]">
          {isAr
            ? 'اكتب الأنواع مفصولة بفاصلة (،). ستظهر هذه الأنواع فوراً في القوائم المنسدلة عند إضافة أو تعديل المشروعات.'
            : 'Enter unit types separated by commas. These will appear in dropdowns across the system.'}
        </p>

        <div>
          <label className="text-xs font-bold text-[#e3a23c] block mb-1">
            {isAr ? 'أنواع الوحدات (سكني)' : 'Residential Unit Types'}
          </label>
          <textarea
            rows={3}
            value={resTypes}
            onChange={(e) => setResTypes(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs text-white focus:outline-none focus:border-[#e3a23c]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#e3a23c] block mb-1">
            {isAr ? 'أنواع الوحدات (تجاري / إداري)' : 'Commercial & Admin Types'}
          </label>
          <textarea
            rows={2}
            value={commTypes}
            onChange={(e) => setCommTypes(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs text-white focus:outline-none focus:border-[#e3a23c]"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#24201a]">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl border border-[#2a251e] text-xs font-bold text-[#9c9284]"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="py-2 px-5 rounded-xl bg-[#e3a23c] text-black font-extrabold text-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{isAr ? 'حفظ التعديلات' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
