import React, { useState } from 'react';
import { 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Filter, 
  PenLine, 
  X,
  ThumbsUp
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { ServiceType } from '../types';
import { BeforeAfterSection } from '../components/BeforeAfterSection';

interface ReviewsViewProps {
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({ onNavigate, onOpenAuth }) => {
  const { reviews, addReview } = useBooking();
  const { currentUser } = useAuth();

  const [filterType, setFilterType] = useState<string>('all');
  const [writeModalOpen, setWriteModalOpen] = useState<boolean>(false);

  // New review form
  const [reviewService, setReviewService] = useState<ServiceType>('basic');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewArea, setReviewArea] = useState<string>('30평대 아파트');
  const [reviewRegion, setReviewRegion] = useState<string>('서울 송파구');
  const [reviewContent, setReviewContent] = useState<string>('');
  const [reviewCleaner, setReviewCleaner] = useState<string>('김지은 수석 클리너');

  const filteredReviews = reviews.filter((r) => {
    if (filterType === 'all') return true;
    return r.serviceType === filterType;
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!reviewContent.trim()) return;

    await addReview({
      userId: currentUser.uid,
      userName: `${currentUser.displayName || '고객'}님`,
      serviceType: reviewService,
      areaSize: reviewArea,
      region: reviewRegion,
      rating: reviewRating,
      content: reviewContent.trim(),
      cleanerName: reviewCleaner,
    });

    setReviewContent('');
    setWriteModalOpen(false);
  };

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header & Stats Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            100% 실사용자 검증 리뷰
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0f2b5c] tracking-tight">
            CleanExpert 생생 고객 후기
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            실제로 서비스를 이용하신 고객님들의 진솔한 경험담을 확인하세요.
          </p>
        </div>

        {/* Rating Score Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">전체 만족도</span>
              <div className="text-5xl font-black text-[#0f2b5c]">4.98</div>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs text-slate-500">누적 후기 35,420개 기준</span>
            </div>

            <div className="py-4 md:py-0 md:px-6 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>친절함 및 응대 매너</span>
                <span className="font-bold text-slate-900">99.8% 만족</span>
              </div>
              <div className="flex items-center justify-between">
                <span>청소 결과 및 마감 퀄리티</span>
                <span className="font-bold text-slate-900">99.4% 만족</span>
              </div>
              <div className="flex items-center justify-between">
                <span>시간 준수 및 비대면 신뢰도</span>
                <span className="font-bold text-slate-900">99.9% 만족</span>
              </div>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6 text-center space-y-3">
              <p className="text-xs text-slate-600">
                청소를 완료하셨나요?<br />소중한 의견을 남겨주시면 포인트를 적립해드립니다.
              </p>
              <button
                onClick={() => setWriteModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#0f2b5c] hover:bg-blue-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <PenLine className="w-3.5 h-3.5 text-emerald-400" />
                <span>이용 후기 작성하기</span>
              </button>
            </div>

          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {[
              { id: 'all', label: '전체 후기' },
              { id: 'basic', label: '기본 방문 청소' },
              { id: 'kitchen_bath', label: '주방·욕실 집중' },
              { id: 'recurring', label: '정기 관리' },
              { id: 'move_in', label: '이사·입주 집중' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-[#0f2b5c] text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            총 {filteredReviews.length}개의 후기
          </span>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{rev.date}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{rev.userName}</span>
                    <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ 시공 인증
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {rev.region} · {rev.areaSize}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  “{rev.content}”
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>담당: <strong>{rev.cleanerName}</strong></span>
                <span className="text-[11px] text-slate-400">CleanExpert 검증</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Before & After Interactive Section */}
      <BeforeAfterSection />

      {/* Review Write Modal */}
      {writeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            
            <button
              onClick={() => setWriteModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">
              CleanExpert 이용 후기 작성
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              솔직한 후기는 다른 고객님들의 선택에 큰 도움이 됩니다.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">만족도 별점</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">이용 서비스</label>
                  <select
                    value={reviewService}
                    onChange={(e) => setReviewService(e.target.value as ServiceType)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="basic">기본 방문 청소</option>
                    <option value="kitchen_bath">주방·욕실 집중</option>
                    <option value="recurring">정기 관리</option>
                    <option value="move_in">이사·입주 집중</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">지역</label>
                  <input
                    type="text"
                    value={reviewRegion}
                    onChange={(e) => setReviewRegion(e.target.value)}
                    placeholder="예: 서울 송파구"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">후기 내용</label>
                <textarea
                  rows={4}
                  required
                  placeholder="청소 서비스의 어떤 점이 만족스러우셨나요? 구체적인 후기를 들려주세요."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#0f2b5c] hover:bg-blue-900 text-white font-bold text-sm shadow-md cursor-pointer"
                >
                  후기 등록하기
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
