import React, { useState } from 'react';
import { Language } from '../types';
import { X, Users, UserPlus, CheckCircle2 } from 'lucide-react';

interface SubscribersModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const SubscribersModal: React.FC<SubscribersModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const [email, setEmail] = useState('');
  const [duration, setDuration] = useState('90');
  const [role, setRole] = useState('editor');
  const [createdAccount, setCreatedAccount] = useState<{ email: string; pass: string; expDate: string } | null>(null);

  const handleCreate = () => {
    if (!email.trim()) {
      alert(isAr ? 'يرجى كتابة البريد الإلكتروني للمشترك' : 'Please enter subscriber email');
      return;
    }

    const randomPass = Math.random().toString(36).slice(-6) + Math.floor(Math.random() * 100);
    const exp = new Date();
    exp.setDate(exp.getDate() + parseInt(duration));

    setCreatedAccount({
      email: email.trim().toLowerCase(),
      pass: randomPass,
      expDate: exp.toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[#14120f] border border-[#2a251e] shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#24201a] pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#e3a23c]" />
            <h3 className="text-sm font-extrabold text-white">
              {isAr ? 'إدارة المشتركين والوسطاء' : 'Subscribers & Team Management'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-[#756b5a] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-[#9c9284] block mb-1">
              {isAr ? 'بريد المشترك الإلكتروني' : 'Subscriber Email'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="broker@example.com"
              className="w-full py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs text-white focus:outline-none focus:border-[#e3a23c]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#9c9284] block mb-1">
              {isAr ? 'مدة الاشتراك' : 'Subscription Duration'}
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs text-white focus:outline-none focus:border-[#e3a23c]"
            >
              <option value="30">{isAr ? 'شهر واحد' : '1 Month'}</option>
              <option value="90">{isAr ? '3 شهور' : '3 Months'}</option>
              <option value="180">{isAr ? '6 شهور' : '6 Months'}</option>
              <option value="365">{isAr ? 'سنة كاملة' : '1 Year'}</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#9c9284] block mb-1">
              {isAr ? 'مستوى الصلاحية' : 'Permission Level'}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs text-white focus:outline-none focus:border-[#e3a23c]"
            >
              <option value="viewer">{isAr ? 'مشترك (تصفح وبحث وحساب فقط)' : 'Viewer'}</option>
              <option value="editor">{isAr ? 'محرر (إضافة وتعديل المشروعات)' : 'Editor'}</option>
              <option value="admin">{isAr ? 'مدير نظام كامل (Admin)' : 'Admin'}</option>
            </select>
          </div>

          <button
            onClick={handleCreate}
            className="w-full py-2.5 rounded-xl bg-[#e3a23c] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isAr ? 'إنشاء وتفعيل الحساب' : 'Create Account'}</span>
          </button>
        </div>

        {createdAccount && (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? 'تم إنشاء الحساب بنجاح!' : 'Account Created Successfully!'}</span>
            </div>
            <div>
              <span className="text-[#9c9284]">{isAr ? 'الإيميل: ' : 'Email: '}</span>
              <span className="font-mono-num text-white">{createdAccount.email}</span>
            </div>
            <div>
              <span className="text-[#9c9284]">{isAr ? 'كلمة المرور المؤقتة: ' : 'Password: '}</span>
              <span className="font-mono-num font-bold text-yellow-400">{createdAccount.pass}</span>
            </div>
            <div>
              <span className="text-[#9c9284]">{isAr ? 'تاريخ انتهاء الاشتراك: ' : 'Expiry: '}</span>
              <span className="font-mono-num text-white">{createdAccount.expDate}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
