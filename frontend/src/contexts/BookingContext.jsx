import React, { createContext, useContext, useState, useEffect } from 'react'

const BookingContext = createContext()

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    trip: null,
    passengers: [],
    selectedSeats: [],
    totalPrice: 0,
    paymentMethod: null,
    bookingCode: null,
    notes: '',
    specialRequests: []
  })

  const [bookingHistory, setBookingHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)

  // Mock booking service thay thế
  const bookingService = {
    getUserBookings: async () => {
      // Mock data for testing
      return { 
        data: { 
          bookings: [] 
        } 
      }
    },
    createBooking: async (bookingData) => {
      // Mock successful booking
      return { 
        data: { 
          bookingCode: 'BK' + Date.now(),
          booking: {
            id: Date.now(),
            ...bookingData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
          }
        } 
      }
    },
    cancelBooking: async (bookingCode) => {
      return { data: { success: true } }
    }
  }

  // Simple notification function
  const showNotification = (message, type = 'info') => {
    console.log(`[${type.toUpperCase()}]: ${message}`)
  }

  // Load auth data từ localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('auth')
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth)
        // Set authentication state based on stored data
      } catch (err) {
        console.error('Error loading auth data:', err)
      }
    }
  }, [])

  // Load booking data từ localStorage
  useEffect(() => {
    const savedBooking = localStorage.getItem('bookingData')
    if (savedBooking) {
      try {
        const parsed = JSON.parse(savedBooking)
        if (parsed.trip) {
          setBookingData(parsed)
        }
      } catch (err) {
        console.error('Error loading booking data:', err)
        localStorage.removeItem('bookingData')
      }
    }
  }, [])

  const isTripValid = (trip) => {
    if (!trip?.departureTime) return false
    const tripTime = new Date(trip.departureTime)
    const now = new Date()
    return tripTime > now
  }

  const loadBookingHistory = async () => {
    try {
      setIsLoading(true)
      const response = await bookingService.getUserBookings()
      
      if (response && response.data) {
        setBookingHistory(response.data.bookings || [])
      }
    } catch (error) {
      console.error('Error loading booking history:', error)
      showNotification('Không thể tải lịch sử đặt vé', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Save booking data to localStorage
  useEffect(() => {
    if (bookingData.trip) {
      localStorage.setItem('bookingData', JSON.stringify(bookingData))
    }
  }, [bookingData])

  // Step management
  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const goToStep = (step) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step)
    }
  }

  // Trip management
  const setTrip = (trip) => {
    if (!isTripValid(trip)) {
      setError('Chuyến đi đã hết hạn hoặc không khả dụng')
      showNotification('Chuyến đi không khả dụng', 'error')
      return false
    }

    setBookingData(prev => ({
      ...prev,
      trip,
      selectedSeats: [],
      passengers: [],
      totalPrice: 0
    }))
    
    setCurrentStep(2)
    setError(null)
    showNotification('Đã chọn chuyến đi', 'success')
    return true
  }

  // Passenger management
  const addPassenger = (passenger) => {
    setBookingData(prev => ({
      ...prev,
      passengers: [...prev.passengers, { 
        ...passenger, 
        id: Date.now() + Math.random()
      }]
    }))
  }

  const updatePassenger = (passengerId, updates) => {
    setBookingData(prev => ({
      ...prev,
      passengers: prev.passengers.map(p =>
        p.id === passengerId ? { ...p, ...updates } : p
      )
    }))
  }

  const removePassenger = (passengerId) => {
    setBookingData(prev => ({
      ...prev,
      passengers: prev.passengers.filter(p => p.id !== passengerId)
    }))
  }

  // Seat management
  const selectSeat = (seatNumber) => {
    setBookingData(prev => {
      const seatIndex = prev.selectedSeats.indexOf(seatNumber)
      
      if (seatIndex > -1) {
        // Deselect seat
        const newSeats = prev.selectedSeats.filter(s => s !== seatNumber)
        return {
          ...prev,
          selectedSeats: newSeats,
          totalPrice: newSeats.length * (prev.trip?.price || 0)
        }
      } else {
        // Select seat
        const newSeats = [...prev.selectedSeats, seatNumber]
        return {
          ...prev,
          selectedSeats: newSeats,
          totalPrice: newSeats.length * (prev.trip?.price || 0)
        }
      }
    })
  }

  const setPaymentMethod = (method) => {
    setBookingData(prev => ({
      ...prev,
      paymentMethod: method
    }))
  }

  // Booking confirmation
  const confirmBooking = async () => {
    if (!validateBooking()) {
      return { success: false, message: error }
    }

    try {
      setIsLoading(true)
      const response = await bookingService.createBooking(bookingData)
      const { bookingCode, booking } = response.data

      setBookingData(prev => ({
        ...prev,
        bookingCode
      }))

      setBookingHistory(prev => [booking, ...prev])
      localStorage.removeItem('bookingData')

      showNotification(`Đặt vé thành công! Mã: ${bookingCode}`, 'success')
      setCurrentStep(5)
      
      return { success: true, bookingCode, booking }
    } catch (error) {
      const message = error.message || 'Đặt vé thất bại'
      setError(message)
      showNotification(message, 'error')
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }

  const clearBooking = () => {
    setBookingData({
      trip: null,
      passengers: [],
      selectedSeats: [],
      totalPrice: 0,
      paymentMethod: null,
      bookingCode: null,
      notes: '',
      specialRequests: []
    })
    setCurrentStep(1)
    setError(null)
    localStorage.removeItem('bookingData')
  }

  const validateBooking = () => {
    if (!bookingData.trip) {
      setError('Vui lòng chọn chuyến đi')
      return false
    }

    if (bookingData.passengers.length === 0) {
      setError('Vui lòng nhập thông tin hành khách')
      return false
    }

    if (bookingData.selectedSeats.length !== bookingData.passengers.length) {
      setError('Vui lòng chọn ghế cho tất cả hành khách')
      return false
    }

    if (!bookingData.paymentMethod) {
      setError('Vui lòng chọn phương thức thanh toán')
      return false
    }

    setError(null)
    return true
  }

  const value = {
    // State
    bookingData,
    bookingHistory,
    isLoading,
    error,
    currentStep,

    // Actions
    nextStep,
    prevStep,
    goToStep,
    setTrip,
    addPassenger,
    updatePassenger,
    removePassenger,
    selectSeat,
    setPaymentMethod,
    confirmBooking,
    clearBooking,
    validateBooking,

    // Utility
    getTotalPrice: () => bookingData.totalPrice,
    canProceedToNextStep: () => {
      switch (currentStep) {
        case 1: return !!bookingData.trip
        case 2: return bookingData.passengers.length > 0
        case 3: return bookingData.selectedSeats.length === bookingData.passengers.length
        case 4: return !!bookingData.paymentMethod
        default: return true
      }
    }
  }

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}

export default BookingContext