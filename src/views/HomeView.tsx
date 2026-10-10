import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowRight, 
  Star, 
  Users, 
  HeartHandshake, 
  Check, 
  Layers, 
  ChevronRight,
  Flame,
  Droplets
} from 'lucide-react';
import { SERVICES_DATA, CLEANERS_DATA, INITIAL_REVIEWS } from '../data/services';
import { BeforeAfterSection } from '../components/BeforeAfterSection';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onSelectService: (serviceId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onSelectService }) => {
  return (
    <div className="space-y-0">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle decorative background circle */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-bold mx-auto lg:mx-0">
                <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>대한민국 1등 프리미엄 가정방문 청소</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0f2b5c] tracking-tight leading-[1.15]">
                  청소는 <span className="text-[#0f2b5c]">Clean</span><span className="text-emerald-500">Expert</span>에.<br />
                  <span className="text-slate-900 underline decoration-emerald-400 decoration-4 underline-offset-8">
                    당신의 시간은 당신에게.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed pt-2 max-w-2xl mx-auto lg:mx-0">
                  미뤄둔 집안 청소, 이제 직접 하지 마세요.<br className="hidden sm:inline" />
                  원하는 날짜와 시간을 선택하면 CleanExpert가 집으로 찾아갑니다.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0f2b5c] to-blue-800 hover:from-blue-900 hover:to-[#0f2b5c] text-white font-extrabold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-blue-900/20 hover:shadow-2xl transition-all cursor-pointer group"
                >
                  <Calendar className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>우리 집 청소 날짜 선택하기</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('pricing')}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-base flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>실시간 요금 계산기</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-2 sm:gap-4 text-center sm:text-left max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900">1억원 보장</div>
                    <div className="text-[11px] text-slate-500">배상책임보험</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900">100% 신원검증</div>
                    <div className="text-[11px] text-slate-500">전문 마스터</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900">4.98 평점</div>
                    <div className="text-[11px] text-slate-500">35,000+ 후기</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Visual Image Card (Inspired by reference screenshot) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80"
                  alt="CleanExpert 전문 마스터 청소 현장"
                  className="w-full h-[450px] object-cover opacity-95 hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2b5c]/80 via-transparent to-black/20"></div>

                {/* Floating Top Card */}
                <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">전문 아카데미 60h 수료</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">본사 직속 공인 클리너</p>
                  </div>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-5 inset-x-5 bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 text-white border border-slate-700/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> 100℃ 고온 스팀 & 독일 친환경 케어
                    </span>
                    <span className="text-[11px] bg-blue-600/80 px-2 py-0.5 rounded-full font-bold">
                      오늘 예약 가능
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>서울·경기·인천 365일 연중무휴</span>
                    <span className="font-extrabold text-white">49,000원부터~</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge on Corner */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" alt="클리너" />
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80" alt="클리너" />
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80" alt="클리너" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">35,000+ 완료</div>
                  <div className="text-[10px] text-slate-500">실시간 만족도 99.4%</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. Empathy / Pain Points Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0f2b5c] text-xs font-bold mb-3">
              고객님의 주말과 저녁을 위한 서비스
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f2b5c] tracking-tight">
              “쉬는 날까지 청소하느라 바쁘셨나요?”
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              쌓인 먼지, 주방의 기름때, 욕실의 물때.<br className="hidden sm:inline" />
              혼자 해결하기 버거운 집안 청소를 CleanExpert에 맡겨보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0f2b5c] flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                💼
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mb-2">바쁜 직장인</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                퇴근 후 녹초가 되어 청소할 엄두가 안 날 때, 외출한 사이 집이 호텔처럼 정돈됩니다.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                👫
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mb-2">맞벌이 부부</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                주말마다 청소 분담 때문에 다투지 마세요. 둘만의 휴식과 데이트 시간을 되찾아 드립니다.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                🍼
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mb-2">육아 가정</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                기어 다니는 아기를 위한 100% 에코서트 친환경 세제와 100℃ 고온 스팀 살균을 제공합니다.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                ✨
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mb-2">정기 관리 고객</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                주 1회/격주 전담 매니저 배정으로 언제나 환하고 위생적인 주거 컨디션을 유지합니다.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Service Introduction Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                맞춤형 청소 프로그램
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f2b5c] mt-2">
                “우리 집에 필요한 청소만 선택하세요.”
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                투명한 기준과 구체적인 청소 범위로 방문 전 기대 차이를 완벽히 없앱니다.
              </p>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#0f2b5c] hover:text-emerald-600 cursor-pointer"
            >
              <span>전체 서비스 상세 범위 보기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES_DATA.map((srv) => (
              <div 
                key={srv.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col group"
              >
                {/* Card Thumbnail */}
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#0f2b5c]/90 text-white text-xs font-bold shadow-xs">
                      {srv.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-1 rounded-md bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-bold">
                      {srv.durationLabel}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {srv.tagline}
                    </p>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    {srv.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">시작 가격</span>
                      <span className="text-base font-black text-[#0f2b5c]">
                        {srv.basePrice.toLocaleString()}원~
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        onSelectService(srv.id);
                        onNavigate('booking');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 group-hover:bg-[#0f2b5c] group-hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>선택</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Trust & Security Section (신뢰 영역) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              CleanExpert 4대 안심 보증
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f2b5c] mt-3">
              “누가 오는지, 어디까지 청소하는지, 미리 확인하세요.”
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              낯선 사람을 집에 들이는 일, 불안하지 않도록 원칙과 자격으로 증명합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">100% 신원 및 범죄조회</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                주민등록초본 및 범죄경력 사실조회를 100% 완료한 클리너만 엄격 선발합니다.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center mx-auto shadow-md">
                <Award className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">아카데미 60h 정규 교육</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                공간별 표준 청소 매뉴얼과 친환경 장비 조작 실습을 마친 공인 마스터만 배정됩니다.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center mx-auto shadow-md">
                <HeartHandshake className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">현대해상 1억원 배상보험</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                작업 중 발생하는 미세한 가구 손상이나 파손 시에도 본사 안심센터에서 100% 보상합니다.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">24시간 불만족 A/S 보장</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                청소 후 미흡한 부분이 발견되면 24시간 내 무상 재방문 케어를 전액 무료 진행합니다.
              </p>
            </div>

          </div>

          {/* Cleaner Profiles Spotlight */}
          <div className="bg-gradient-to-br from-slate-900 to-[#0f2b5c] rounded-3xl p-6 sm:p-10 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  CERTIFIED CLEANING EXPERTS
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-1">
                  우리 집에 방문할 전담 마스터 클리너
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                CleanExpert는 용역 외주 알바를 쓰지 않습니다. 본사 정직원 및 전속 마스터만이 방문합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CLEANERS_DATA.map((cleaner) => (
                <div key={cleaner.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-emerald-400/50 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={cleaner.avatarUrl}
                      alt={cleaner.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{cleaner.name} {cleaner.title}</h4>
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="font-bold">{cleaner.rating}</span>
                        <span className="text-slate-400 text-[10px]">({cleaner.completedJobs}건)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-300 font-medium mb-1">
                    자격: {cleaner.certification}
                  </p>
                  <p className="text-[11px] text-slate-300">
                    전문: {cleaner.specialty}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. Process Section (이용 과정) */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-600">간편한 4단계</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f2b5c] mt-2">
              CleanExpert 이용 과정
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              복잡한 견적 상담 없이, 온라인에서 3분 만에 예약하고 편안하게 기다리세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0f2b5c] font-black text-base flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">서비스 & 주소 선택</h3>
              <p className="text-xs text-slate-600">
                원하는 청소 종류(기본, 집중, 정기, 이사)와 주거 면적, 지역을 입력합니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0f2b5c] font-black text-base flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">날짜·시간 슬롯 선택</h3>
              <p className="text-xs text-slate-600">
                달력에서 실시간 잔여 슬롯을 확인하고 희망 방문 시작 시간을 선택합니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0f2b5c] font-black text-base flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">예약 접수 및 확정</h3>
              <p className="text-xs text-slate-600">
                접수 완료 후 전담 매니저 매칭 및 확정 안내를 카카오톡과 문자로 전달드립니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black text-base flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">방문 청소 & 힐링</h3>
              <p className="text-xs text-slate-600">
                전문 장비를 갖춘 매니저가 방문해 꼼꼼히 청소하고 완료 보고서를 전송합니다.
              </p>
            </div>

          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigate('booking')}
              className="px-8 py-3.5 rounded-xl bg-[#0f2b5c] hover:bg-blue-900 text-white font-bold text-sm inline-flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>지금 3분 만에 예약 시작하기</span>
            </button>
          </div>

        </div>
      </section>

      {/* 6. Before & After Section */}
      <BeforeAfterSection />

      {/* 7. Real Customer Reviews */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-emerald-600">검증된 생생 이용후기</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f2b5c] mt-2">
                실제 고객들의 리얼 만족 후기
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                시공을 완료한 실사용자만 작성할 수 있는 100% 검증 리뷰입니다.
              </p>
            </div>
            <button
              onClick={() => onNavigate('reviews')}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#0f2b5c] hover:text-emerald-600 cursor-pointer"
            >
              <span>후기 더보기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIAL_REVIEWS.map((rev) => (
              <div key={rev.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-800">
                    {rev.userName} · <span className="text-emerald-600 font-semibold">{rev.region}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {rev.areaSize} / {rev.cleanerName}
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed pt-1">
                    “{rev.content}”
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-emerald-700 font-medium">✓ 시공 인증 완료</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. Bottom CTA (마지막 예약 영역) */}
      <section className="py-20 sm:py-24 bg-gradient-to-r from-[#0f2b5c] via-blue-900 to-[#0f2b5c] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold border border-white/10">
            <Sparkles className="w-4 h-4" />
            <span>청소를 맡기면 내 시간이 돌아옵니다</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            “다음 쉬는 날은, 청소 대신 쉬세요.”
          </h2>

          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal">
            원하는 날짜와 시간만 선택하세요. 전문 매니저가 찾아가 깨끗한 공간과 여유로운 주말을 선물합니다.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('booking')}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5 text-slate-950" />
              <span>방문 청소 예약하기</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('services')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/20 transition-colors cursor-pointer"
            >
              서비스 범위 및 요금 보기
            </button>
          </div>

          <p className="text-xs text-slate-300 pt-2">
            ※ 방문 24시간 전 100% 무료 취소 | 현대해상 1억원 배상보험 전원 가입
          </p>
        </div>
      </section>

    </div>
  );
};
