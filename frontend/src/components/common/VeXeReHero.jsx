import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Users, ArrowRight, Search } from 'lucide-react'

const VeXeReHero = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  })

  const popularRoutes = [
    { from: 'Hà Nội', to: 'Hải Phòng', icon: '🚌' },
    { from: 'Hà Nội', to: 'Hạ Long', icon: '⛰️' },
    { from: 'TP.HCM', to: 'Cần Thơ', icon: '🌾' },
    { from: 'TP.HCM', to: 'Nha Trang', icon: '🏖️' },
    { from: 'Hà Nội', to: 'Vinh', icon: '🌄' },
    { from: 'Đà Nẵng', to: 'Huế', icon: '🏰' },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/search-trips', { state: formData })
  }

  const handleQuickSelect = (from, to) => {
    setFormData({ ...formData, from, to })
  }

  return (
    <section className="relative bg-gradient-to-br from-[#1861c5] via-[#2474E5] to-[#4a90e2] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ffc600] rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Đặt Vé Xe Online
            <span className="block text-[#ffc600]">Siêu Tiện Lợi</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto">
            Hơn 500 nhà xe chất lượng cao - Chuyến đi an toàn - Giá vé hợp lý
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mb-6">
              {/* From Location */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1861c5]" />
                  Điểm đi
                </label>
                <input
                  type="text"
                  placeholder="Chọn điểm đi"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1861c5] transition-all text-gray-900 font-medium"
                  required
                />
              </div>

              {/* Arrow Icon */}
              <div className="hidden lg:flex lg:col-span-1 items-end justify-center pb-3">
                <ArrowRight className="w-6 h-6 text-[#ffc600]" />
              </div>

              {/* To Location */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#ffc600]" />
                  Điểm đến
                </label>
                <input
                  type="text"
                  placeholder="Chọn điểm đến"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1861c5] transition-all text-gray-900 font-medium"
                  required
                />
              </div>

              {/* Date */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1861c5]" />
                  Ngày đi
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1861c5] transition-all text-gray-900 font-medium"
                  required
                />
              </div>

              {/* Search Button */}
              <div className="lg:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#ffc600] to-[#ffb800] text-[#1861c5] font-bold rounded-lg hover:shadow-xl transition-all transform hover:scale-105 duration-300 flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Tìm vé</span>
                </button>
              </div>
            </div>

            {/* Popular Routes */}
            <div className="border-t-2 border-gray-200 pt-5">
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-[#1861c5]">🔥</span>
                Tuyến phổ biến:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {popularRoutes.map((route, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSelect(route.from, route.to)}
                    className="px-3 py-2 bg-gray-50 hover:bg-[#1861c5] hover:text-white text-gray-700 rounded-lg transition-all border border-gray-200 hover:border-[#1861c5] font-medium text-sm flex items-center gap-2 justify-center"
                  >
                    <span>{route.icon}</span>
                    <span className="hidden sm:inline">{route.from}</span>
                    <span className="text-xs">→</span>
                    <span className="hidden sm:inline">{route.to}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { number: '500+', label: 'Nhà xe uy tín', icon: '🚌' },
            { number: '100K+', label: 'Chuyến xe/ngày', icon: '🎫' },
            { number: '5M+', label: 'Hành khách', icon: '👥' },
            { number: '4.8★', label: 'Đánh giá', icon: '⭐' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center text-white">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold mb-1">{stat.number}</div>
              <div className="text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default VeXeReHero
