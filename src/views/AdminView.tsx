import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Calendar, 
  AlertTriangle, 
  X, 
  Settings, 
  Layers, 
  UserPlus, 
  Phone, 
  MapPin, 
  FileText,
  DollarSign
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Booking, BookingStatus, TimeSlot } from '../types';
import { SERVICES_DATA, CLEANERS_DATA, ADDON_OPTIONS } from '../data/services';

interface AdminViewProps {
  onNavigate: (view: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const { 
    bookings, 
    updateBookingStatus, 
    assignCleaner, 
    exportToCSV,
    maxSlotsPerWindow,
    setMaxSlotsPerWindow
  } = useBooking();
  const { isAdmin, toggleAdminMode } = useAuth();

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Modals
  const [detailModalBooking, setDetailModalBooking] = useState<Booking | null>(null);
  const [assignModalBooking, setAssignModalBooking] = useState<Booking | null>(null);
  const [selectedCleaner, setSelectedCleaner] = useState<string>(CLEANERS_DATA[0].name + ' ' + CLEANERS_DATA[0].title);
  const [slotSettingsOpen, setSlotSettingsOpen] = useState<boolean>(false);

  // Filter calculations
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBookings = bookings.filter((b) => {
    // 1. Status filter
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;

    // 2. Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        b.bookingNumber.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.region.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 3. Date range
    if (dateFilter === 'today') {
      return b.date === todayStr;
    }
    if (dateFilter === 'week') {
      const now = new Date();
      const bDate = new Date(b.date);
      const diffTime = bDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= -1 && diffDays <= 7;
    }
    if (dateFilter === 'month') {
      return b.date.startsWith(todayStr.slice(0, 7));
    }

    return true;
  });

  // KPI Metrics
  const totalBookingsCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const unassignedCount = bookings.filter((b) => !b.assignedCleaner && b.status !== 'cancelled').length;
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    await updateBookingStatus(bookingId, newStatus);
  };

  const handleConfirmAssignment = async () => {
    if (!assignModalBooking) return;
    await assignCleaner(assignModalBooking.id, selectedCleaner);
    setAssignModalBooking(null);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header Bar */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
                관리자 콘솔
              </span>
              <span className="text-xs text-slate-400">CleanExpert Dispatch & Schedule Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              방문 청소 통합 일정 & 예약 관리
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setSlotSettingsOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>슬롯 수용인원 설정</span>
            </button>

            <button
              onClick={exportToCSV}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>예약대장 엑셀(CSV) 다운로드</span>
            </button>
          </div>
        </div>

        {/* 4 Key Performance Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span>총 누적 예약</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{totalBookingsCount}건</div>
            <p className="text-[11px] text-slate-400 mt-1">시스템 실시간 반영</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span>신규 접수 (확정 대기)</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600">{pendingCount}건</div>
            <p className="text-[11px] text-slate-400 mt-1">관리자 확인 및 확정 필요</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span>담당자 배정 필요</span>
              <UserPlus className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-rose-600">{unassignedCount}건</div>
            <p className="text-[11px] text-slate-400 mt-1">전담 클리너 매칭 대기</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span>예약 총 매출액</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-[#0f2b5c]">
              {totalRevenue.toLocaleString()}원
            </div>
            <p className="text-[11px] text-slate-400 mt-1">취소 제외 정상 예약 합계</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="고객명, 연락처, 지역, 예약번호 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-emerald-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            {/* Date filter tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {[
                { id: 'all', label: '전체 일정' },
                { id: 'today', label: '오늘 방문' },
                { id: 'week', label: '이번 주' },
                { id: 'month', label: '이번 달' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDateFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    dateFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status select dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold text-slate-700"
            >
              <option value="all">전체 상태 보기</option>
              <option value="pending">접수 대기</option>
              <option value="confirmed">예약 확정</option>
              <option value="in_progress">작업 진행 중</option>
              <option value="completed">청소 완료</option>
              <option value="cancelled">예약 취소됨</option>
            </select>
          </div>

        </div>

        {/* Master Table of Bookings (프롬프트 요구 스펙 테이블 형태) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-300 font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-4">예약번호</th>
                  <th className="py-3.5 px-4">방문 일시</th>
                  <th className="py-3.5 px-4">고객명 / 연락처</th>
                  <th className="py-3.5 px-4">방문 지역 (구·동)</th>
                  <th className="py-3.5 px-4">서비스 종류</th>
                  <th className="py-3.5 px-4">금액</th>
                  <th className="py-3.5 px-4">담당자 배정</th>
                  <th className="py-3.5 px-4">상태 관리</th>
                  <th className="py-3.5 px-4 text-center">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      해당 조건의 예약 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const srv = SERVICES_DATA.find((s) => s.id === b.serviceType);

                    return (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* 예약번호 */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0f2b5c]">
                          {b.bookingNumber}
                        </td>

                        {/* 방문 일시 */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900">{b.date}</div>
                          <div className="text-[11px] text-slate-500">
                            {b.timeSlot === 'morning_09' ? '오전 09:00' : b.timeSlot === 'afternoon_14' ? '오후 14:00' : '저녁 18:00'}
                          </div>
                        </td>

                        {/* 고객명 / 연락처 */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900">{b.customerName}</div>
                          <div className="text-[11px] text-slate-500">{b.customerPhone}</div>
                        </td>

                        {/* 방문 지역 */}
                        <td className="py-3.5 px-4 max-w-[180px] truncate">
                          <div className="font-bold text-slate-900">{b.region}</div>
                          <div className="text-[11px] text-slate-500 truncate" title={`${b.address} ${b.addressDetail}`}>
                            {b.addressDetail || b.address}
                          </div>
                        </td>

                        {/* 서비스 */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-800">
                            {srv?.name || b.serviceType}
                          </span>
                        </td>

                        {/* 금액 */}
                        <td className="py-3.5 px-4 font-black text-[#0f2b5c] whitespace-nowrap">
                          {b.totalPrice.toLocaleString()}원
                        </td>

                        {/* 담당자 배정 */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {b.assignedCleaner ? (
                            <button
                              onClick={() => {
                                setAssignModalBooking(b);
                                setSelectedCleaner(b.assignedCleaner || '');
                              }}
                              className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold hover:bg-emerald-100 cursor-pointer"
                            >
                              ✓ {b.assignedCleaner}
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setAssignModalBooking(b);
                              }}
                              className="text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg font-bold hover:bg-rose-100 cursor-pointer flex items-center gap-1"
                            >
                              <UserPlus className="w-3 h-3" />
                              <span>배정하기</span>
                            </button>
                          )}
                        </td>

                        {/* 상태 변경 */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                            className={`py-1.5 px-2 rounded-lg font-bold text-xs border cursor-pointer ${
                              b.status === 'pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : b.status === 'confirmed'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : b.status === 'in_progress'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : b.status === 'completed'
                                ? 'bg-slate-100 text-slate-700 border-slate-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            <option value="pending">접수</option>
                            <option value="confirmed">확정</option>
                            <option value="in_progress">작업 중</option>
                            <option value="completed">완료</option>
                            <option value="cancelled">취소</option>
                          </select>
                        </td>

                        {/* 상세 보기 */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setDetailModalBooking(b)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                          >
                            상세
                          </button>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Booking Detail Modal */}
      {detailModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setDetailModalBooking(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-black text-[#0f2b5c] bg-blue-50 px-2.5 py-1 rounded-md">
                {detailModalBooking.bookingNumber}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                예약 상세 정보
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <span className="text-slate-400 block mb-0.5">고객명 / 연락처</span>
                  <span className="font-bold text-slate-900">
                    {detailModalBooking.customerName} ({detailModalBooking.customerPhone})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">방문 일시</span>
                  <span className="font-bold text-slate-900">
                    {detailModalBooking.date} / {detailModalBooking.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">서비스 종류</span>
                  <span className="font-bold text-slate-900">{detailModalBooking.serviceType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">금액</span>
                  <span className="font-black text-[#0f2b5c] text-sm">
                    {detailModalBooking.totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">상세 주소</span>
                <span className="font-bold text-slate-900">
                  {detailModalBooking.address} {detailModalBooking.addressDetail}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">공동현관 / 출입 정보</span>
                <span className="font-bold text-slate-900">
                  {detailModalBooking.entryInfo || '기재 없음 (현장 안내)'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">선택 옵션</span>
                <span className="font-bold text-emerald-700">
                  {detailModalBooking.options.length > 0 
                    ? detailModalBooking.options.map(id => ADDON_OPTIONS.find(o => o.id === id)?.name).join(', ')
                    : '선택 없음'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">고객 메모 및 특별 요청</span>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-800 leading-relaxed">
                  {detailModalBooking.notes || '요청 사항 없음'}
                </p>
              </div>

              <div className="flex gap-4 pt-1">
                <span>반려동물: <strong>{detailModalBooking.hasPets ? '있음' : '없음'}</strong></span>
                <span>주차 가능: <strong>{detailModalBooking.hasParking ? '가능' : '불가'}</strong></span>
                <span>배정 클리너: <strong>{detailModalBooking.assignedCleaner || '미배정'}</strong></span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailModalBooking(null)}
                className="px-6 py-2.5 rounded-xl bg-[#0f2b5c] text-white text-xs font-bold"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Cleaner Modal */}
      {assignModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              청소 전담 마스터 배정
            </h3>
            <p className="text-xs text-slate-500">
              예약번호: {assignModalBooking.bookingNumber} ({assignModalBooking.customerName} 고객님)
            </p>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                배정할 클리너 마스터 선택
              </label>
              <div className="space-y-2">
                {CLEANERS_DATA.map((cleaner) => {
                  const label = `${cleaner.name} ${cleaner.title}`;
                  return (
                    <div
                      key={cleaner.id}
                      onClick={() => setSelectedCleaner(label)}
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        selectedCleaner === label
                          ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/10'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <img src={cleaner.avatarUrl} alt={cleaner.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1 text-xs">
                        <div className="font-extrabold text-slate-900">{label}</div>
                        <div className="text-slate-500 text-[11px]">{cleaner.specialty} · 평점 {cleaner.rating}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAssignModalBooking(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              >
                취소
              </button>
              <button
                onClick={handleConfirmAssignment}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                배정 확정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slot Capacity Settings Modal */}
      {slotSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              시간대별 예약 수용 인원 설정
            </h3>
            <p className="text-xs text-slate-500">
              클리너 인력 수급 상황에 맞추어 시간대별 최대 예약 가능 인원을 조정합니다.
            </p>

            <div className="space-y-3 text-xs">
              <label className="font-bold text-slate-700 block">
                슬롯당 최대 수용 인원 (현재: {maxSlotsPerWindow}명)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 8].map((num) => (
                  <button
                    key={num}
                    onClick={() => setMaxSlotsPerWindow(num)}
                    className={`flex-1 py-2.5 rounded-xl border font-bold text-xs ${
                      maxSlotsPerWindow === num
                        ? 'border-[#0f2b5c] bg-[#0f2b5c] text-white shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {num}명
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                * 초과 접수 시 고객 화면에서 해당 시간대가 자동으로 '예약 마감' 처리됩니다.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSlotSettingsOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#0f2b5c] text-white text-xs font-bold"
              >
                설정 완료
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
