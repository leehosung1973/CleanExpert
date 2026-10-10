import React, { useState } from 'react';
import { 
  Calculator, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SERVICES_DATA, AREA_SIZE_OPTIONS, ADDON_OPTIONS } from '../data/services';
import { ServiceType, AreaSize } from '../types';

interface PricingViewProps {
  onNavigate: (view: string) => void;
  onStartBookingWithParams: (serviceId: ServiceType, areaSize: AreaSize, options: string[]) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ 
  onNavigate, 
  onStartBookingWithParams 
}) => {
  // Calculator state
  const [calcService, setCalcService] = useState<ServiceType>('basic');
  const [calcArea, setCalcArea] = useState<AreaSize>('21_30');
  const [calcOptions, setCalcOptions] = useState<string[]>(['opt_phytoncide']);

  // Calculate pricing
  const currentService = SERVICES_DATA.find((s) => s.id === calcService) || SERVICES_DATA[0];
  const currentArea = AREA_SIZE_OPTIONS.find((a) => a.id === calcArea) || AREA_SIZE_OPTIONS[2];
  
  // Base cost = service base * area multiplier
  const baseCost = Math.round(currentService.basePrice * currentArea.priceMultiplier / 1000) * 1000;
  
  // Addon costs
  const addonCost = calcOptions.reduce((sum, optId) => {
    const opt = ADDON_OPTIONS.find((o) => o.id === optId);
    return sum + (opt ? opt.price : 0);
  }, 0);

  const totalEstimatedCost = baseCost + addonCost;

  // Duration calc
  const addonDurationMins = calcOptions.reduce((sum, optId) => {
    const opt = ADDON_OPTIONS.find((o) => o.id === optId);
    return sum + (opt ? opt.durationMinutes : 0);
  }, 0);
  const totalDurationHours = currentService.defaultDurationHours + currentArea.timeBonusHours + (addonDurationMins / 60);

  const toggleOption = (id: string) => {
    setCalcOptions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBookFromCalculator = () => {
    onStartBookingWithParams(calcService, calcArea, calcOptions);
  };

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0f2b5c] text-xs font-bold border border-blue-200">
            정찰제 기반 투명한 요금
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0f2b5c] tracking-tight">
            이용요금 및 실시간 견적기
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            숨겨진 추가 비용 없이, 평수와 원하는 옵션에 따라 정직하게 계산됩니다.
          </p>
        </div>

        {/* 1. Interactive Instant Cost Calculator */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg max-w-5xl mx-auto">
          
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                실시간 예상 견적 계산기
              </h2>
              <p className="text-xs text-slate-500">
                우리 집 평수와 희망 청소를 선택하면 즉시 견적과 소요시간이 산출됩니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Inputs Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step A: Service Type */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                  1. 청소 서비스 종류
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {SERVICES_DATA.map((srv) => (
                    <button
                      key={srv.id}
                      onClick={() => setCalcService(srv.id)}
                      className={`p-3 sm:p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                        calcService === srv.id
                          ? 'border-[#0f2b5c] bg-blue-50/50 ring-2 ring-[#0f2b5c]/10 text-[#0f2b5c]'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="font-extrabold text-xs sm:text-sm">{srv.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{srv.basePrice.toLocaleString()}원부터~</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step B: Area Size */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                  2. 주거 공급 면적 (평수)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AREA_SIZE_OPTIONS.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setCalcArea(area.id)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        calcArea === area.id
                          ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/10 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold">{area.label}</div>
                      <div className="text-[11px] text-slate-500">{area.pyeong}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step C: Add-on Options */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                  3. 추가 옵션 선택 (중복 가능)
                </label>
                <div className="space-y-2">
                  {ADDON_OPTIONS.map((opt) => {
                    const isChecked = calcOptions.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleOption(opt.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'border-emerald-500 bg-emerald-50/30'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 pointer-events-none"
                          />
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-slate-800">
                              {opt.name}
                            </span>
                            <span className="text-[11px] text-slate-500 ml-2">
                              (+{opt.durationMinutes}분)
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-slate-900">
                          +{opt.price.toLocaleString()}원
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Result Quote Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0f2b5c] to-blue-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
              <div className="space-y-6">
                
                <div className="border-b border-blue-800/80 pb-4">
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                    ESTIMATED QUOTE
                  </span>
                  <h3 className="text-xl font-black mt-1 text-white">
                    예상 견적 요약
                  </h3>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>선택 서비스</span>
                    <span className="font-bold text-white">{currentService.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>주거 평수</span>
                    <span className="font-bold text-white">{currentArea.label}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>기본 서비스 요금</span>
                    <span className="font-bold text-white">{baseCost.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>추가 옵션 ({calcOptions.length}개)</span>
                    <span className="font-bold text-white">+{addonCost.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300 border-t border-blue-800/60 pt-3">
                    <span className="flex items-center gap-1 text-emerald-300">
                      <Clock className="w-4 h-4" /> 예상 작업 시간
                    </span>
                    <span className="font-bold text-emerald-300">
                      약 {totalDurationHours.toFixed(1)}시간
                    </span>
                  </div>
                </div>

                {/* Total Price Display */}
                <div className="bg-white/10 rounded-xl p-4 border border-white/10 text-center">
                  <span className="text-xs text-slate-300 block mb-1">총 예상 금액 (VAT 포함)</span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-300">
                    {totalEstimatedCost.toLocaleString()}<span className="text-xl text-white font-normal">원</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    방문 전 현장 결제 또는 예약 확정 후 결제
                  </p>
                </div>

              </div>

              <div className="pt-6">
                <button
                  onClick={handleBookFromCalculator}
                  className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg transition-transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-slate-950" />
                  <span>이 조건으로 날짜 선택하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* 2. Standard Pricing Reference Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs max-w-5xl mx-auto space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              평수 및 서비스별 기준 요금표
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              * 정기 케어 이용 시 매 회차 15% 추가 할인 적용된 금액입니다.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                  <th className="py-3 px-4">주거 면적</th>
                  <th className="py-3 px-4">기본 방문 청소</th>
                  <th className="py-3 px-4 text-[#0f2b5c]">주방·욕실 집중 케어</th>
                  <th className="py-3 px-4 text-emerald-700">정기 케어 (회당)</th>
                  <th className="py-3 px-4">이사·입주 집중 청소</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {AREA_SIZE_OPTIONS.map((area) => (
                  <tr key={area.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {area.label} <span className="text-[11px] text-slate-400">({area.pyeong})</span>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {Math.round(59000 * area.priceMultiplier / 1000 * 1000).toLocaleString()}원
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0f2b5c]">
                      {Math.round(89000 * area.priceMultiplier / 1000 * 1000).toLocaleString()}원
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600">
                      {Math.round(52000 * area.priceMultiplier / 1000 * 1000).toLocaleString()}원
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {Math.round(169000 * area.priceMultiplier / 1000 * 1000).toLocaleString()}원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Additional Cost Conditions (추가 비용 조건 투명 고지) */}
        <div className="bg-amber-50/60 rounded-3xl p-6 sm:p-8 border border-amber-200/80 max-w-5xl mx-auto space-y-4">
          <div className="flex items-center gap-2.5 text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <h3 className="font-extrabold text-base sm:text-lg">
              추가 요금 발생 기준 (사전 투명 공시)
            </h3>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            CleanExpert는 사전에 협의되지 않은 일방적인 현장 추가 요금을 절대 요구하지 않습니다.<br />
            다만, 아래의 특수 환경에 해당하는 경우 사전에 고객님께 동의를 구한 후 합리적 비용이 조정될 수 있습니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
            <div className="p-3 bg-white rounded-xl border border-amber-200">
              <strong>1. 복층 구조 또는 층고 3.5m 이상</strong>
              <p className="text-slate-500 mt-0.5">안전 사다리 작업 및 층간 이동에 따른 20,000원 추가</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-amber-200">
              <strong>2. 쓰레기 방 또는 심각한 특수 오염</strong>
              <p className="text-slate-500 mt-0.5">종량제 100L 초과 폐기물 배출 시 현장 협의 후 인력 추가</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-amber-200">
              <strong>3. 베란다 창문 시트지 / 뽁뽁이 전체 제거</strong>
              <p className="text-slate-500 mt-0.5">유리 손상 방지 약품 스크래핑 작업 창당 15,000원</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-amber-200">
              <strong>4. 반려동물 다량 배설물 현장</strong>
              <p className="text-slate-500 mt-0.5">특수 살균 소독 및 배설물 수거 전용 키트 비용 20,000원</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
