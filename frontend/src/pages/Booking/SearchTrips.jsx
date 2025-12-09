import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { 
  Filter, SortAsc, MapPin, Calendar, Clock, Star, Zap, 
  Shield, Wifi, Coffee, Battery, Wind, Tv, Package,
  X, Check, RefreshCw, TrendingUp, Award, Navigation
} from 'lucide-react'
import TripCard from "../../components/booking/TripCard"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import Pagination from "../../components/common/Pagination"
import SearchBox from "../../components/common/SearchBox"

const SearchTrips = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || new Date().toISOString().split('T')[0],
    page: parseInt(searchParams.get('page')) || 1,
    limit: 9,
    sortBy: 'departure_time',
    sortOrder: 'asc',
    busType: '',
    priceRange: [0, 500000],
    departureTime: '',
    amenities: [],
    companies: [],
    rating: 0
  })

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0
  })

  // Enhanced mock data with realistic trips
  const mockTrips = Array.from({ length: 15 }, (_, index) => {
    const busTypes = ['Giường nằm VIP', 'Ghế ngồi', 'Limousine', 'Giường nằm thường']
    const companies = [
      { name: 'Mai Linh Express', rating: 4.5, reviews: 1247, logo: '🚌' },
      { name: 'Phương Trang', rating: 4.3, reviews: 892, logo: '🚌' },
      { name: 'Hoàng Long', rating: 4.7, reviews: 567, logo: '🚌' },
      { name: 'Thành Bưởi', rating: 4.4, reviews: 1103, logo: '🚌' },
      { name: 'Kumho Viet Thanh', rating: 4.6, reviews: 456, logo: '🚌' }
    ]
    const routes = [
      { from: 'Hà Nội', to: 'Hải Phòng', distance: '120km', duration: '2h30m' },
      { from: 'Hà Nội', to: 'Quảng Ninh', distance: '150km', duration: '3h15m' },
      { from: 'TP.HCM', to: 'Vũng Tàu', distance: '95km', duration: '2h' },
      { from: 'TP.HCM', to: 'Đà Lạt', distance: '300km', duration: '6h' },
      { from: 'Đà Nẵng', to: 'Huế', distance: '100km', duration: '2h45m' }
    ]
    
    const company = companies[Math.floor(Math.random() * companies.length)]
    const route = routes[Math.floor(Math.random() * routes.length)]
    const busType = busTypes[Math.floor(Math.random() * busTypes.length)]
    
    const basePrice = Math.floor(Math.random() * 100000) + 50000
    const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0
    const finalPrice = discount > 0 ? basePrice * (1 - discount/100) : basePrice
    
    const amenities = ['wifi', 'ac', 'water']
    if (Math.random() > 0.5) amenities.push('charging')
    if (Math.random() > 0.7) amenities.push('entertainment')
    if (Math.random() > 0.8) amenities.push('luggage')
    
    return {
      id: `TRIP${1000 + index}`,
      companyName: company.name,
      companyLogo: company.logo,
      rating: company.rating,
      reviews: company.reviews,
      isVerified: Math.random() > 0.3,
      busType,
      amenities,
      departureCity: route.from,
      arrivalCity: route.to,
      departureTime: `${Math.floor(Math.random() * 12) + 6}:${Math.random() > 0.5 ? '00' : '30'}`,
      arrivalTime: `${Math.floor(Math.random() * 12) + 9}:${Math.random() > 0.5 ? '00' : '30'}`,
      departureStation: `Bến xe ${route.from}`,
      arrivalStation: `Bến xe ${route.to}`,
      departureDate: filters.date || new Date().toISOString().split('T')[0],
      distance: route.distance,
      duration: route.duration,
      price: finalPrice,
      originalPrice: discount > 0 ? basePrice : null,
      availableSeats: Math.floor(Math.random() * 20) + 1,
      isInstantConfirmation: Math.random() > 0.2,
      isSafetyCertified: Math.random() > 0.1,
      cancellationPolicy: 'Hoàn 100% trước 2h'
    }
  })

  const amenitiesList = [
    { id: 'wifi', name: 'WiFi', icon: Wifi, color: 'text-blue-600' },
    { id: 'ac', name: 'Điều hòa', icon: Wind, color: 'text-cyan-600' },
    { id: 'water', name: 'Nước uống', icon: Coffee, color: 'text-orange-600' },
    { id: 'charging', name: 'Sạc USB', icon: Battery, color: 'text-green-600' },
    { id: 'entertainment', name: 'Giải trí', icon: Tv, color: 'text-purple-600' },
    { id: 'luggage', name: 'Hành lý', icon: Package, color: 'text-yellow-600' }
  ]

  const busTypes = [
    { id: 'vip', name: 'Giường nằm VIP', icon: '⭐', desc: 'Cao cấp nhất' },
    { id: 'normal', name: 'Giường nằm thường', icon: '🛏️', desc: 'Tiêu chuẩn' },
    { id: 'seat', name: 'Ghế ngồi', icon: '💺', desc: 'Tiết kiệm' },
    { id: 'limo', name: 'Limousine', icon: '🚗', desc: 'Sang trọng' }
  ]

  const departureTimes = [
    { id: 'morning', label: 'Sáng', time: '5h - 12h', icon: '🌅' },
    { id: 'afternoon', label: 'Chiều', time: '12h - 18h', icon: '☀️' },
    { id: 'evening', label: 'Tối', time: '18h - 24h', icon: '🌇' },
    { id: 'night', label: 'Đêm', time: '0h - 5h', icon: '🌙' }
  ]

  const companiesList = [
    { id: 'mai_linh', name: 'Mai Linh Express', rating: 4.5 },
    { id: 'phuong_trang', name: 'Phương Trang', rating: 4.3 },
    { id: 'hoang_long', name: 'Hoàng Long', rating: 4.7 },
    { id: 'thanh_buoi', name: 'Thành Bưởi', rating: 4.4 },
    { id: 'kumho', name: 'Kumho Viet Thanh', rating: 4.6 }
  ]

  useEffect(() => {
    searchTrips()
  }, [filters])

  const searchTrips = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Filter mock data
      let filteredTrips = mockTrips.filter(trip => {
        if (filters.from && !trip.departureCity.toLowerCase().includes(filters.from.toLowerCase())) return false
        if (filters.to && !trip.arrivalCity.toLowerCase().includes(filters.to.toLowerCase())) return false
        if (filters.date && trip.departureDate !== filters.date) return false
        
        // Bus type filter
        if (filters.busType) {
          const typeMap = {
            'vip': 'Giường nằm VIP',
            'normal': 'Giường nằm thường',
            'seat': 'Ghế ngồi',
            'limo': 'Limousine'
          }
          if (trip.busType !== typeMap[filters.busType]) return false
        }
        
        // Price filter
        if (trip.price < filters.priceRange[0] || trip.price > filters.priceRange[1]) return false
        
        // Amenities filter
        if (filters.amenities.length > 0) {
          const hasAllAmenities = filters.amenities.every(amenity => 
            trip.amenities.includes(amenity)
          )
          if (!hasAllAmenities) return false
        }
        
        // Company filter
        if (filters.companies.length > 0) {
          if (!filters.companies.some(company => 
            trip.companyName.toLowerCase().includes(company.toLowerCase())
          )) return false
        }
        
        // Rating filter
        if (filters.rating > 0 && trip.rating < filters.rating) return false
        
        // Departure time filter
        if (filters.departureTime) {
          const hour = parseInt(trip.departureTime.split(':')[0])
          switch (filters.departureTime) {
            case 'morning':
              if (hour < 5 || hour >= 12) return false
              break
            case 'afternoon':
              if (hour < 12 || hour >= 18) return false
              break
            case 'evening':
              if (hour < 18 || hour >= 24) return false
              break
            case 'night':
              if (hour >= 5 && hour < 24) return false
              break
          }
        }
        
        return true
      })

      // Sort trips
      filteredTrips.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price':
            return filters.sortOrder === 'asc' ? a.price - b.price : b.price - a.price
          case 'departure_time':
            return filters.sortOrder === 'asc' ? a.departureTime.localeCompare(b.departureTime) : b.departureTime.localeCompare(a.departureTime)
          case 'rating':
            return filters.sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating
          case 'duration':
            const durationA = parseInt(a.duration)
            const durationB = parseInt(b.duration)
            return filters.sortOrder === 'asc' ? durationA - durationB : durationB - durationA
          default:
            return 0
        }
      })

      setTrips(filteredTrips)
      setPagination({
        page: filters.page,
        limit: filters.limit,
        total: filteredTrips.length,
        pages: Math.ceil(filteredTrips.length / filters.limit)
      })
      
      // Update URL
      const newSearchParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'page' && key !== 'amenities' && key !== 'companies') {
          newSearchParams.set(key, value.toString())
        }
      })
      if (filters.amenities.length > 0) {
        newSearchParams.set('amenities', filters.amenities.join(','))
      }
      if (filters.companies.length > 0) {
        newSearchParams.set('companies', filters.companies.join(','))
      }
      if (filters.page > 1) newSearchParams.set('page', filters.page.toString())
      
      navigate(`/search?${newSearchParams.toString()}`, { replace: true })
      
    } catch (err) {
      setError('Có lỗi xảy ra khi tìm kiếm chuyến xe. Vui lòng thử lại.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  const handleAmenityChange = (amenityId) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId],
      page: 1
    }))
  }

  const handleCompanyChange = (companyId) => {
    setFilters(prev => ({
      ...prev,
      companies: prev.companies.includes(companyId)
        ? prev.companies.filter(id => id !== companyId)
        : [...prev.companies, companyId],
      page: 1
    }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSortChange = (sortBy, sortOrder) => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({
      from: filters.from,
      to: filters.to,
      date: filters.date,
      page: 1,
      limit: 9,
      sortBy: 'departure_time',
      sortOrder: 'asc',
      busType: '',
      priceRange: [0, 500000],
      departureTime: '',
      amenities: [],
      companies: [],
      rating: 0
    })
  }

  const hasActiveFilters = 
    filters.busType || 
    filters.departureTime || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 500000 || 
    filters.amenities.length > 0 ||
    filters.companies.length > 0 ||
    filters.rating > 0

  // Get current search summary
  const getSearchSummary = () => {
    const from = filters.from || 'Tất cả'
    const to = filters.to || 'Tất cả'
    const date = filters.date ? new Date(filters.date).toLocaleDateString('vi-VN') : 'Hôm nay'
    return `${from} → ${to} • ${date}`
  }

  if (loading && trips.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Đang tìm kiếm chuyến xe...
          </h3>
          <p className="text-gray-600">
            Hệ thống đang tìm kiếm những chuyến xe phù hợp nhất cho bạn
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Tìm chuyến xe hoàn hảo
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Hơn 1000+ chuyến xe chất lượng • Giá tốt nhất • Đảm bảo hoàn tiền
            </p>
          </div>
          
          {/* Search Box */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <SearchBox 
                initialValues={{
                  from: filters.from,
                  to: filters.to,
                  date: filters.date,
                  passengers: 1
                }}
                onSearch={handleFilterChange}
                variant="compact"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="card-modern sticky top-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    Bộ lọc
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors duration-200"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Xóa tất cả
                    </button>
                  )}
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {filters.busType && (
                        <span className="badge-modern badge-primary text-xs">
                          {busTypes.find(b => b.id === filters.busType)?.name}
                        </span>
                      )}
                      {filters.departureTime && (
                        <span className="badge-modern bg-green-100 text-green-800 text-xs">
                          {departureTimes.find(t => t.id === filters.departureTime)?.label}
                        </span>
                      )}
                      {filters.amenities.map(amenity => (
                        <span key={amenity} className="badge-modern bg-purple-100 text-purple-800 text-xs">
                          {amenitiesList.find(a => a.id === amenity)?.name}
                        </span>
                      ))}
                      {filters.companies.map(company => (
                        <span key={company} className="badge-modern bg-gray-100 text-gray-800 text-xs">
                          {companiesList.find(c => c.id === company)?.name}
                        </span>
                      ))}
                      {filters.rating > 0 && (
                        <span className="badge-modern bg-yellow-100 text-yellow-800 text-xs">
                          ⭐ {filters.rating}+
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Bus Type Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Loại xe
                  </label>
                  <div className="space-y-2">
                    {busTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => handleFilterChange({ 
                          busType: filters.busType === type.id ? '' : type.id 
                        })}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                          filters.busType === type.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <span className="text-xl">{type.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{type.name}</div>
                          <div className="text-xs text-gray-500">{type.desc}</div>
                        </div>
                        {filters.busType === type.id && (
                          <Check className="w-5 h-5 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Khoảng giá: <span className="text-blue-600 font-bold">
                      {filters.priceRange[1].toLocaleString('vi-VN')}đ
                    </span>
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="10000"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange({ 
                        priceRange: [filters.priceRange[0], parseInt(e.target.value)] 
                      })}
                      className="w-full h-2 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">0đ</span>
                      <span className="text-gray-600">500.000đ</span>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Tiện nghi
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {amenitiesList.map(amenity => {
                      const Icon = amenity.icon
                      return (
                        <button
                          key={amenity.id}
                          onClick={() => handleAmenityChange(amenity.id)}
                          className={`p-3 rounded-lg border transition-all duration-200 flex flex-col items-center ${
                            filters.amenities.includes(amenity.id)
                              ? 'bg-blue-50 border-blue-200 shadow-sm'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${amenity.color} mb-1`} />
                          <span className="text-xs font-medium text-gray-700">{amenity.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Companies */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Nhà xe
                  </label>
                  <div className="space-y-2">
                    {companiesList.map(company => (
                      <label key={company.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={filters.companies.includes(company.id)}
                          onChange={() => handleCompanyChange(company.id)}
                          className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{company.rating}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Đánh giá tối thiểu
                  </label>
                  <div className="flex items-center gap-2">
                    {[0, 3, 4, 4.5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => handleFilterChange({ rating: filters.rating === rating ? 0 : rating })}
                        className={`flex-1 py-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-1 ${
                          filters.rating === rating
                            ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${rating > 0 ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">
                          {rating === 0 ? 'Tất cả' : rating + '+'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Departure Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Giờ khởi hành
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {departureTimes.map(time => (
                      <button
                        key={time.id}
                        onClick={() => handleFilterChange({ 
                          departureTime: filters.departureTime === time.id ? '' : time.id 
                        })}
                        className={`p-3 rounded-lg border transition-all duration-200 flex flex-col items-center ${
                          filters.departureTime === time.id
                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-lg mb-1">{time.icon}</span>
                        <span className="text-xs font-medium text-gray-700">{time.label}</span>
                        <span className="text-xs text-gray-500 mt-1">{time.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Navigation className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-bold text-gray-900">
                      {getSearchSummary()}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Tìm thấy <span className="font-bold text-gray-900">{pagination.total}</span> chuyến xe phù hợp
                  </p>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <SortAsc className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">Sắp xếp:</span>
                  </div>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-')
                      handleSortChange(sortBy, sortOrder)
                    }}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="departure_time-asc">Giờ đi sớm nhất</option>
                    <option value="departure_time-desc">Giờ đi muộn nhất</option>
                    <option value="price-asc">Giá thấp nhất</option>
                    <option value="price-desc">Giá cao nhất</option>
                    <option value="rating-desc">Đánh giá cao nhất</option>
                    <option value="duration-asc">Thời gian ngắn nhất</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">{error}</p>
                  <button
                    onClick={searchTrips}
                    className="text-sm text-red-600 hover:text-red-700 font-medium mt-1 flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Thử lại
                  </button>
                </div>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && (
              <div className="space-y-4 mb-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                      <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            {trips.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="inline-flex p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl mb-6">
                  <MapPin className="w-16 h-16 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Không tìm thấy chuyến xe phù hợp
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {filters.from || filters.to || hasActiveFilters 
                    ? 'Hãy thử thay đổi điều kiện tìm kiếm hoặc mở rộng bộ lọc để có nhiều lựa chọn hơn'
                    : 'Hãy bắt đầu tìm kiếm chuyến xe của bạn'
                  }
                </p>
                {(filters.from || filters.to || hasActiveFilters) && (
                  <button
                    onClick={clearFilters}
                    className="btn-modern btn-primary px-8 py-3 rounded-xl text-lg"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Xóa bộ lọc và thử lại
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Trips Grid */}
                <div className="space-y-4 mb-8">
                  {trips
                    .slice((filters.page - 1) * filters.limit, filters.page * filters.limit)
                    .map(trip => (
                      <TripCard key={trip.id} trip={trip} />
                    ))
                  }
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Hiển thị <span className="font-semibold text-gray-900">
                          {Math.min((filters.page - 1) * filters.limit + 1, pagination.total)}
                        </span> -{' '}
                        <span className="font-semibold text-gray-900">
                          {Math.min(filters.page * filters.limit, pagination.total)}
                        </span> của{' '}
                        <span className="font-semibold text-gray-900">{pagination.total}</span> chuyến xe
                      </div>
                      <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.pages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Promo Banner */}
            {trips.length > 0 && (
              <div className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="w-8 h-8 text-yellow-300" />
                      <h3 className="text-xl font-bold">Đặt vé ngay - Nhận ưu đãi đặc biệt!</h3>
                    </div>
                    <p className="text-blue-100">
                      Giảm thêm 10% khi thanh toán online • Hoàn tiền 100% trong 24h
                    </p>
                  </div>
                  <button className="btn-modern bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-bold text-lg whitespace-nowrap">
                    Đặt vé ngay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchTrips