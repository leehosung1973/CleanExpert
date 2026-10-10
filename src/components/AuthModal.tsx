import React from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, User, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  customTitle?: string;
  customSubtitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  customTitle = 'CleanExpert 회원 서비스',
  customSubtitle = '선택하신 청소 예약 정보는 로그인 후에도 안전하게 유지됩니다.'
}) => {
  const { signInWithGoogle, signInDemoCustomer, signInDemoAdmin, loading } = useAuth();

  if (!isOpen) return null;

  const handleGoogle = async () => {
    await signInWithGoogle();
    onClose();
  };

  const handleDemoCustomer = () => {
    signInDemoCustomer();
    onClose();
  };

  const handleDemoAdmin = () => {
    signInDemoAdmin();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0f2b5c] to-blue-700 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-blue-900/15">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 font-sans">
            {customTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {customSubtitle}
          </p>
        </div>

        {/* Google Real Sign-in Button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Google 계정으로 계속하기</span>
          </button>

          {/* Kakao Style / Quick Customer Experience */}
          <button
            onClick={handleDemoCustomer}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold text-sm shadow-xs transition-colors cursor-pointer"
          >
            <span className="font-extrabold text-base">💬</span>
            <span>카카오 간편 로그인 (원클릭 체험)</span>
          </button>

          {/* Quick Admin Access */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleDemoAdmin}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>관리자 계정으로 테스트 로그인</span>
            </button>
          </div>
        </div>

        {/* Benefits notice */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500 space-y-2">
          <div className="flex items-center gap-2 text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>비회원도 첫 예약 즉시 3분 만에 간편 접수 완료</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>개인정보 안전 암호화 및 안심 배상책임 1억원 보호</span>
          </div>
        </div>

      </div>
    </div>
  );
};
