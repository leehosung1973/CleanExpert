import React, { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  Sparkles, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Search 
} from 'lucide-react';
import { FAQ_DATA } from '../data/services';

interface FaqViewProps {
  onNavigate: (view: string) => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFaqs = FAQ_DATA.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0f2b5c] text-xs font-bold border border-blue-200">
            궁금한 점을 미리 해결해 드립니다
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0f2b5c] tracking-tight">
            자주 묻는 질문 (FAQ)
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            예약부터 방문 청소, 취소 및 보상 규정까지 자주 주시는 질문들을 모았습니다.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-lg mx-auto">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="궁금한 키워드를 검색해보세요 (예: 세제, 취소, 비대면, 파손)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm shadow-xs focus:outline-emerald-500"
          />
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#0f2b5c] font-black text-xs flex items-center justify-center shrink-0">
                      Q
                    </span>
                    <div>
                      <span className="text-[11px] font-bold text-emerald-600 block mb-0.5">
                        {faq.category}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 text-[#0f2b5c]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/40">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        A
                      </span>
                      <p className="pt-0.5">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Inquiry Card */}
        <div className="bg-[#0f2b5c] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-black text-lg sm:text-xl">
              찾으시는 답변이 없으신가요?
            </h4>
            <p className="text-xs text-slate-300">
              CleanExpert 고객센터 (1588-7240 / 365일 08:00~20:00)로 언제든 문의주세요.
            </p>
          </div>
          <button
            onClick={() => onNavigate('booking')}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md whitespace-nowrap cursor-pointer flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-slate-950" />
            <span>바로 방문 예약하기</span>
          </button>
        </div>

      </div>
    </div>
  );
};
