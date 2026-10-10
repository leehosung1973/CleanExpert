import React, { useState } from 'react';
import { Sparkles, CheckCircle, ArrowRight, Eye } from 'lucide-react';

interface BeforeAfterItem {
  id: string;
  title: string;
  category: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  duration: string;
  method: string;
}

const COMPARISON_ITEMS: BeforeAfterItem[] = [
  {
    id: 'hood',
    title: '주방 레인지후드 & 가스레인지',
    category: '주방 집중 케어',
    description: '3년간 누적된 끈적한 유증기 기름때와 필터 내부 오염을 고온 스팀과 친환경 약품으로 100% 분해했습니다.',
    beforeImg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    duration: '소요 50분',
    method: '100℃ 고온 스팀 + 독일 친환경 유지분해제'
  },
  {
    id: 'bathroom',
    title: '욕실 타일 줄눈 & 수전 물때',
    category: '욕실 살균 케어',
    description: '타일 틈새의 거뭇한 흑곰팡이와 샤워기 수전의 하얀 석회 백화 현상을 완벽 제거하고 항균 코팅을 진행했습니다.',
    beforeImg: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80',
    duration: '소요 60분',
    method: '곰팡이 침투 분해제 + 고압 스케일링'
  },
  {
    id: 'window',
    title: '창틀 4면 찌든 먼지 & 빗물 자국',
    category: '창틀 집중 케어',
    description: '외부 도로변에서 유입된 미세먼지와 빗물 찌든때를 전용 브러시와 고압 흡입 장비로 하얗게 복원했습니다.',
    beforeImg: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    duration: '소요 40분',
    method: '창틀 전용 4각 브러시 + 흡입 건조'
  }
];

export const BeforeAfterSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showAfter, setShowAfter] = useState(true);
  const current = COMPARISON_ITEMS[activeTab];

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>실제 시공 현장 Before & After</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f2b5c] tracking-tight">
            동일한 조건의 실제 청소 전후 비교
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            과장 없는 현장 사진으로 증명합니다. CleanExpert 전문 매니저의 손길이 닿으면 묵은 때도 새것처럼 빛납니다.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {COMPARISON_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(idx);
                setShowAfter(true);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === idx
                  ? 'bg-[#0f2b5c] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Comparison Display Card */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Box (Side by Side or Switcher) */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-4/3 bg-slate-900">
                <img
                  src={showAfter ? current.afterImg : current.beforeImg}
                  alt={current.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                
                {/* Floating State Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-black shadow-md uppercase tracking-wider ${
                      showAfter
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {showAfter ? '✨ CLEANEXPERT 시공 후' : '⚠️ 청소 전 묵은 오염'}
                  </span>
                </div>

                {/* Switcher Buttons Bar at Bottom of Image */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between bg-black/60 backdrop-blur-md rounded-xl p-2">
                  <span className="text-white text-xs font-medium pl-2 hidden sm:inline">
                    {showAfter ? '완벽 제거 및 코팅 완료' : '누적된 기름때 및 곰팡이'}
                  </span>
                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setShowAfter(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        !showAfter ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      청소 전 (Before)
                    </button>
                    <button
                      onClick={() => setShowAfter(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        showAfter ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      청소 후 (After)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-block px-2.5 py-1 rounded-md bg-blue-100 text-[#0f2b5c] text-xs font-extrabold">
                {current.category}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {current.description}
              </p>

              <div className="pt-2 space-y-2.5 border-t border-slate-200 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    <strong>사용 공법:</strong> {current.method}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    <strong>작업 소요:</strong> {current.duration}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    <strong>안심 기준:</strong> 1억원 배상보험 & 24시간 만족 보증
                  </span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => setShowAfter(!showAfter)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>{showAfter ? '청소 전 모습 보기' : '청소 후 모습 보기'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
