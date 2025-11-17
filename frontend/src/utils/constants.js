export const APP_CONSTANTS = {
  ROLES: {
    PASSENGER: 'passenger',
    BUS_COMPANY: 'bus_company',
    ADMIN: 'admin'
  },
  
  BOOKING_STATUS: {
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
  },
  
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  },
  
  PAYMENT_METHODS: {
    VNPAY: 'vnpay',
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card',
    CASH: 'cash'
  },
  
  BUS_TYPES: {
    LIMOUSINE: 'limousine',
    SLEEPER: 'sleeper',
    SEATER: 'seater',
    VAN: 'van'
  },
  
  TRIP_STATUS: {
    SCHEDULED: 'scheduled',
    DEPARTED: 'departed',
    ARRIVED: 'arrived',
    CANCELLED: 'cancelled'
  }
}

export const CITIES = [
  'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'Nha Trang', 'Quảng Ninh', 'Vũng Tàu', 'Đà Lạt', 'Huế',
  'Quảng Ninh', 'Hạ Long', 'Phú Quốc', 'Sapa', 'Tam Đảo'
]

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  SEARCH_HISTORY: 'search_history'
}