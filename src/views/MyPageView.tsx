import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ChevronRight, 
  Phone, 
  ArrowRight,
  PenTool,
  RotateCcw
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Booking, BookingStatus, TimeSlot } from '../types';
import { SERVICES_DATA, ADDON_OPTIONS } from '../data/services';

interface MyPageViewProps {
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
}

export const MyPageView: React.FC<MyPageViewProps> = ({ onNavigate, onOpenAuth }) => {
  const { bookings, myBookings, updateBookingStatus, rescheduleBooking, cancelBooking } = useBooking();
  const { currentUser, signInDemoCustomer } = useAuth();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState<boolean>(false);
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);

  // Reschedule form states
  const [newDate, setNewDate] = useState<string>('');
  const [newSlot, setNewSlot] = useState<TimeSlot>('morning_09');

  // Display user bookings (or all if demo testing)
  const displayBookings = currentUser ? myBookings : [];

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-xs">접수 대기</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full text-xs">예약 확정</span>;
      case 'in_progress':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-xs">작업 진행 중</span>;
      case 'completed':
        return <span className="bg-slate-200 text-slate-800 font-bold px-2.5 py-1 rounded-full text-xs">청소 완료</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-full text-xs">예약 취소됨</span>;
      default:
        return null;
    }
  };

  const handleOpenReschedule = (b: Booking) => {
    setSelectedBooking(b);
    setNewDate(b.date);
    setNewSlot(b.timeSlot);
    setRescheduleModalOpen(true);
  };

  const handleOpenCancel = (b: Booking) => {
    setSelectedBooking(b);
    setCancelModalOpen(true);
  };

  const handleConfirmReschedule = async () => {
    if (!selectedBooking || !newDate) return;
    await rescheduleBooking(selectedBooking.id, newDate, newSlot);
    setRescheduleModalOpen(false);
    setSelectedBooking(null);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    await cancelBooking(selectedBooking.id);
    setCancelModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#0f2b5c] tracking-tight">
              마이페이지
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              내 예약 현황, 일정 변경 및 취소 내역을 관리합니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('booking')}
              className="px-5 py-2.5 rounded-xl bg-[#0f2b5c] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>새로운 청소 예약하기</span>
            </button>
          </div>
        </div>

        {/* Auth Check Prompt if not signed in */}
        {!currentUser ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0f2b5c] flex items-center justify-center mx-auto">
              <User className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                로그인 후 예약 내역을 확인하실 수 있습니다
              </h3>
              <p className="text-xs text-slate-500">
                Google 계정 또는 간편 로그인을 통해 예약 상태와 배정된 매니저를 실시간으로 확인해보세요.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenAuth}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#0f2b5c] text-white font-bold text-sm shadow-md cursor-pointer hover:bg-blue-900"
              >
                로그인하러 가기
              </button>
              <button
                onClick={() => signInDemoCustomer()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FEE500] text-slate-900 font-bold text-sm cursor-pointer hover:bg-[#FDD835]"
              >
                체험 계정으로 즉시 확인
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
                  {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {currentUser.displayName} 고객님
                  </h3>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                <span>내 예약 총 <strong>{displayBookings.length}</strong>건</span>
                <span>|</span>
                <span className="text-emerald-700 font-bold">1억원 배상보험 적용 중</span>
              </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              <h3 className="font-black text-lg text-slate-900">
                내 청소 예약 목록
              </h3>

              {displayBookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-slate-200">
                  <p className="text-slate-500 text-sm">
                    아직 접수된 청소 예약 내역이 없습니다.
                  </p>
                  <button
                    onClick={() => onNavigate('booking')}
                    className="px-6 py-2.5 rounded-xl bg-[#0f2b5c] text-white font-bold text-xs shadow-md cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>첫 청소 예약 시작하기</span>
                  </button>
                </div>
              ) : (
                displayBookings.map((booking) => {
                  const srv = SERVICES_DATA.find((s) => s.id === booking.serviceType) || SERVICES_DATA[0];

                  return (
                    <div
                      key={booking.id}
                      className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 hover:border-slate-300 transition-all"
                    >
                      {/* Top Header of Reservation */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-[#0f2b5c] bg-blue-50 px-2.5 py-1 rounded-lg">
                            {booking.bookingNumber}
                          </span>
                          <h4 className="font-extrabold text-base sm:text-lg text-slate-900">
                            {srv.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>

                      {/* Timeline status bar */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                        <div className="grid grid-cols-4 text-center text-[11px] font-bold">
                          <div className={`space-y-1 ${booking.status !== 'cancelled' ? 'text-emerald-700' : 'text-slate-400'}`}>
                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-[10px]">1</div>
                            <span>예약 접수</span>
                          </div>
                          <div className={`space-y-1 ${['confirmed', 'in_progress', 'completed'].includes(booking.status) ? 'text-emerald-700' : 'text-slate-400'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center mx-auto text-[10px] ${['confirmed', 'in_progress', 'completed'].includes(booking.status) ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'}`}>2</div>
                            <span>매니저 확정</span>
                          </div>
                          <div className={`space-y-1 ${['in_progress', 'completed'].includes(booking.status) ? 'text-emerald-700' : 'text-slate-400'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center mx-auto text-[10px] ${['in_progress', 'completed'].includes(booking.status) ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'}`}>3</div>
                            <span>방문 청소</span>
                          </div>
                          <div className={`space-y-1 ${booking.status === 'completed' ? 'text-emerald-700' : 'text-slate-400'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center mx-auto text-[10px] ${booking.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'}`}>4</div>
                            <span>완료 및 리포트</span>
                          </div>
                        </div>
                      </div>

                      {/* Reservation Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
                        <div>
                          <span className="text-slate-400 block mb-0.5">방문 일시</span>
                          <span className="font-extrabold text-slate-900 text-sm">
                            {booking.date} ({booking.timeSlot === 'morning_09' ? '오전 09:00' : booking.timeSlot === 'afternoon_14' ? '오후 14:00' : '저녁 18:00'})
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block mb-0.5">방문 주소</span>
                          <span className="font-bold text-slate-800 truncate block">
                            {booking.address} {booking.addressDetail}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block mb-0.5">담당 클리너</span>
                          <span className="font-bold text-slate-800">
                            {booking.assignedCleaner ? (
                              <span className="text-emerald-700">✓ {booking.assignedCleaner}</span>
                            ) : (
                              <span className="text-slate-400">일정 확인 후 배정 예정</span>
                            )}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block mb-0.5">결제 금액</span>
                          <span className="font-black text-[#0f2b5c] text-sm">
                            {booking.totalPrice.toLocaleString()}원
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                          <button
                            onClick={() => handleOpenReschedule(booking)}
                            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold cursor-pointer"
                          >
                            일정 변경 신청
                          </button>
                          <button
                            onClick={() => handleOpenCancel(booking)}
                            className="px-4 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold cursor-pointer"
                          >
                            예약 취소
                          </button>
                        </div>
                      )}

                      {booking.status === 'completed' && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-emerald-700 font-bold">
                            ✓ 청소가 안전하게 완료되었습니다.
                          </span>
                          <button
                            onClick={() => onNavigate('reviews')}
                            className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold cursor-pointer hover:bg-emerald-100"
                          >
                            이용 후기 작성하기
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

      </div>

      {/* Reschedule Modal */}
      {rescheduleModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              방문 일정 변경 신청
            </h3>
            <p className="text-xs text-slate-500">
              현재 예약: {selectedBooking.date} ({selectedBooking.timeSlot})
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">변경 희망 날짜</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">변경 희망 시간대</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value as TimeSlot)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="morning_09">오전 09:00</option>
                  <option value="afternoon_14">오후 14:00</option>
                  <option value="evening_18">저녁 18:00</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-blue-50 text-xs text-[#0f2b5c] rounded-xl">
              ※ 방문 24시간 전 일정 변경은 수수료 없이 무료로 처리됩니다.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRescheduleModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              >
                닫기
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-5 py-2 rounded-xl bg-[#0f2b5c] text-white text-xs font-bold hover:bg-blue-900"
              >
                변경 신청 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-black text-rose-600">
              정말로 예약을 취소하시겠습니까?
            </h3>
            <p className="text-xs text-slate-600">
              예약번호: {selectedBooking.bookingNumber} ({selectedBooking.date})
            </p>

            <div className="p-3 bg-rose-50 text-xs text-rose-800 rounded-xl border border-rose-200">
              방문 24시간 전 취소 시 전액 환불되며 위약금이 발생하지 않습니다.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              >
                돌아가기
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                예약 취소 확인
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
