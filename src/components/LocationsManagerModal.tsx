import React, { useState } from 'react';
import { MainLocation, SubLocation, Language } from '../types';
import { X, Plus, Trash2, Edit2, Check, MapPin, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { initialLocations } from '../data/initialData';

interface LocationsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: MainLocation[];
  onSaveLocations: (locations: MainLocation[]) => void;
  lang: Language;
}

export const LocationsManagerModal: React.FC<LocationsManagerModalProps> = ({
  isOpen,
  onClose,
  locations,
  onSaveLocations,
  lang
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const [locList, setLocList] = useState<MainLocation[]>(locations);
  const [expandedMainId, setExpandedMainId] = useState<string | null>(locations[0]?.id || null);

  // New Main Location form state
  const [newMainName, setNewMainName] = useState('');
  const [newMainNameEn, setNewMainNameEn] = useState('');
  const [isAddingMain, setIsAddingMain] = useState(false);

  // New Sub Location form state
  const [newSubName, setNewSubName] = useState('');
  const [newSubNameEn, setNewSubNameEn] = useState('');
  const [activeMainForSub, setActiveMainForSub] = useState<string | null>(null);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddMainLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMainName.trim()) return;
    const newMain: MainLocation = {
      id: `loc_${Date.now()}`,
      name: newMainName.trim(),
      nameEn: newMainNameEn.trim() || undefined,
      subLocations: []
    };
    const updated = [...locList, newMain];
    setLocList(updated);
    onSaveLocations(updated);
    setNewMainName('');
    setNewMainNameEn('');
    setIsAddingMain(false);
    setExpandedMainId(newMain.id);
  };

  const handleAddSubLocation = (mainId: string) => {
    if (!newSubName.trim()) return;
    const newSub: SubLocation = {
      id: `sub_${Date.now()}`,
      name: newSubName.trim(),
      nameEn: newSubNameEn.trim() || undefined
    };
    const updated = locList.map(m => {
      if (m.id === mainId) {
        return {
          ...m,
          subLocations: [...m.subLocations, newSub]
        };
      }
      return m;
    });
    setLocList(updated);
    onSaveLocations(updated);
    setNewSubName('');
    setNewSubNameEn('');
    setActiveMainForSub(null);
  };

  const handleDeleteMainLocation = (mainId: string) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذه المنطقة الرئيسية وجميع مناطقها الفرعية؟' : 'Delete this main region and all its sub-regions?')) {
      const updated = locList.filter(m => m.id !== mainId);
      setLocList(updated);
      onSaveLocations(updated);
    }
  };

  const handleDeleteSubLocation = (mainId: string, subId: string) => {
    const updated = locList.map(m => {
      if (m.id === mainId) {
        return {
          ...m,
          subLocations: m.subLocations.filter(s => s.id !== subId)
        };
      }
      return m;
    });
    setLocList(updated);
    onSaveLocations(updated);
  };

  const handleSaveEdit = (mainId: string, subId?: string) => {
    if (!editingName.trim()) return;
    let updated: MainLocation[];
    if (subId) {
      updated = locList.map(m => {
        if (m.id === mainId) {
          return {
            ...m,
            subLocations: m.subLocations.map(s => s.id === subId ? { ...s, name: editingName.trim() } : s)
          };
        }
        return m;
      });
    } else {
      updated = locList.map(m => m.id === mainId ? { ...m, name: editingName.trim() } : m);
    }
    setLocList(updated);
    onSaveLocations(updated);
    setEditingId(null);
    setEditingName('');
  };

  const handleResetToDefault = () => {
    if (confirm(isAr ? 'هل تريد استعادة قائمة المناطق الافتراضية؟' : 'Reset to default system locations?')) {
      setLocList(initialLocations);
      onSaveLocations(initialLocations);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#14120f] border border-[#2a251e] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#24201a] bg-[#181511]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e3a23c]/20 border border-[#e3a23c]/40 flex items-center justify-center text-[#e3a23c]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                {isAr ? 'إدارة وتقسيم المناطق الجغرافية' : 'Locations & Districts Manager'}
              </h3>
              <p className="text-[11px] text-[#756b5a]">
                {isAr ? 'تحكم كامل لـ Jean/Owner في المناطق الرئيسية والمناطق الفرعية' : 'Owner control for main regions and sub-districts'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#201d19] hover:bg-[#2e2923] border border-[#302a22] flex items-center justify-center text-[#9c9284] hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Top Action Bar */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setIsAddingMain(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#e3a23c] hover:bg-[#c98a2c] text-black font-extrabold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة منطقة رئيسية جديدة' : 'Add Main Region'}</span>
            </button>

            <button
              onClick={handleResetToDefault}
              className="flex items-center gap-1 text-xs text-[#756b5a] hover:text-[#e3a23c] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
            </button>
          </div>

          {/* New Main Region Input Form */}
          {isAddingMain && (
            <form onSubmit={handleAddMainLocation} className="p-4 rounded-2xl bg-[#191612] border border-[#e3a23c]/50 space-y-3 animate-fadeIn">
              <h4 className="text-xs font-bold text-[#e3a23c]">
                {isAr ? 'إضافة منطقة رئيسية (مثال: حدائق أكتوبر، التجمع، الشروق)' : 'Add New Main Region'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={isAr ? 'اسم المنطقة بالعربي (مثال: حدائق أكتوبر)' : 'Region Name in Arabic'}
                  value={newMainName}
                  onChange={(e) => setNewMainName(e.target.value)}
                  className="py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs text-white focus:outline-none focus:border-[#e3a23c]"
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Region Name (English)"
                  value={newMainNameEn}
                  onChange={(e) => setNewMainNameEn(e.target.value)}
                  className="py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs text-white focus:outline-none focus:border-[#e3a23c]"
                />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddingMain(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#9c9284] hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#e3a23c] text-black font-extrabold text-xs"
                >
                  {isAr ? 'حفظ المنطقة' : 'Save Region'}
                </button>
              </div>
            </form>
          )}

          {/* Locations Tree Accordion */}
          <div className="space-y-3">
            {locList.map((main) => {
              const isExpanded = expandedMainId === main.id;
              const isEditingThisMain = editingId === main.id;

              return (
                <div
                  key={main.id}
                  className="rounded-2xl bg-[#181511] border border-[#2a251e] overflow-hidden transition-all"
                >
                  {/* Main Region Row */}
                  <div className="p-3.5 flex items-center justify-between gap-3 bg-[#1c1813]">
                    <div className="flex items-center gap-2 flex-1">
                      <button
                        onClick={() => setExpandedMainId(isExpanded ? null : main.id)}
                        className="p-1 rounded-lg hover:bg-[#2a241c] text-[#e3a23c] transition-transform"
                        title={isAr ? 'عرض/إخفاء المناطق الفرعية' : 'Toggle sub-regions'}
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>

                      {isEditingThisMain ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="py-1 px-2.5 rounded-lg bg-[#0e0d0b] border border-[#e3a23c] text-xs text-white focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(main.id)}
                            className="p-1 rounded-lg bg-emerald-700 text-white"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded-lg bg-[#2a241c] text-[#9c9284]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => setExpandedMainId(isExpanded ? null : main.id)}
                          className="cursor-pointer flex items-center gap-2 flex-1"
                        >
                          <span className="text-xs sm:text-sm font-extrabold text-white">
                            {main.name}
                          </span>
                          <span className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded-full bg-[#2a241c] text-[#e3a23c]">
                            {main.subLocations.length} {isAr ? 'مناطق' : 'sub-areas'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Main Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setActiveMainForSub(main.id);
                          setExpandedMainId(main.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[#2a241c] text-[#e3a23c] text-[11px] font-bold flex items-center gap-1"
                        title={isAr ? 'إضافة منطقة فرعية بالداخل' : 'Add sub-region'}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isAr ? 'إضافة فرعي' : 'Add Sub'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingId(main.id);
                          setEditingName(main.name);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[#2a241c] text-[#9c9284] hover:text-white"
                        title={isAr ? 'تعديل الاسم' : 'Rename'}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteMainLocation(main.id)}
                        className="p-1.5 rounded-lg hover:bg-[#3d1818] text-[#756b5a] hover:text-red-400"
                        title={isAr ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Sub Locations Accordion Body */}
                  {isExpanded && (
                    <div className="p-3.5 border-t border-[#26211a] bg-[#14120f] space-y-2.5">
                      
                      {/* Sub-areas chips list */}
                      <div className="flex flex-wrap gap-2">
                        {main.subLocations.length > 0 ? (
                          main.subLocations.map((sub) => {
                            const isEditingSub = editingId === sub.id;

                            if (isEditingSub) {
                              return (
                                <div key={sub.id} className="flex items-center gap-1 bg-[#1a1713] p-1 rounded-xl border border-[#e3a23c]">
                                  <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="py-0.5 px-2 bg-transparent text-xs text-white focus:outline-none"
                                    autoFocus
                                  />
                                  <button onClick={() => handleSaveEdit(main.id, sub.id)} className="text-emerald-400 p-0.5">
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => setEditingId(null)} className="text-[#9c9284] p-0.5">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={sub.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e1a14] border border-[#2e271e] text-xs font-semibold text-[#f5f1ea] group"
                              >
                                <span>{sub.name}</span>
                                <button
                                  onClick={() => {
                                    setEditingId(sub.id);
                                    setEditingName(sub.name);
                                  }}
                                  className="opacity-40 group-hover:opacity-100 hover:text-[#e3a23c] transition-opacity"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubLocation(main.id, sub.id)}
                                  className="opacity-40 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-xs text-[#756b5a] italic py-1">
                            {isAr ? 'لا توجد مناطق فرعية مضافة بعد. اضغط "إضافة فرعي" لإضافة منطقة.' : 'No sub-districts yet.'}
                          </div>
                        )}
                      </div>

                      {/* Add Sub Region inline form */}
                      {activeMainForSub === main.id && (
                        <div className="p-3 rounded-xl bg-[#191612] border border-[#3d3324] mt-2 space-y-2">
                          <span className="text-[11px] font-bold text-[#e3a23c] block">
                            {isAr ? `إضافة منطقة فرعية داخل (${main.name})` : `Add sub-district inside (${main.name})`}
                          </span>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder={isAr ? 'اسم المنطقة الفرعية (مثال: منطقة النوادي، طريق الواحات)' : 'Sub-district name'}
                              value={newSubName}
                              onChange={(e) => setNewSubName(e.target.value)}
                              className="flex-1 py-1.5 px-3 rounded-lg bg-[#0e0d0b] border border-[#262422] text-xs text-white focus:outline-none focus:border-[#e3a23c]"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleAddSubLocation(main.id)}
                              className="px-3 py-1.5 rounded-lg bg-[#e3a23c] text-black font-extrabold text-xs"
                            >
                              {isAr ? 'إضافة' : 'Add'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveMainForSub(null)}
                              className="px-2 py-1.5 rounded-lg bg-[#201d19] text-[#9c9284] text-xs"
                            >
                              {isAr ? 'إلغاء' : 'Cancel'}
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#24201a] bg-[#181511] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#e3a23c] text-black font-extrabold text-xs shadow-sm hover:brightness-110 transition-all"
          >
            {isAr ? 'تم وحفظ التعديلات' : 'Done & Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
