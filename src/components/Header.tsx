import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  User, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const { currentUser, isAdmin, signOut, toggleAdminMode } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: '홈' },
    { id: 'services', label: '서비스 안내' },
    { id: 'pricing', label: '이용요금' },
    { id: 'reviews', label: '고객 후기' },
    { id: 'faq', label: '자주 묻는 질문' },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
          <Sparkles className="w-3.5 h-3.5" /> 10월 첫 예약 특별 혜택
        </span>
        <span className="text-slate-300 hidden sm:inline">|</span>
        <span className="text-slate-300">
          지금 예약 시 100℃ 고온 스팀 배수구 살균 무상 제공
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0f2b5c] to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-[#0f2b5c] font-sans">
                  Clean<span className="text-emerald-500">Expert</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hidden sm:inline-block">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                가정방문 청소 전문 파트너
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  currentView === item.id
                    ? 'text-emerald-600 bg-emerald-50/70 font-bold'
                    : 'text-slate-700 hover:text-[#0f2b5c] hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Admin Switch Button */}
            <button
              onClick={() => {
                if (currentView === 'admin') {
                  onNavigate('home');
                } else {
                  onNavigate('admin');
                }
              }}
              title="관리자 전용 대시보드 전환"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">관리자</span>
              {isAdmin && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              )}
            </button>

            {/* Auth Button or User Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-medium cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    {currentUser.displayName ? currentUser.displayName.slice(0, 1) : 'U'}
                  </div>
                  <span className="max-w-[80px] truncate hidden sm:inline">
                    {currentUser.displayName || '회원'}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 text-xs z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900 truncate">{currentUser.displayName}</p>
                      <p className="text-slate-500 text-[11px] truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('mypage');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" /> 마이페이지 (내 예약)
                    </button>
                    <button
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> 로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#0f2b5c] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                로그인
              </button>
            )}

            {/* Primary Reservation CTA Button */}
            <button
              onClick={() => onNavigate('booking')}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#0f2b5c] to-blue-800 hover:from-blue-900 hover:to-[#0f2b5c] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-blue-900/15 hover:shadow-lg transition-all cursor-pointer group"
            >
              <Calendar className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>날짜 선택하고 예약하기</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  currentView === item.id
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  onNavigate('mypage');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
              >
                <span>마이페이지 (예약 확인·변경)</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
              >
                <span>관리자 전용 일정관리</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
