import React from 'react';
import { Calendar, ChevronRight, Sparkles } from 'lucide-react';

interface MobileReservationBarProps {
  onReserve: () => void;
  currentView: string;
}

export const MobileReservationBar: React.FC<MobileReservationBarProps> = ({ onReserve, currentView }) => {
  // Hide if already in booking wizard or admin
  if (currentView === 'booking' || currentView === 'admin') {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> 실시간 잔여 슬롯 조회 가능
          </span>
          <span className="text-xs font-bold text-slate-800">
            청소를 맡기면 내 시간이 돌아옵니다
          </span>
        </div>
        <button
          onClick={onReserve}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0f2b5c] to-blue-800 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-900/20 whitespace-nowrap cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-emerald-300" />
          <span>예약하기</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        </button>
      </div>
    </div>
  );
};
