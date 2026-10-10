import { BookingOption, Cleaner, Review, ServiceType, AreaSize } from '../types';

export interface ServiceDetail {
  id: ServiceType;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  basePrice: number;
  durationLabel: string;
  defaultDurationHours: number;
  image: string;
  included: string[];
  excluded: string[];
  recommendedFor: string;
  features: string[];
}

export const SERVICES_DATA: ServiceDetail[] = [
  {
    id: 'basic',
    name: '기본 방문 청소',
    badge: '인기 기본',
    tagline: '일상에 여유를 더하는 정돈과 위생 케어',
    description: '바쁜 일상 속 주기적으로 필요한 거실, 침실, 주방 기본 및 욕실 표면 청소와 분리수거까지 꼼꼼하게 진행합니다.',
    basePrice: 59000,
    durationLabel: '약 2.5 ~ 3시간',
    defaultDurationHours: 3,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    recommendedFor: '청소할 시간이 부족한 직장인, 주기적인 위생 관리가 필요한 1~2인 가구',
    features: ['친환경 세제 사용', '바닥 청소기 & 밀대 물걸레', '재활용 분리배출', '가구 외부 먼지 케어'],
    included: [
      '거실/침실: 침구 정돈, 바닥 진공 흡입 및 물걸레 케어, 외부 가구 먼지 제거, 휴지통 비우기',
      '주방: 싱크대 개수대 세척, 조리대 상판 기름때 닦기, 가스레인지/인덕션 표면 오염 제거',
      '욕실: 세면대/변기 살균 물청소, 욕조/샤워부스 물때 세척, 거울 얼룩 닦기, 바닥 건조',
      '현관 & 쓰레기: 신발장 외부 먼지 털기, 규격봉투 일반쓰레기 및 재활용 쓰레기 1회 분리배출'
    ],
    excluded: [
      '외창(아파트 바깥쪽 유리창) 닦기 (추락 위험)',
      '성인 남성 혼자 들기 어려운 대형 가구/가전제품 이동',
      '애완동물 배설물 수거 및 특수 오염물 제거',
      '도배/장판 풀자국 및 인테리어 시공 분진 (입주 청소 대상)'
    ]
  },
  {
    id: 'kitchen_bath',
    name: '주방·욕실 집중 청소',
    badge: '강력 추천',
    tagline: '기름때와 곰팡이, 물때를 100℃ 고온 스팀으로 박멸',
    description: '혼자서 손대기 엄두가 안 나는 주방 후드 필터 기름때와 욕실 타일 줄눈 곰팡이, 수전 물때를 전문가의 전용 장비로 집중 분해합니다.',
    basePrice: 89000,
    durationLabel: '약 3.5 ~ 4시간',
    defaultDurationHours: 4,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    recommendedFor: '주방 기름때/환풍기 청소가 막막한 분, 욕실 타일 곰팡이가 고민인 맞벌이·육아 가정',
    features: ['100℃ 고온 스팀 살균', '후드 필터 기름때 완전 분해', '욕실 줄눈 곰팡이 전용 케어', '배수구 악취 탈취'],
    included: [
      '주방 심층: 레인지후드 필터 분해 및 기름때 약품 침투 세척, 인덕션/가스구 탄 자국 박리',
      '주방 살균: 싱크대 개수구/배수트랩 고온 스팀 살균, 수전 스케일링, 타일 벽면 기름막 제거',
      '욕실 심층: 타일 바닥/벽면 줄눈 곰팡이 전용 침투 케어, 욕조 및 세면대 묵은 물때 제거',
      '욕실 마감: 샤워부스 유리 백화 현상 스케일링, 환풍구 커버 탈거 세척, 배수구 악취 제거'
    ],
    excluded: [
      '실리콘 내부로 완전히 착색된 노후 곰팡이 (실리콘 재시공 필요 영역)',
      '싱크대 하부장 배관 교체 및 설비 누수 보수 작업',
      '외창 및 거실/방 일반 청소 (주방·욕실 집중 프로그램입니다)'
    ]
  },
  {
    id: 'recurring',
    name: '정기 관리 청소',
    badge: '15% 할인',
    tagline: '주 1회/격주 방문으로 늘 호텔처럼 쾌적한 집',
    description: '믿을 수 있는 전담 클리너가 지정되어 매주 또는 격주로 우리 집을 지속 관리해드립니다. 피톤치드 살균 무료 서비스가 포함됩니다.',
    basePrice: 52000,
    durationLabel: '회당 약 2.5 ~ 3시간',
    defaultDurationHours: 3,
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80',
    recommendedFor: '육아와 맞벌이로 시간이 절대적으로 부족한 가족, 늘 청결한 컨디션을 원하는 고객',
    features: ['지정 전담 클리너 1:1 배정', '회당 15% 자동 할인', '월 1회 피톤치드 무료', '우선 일정 예약 권한'],
    included: [
      '기본 방문 청소의 모든 영역 100% 포함',
      '회차별 로테이션 집중 관리 (1주차: 냉장고/오븐, 2주차: 창틀/베란다 등 순차 케어)',
      '생활 패턴에 맞춘 1:1 맞춤형 세부 동선 적용',
      '월 1회 피톤치드 공간 살균 서비스 무상 제공'
    ],
    excluded: [
      '무단 예약 당일 취소 시 위약 규정 적용',
      '가구/인테리어 보수 작업'
    ]
  },
  {
    id: 'move_in',
    name: '이사·입주 집중 청소',
    badge: '새집 증후군 케어',
    tagline: '이전 거주자 흔적과 공사 분진 완벽 제거',
    description: '이사 전후 빈집을 대상으로 천장 몰딩부터 바닥, 창틀 4면, 수납 서랍장 전면 탈거까지 신축 분진과 미세먼지를 깨끗이 청소합니다.',
    basePrice: 169000,
    durationLabel: '약 4.5 ~ 6시간',
    defaultDurationHours: 5,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    recommendedFor: '신규 아파트 입주 예정자, 전월세 이사 전 깔끔한 입주를 원하는 고객',
    features: ['전 구역 서랍/전등 탈거 청소', '창틀 4면 묵은때 완벽 제거', '벽면/천장 미세분진 털기', '새집 피톤치드 훈증'],
    included: [
      '집안 전체: 천장 몰딩, 전등갓 탈거 청소, 벽지 분진 털기, 걸레받이, 바닥 전용 기계 세척',
      '수납 공간: 신발장, 붙박이장, 싱크대 상/하부장 모든 서랍 레일 탈거 후 안쪽까지 청소',
      '창틀 & 베란다: 내부 창틀 4면 고온 스팀 및 전용 브러시 세척, 베란다 타일 물청소',
      '살균 마감: 편백 피톤치드 전 공간 초미립자 분무 살균 (새집증후군 완화)'
    ],
    excluded: [
      '외부 유리창(외벽창) 닦기 (고소 외줄 작업 별도)',
      '시트지/스티커 대량 제거 시 추가 비용 발생 가능',
      '인테리어 폐자재 대형 폐기물 수거'
    ]
  }
];

export const AREA_SIZE_OPTIONS: { id: AreaSize; label: string; pyeong: string; priceMultiplier: number; timeBonusHours: number }[] = [
  { id: 'under_10', label: '10평 이하 (원룸 / 소형)', pyeong: '~33㎡', priceMultiplier: 1.0, timeBonusHours: 0 },
  { id: '11_20', label: '11평 ~ 20평 (투룸 / 1.5룸)', pyeong: '34~66㎡', priceMultiplier: 1.25, timeBonusHours: 0.5 },
  { id: '21_30', label: '21평 ~ 30평 (중형 아파트/빌라)', pyeong: '67~99㎡', priceMultiplier: 1.55, timeBonusHours: 1.0 },
  { id: '31_40', label: '31평 ~ 40평 (국민평수 아파트)', pyeong: '100~132㎡', priceMultiplier: 1.9, timeBonusHours: 1.5 },
  { id: 'over_40', label: '41평 이상 (대형 평수)', pyeong: '133㎡~', priceMultiplier: 2.3, timeBonusHours: 2.0 },
];

export const ADDON_OPTIONS: BookingOption[] = [
  {
    id: 'opt_fridge',
    name: '냉장고 내부 스팀 살균',
    price: 25000,
    durationMinutes: 40,
    description: '선반 분해 세척 및 식중독균 예방 고온 스팀 소독'
  },
  {
    id: 'opt_oven',
    name: '오븐 / 에어프라이어 내부 집중 세척',
    price: 20000,
    durationMinutes: 30,
    description: '기름때 탄 자국 전용 친환경 약품 분해 세척'
  },
  {
    id: 'opt_window_frame',
    name: '창틀 4면 묵은 먼지 집중 케어',
    price: 20000,
    durationMinutes: 35,
    description: '외부 유입 흙먼지와 빗물 찌든때 전용 브러시 흡입'
  },
  {
    id: 'opt_phytoncide',
    name: '친환경 피톤치드 공간 항균 탈취',
    price: 15000,
    durationMinutes: 20,
    description: '편백나무 100% 천연 원액 공간 초미립자 분무 살균'
  },
  {
    id: 'opt_steam_drain',
    name: '싱크대/욕실 배수구 고온 스팀 박멸',
    price: 15000,
    durationMinutes: 20,
    description: '배수 트랩 100℃ 고압 스팀 분사로 악취 및 유충 제거'
  }
];

export const CLEANERS_DATA: Cleaner[] = [
  {
    id: 'cleaner-1',
    name: '김지은',
    title: '수석 마스터 클리너',
    experienceYears: 7,
    completedJobs: 1420,
    rating: 4.99,
    certification: '한국정리수납전문가 1급 / 친환경 방역관리사',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    specialty: '주방 기름때 완전 분해 & 수납 동선 재배치'
  },
  {
    id: 'cleaner-2',
    name: '박현우',
    title: '시니어 홈 케어 디렉터',
    experienceYears: 5,
    completedJobs: 1180,
    rating: 4.96,
    certification: '실내환경위생사 / 고온스팀 장비 마스터',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    specialty: '욕실 줄눈 곰팡이 박멸 & 창틀 스케일링'
  },
  {
    id: 'cleaner-3',
    name: '이수민',
    title: '정기 케어 전문 매니저',
    experienceYears: 6,
    completedJobs: 1350,
    rating: 4.98,
    certification: '가정위생관리사 / 영유아 안심 위생 수료',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    specialty: '영유아 육아 가정 친환경 안심 케어'
  },
  {
    id: 'cleaner-4',
    name: '최원호',
    title: '입주·이사 테크니컬 클리너',
    experienceYears: 8,
    completedJobs: 1640,
    rating: 4.97,
    certification: '건축준공청소 관리사 / 새집증후군 케어 마스터',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    specialty: '신축 분진 완벽 제거 & 피톤치드 훈증'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userId: 'user-sample-1',
    userName: '정*윤 고객님',
    serviceType: 'kitchen_bath',
    areaSize: '34평 아파트',
    region: '서울 송파구 잠실동',
    rating: 5,
    cleanerName: '김지은 수석 클리너',
    content: '맞벌이라 주말마다 주방 후드랑 욕실 청소할 생각에 스트레스였는데, CleanExpert 이용하고 주말에 가족이랑 온전히 쉬었습니다. 후드 기름때가 새것처럼 빛나서 감동받았어요!',
    beforeImg: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    date: '2026.10.05',
    verified: true
  },
  {
    id: 'rev-2',
    userId: 'user-sample-2',
    userName: '한*석 고객님',
    serviceType: 'basic',
    areaSize: '24평 오피스텔',
    region: '서울 강남구 역삼동',
    rating: 5,
    cleanerName: '박현우 시니어 클리너',
    content: '야근이 잦아서 집이 엉망이었는데, 퇴근하고 문을 열자마자 은은한 피톤치드 향과 호텔 침구처럼 정돈된 침실을 보고 피로가 싹 풀렸습니다. 이제 2주마다 정기 청소 받으려고요.',
    beforeImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    date: '2026.09.28',
    verified: true
  },
  {
    id: 'rev-3',
    userId: 'user-sample-3',
    userName: '민*아 고객님',
    serviceType: 'recurring',
    areaSize: '32평 빌라',
    region: '경기 성남시 분당구',
    rating: 5,
    cleanerName: '이수민 매니저',
    content: '아이가 어려서 독한 락스 냄새 나는 곳은 피하고 싶었는데, CleanExpert는 독일 에코서트 친환경 세제만 쓰셔서 안심입니다. 매니저님이 정말 친절하시고 손도 빠르세요.',
    beforeImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    date: '2026.09.19',
    verified: true
  },
  {
    id: 'rev-4',
    userId: 'user-sample-4',
    userName: '오*택 고객님',
    serviceType: 'move_in',
    areaSize: '42평 아파트',
    region: '서울 마포구 공덕동',
    rating: 5,
    cleanerName: '최원호 마스터',
    content: '인테리어 공사 후 분진이 너무 많아서 걱정했는데, 전등갓이랑 서랍장 안쪽까지 다 뜯어서 닦아주셨네요. 창틀 모서리까지 하얗게 변했습니다. 돈이 전혀 아깝지 않은 퀄리티입니다.',
    beforeImg: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    date: '2026.09.12',
    verified: true
  }
];

export const SERVICE_REGIONS = [
  { city: '서울', districts: ['강남구', '서초구', '송파구', '강동구', '마포구', '용산구', '성동구', '광진구', '영등포구', '양천구', '강서구', '구로구', '동작구', '관악구', '서대문구', '은평구', '종로구', '중구', '성북구', '노원구', '도봉구', '강북구', '동대문구', '중랑구', '금천구'] },
  { city: '경기', districts: ['성남시 분당구', '성남시 판교', '하남시', '수원시 영통구', '수원시 광교', '용인시 수지구', '용인시 기흥구', '과천시', '안양시 동안구', '부천시', '고양시 일산동구', '남양주시 다산'] },
  { city: '인천', districts: ['연수구 송도동', '서구 청라동', '남동구'] }
];

export const FAQ_DATA = [
  {
    category: '예약 및 일정',
    question: '당일 예약이나 주말 예약도 가능한가요?',
    answer: 'CleanExpert는 365일 연중무휴로 운영되며 주말 및 공휴일도 동일한 기본 요금으로 예약 가능합니다. 당일 방문의 경우 실시간 잔여 슬롯 현황에 따라 최소 4시간 전 예약 접수 시 매니저 매칭이 진행됩니다.'
  },
  {
    category: '청소 도구 & 세제',
    question: '집에 청소 도구나 세제를 따로 준비해두어야 하나요?',
    answer: '아닙니다! 고객님께서 준비하실 것은 전혀 없습니다. CleanExpert 전문 매니저가 독일 프리미엄 친환경 세제 키트, 전용 극세사 패드, 고온 스팀기 및 진공청소기 등 인증받은 전문 장비를 모두 지참하여 방문합니다. (단, 규격 쓰레기봉투 1장은 비치 권장)'
  },
  {
    category: '방문 및 비대면',
    question: '청소하는 동안 집에 꼭 사람이 있어야 하나요?',
    answer: '청소 시작 전 대면 확인 후 외출하셔도 되며, 공동현관 및 도어락 출입 정보를 예약 시 기재해주시면 완전 비대면 청소도 가능합니다. 작업 시작과 완료 시 실시간 현장 사진과 진행 보고서를 카카오톡/문자 및 마이페이지로 즉시 전송해드립니다.'
  },
  {
    category: '안심 & 파손 보장',
    question: '청소 도중 가구나 물품이 파손되면 어떻게 보상받나요?',
    answer: 'CleanExpert 소속 전 매니저는 현대해상 1억원 영업배상책임보험에 100% 가입되어 있습니다. 작업 중 불가피하게 발생한 파손 사고에 대해 본사 고객안심센터에서 100% 신속 보상 처리해드립니다.'
  },
  {
    category: '취소 및 환불',
    question: '예약 후 일정 변경이나 취소는 어떻게 하나요?',
    answer: '방문 24시간 전까지는 마이페이지 또는 고객센터를 통해 수수료 없이 100% 무료 취소 및 일정 변경이 가능합니다. 방문 24시간 이내 취소 시에는 매니저 일정 배정 손실에 따른 30%의 위약금이 발생할 수 있습니다.'
  },
  {
    category: '청소 품질',
    question: '청소 결과가 마음에 들지 않으면 어떻게 되나요?',
    answer: 'CleanExpert는 100% 만족 보장제를 운영합니다. 청소 완료 후 24시간 이내에 미흡한 부분을 접수해주시면, 고객센터 확인 후 담당 매니저 또는 수석 검수 매니저가 무상으로 재방문하여 추가 케어를 진행합니다.'
  }
];
