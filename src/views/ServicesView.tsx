import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  HelpCircle,
  PlusCircle
} from 'lucide-react';
import { SERVICES_DATA, ADDON_OPTIONS } from '../data/services';
import { ServiceType } from '../types';

interface ServicesViewProps {
  onNavigate: (view: string) => void;
  onSelectService: (serviceId: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate, onSelectService }) => {
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceType>('basic');
  const activeService = SERVICES_DATA.find((s) => s.id === selectedServiceId) || SERVICES_DATA[0];

  const handleBookWithService = (id: string) => {
    onSelectService(id);
    onNavigate('booking');
  };

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            투명한 청소 범위 안내
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0f2b5c] tracking-tight">
            우리 집에 꼭 필요한 서비스 안내
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            CleanExpert는 공간별 포함 항목과 제외 항목을 사전에 명확히 공개하여 기대 차이 없는 완벽한 만족을 드립니다.
          </p>
        </div>

        {/* Service Type Tab Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {SERVICES_DATA.map((srv) => (
            <button
              key={srv.id}
              onClick={() => setSelectedServiceId(srv.id)}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                selectedServiceId === srv.id
                  ? 'bg-white border-[#0f2b5c] shadow-lg ring-2 ring-[#0f2b5c]/10'
                  : 'bg-white/80 border-slate-200 hover:bg-white text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                  selectedServiceId === srv.id
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {srv.badge}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {srv.durationLabel}
                </span>
              </div>
              <h3 className={`font-extrabold text-base sm:text-lg ${
                selectedServiceId === srv.id ? 'text-[#0f2b5c]' : 'text-slate-800'
              }`}>
                {srv.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                {srv.basePrice.toLocaleString()}원~
              </p>
            </button>
          ))}
        </div>

        {/* Selected Service Detailed Breakdown Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          
          {/* Top Banner of Active Service */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-slate-100 pb-8">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-blue-100 text-[#0f2b5c] font-black text-xs">
                  {activeService.badge}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  예상 소요시간: {activeService.durationLabel}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                {activeService.name}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {activeService.description}
              </p>
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-900">
                <strong>추천 대상:</strong> {activeService.recommendedFor}
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
              <span className="text-xs text-slate-500">기본 시작 요금 (원룸/소형 기준)</span>
              <div className="text-3xl font-black text-[#0f2b5c]">
                {activeService.basePrice.toLocaleString()}원~
              </div>
              <p className="text-[11px] text-slate-500">
                평수 및 추가 옵션 선택에 따라 최종 견적이 산출됩니다.
              </p>
              <button
                onClick={() => handleBookWithService(activeService.id)}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0f2b5c] to-blue-800 hover:from-blue-900 hover:to-[#0f2b5c] text-white font-bold text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>이 서비스로 날짜 선택하기</span>
              </button>
            </div>
          </div>

          {/* Included vs Excluded Scope (기대 차이 줄이기 핵심) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Included */}
            <div className="bg-emerald-50/40 rounded-2xl p-6 border border-emerald-200/60 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="font-extrabold text-base">청소 포함 항목 (기본 제공)</h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                {activeService.included.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Excluded */}
            <div className="bg-rose-50/40 rounded-2xl p-6 border border-rose-200/60 space-y-4">
              <div className="flex items-center gap-2 text-rose-800">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <h3 className="font-extrabold text-base">청소 제외 항목 (미포함 영역)</h3>
              </div>
              <p className="text-xs text-slate-500">
                안전 사고 예방 및 파손 방지를 위해 다음 작업은 정중히 제외됩니다.
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                {activeService.excluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                    <span className="leading-relaxed text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Add-on Options Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900">
              함께 선택 가능한 프리미엄 추가 옵션
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              필요한 곳만 콕 집어 선택하세요. 예약 단계에서 언제든 추가할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADDON_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                      +{opt.durationMinutes}분 소요
                    </span>
                    <span className="text-sm font-black text-emerald-600">
                      +{opt.price.toLocaleString()}원
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{opt.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Booking Banner */}
        <div className="bg-[#0f2b5c] rounded-3xl p-8 sm:p-10 text-white text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-black">
            우리 집에 맞는 청소 서비스를 결정하셨나요?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            원하는 날짜와 시간대를 선택하면 전문 매니저가 지정되어 완벽하게 케어해드립니다.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleBookWithService(selectedServiceId)}
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg cursor-pointer inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>날짜 선택하고 예약하기</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
