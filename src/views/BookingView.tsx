import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Home, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Phone, 
  Key, 
  FileText,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { SERVICES_DATA, AREA_SIZE_OPTIONS, ADDON_OPTIONS, SERVICE_REGIONS } from '../data/services';
import { ServiceType, HomeType, AreaSize, TimeSlot, Booking } from '../types';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

interface BookingViewProps {
  initialServiceId?: ServiceType;
  initialAreaSize?: AreaSize;
  initialOptions?: string[];
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  initialServiceId = 'basic',
  initialAreaSize = '21_30',
  initialOptions = [],
  onNavigate,
  onOpenAuth
}) => {
  const { createBooking, getSlotAvailability } = useBooking();
  const { currentUser, signInWithGoogle, signInDemoCustomer } = useAuth();

  // Wizard Step: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7
  const [step, setStep] = useState<number>(1);

  // Form states
  const [serviceType, setServiceType] = useState<ServiceType>(initialServiceId);
  const [selectedCity, setSelectedCity] = useState<string>('서울');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('강남구');
  const [addressLine, setAddressLine] = useState<string>('');
  const [addressDetail, setAddressDetail] = useState<string>('');

  const [homeType, setHomeType] = useState<HomeType>('apartment');
  const [areaSize, setAreaSize] = useState<AreaSize>(initialAreaSize);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(initialOptions);

  // Date selection (default to tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>('morning_09');

  // Customer contact info
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [entryInfo, setEntryInfo] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [hasPets, setHasPets] = useState<boolean>(false);
  const [hasParking, setHasParking] = useState<boolean>(true);

  // Agreement
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  // Final confirmation result
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Auto populate customer info if logged in
  useEffect(() => {
    if (currentUser) {
      if (!customerName && currentUser.displayName) {
        setCustomerName(currentUser.displayName);
      }
      if (!customerPhone) {
        setCustomerPhone('010-8912-3401');
      }
    }
  }, [currentUser]);

  // Pricing calculations
  const serviceDetail = SERVICES_DATA.find((s) => s.id === serviceType) || SERVICES_DATA[0];
  const areaDetail = AREA_SIZE_OPTIONS.find((a) => a.id === areaSize) || AREA_SIZE_OPTIONS[2];
  const baseCost = Math.round(serviceDetail.basePrice * areaDetail.priceMultiplier / 1000) * 1000;
  const addonCost = selectedOptions.reduce((sum, optId) => {
    const opt = ADDON_OPTIONS.find((o) => o.id === optId);
    return sum + (opt ? opt.price : 0);
  }, 0);
  const totalPrice = baseCost + addonCost;

  const addonMins = selectedOptions.reduce((sum, optId) => {
    const opt = ADDON_OPTIONS.find((o) => o.id === optId);
    return sum + (opt ? opt.durationMinutes : 0);
  }, 0);
  const durationHours = serviceDetail.defaultDurationHours + areaDetail.timeBonusHours + (addonMins / 60);

  // Slot availability for current chosen date
  const slotStatus = getSlotAvailability(selectedDate);

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    setErrorMessage('');
    if (step === 1) {
      if (!selectedDistrict) {
        setErrorMessage('방문 서비스 지역을 선택해주세요.');
        return;
      }
    }
    if (step === 3) {
      if (!slotStatus.slots[selectedSlot].available) {
        setErrorMessage('선택하신 시간대는 예약이 마감되었습니다. 다른 시간대를 선택해주세요.');
        return;
      }
    }
    if (step === 5) {
      if (!customerName.trim() || !customerPhone.trim()) {
        setErrorMessage('성함과 연락처를 모두 입력해주세요.');
        return;
      }
      if (!addressDetail.trim() && !addressLine.trim()) {
        setErrorMessage('상세 주소(동, 호수)를 입력해주세요.');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const handlePrev = () => {
    setErrorMessage('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit Final Booking
  const handleFinalSubmit = async () => {
    if (!agreeTerms) {
      setErrorMessage('약관 및 취소 규정에 동의해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const fullAddress = `${selectedCity} ${selectedDistrict} ${addressLine}`.trim();
      const userId = currentUser ? currentUser.uid : `guest-${Date.now()}`;

      const newBooking = await createBooking({
        userId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        address: fullAddress || `${selectedCity} ${selectedDistrict}`,
        addressDetail: addressDetail.trim() || '상세 주소 현장 안내',
        postalCode: '06123',
        region: `${selectedCity} ${selectedDistrict}`,
        serviceType,
        homeType,
        areaSize,
        options: selectedOptions,
        date: selectedDate,
        timeSlot: selectedSlot,
        durationHours: Number(durationHours.toFixed(1)),
        totalPrice,
        notes: notes.trim(),
        entryInfo: entryInfo.trim(),
        hasPets,
        hasParking,
      });

      setCreatedBooking(newBooking);
      setStep(7); // Success Step

      // Launch celebration confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      setErrorMessage(err.message || '예약 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate 14 selectable dates from tomorrow
  const availableDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[d.getDay()];
    return {
      dateStr,
      display: `${d.getMonth() + 1}/${d.getDate()} (${dayName})`,
      isWeekend: d.getDay() === 0 || d.getDay() === 6
    };
  });

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Tracker (Steps 1 to 6) */}
        {step < 7 && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span className="text-[#0f2b5c] font-black">단계 {step} / 6</span>
              <span>
                {step === 1 && '1. 서비스 & 지역'}
                {step === 2 && '2. 평수 & 옵션'}
                {step === 3 && '3. 날짜 & 시간'}
                {step === 4 && '4. 고객 확인'}
                {step === 5 && '5. 방문 상세 정보'}
                {step === 6 && '6. 최종 확인'}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#0f2b5c] to-emerald-500 h-full transition-all duration-300"
                style={{ width: `${(step / 6) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Error message alert banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: 서비스 & 주소 선택 */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600">STEP 1</span>
              <h2 className="text-2xl font-black text-[#0f2b5c]">
                어떤 청소와 방문 지역이 필요하신가요?
              </h2>
              <p className="text-xs text-slate-500">
                원하는 청소 종류를 선택하고 서비스 가능 지역을 확인해주세요.
              </p>
            </div>

            {/* Service Selection */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-700 block">청소 종류 선택</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES_DATA.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => setServiceType(srv.id)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      serviceType === srv.id
                        ? 'border-[#0f2b5c] bg-blue-50/50 ring-2 ring-[#0f2b5c]/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        {srv.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{srv.basePrice.toLocaleString()}원~</span>
                    </div>
                    <div className="font-extrabold text-base text-slate-900">{srv.name}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-1">{srv.tagline}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Region check */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-extrabold text-slate-700 block">
                방문 서비스 가능 지역 확인
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">시 / 도</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      const cityObj = SERVICE_REGIONS.find((c) => c.city === e.target.value);
                      if (cityObj && cityObj.districts.length > 0) {
                        setSelectedDistrict(cityObj.districts[0]);
                      }
                    }}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold focus:outline-emerald-500"
                  >
                    {SERVICE_REGIONS.map((r) => (
                      <option key={r.city} value={r.city}>{r.city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">시 / 군 / 구</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold focus:outline-emerald-500"
                  >
                    {SERVICE_REGIONS.find((r) => r.city === selectedCity)?.districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service verification feedback */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>{selectedCity} {selectedDistrict}</strong>은 CleanExpert 전문 매니저 방문 지원 지역입니다!
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleNext}
                className="px-8 py-3.5 rounded-xl bg-[#0f2b5c] hover:bg-blue-900 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>다음: 평수 및 옵션 선택</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 면적 및 추가 옵션 선택 */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600">STEP 2</span>
              <h2 className="text-2xl font-black text-[#0f2b5c]">
                주거 형태와 평수, 추가 옵션을 선택해주세요
              </h2>
              <p className="text-xs text-slate-500">
                실제 면적과 옵션에 맞추어 맞춤 장비와 적정 인력이 배정됩니다.
              </p>
            </div>

            {/* Home Type */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 block">주거 형태</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'apartment', label: '아파트' },
                  { id: 'officetel', label: '오피스텔' },
                  { id: 'villa', label: '빌라 / 연립' },
                  { id: 'house', label: '단독 / 주택' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setHomeType(type.id as HomeType)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      homeType === type.id
                        ? 'border-[#0f2b5c] bg-blue-50 text-[#0f2b5c] ring-2 ring-[#0f2b5c]/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Size */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 block">공급 면적 (평수)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AREA_SIZE_OPTIONS.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => setAreaSize(area.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                      areaSize === area.id
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold ring-2 ring-emerald-600/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-sm font-bold">{area.label}</div>
                    <div className="text-[11px] text-slate-500">{area.pyeong}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-extrabold text-slate-700 block">
                추가 옵션 (원하시는 공간 집중 선택)
              </label>
              <div className="space-y-2">
                {ADDON_OPTIONS.map((opt) => {
                  const isChecked = selectedOptions.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleOption(opt.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/30'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-emerald-600 rounded border-slate-300 pointer-events-none"
                        />
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900">{opt.name}</div>
                          <div className="text-[11px] text-slate-500">{opt.description} (+{opt.durationMinutes}분)</div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-700">
                        +{opt.price.toLocaleString()}원
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Estimate preview box */}
            <div className="bg-slate-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">현재 예상 견적 (VAT 포함)</span>
                <div className="text-lg font-black text-[#0f2b5c]">
                  {totalPrice.toLocaleString()}원
                  <span className="text-xs text-slate-500 font-normal ml-2">
                    (예상 약 {durationHours.toFixed(1)}시간)
                  </span>
                </div>
              </div>
              <div className="text-xs text-emerald-700 font-bold">
                ✓ 24시간 전 무료 취소
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={handlePrev}
                className="px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm cursor-pointer hover:bg-slate-50"
              >
                이전 단계
              </button>
              <button
                onClick={handleNext}
                className="px-8 py-3.5 rounded-xl bg-[#0f2b5c] hover:bg-blue-900 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>다음: 날짜 및 시간 선택</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: 날짜 및 시간 선택 (실시간 슬롯 확인 및 마감 처리) */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600">STEP 3</span>
              <h2 className="text-2xl font-black text-[#0f2b5c]">
                원하는 방문 날짜와 시간을 선택해주세요
              </h2>
              <p className="text-xs text-slate-500">
                실제 배정 가능한 전담 매니저의 실시간 슬롯 현황입니다.
              </p>
            </div>

            {/* Date Selector Horizon */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 block">방문 일자 선택</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {availableDates.map((item) => (
                  <button
                    key={item.dateStr}
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`p-3 rounded-xl text-center border transition-all cursor-pointer ${
                      selectedDate === item.dateStr
                        ? 'border-[#0f2b5c] bg-[#0f2b5c] text-white shadow-md'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`text-xs font-extrabold ${selectedDate === item.dateStr ? 'text-white' : item.isWeekend ? 'text-blue-600' : 'text-slate-800'}`}>
                      {item.display}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Availability Selection */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-700 block">
                  방문 시작 시간 선택 ({selectedDate})
                </label>
                <span className="text-[11px] text-emerald-600 font-bold">
                  ● 실시간 마감 현황 반영
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    slot: 'morning_09' as TimeSlot,
                    timeLabel: '오전 09:00',
                    desc: '상쾌한 아침 시작 케어',
                    statusObj: slotStatus.slots.morning_09
                  },
                  {
                    slot: 'afternoon_14' as TimeSlot,
                    timeLabel: '오후 14:00',
                    desc: '가장 선호하는 낮 시간대',
                    statusObj: slotStatus.slots.afternoon_14
                  },
                  {
                    slot: 'evening_18' as TimeSlot,
                    timeLabel: '저녁 18:00',
                    desc: '퇴근 전후 야간 케어',
                    statusObj: slotStatus.slots.evening_18
                  }
                ].map((item) => {
                  const isAvailable = item.statusObj.available;
                  const isSelected = selectedSlot === item.slot;
                  const remaining = item.statusObj.total - item.statusObj.booked;

                  return (
                    <button
                      key={item.slot}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSlot(item.slot)}
                      className={`p-4 rounded-2xl text-left border transition-all relative ${
                        !isAvailable
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-600/10 cursor-pointer shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-base">{item.timeLabel}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          !isAvailable
                            ? 'bg-slate-200 text-slate-500'
                            : remaining === 1
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {!isAvailable ? '예약 마감' : `잔여 ${remaining}자리`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-[#0f2b5c] flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-blue-600" />
                <span>
                  방문 청소 소요시간은 약 <strong>{durationHours.toFixed(1)}시간</strong>이며, 매니저가 여유 있게 집중 작업합니다.
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={handlePrev}
                className="px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm cursor-pointer hover:bg-slate-50"
              >
                이전 단계
              </button>
              <button
                onClick={handleNext}
                className="px-8 py-3.5 rounded-xl bg-[#0f2b5c] hover:bg-blue-900 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>다음: 고객 확인</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: 로그인 및 정보 유지 안내 */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600">STEP 4</span>
              <h2 className="text-2xl font-black text-[#0f2b5c]">
                {currentUser ? '회원 정보가 확인되었습니다' : '간편 로그인 또는 비회원 접수'}
              </h2>
              <p className="text-xs text-slate-500">
                선택하신 청소 예약 정보는 유지되며, 마이페이지에서 예약 상태를 실시간 확인할 수 있습니다.
              </p>
            </div>

            {currentUser ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                    {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">
                      {currentUser.displayName} 고객님으로 로그인됨
                    </h4>
                    <p className="text-xs text-slate-600">{currentUser.email}</p>
                  </div>
                </div>
                <div className="text-xs text-emerald-800 pt-2 border-t border-emerald-200">
                  ✓ 예약 완료 후 마이페이지에서 즉시 상태를 확인하고 일정을 관리하실 수 있습니다.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Google Login */}
                  <button
                    onClick={async () => {
                      await signInWithGoogle();
                    }}
                    className="p-4 rounded-2xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 flex items-center justify-center gap-3 font-bold text-xs sm:text-sm shadow-xs cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>Google 계정으로 계속하기</span>
                  </button>

                  {/* Demo/Kakao */}
                  <button
                    onClick={() => signInDemoCustomer()}
                    className="p-4 rounded-2xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] flex items-center justify-center gap-2 font-bold text-xs sm:text-sm shadow-xs cursor-pointer"
                  >
                    <span>💬 카카오/간편 체험 로그인</span>
                  </button>
                </div>

                <div className="text-center py-2">
                  <span className="text-xs text-slate-400">또는</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-xs text-slate-600 mb-2">
                    로그인 없이 다음 단계에서 예약자 정보를 직접 입력하셔도 정상 접수됩니다.
                  </p>
                  <button
                    onClick={handleNext}
                    className="text-xs font-bold text-[#0f2b5c] underline hover:text-emerald-600 cursor-pointer"
                  >
                    비회원으로 바로 방문 정보 입력하기 →
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                onClick={handlePrev}
                className="px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm cursor-pointer hover:bg-slate-50"
              >
                이전 단계
              </button>
              <button
                onClick={handleNext}
                className="px-8 py-3.5 rounded-xl bg-[#0f2b5c] hover:bg-blue-900 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>다음: 방문 정보 입력</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: 방문 상세 정보 입력 */}
        {step === 5 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600">STEP 5</span>
              <h2 className="text-2xl font-black text-[#0f2b5c]">
                방문 정보와 상세 요청 사항을 입력해주세요
              </h2>
              <p className="text-xs text-slate-500">
                정확한 방문과 안전한 비대면 청소를 위해 세부 정보를 작성해주세요.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" /> 예약자 성함 *
                </label>
                <input
                  type="text"
                  placeholder="예: 홍길동"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> 연락처 (휴대폰 번호) *
                </label>
                <input
                  type="tel"
                  placeholder="예: 010-1234-5678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> 상세 주소 (동·호수) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="도로명 또는 건물명 (예: 테헤란로 152 강남파이낸스)"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500"
                />
                <input
                  type="text"
                  placeholder="동·호수 (예: 101동 1402호)"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" /> 공동현관 및 도어락 출입 방법 (비대면 시 필수)
              </label>
              <input
                type="text"
                placeholder="예: 공동현관 #1234*, 도어락 5678* 또는 경비실 호출 요청"
                value={entryInfo}
                onChange={(e) => setEntryInfo(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500"
              />
            </div>

            {/* Pets & Parking switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">반려동물 유무</div>
                  <div className="text-[11px] text-slate-500">강아지/고양이 등 안심 케어</div>
                </div>
                <button
                  type="button"
                  onClick={() => setHasPets(!hasPets)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    hasPets ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-xs"></span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">무료 주차 가능 여부</div>
                  <div className="text-[11px] text-slate-500">단지 내 지상/지하 주차장</div>
                </div>
                <button
                  type="button"
                  onClick={() => setHasParking(!hasParking)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    hasParking ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-xs"></span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" /> 클리너 특별 요청 메모
              </label>
              <textarea
                rows={2}
                placeholder="예: 주방 후드 기름때 위주로 신경써주세요 / 아이가 낮잠 중이니 초인종 대신 문자 남겨주세요"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={handlePrev}
                className="px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm cursor-pointer hover:bg-slate-50"
              >
                이전 단계
              </button>
              <button
                onClick={handleNext}
                className="px-8 py-3.5 rounded-xl bg-[#0f2b5c] hover:bg-blue-900 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>다음: 최종 확인 및 접수</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: 최종 확인 & 약관 동의 */}
        {step === 6 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600">STEP 6</span>
              <h2 className="text-2xl font-black text-[#0f2b5c]">
                최종 예약 내역 확인
              </h2>
              <p className="text-xs text-slate-500">
                선택하신 정보와 약관을 확인하시고 예약 접수를 완료해주세요.
              </p>
            </div>

            {/* Summary card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">선택 서비스</span>
                  <span className="font-extrabold text-slate-900 text-sm">{serviceDetail.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">방문 일시</span>
                  <span className="font-extrabold text-[#0f2b5c] text-sm">
                    {selectedDate} ({selectedSlot === 'morning_09' ? '오전 09:00' : selectedSlot === 'afternoon_14' ? '오후 14:00' : '저녁 18:00'})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">주거 형태 및 평수</span>
                  <span className="font-bold text-slate-800">{areaDetail.label}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">예약자 / 연락처</span>
                  <span className="font-bold text-slate-800">{customerName} ({customerPhone})</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block mb-0.5">방문 주소</span>
                  <span className="font-bold text-slate-800">
                    {selectedCity} {selectedDistrict} {addressLine} {addressDetail}
                  </span>
                </div>
                {selectedOptions.length > 0 && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block mb-0.5">추가 선택 옵션</span>
                    <span className="font-bold text-emerald-700">
                      {selectedOptions.map(id => ADDON_OPTIONS.find(o => o.id === id)?.name).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">예상 소요 시간</span>
                  <span className="font-bold text-slate-800 text-xs">약 {durationHours.toFixed(1)}시간</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">최종 결제 예정 금액 (VAT 포함)</span>
                  <span className="text-2xl font-black text-[#0f2b5c]">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            {/* Terms and Cancellation Policy Agreement */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded mt-0.5"
                />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 block mb-1">
                    [필수] 예약 취소·변경 규정 및 서비스 이용약관 동의
                  </strong>
                  • 방문 24시간 전까지는 위약금 없이 100% 무료 취소 및 일정 변경이 가능합니다.<br />
                  • 현대해상 1억원 배상책임보험 및 24시간 내 무상 재방문 보장제 규정에 동의합니다.
                </div>
              </label>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={handlePrev}
                disabled={isSubmitting}
                className="px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm cursor-pointer hover:bg-slate-50 disabled:opacity-50"
              >
                이전 단계
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#0f2b5c] to-blue-800 hover:from-blue-900 hover:to-[#0f2b5c] text-white font-black text-base flex items-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
              >
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>{isSubmitting ? '접수 처리 중...' : '방문 청소 예약 접수하기'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: 예약 접수 완료 화면 (프롬프트 요구 카피 완벽 적용) */}
        {step === 7 && createdBooking && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-8 animate-in zoom-in-95">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3 max-w-lg mx-auto">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                예약번호: {createdBooking.bookingNumber}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0f2b5c]">
                예약 요청이 접수되었습니다.
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                방문 일정 확인 후 예약 확정 안내를 보내드립니다.<br />
                예약 상태는 마이페이지에서 확인하실 수 있습니다.
              </p>
            </div>

            {/* Booking confirmation summary */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">예약 일시</span>
                <span className="font-bold text-slate-900">
                  {createdBooking.date} ({createdBooking.timeSlot === 'morning_09' ? '오전 09:00' : createdBooking.timeSlot === 'afternoon_14' ? '오후 14:00' : '저녁 18:00'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">신청 서비스</span>
                <span className="font-bold text-slate-900">{serviceDetail.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">방문지</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px]">
                  {createdBooking.address} {createdBooking.addressDetail}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">예상 금액</span>
                <span className="font-black text-[#0f2b5c]">{createdBooking.totalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500">현재 상태</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  접수 대기 (관리자 확인 중)
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onNavigate('mypage')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0f2b5c] hover:bg-blue-900 text-white font-bold text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>마이페이지에서 내 예약 확인하기</span>
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 cursor-pointer"
              >
                홈으로 돌아가기
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
