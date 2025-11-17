import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Calendar, MapPin, Swap } from 'lucide-react'
import { CITIES } from '../../utils/constants'
import { debounce } from '../../utils/helpers'

const SearchBox = ({ className = '' }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: ''
  })
  const [suggestions, setSuggestions] = useState({
    from: [],
    to: []
  })
  const [focusedField, setFocusedField] = useState(null)

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setFormData(prev => ({
      ...prev,
      date: tomorrow.toISOString().split('T')[0]
    }))
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (value.length > 0 && (field === 'from' || field === 'to')) {
      const filtered = CITIES.filter(city =>
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

  const swapLocations = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.from || !formData.to || !formData.date) {
      alert('Vui lòng điền đầy đủ thông tin tìm kiếm')
      return
    }

    const searchParams = new URLSearchParams(formData)
    navigate(`/search?${searchParams.toString()}`)
  }

  const debouncedHandleInputChange = debounce(handleInputChange, 300)

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* From Location */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Điểm đi
            </label>
            <div className="relative">
              <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.from}
                onChange={(e) => debouncedHandleInputChange('from', e.target.value)}
                onFocus={() => setFocusedField('from')}
                onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                placeholder="Nhập điểm đi..."
                className="input pl-10 pr-4"
                required
              />
            </div>
            {focusedField === 'from' && suggestions.from.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.from.map((city, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                    onClick={() => handleSuggestionClick('from', city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex items-end justify-center">
            <button
              type="button"
              onClick={swapLocations}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors mb-2"
            >
              <Swap size={20} className="text-gray-600" />
            </button>
          </div>

          {/* To Location */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Điểm đến
            </label>
            <div className="relative">
              <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.to}
                onChange={(e) => debouncedHandleInputChange('to', e.target.value)}
                onFocus={() => setFocusedField('to')}
                onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                placeholder="Nhập điểm đến..."
                className="input pl-10 pr-4"
                required
              />
            </div>
            {focusedField === 'to' && suggestions.to.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.to.map((city, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                    onClick={() => handleSuggestionClick('to', city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày đi
            </label>
            <div className="relative">
              <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="input pl-10 pr-4"
                required
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Search size={20} />
              <span>Tìm chuyến xe</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchBox