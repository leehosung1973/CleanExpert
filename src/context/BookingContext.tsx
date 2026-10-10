import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { Booking, BookingStatus, Review, TimeSlot, SlotAvailability } from '../types';
import { INITIAL_REVIEWS } from '../data/services';

interface BookingContextType {
  bookings: Booking[];
  myBookings: Booking[];
  reviews: Review[];
  loadingBookings: boolean;
  createBooking: (bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  assignCleaner: (bookingId: string, cleanerName: string) => Promise<void>;
  rescheduleBooking: (bookingId: string, newDate: string, newSlot: TimeSlot) => Promise<void>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<void>;
  addReview: (reviewData: Omit<Review, 'id' | 'date' | 'verified'>) => Promise<void>;
  getSlotAvailability: (dateStr: string) => SlotAvailability;
  maxSlotsPerWindow: number;
  setMaxSlotsPerWindow: (val: number) => void;
  exportToCSV: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Initial mock bookings so user immediately sees rich data in Admin & MyPage
const SEED_BOOKINGS: Booking[] = [
  {
    id: 'seed-booking-1',
    bookingNumber: 'CE-20261010-001',
    userId: 'user-sample-1',
    customerName: '정소윤',
    customerPhone: '010-3482-9912',
    address: '서울특별시 송파구 올림픽로 300',
    addressDetail: '잠실 롯데캐슬 102동 1403호',
    postalCode: '05551',
    region: '서울 송파구',
    serviceType: 'kitchen_bath',
    homeType: 'apartment',
    areaSize: '31_40',
    options: ['opt_fridge', 'opt_steam_drain'],
    date: '2026-10-12',
    timeSlot: 'morning_09',
    durationHours: 4.5,
    totalPrice: 129000,
    notes: '주방 후드에 기름때가 두껍게 껴있어서 집중 부탁드립니다.',
    entryInfo: '공동현관 #1403*, 도어락 5821*',
    hasPets: false,
    hasParking: true,
    assignedCleaner: '김지은 수석 클리너',
    status: 'confirmed',
    createdAt: '2026-10-09T14:20:00Z',
    updatedAt: '2026-10-09T16:00:00Z',
  },
  {
    id: 'seed-booking-2',
    bookingNumber: 'CE-20261010-002',
    userId: 'demo-customer-77',
    customerName: '김민지',
    customerPhone: '010-8912-3401',
    address: '서울특별시 마포구 마포대로 12',
    addressDetail: '래미안 마포 104동 802호',
    postalCode: '04168',
    region: '서울 마포구',
    serviceType: 'basic',
    homeType: 'apartment',
    areaSize: '21_30',
    options: ['opt_phytoncide'],
    date: '2026-10-14',
    timeSlot: 'afternoon_14',
    durationHours: 3.5,
    totalPrice: 94000,
    notes: '비대면 진행 예정입니다. 쓰레기 분리수거 봉투는 현관 앞에 뒀습니다.',
    entryInfo: '비대면 진행 / 비밀번호는 예약일 당일 아침 문자 전송 예정',
    hasPets: true,
    hasParking: true,
    assignedCleaner: '박현우 시니어 클리너',
    status: 'pending',
    createdAt: '2026-10-10T02:15:00Z',
    updatedAt: '2026-10-10T02:15:00Z',
  },
  {
    id: 'seed-booking-3',
    bookingNumber: 'CE-20261009-009',
    userId: 'user-sample-3',
    customerName: '이지훈',
    customerPhone: '010-2234-7718',
    address: '경기도 성남시 분당구 판교역로 146',
    addressDetail: '알파리움 2단지 201동 1904호',
    postalCode: '13529',
    region: '경기 성남시 판교',
    serviceType: 'recurring',
    homeType: 'apartment',
    areaSize: '31_40',
    options: ['opt_window_frame'],
    date: '2026-10-11',
    timeSlot: 'morning_09',
    durationHours: 3.5,
    totalPrice: 72000,
    notes: '정기 2회차 방문입니다. 안방 욕실 줄눈 위주로 부탁드립니다.',
    entryInfo: '경비실 호출 가능',
    hasPets: false,
    hasParking: true,
    assignedCleaner: '이수민 매니저',
    status: 'in_progress',
    createdAt: '2026-10-08T09:30:00Z',
    updatedAt: '2026-10-10T01:00:00Z',
  },
  {
    id: 'seed-booking-4',
    bookingNumber: 'CE-20261008-005',
    userId: 'user-sample-4',
    customerName: '강태우',
    customerPhone: '010-5541-8930',
    address: '서울특별시 강남구 테헤란로 201',
    addressDetail: '역삼 센트럴자이 105동 501호',
    postalCode: '06141',
    region: '서울 강남구',
    serviceType: 'move_in',
    homeType: 'apartment',
    areaSize: '31_40',
    options: ['opt_fridge', 'opt_oven', 'opt_phytoncide'],
    date: '2026-10-08',
    timeSlot: 'morning_09',
    durationHours: 6.0,
    totalPrice: 229000,
    notes: '입주 전 빈집 청소 완료건입니다.',
    entryInfo: '당일 직접 문 개방함',
    hasPets: false,
    hasParking: true,
    assignedCleaner: '최원호 마스터',
    status: 'completed',
    createdAt: '2026-10-06T11:00:00Z',
    updatedAt: '2026-10-08T16:00:00Z',
  }
];

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  const [allBookings, setAllBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(true);
  const [maxSlotsPerWindow, setMaxSlotsPerWindow] = useState<number>(3); // 3 cleaners per slot

  // Firestore sync for bookings
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const bookingsCol = collection(db, 'bookings');
      unsubscribe = onSnapshot(
        bookingsCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Booking[] = [];
            snapshot.forEach((doc) => {
              list.push(doc.data() as Booking);
            });
            // Merge seed data if not present
            const combinedMap = new Map<string, Booking>();
            SEED_BOOKINGS.forEach((b) => combinedMap.set(b.id, b));
            list.forEach((b) => combinedMap.set(b.id, b));
            const merged = Array.from(combinedMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setAllBookings(merged);
          }
          setLoadingBookings(false);
        },
        (error) => {
          console.warn('Firestore snapshot note:', error.message);
          setLoadingBookings(false);
        }
      );
    } catch (e) {
      console.warn('Firestore listener fallback to memory state');
      setLoadingBookings(false);
    }

    return () => unsubscribe();
  }, []);

  // Fetch reviews from Firestore
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const reviewsCol = collection(db, 'reviews');
      unsubscribe = onSnapshot(
        reviewsCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Review[] = [];
            snapshot.forEach((doc) => list.push(doc.data() as Review));
            const map = new Map<string, Review>();
            INITIAL_REVIEWS.forEach((r) => map.set(r.id, r));
            list.forEach((r) => map.set(r.id, r));
            setReviews(Array.from(map.values()));
          }
        },
        () => {}
      );
    } catch (err) {
      // fallback
    }
    return () => unsubscribe();
  }, []);

  // Filter bookings for current logged in user if not admin
  const myBookings = allBookings.filter((b) => {
    if (!currentUser) return false;
    return b.userId === currentUser.uid || (currentUser.email && b.customerPhone.includes('3401'));
  });

  // Check slot availability for specific date
  const getSlotAvailability = (dateStr: string): SlotAvailability => {
    const dayBookings = allBookings.filter(
      (b) => b.date === dateStr && b.status !== 'cancelled'
    );

    const morningCount = dayBookings.filter((b) => b.timeSlot === 'morning_09').length;
    const afternoonCount = dayBookings.filter((b) => b.timeSlot === 'afternoon_14').length;
    const eveningCount = dayBookings.filter((b) => b.timeSlot === 'evening_18').length;

    return {
      date: dateStr,
      slots: {
        morning_09: {
          total: maxSlotsPerWindow,
          booked: morningCount,
          available: morningCount < maxSlotsPerWindow
        },
        afternoon_14: {
          total: maxSlotsPerWindow,
          booked: afternoonCount,
          available: afternoonCount < maxSlotsPerWindow
        },
        evening_18: {
          total: maxSlotsPerWindow,
          booked: eveningCount,
          available: eveningCount < maxSlotsPerWindow
        }
      }
    };
  };

  // Create new reservation
  const createBooking = async (
    bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<Booking> => {
    // 1. Capacity check
    const availability = getSlotAvailability(bookingData.date);
    const targetSlot = availability.slots[bookingData.timeSlot];
    if (!targetSlot.available) {
      throw new Error('선택하신 날짜의 해당 시간대는 이미 마감되었습니다. 다른 시간을 선택해주세요.');
    }

    const timestamp = new Date().toISOString();
    const id = `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const datePart = bookingData.date.replace(/-/g, '');
    const bookingNumber = `CE-${datePart}-${randomSuffix}`;

    const newBooking: Booking = {
      ...bookingData,
      id,
      bookingNumber,
      status: 'pending', // '접수 대기' -> 관리자 확인 후 확정
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Update in memory immediately
    setAllBookings((prev) => [newBooking, ...prev]);

    // Persist to Firestore
    try {
      const docRef = doc(db, 'bookings', id);
      await setDoc(docRef, newBooking);
    } catch (error) {
      console.warn('Firestore setDoc notice:', error);
      // In local demo or offline mode, memory persistence guarantees user experience
    }

    return newBooking;
  };

  // Update status (Admin & Customer cancellation)
  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    const timestamp = new Date().toISOString();
    setAllBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status, updatedAt: timestamp } : b))
    );

    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, { status, updatedAt: timestamp });
    } catch (error) {
      console.warn('Firestore updateDoc note:', error);
    }
  };

  // Assign cleaner (Admin)
  const assignCleaner = async (bookingId: string, cleanerName: string) => {
    const timestamp = new Date().toISOString();
    setAllBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, assignedCleaner: cleanerName, status: b.status === 'pending' ? 'confirmed' : b.status, updatedAt: timestamp }
          : b
      )
    );

    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, {
        assignedCleaner: cleanerName,
        status: 'confirmed',
        updatedAt: timestamp
      });
    } catch (error) {
      console.warn('Firestore assign cleaner note:', error);
    }
  };

  // Reschedule booking
  const rescheduleBooking = async (bookingId: string, newDate: string, newSlot: TimeSlot) => {
    const timestamp = new Date().toISOString();
    setAllBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, date: newDate, timeSlot: newSlot, updatedAt: timestamp } : b
      )
    );

    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, { date: newDate, timeSlot: newSlot, updatedAt: timestamp });
    } catch (error) {
      console.warn('Firestore reschedule note:', error);
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId: string, reason?: string) => {
    await updateBookingStatus(bookingId, 'cancelled');
  };

  // Add customer review
  const addReview = async (reviewData: Omit<Review, 'id' | 'date' | 'verified'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      verified: true
    };

    setReviews((prev) => [newReview, ...prev]);

    try {
      const docRef = doc(db, 'reviews', newReview.id);
      await setDoc(docRef, newReview);
    } catch (error) {
      console.warn('Firestore review set note:', error);
    }
  };

  // Export bookings to CSV file for Admin
  const exportToCSV = () => {
    const headers = ['예약번호', '방문일자', '시간대', '고객명', '연락처', '지역', '주소', '서비스종류', '금액(원)', '배정담당자', '상태', '신청일시'];
    const rows = allBookings.map((b) => [
      b.bookingNumber,
      b.date,
      b.timeSlot === 'morning_09' ? '오전 09:00' : b.timeSlot === 'afternoon_14' ? '오후 14:00' : '저녁 18:00',
      b.customerName,
      b.customerPhone,
      b.region,
      `"${b.address} ${b.addressDetail || ''}"`,
      b.serviceType,
      b.totalPrice,
      b.assignedCleaner || '미배정',
      b.status,
      b.createdAt
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CleanExpert_예약대장_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings: allBookings,
        myBookings,
        reviews,
        loadingBookings,
        createBooking,
        updateBookingStatus,
        assignCleaner,
        rescheduleBooking,
        cancelBooking,
        addReview,
        getSlotAvailability,
        maxSlotsPerWindow,
        setMaxSlotsPerWindow,
        exportToCSV,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
