import React, { useState } from 'react';
import { Language } from '../types';
import { JLogo } from './JLogo';
import { X, Building2, LogIn, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLoginSuccess: (email: string, role: string) => void;
  currentUserEmail: string | null;
  onSignOut: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLoginSuccess,
  currentUserEmail,
  onSignOut
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail) {
      setErrorMsg(isAr ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter email address');
      return;
    }
    if (!trimmedPass) {
      setErrorMsg(isAr ? 'يرجى إدخال كلمة المرور' : 'Please enter password');
      return;
    }

    // Owner check: jeanhany04@gmail.com requires valid admin password
    if (trimmedEmail === 'jeanhany04@gmail.com') {
      if (trimmedPass !== 'admin123' && trimmedPass !== 'jean123' && trimmedPass !== '123456') {
        setErrorMsg(isAr ? 'كلمة المرور غير صحيحة لحساب المالك (Owner)' : 'Incorrect password for Owner account');
        return;
      }
      onLoginSuccess('jeanhany04@gmail.com', 'admin');
      onClose();
      return;
    }

    // Other brokers / users
    if (trimmedPass.length < 4) {
      setErrorMsg(isAr ? 'كلمة المرور يجب ألا تقل عن 4 خانات' : 'Password must be at least 4 characters');
      return;
    }

    onLoginSuccess(trimmedEmail, 'broker');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#14120f] border border-[#2a251e] shadow-2xl p-6 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-1 rounded-full text-[#756b5a] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon Monogram */}
        <div className="mb-4 flex items-center justify-center">
          <JLogo size="md" />
        </div>

        <h2 className="text-base font-extrabold text-white mb-1">
          {isAr ? 'تسجيل الدخول للمنصة' : 'Portal Sign In'}
        </h2>
        <p className="text-xs text-[#9c9284] mb-4">
          {isAr
            ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور للمتابعة'
            : 'Enter your email and password to proceed'}
        </p>

        {currentUserEmail ? (
          <div className="p-4 rounded-xl bg-[#181511] border border-[#26211a] space-y-3 mb-2">
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? 'أنت مسجل الدخول حالياً:' : 'Currently signed in as:'}</span>
            </div>
            <div className="text-xs font-mono-num font-bold text-white">{currentUserEmail}</div>
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-red-950/40 hover:bg-red-950/70 border border-red-800 text-red-300 font-bold text-xs transition-all"
            >
              {isAr ? 'تسجيل الخروج' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-start">
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#9c9284] block mb-1">
                {isAr ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="name@example.com"
                required
                className="w-full py-2.5 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs text-white focus:outline-none focus:border-[#e3a23c]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#9c9284] block mb-1">
                {isAr ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="••••••••"
                required
                className="w-full py-2.5 px-3 rounded-xl bg-[#0e0d0b] border border-[#262422] text-xs text-white focus:outline-none focus:border-[#e3a23c]"
              />
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <label className="flex items-center gap-1.5 text-[#9c9284] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#2a251e] bg-[#0e0d0b] text-[#e3a23c]"
                />
                <span>{isAr ? 'تذكرني' : 'Remember me'}</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#e3a23c] hover:bg-[#c98a2c] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(227,162,60,0.3)] transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>{isAr ? 'تسجيل الدخول والوصول للمنظومة' : 'Sign In & Enter'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
