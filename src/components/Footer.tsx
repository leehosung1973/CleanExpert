import React from 'react';
import { Sparkles, Phone, ShieldCheck, Clock, Award, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      {/* Trust Badges Bar */}
      <div className="border-b border-slate-800 py-8 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm">현대해상 1억원 배상보험</h4>
                <p className="text-slate-400 text-xs">작업 중 파손 100% 보상 보증</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm">100% 신원·자격 검증</h4>
                <p className="text-slate-400 text-xs">아카데미 60시간 수료 마스터</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm">24시간 만족 보장제</h4>
                <p className="text-slate-400 text-xs">미흡 시 무상 재방문 A/S</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm">365일 연중무휴 방문</h4>
                <p className="text-slate-400 text-xs">원하는 날짜·시간 즉시 매칭</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Clean<span className="text-emerald-400">Expert</span>
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              “청소를 맡기면 내 시간이 돌아옵니다.”<br />
              CleanExpert는 직장인, 맞벌이 부부, 육아 가정을 위한 대한민국 대표 프리미엄 가정방문 청소 전문 서비스입니다. 엄격히 검증된 전문가와 친환경 장비로 언제나 안심할 수 있는 공간을 약속합니다.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p>상호명: (주)클린엑스퍼트코리아 | 대표이사: 홍길동</p>
              <p>사업자등록번호: 214-88-09124 | 통신판매업신고: 제2026-서울강남-1402호</p>
              <p>본사: 서울특별시 강남구 테헤란로 152 강남파이낸스센터 18층</p>
            </div>
          </div>

          {/* Quick Menu */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">서비스 바로가기</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-emerald-400 cursor-pointer">
                  기본 방문 청소
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-emerald-400 cursor-pointer">
                  주방·욕실 집중 케어
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-emerald-400 cursor-pointer">
                  정기 케어 청소 (15% 할인)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-emerald-400 cursor-pointer">
                  이사·입주 전 청소
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-emerald-400 cursor-pointer">
                  실시간 견적 계산기
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Info */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">고객 지원 & 안심</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('reviews')} className="hover:text-emerald-400 cursor-pointer">
                  실제 고객 이용 후기
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-emerald-400 cursor-pointer">
                  자주 묻는 질문 (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mypage')} className="hover:text-emerald-400 cursor-pointer">
                  내 예약 확인 및 변경·취소
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-emerald-400 cursor-pointer">
                  운영 관리자 페이지
                </button>
              </li>
              <li>
                <span className="text-slate-400">서비스 가능 지역 (서울·경기·인천)</span>
              </li>
            </ul>
          </div>

          {/* Contact Box */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm mb-2">고객센터 안내</h4>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Phone className="w-4 h-4 text-emerald-400" />
                1588-7240
              </div>
              <p className="text-xs text-slate-300">
                운영시간: 08:00 ~ 20:00 (연중무휴)
              </p>
              <p className="text-[11px] text-slate-400">
                카카오톡 채널: @CleanExpert
              </p>
              <button
                onClick={() => onNavigate('booking')}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                우리 집 청소 날짜 선택하기
              </button>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© 2026 CleanExpert Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">이용약관</span>
            <span className="hover:text-slate-300 cursor-pointer font-bold text-slate-300">개인정보처리방침</span>
            <span className="hover:text-slate-300 cursor-pointer">책임배상약관</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
