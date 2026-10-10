export type ServiceType = 'basic' | 'kitchen_bath' | 'deep' | 'move_in' | 'recurring';
export type HomeType = 'apartment' | 'villa' | 'officetel' | 'house';
export type AreaSize = 'under_10' | '11_20' | '21_30' | '31_40' | 'over_40';
export type TimeSlot = 'morning_09' | 'afternoon_14' | 'evening_18';
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface BookingOption {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  addressDetail: string;
  postalCode: string;
  region: string; // e.g. "서울 강남구"
  serviceType: ServiceType;
  homeType: HomeType;
  areaSize: AreaSize;
  options: string[]; // option IDs
  date: string; // YYYY-MM-DD
  timeSlot: TimeSlot;
  durationHours: number;
  totalPrice: number;
  notes?: string;
  entryInfo?: string;
  hasPets: boolean;
  hasParking: boolean;
  assignedCleaner?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Cleaner {
  id: string;
  name: string;
  title: string;
  experienceYears: number;
  completedJobs: number;
  rating: number;
  certification: string;
  avatarUrl: string;
  specialty: string;
}

export interface Review {
  id: string;
  bookingId?: string;
  userId: string;
  userName: string;
  serviceType: ServiceType;
  areaSize: string;
  region: string;
  rating: number;
  content: string;
  cleanerName: string;
  beforeImg?: string;
  afterImg?: string;
  date: string;
  verified: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface SlotAvailability {
  date: string;
  slots: {
    morning_09: { total: number; booked: number; available: boolean };
    afternoon_14: { total: number; booked: number; available: boolean };
    evening_18: { total: number; booked: number; available: boolean };
  };
}
