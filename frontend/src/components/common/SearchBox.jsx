import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Search, 
  Calendar, 
  MapPin, 
  ArrowUpDown, 
  Users,
  Clock,
  TrendingUp,
  Star,
  ChevronDown,
  X,
  Navigation,
  Zap
} from 'lucide-react'
import { debounce } from '../../utils/helpers'

const SearchBox = ({ 
  className = '',
  variant = 'default',
  onSearch,
  initialValues = {}
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    from: initialValues.from || '',
    to: initialValues.to || '',
    date: initialValues.date || '',
    passengers: initialValues.passengers || 1
  })
  const [suggestions, setSuggestions] = useState({
    from: [],
    to: []
  })
  const [focusedField, setFocusedField] = useState(null)
  const [showPassengers, setShowPassengers] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const suggestionsRef = useRef(null)

  const popularCities = [
    'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'Nha Trang', 'Đà Lạt', 'Vũng Tàu', 'Huế', 'Quảng Ninh'
  ]

  const popularRoutes = [
    { from: 'Hà Nội', to: 'Hải Phòng', trips: 45, duration: '2h30m', price: '120.000đ' },
    { from: 'Hà Nội', to: 'Quảng Ninh', trips: 38, duration: '3h15m', price: '150.000đ' },
    { from: 'TP.HCM', to: 'Vũng Tàu', trips: 62, duration: '2h', price: '100.000đ' },
    { from: 'TP.HCM', to: 'Đà Lạt', trips: 27, duration: '6h', price: '200.000đ' },
    { from: 'Đà Nẵng', to: 'Huế', trips: 35, duration: '2h45m', price: '80.000đ' }
  ]

  // Initialize form data
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    setFormData({
      from: params.get('from') || initialValues.from || '',
      to: params.get('to') || initialValues.to || '',
      date: params.get('date') || initialValues.date || tomorrow.toISOString().split('T')[0],
      passengers: parseInt(params.get('passengers')) || initialValues.passengers || 1
    })
  }, [location.search, initialValues])

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5))
    }
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setFocusedField(null)
        setShowPassengers(false)
        setShowDatePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (value.length > 0 && (field === 'from' || field === 'to')) {
      const filtered = popularCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(prev => ({ ...prev, [field]: filtered.slice(0, 5) }))
    } else {
      setSuggestions(prev => ({ ...prev, [field]: [] }))
    }
  }

  const handleSuggestionClick = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setSuggestions(prev => ({ ...prev, [field]: [] }))
    setFocusedField(null)
  }

  const handlePopularRouteClick = (route) => {
    setFormData({
      from: route.from,
      to: route.to,
      date: formData.date,
      passengers: formData.passengers
    })
  }

  const swapLocations = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }))
  }

  const updatePassengers = (change) => {
    setFormData(prev => ({
      ...prev,
      passengers: Math.max(1, Math.min(10, prev.passengers + change))
    }))
  }

  const saveToRecentSearches = (searchData) => {
    const newSearch = {
      ...searchData,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    }
    
    const updated = [newSearch, ...recentSearches.filter(s => 
      !(s.from === searchData.from && s.to === searchData.to)
    )].slice(0, 5)
    
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.from || !formData.to || !formData.date) {
      return
    }

    // Save to recent searches
    saveToRecentSearches(formData)

    // Call custom onSearch handler if provided
    if (onSearch) {
      onSearch(formData)
    } else {
      // Default navigation
      const searchParams = new URLSearchParams({
        from: formData.from,
        to: formData.to,
        date: formData.date,
        passengers: formData.passengers
      })
      navigate(`/search?${searchParams.toString()}`)
    }
  }

  const clearField = (field) => {
    setFormData(prev => ({ ...prev, [field]: '' }))
    setFocusedField(field)
  }

  const getQuickDates = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const weekend = new Date(today)
    const dayOfWeek = today.getDay()
    const daysUntilWeekend = dayOfWeek === 0 ? 6 : 6 - dayOfWeek
    weekend.setDate(today.getDate() + daysUntilWeekend)

    return [
      { label: 'Hôm nay', date: today.toISOString().split('T')[0], icon: '🌞' },
      { label: 'Ngày mai', date: tomorrow.toISOString().split('T')[0], icon: '📅' },
      { label: 'Cuối tuần', date: weekend.toISOString().split('T')[0], icon: '🎉' },
      { label: 'Tuần sau', date: new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0], icon: '⏭️' }
    ]
  }

  const quickDates = getQuickDates()

  const debouncedHandleInputChange = debounce(handleInputChange, 300)

  // Compact variant for search results page
  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* From */}
            <div className="flex-1 relative">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.from}
                  onChange={(e) => handleInputChange('from', e.target.value)}
                  placeholder="Điểm đi"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
                {formData.from && (
                  <button
                    type="button"
                    onClick={() => clearField('from')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={swapLocations}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors duration-200"
                title="Đổi điểm đi/đến"
              >
                <ArrowUpDown className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* To */}
            <div className="flex-1 relative">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.to}
                  onChange={(e) => handleInputChange('to', e.target.value)}
                  placeholder="Điểm đến"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
                {formData.to && (
                  <button
                    type="button"
                    onClick={() => clearField('to')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Tìm kiếm</span>
            </button>
          </div>
        </form>
      </div>
    )
  }

  // Hero variant for home page
  if (variant === 'hero') {
    return (
      <div className={`bg-white rounded-2xl shadow-2xl ${className}`}>
        <div className="p-1">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                {/* From */}
                <div className="md:col-span-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Điểm đi
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.from}
                      onChange={(e) => debouncedHandleInputChange('from', e.target.value)}
                      onFocus={() => setFocusedField('from')}
                      placeholder="Nhập điểm đi..."
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white text-gray-900"
                    />
                  </div>
                </div>

                {/* Swap Button */}
                <div className="md:col-span-2 flex items-end justify-center">
                  <button
                    type="button"
                    onClick={swapLocations}
                    className="bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 p-3 rounded-xl transition-all duration-300 hover:scale-110 mb-2"
                    title="Đổi điểm đi/đến"
                  >
                    <ArrowUpDown className="w-5 h-5 text-blue-600" />
                  </button>
                </div>

                {/* To */}
                <div className="md:col-span-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Điểm đến
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.to}
                      onChange={(e) => debouncedHandleInputChange('to', e.target.value)}
                      onFocus={() => setFocusedField('to')}
                      placeholder="Nhập điểm đến..."
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày đi
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white text-gray-900"
                    />
                  </div>
                </div>

                {/* Passengers */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hành khách
                  </label>
                  <div className="relative" ref={suggestionsRef}>
                    <button
                      type="button"
                      onClick={() => setShowPassengers(!showPassengers)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-left bg-white flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Users className="text-blue-600 w-5 h-5 mr-3" />
                        <span className="text-gray-900">{formData.passengers} hành khách</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showPassengers ? 'rotate-180' : ''}`} />
                    </button>

                    {showPassengers && (
                      <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-medium text-gray-900">Số hành khách</span>
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => updatePassengers(-1)}
                              disabled={formData.passengers <= 1}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                            >
                              <span className="text-lg">-</span>
                            </button>
                            <span className="text-xl font-bold w-8 text-center">{formData.passengers}</span>
                            <button
                              type="button"
                              onClick={() => updatePassengers(1)}
                              disabled={formData.passengers >= 10}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                            >
                              <span className="text-lg">+</span>
                            </button>
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-gray-500">Tối đa 10 hành khách</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
                  >
                    <Search className="w-6 h-6" />
                    <span>Tìm chuyến xe</span>
                    <Zap className="w-5 h-5 animate-pulse" />
                  </button>
                </div>
              </div>

              {/* Quick Date Buttons */}
              <div className="flex flex-wrap gap-2">
                {quickDates.map((quickDate, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, date: quickDate.date }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                      formData.date === quickDate.date
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{quickDate.icon}</span>
                    <span className="text-sm font-medium">{quickDate.label}</span>
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 ${className}`} ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          {/* From */}
          <div className="md:col-span-5">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Điểm đi
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.from}
                  onChange={(e) => debouncedHandleInputChange('from', e.target.value)}
                  onFocus={() => setFocusedField('from')}
                  placeholder="Nhập điểm đi..."
                  className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white text-gray-900"
                />
                {formData.from && (
                  <button
                    type="button"
                    onClick={() => clearField('from')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex items-end justify-center">
            <button
              type="button"
              onClick={swapLocations}
              className="bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition-all duration-300 hover:scale-110 mb-2"
              title="Đổi điểm đi/đến"
            >
              <ArrowUpDown className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* To */}
          <div className="md:col-span-5">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Điểm đến
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.to}
                  onChange={(e) => debouncedHandleInputChange('to', e.target.value)}
                  onFocus={() => setFocusedField('to')}
                  placeholder="Nhập điểm đến..."
                  className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white text-gray-900"
                />
                {formData.to && (
                  <button
                    type="button"
                    onClick={() => clearField('to')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Ngày đi
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Passengers */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Hành khách
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPassengers(!showPassengers)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-left bg-white flex items-center justify-between"
              >
                <span className="text-gray-900">{formData.passengers} hành khách</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showPassengers ? 'rotate-180' : ''}`} />
              </button>

              {showPassengers && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-900">Số hành khách</span>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => updatePassengers(-1)}
                        disabled={formData.passengers <= 1}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                      >
                        <span className="text-lg">-</span>
                      </button>
                      <span className="text-xl font-bold w-8 text-center">{formData.passengers}</span>
                      <button
                        type="button"
                        onClick={() => updatePassengers(1)}
                        disabled={formData.passengers >= 10}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Tìm chuyến xe</span>
            </button>
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {(focusedField && suggestions[focusedField].length > 0) && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto animate-fade-in">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 px-3 py-1">Tìm kiếm gần đây</p>
              {recentSearches.map((search) => (
                <button
                  key={search.id}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-between group"
                  onClick={() => {
                    setFormData({
                      from: search.from,
                      to: search.to,
                      date: formData.date,
                      passengers: search.passengers
                    })
                    setFocusedField(null)
                  }}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{search.from} → {search.to}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(search.timestamp).toLocaleDateString('vi-VN')} • {search.passengers} người
                    </p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </button>
              ))}
            </div>
          )}

          {/* Popular Routes */}
          {popularRoutes.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 px-3 py-1">Tuyến đường phổ biến</p>
              {popularRoutes.slice(0, 3).map((route, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-green-50 rounded-lg transition-colors flex items-center justify-between group"
                  onClick={() => {
                    handlePopularRouteClick(route)
                    setFocusedField(null)
                  }}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{route.from} → {route.to}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {route.duration} • {route.trips} chuyến/ngày
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-green-600">{route.price}</span>
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* City Suggestions */}
          {suggestions[focusedField].length > 0 && (
            <div className="p-3">
              <p className="text-xs font-semibold text-gray-500 px-3 py-1">Đề xuất</p>
              {suggestions[focusedField].map((city, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3"
                  onClick={() => handleSuggestionClick(focusedField, city)}
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{city}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBox