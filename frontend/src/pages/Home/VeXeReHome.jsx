import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Star, MapPin, Clock, Users, Shield, Zap, Heart,
  TrendingUp, Award, Headphones, Lock, Eye, ChevronRight
} from 'lucide-react'
import VeXeReHero from '../../components/common/VeXeReHero'

const VeXeReHome = () => {
  const [featuredTrips, setFeaturedTrips] = useState([])

  // Sample featured trips data
  const trips = [
    {
      id: 1,
      company: 'Phương Trang FUTA Bus Lines',
      logo: '🚌',
      rating: 4.8,
      reviews: 2156,
      route: { from: 'Hà Nội', to: 'Hải Phòng' },
      departure: '06:00',
      arrival: '08:30',
      duration: '2h 30m',
      price: 150000,
      seats: 12,
      amenities: ['Wifi', 'Điều hòa', 'Nước uống'],
      discount: 10
    },
    {
      id: 2,
      company: 'Thành Bưởi Travel',
      logo: '🚌',
      rating: 4.7,
      reviews: 1890,
      route: { from: 'TP.HCM', to: 'Cần Thơ' },
      departure: '22:00',
      arrival: '05:30',
      duration: '7h 30m',
      price: 280000,
      seats: 8,
      amenities: ['Wifi', 'Giường nằm', 'WC'],
      discount: 15
    },
    {
      id: 3,
      company: 'Kumho Samco',
      logo: '🚌',
      rating: 4.9,
      reviews: 3240,
      route: { from: 'Hà Nội', to: 'Hạ Long' },
      departure: '14:00',
      arrival: '17:15',
      duration: '3h 15m',
      price: 180000,
      seats: 15,
      amenities: ['Wifi', 'Điều hòa', 'USB'],
      discount: 0
    },
    {
      id: 4,
      company: 'Mai Linh Express',
      logo: '🚌',
      rating: 4.6,
      reviews: 1567,
      route: { from: 'TP.HCM', to: 'Nha Trang' },
      departure: '06:00',
      arrival: '12:00',
      duration: '6h',
      price: 220000,
      seats: 20,
      amenities: ['Wifi', 'Điều hòa', 'Snack'],
      discount: 20
    },
  ]

  const benefits = [
    {
      icon: Zap,
      title: '100.000+ chuyến xe',
      description: 'Đa dạng lựa chọn các chuyến xe phù hợp',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Chắc chắn có chỗ',
      description: 'Đặt vé trực tuyến, không lo hết vé',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Award,
      title: 'Giá tốt nhất',
      description: 'Nhiều ưu đãi, giá rẻ hơn khi mua trực tiếp',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Headphones,
      title: 'Hỗ trợ 24/7',
      description: 'Luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Lock,
      title: 'Thanh toán an toàn',
      description: 'Nhiều hình thức thanh toán, bảo mật cao',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Eye,
      title: 'Minh bạch & rõ ràng',
      description: 'Thông tin chi tiết, không phí ẩn',
      color: 'from-teal-500 to-cyan-500'
    },
  ]

  const popularRoutes = [
    { from: 'Hà Nội', to: 'Hải Phòng', trips: '500+', price: '150K', image: '🏙️' },
    { from: 'TP.HCM', to: 'Cần Thơ', trips: '300+', price: '280K', image: '🌾' },
    { from: 'Hà Nội', to: 'Hạ Long', trips: '400+', price: '180K', image: '⛰️' },
    { from: 'TP.HCM', to: 'Nha Trang', trips: '350+', price: '220K', image: '🏖️' },
    { from: 'Hà Nội', to: 'Vinh', trips: '200+', price: '200K', image: '🌄' },
    { from: 'Đà Nẵng', to: 'Huế', trips: '450+', price: '100K', image: '🏰' },
  ]

  const testimonials = [
    {
      name: 'Nguyễn Văn A',
      location: 'Hà Nội',
      avatar: 'NA',
      rating: 5,
      text: 'Dịch vụ tuyệt vời! Đặt vé online rất dễ dàng, xe đúng giờ, nhân viên nhiệt tình.',
      badge: 'Khách VIP'
    },
    {
      name: 'Trần Thị B',
      location: 'TP.HCM',
      avatar: 'TB',
      rating: 5,
      text: 'Tôi thường xuyên đặt vé xe qua VeXeRe. Giá cả hợp lý, nhiều chương trình khuyến mãi.',
      badge: 'Khách thường xuyên'
    },
    {
      name: 'Lê Văn C',
      location: 'Đà Nẵng',
      avatar: 'LC',
      rating: 5,
      text: 'Lần đầu sử dụng và rất hài lòng. Giao diện đẹp, thanh toán nhanh chóng.',
      badge: 'Khách mới'
    },
  ]

  useEffect(() => {
    setFeaturedTrips(trips)
  }, [])

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <VeXeReHero />

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn <span className="text-[#1861c5]">VeXeRe?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hơn 5 triệu hành khách tin tưởng lựa chọn VeXeRe mỗi năm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <div key={idx} className="group bg-gray-50 rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#1861c5]">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Trips */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Chuyến xe nổi bật</h2>
              <p className="text-gray-600">Những chuyến xe được đặt nhiều nhất hôm nay</p>
            </div>
            <Link to="/search-trips" className="hidden md:flex items-center gap-2 text-[#1861c5] font-bold hover:text-[#2474E5] transition-colors">
              Xem tất cả <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTrips.map((trip) => (
              <Link key={trip.id} to={`/trip/${trip.id}`} className="group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{trip.logo}</span>
                          <h3 className="font-bold text-gray-900 text-sm leading-tight">{trip.company}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-[#ffc600] text-[#ffc600]" />
                            <span className="font-bold text-gray-900">{trip.rating}</span>
                          </div>
                          <span className="text-gray-400">({trip.reviews})</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Route & Time */}
                  <div className="p-4 flex-1">
                    <div className="text-sm font-bold text-[#1861c5] mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{trip.route.from} → {trip.route.to}</span>
                    </div>
                    
                    {/* Timeline */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{trip.departure}</div>
                        <div className="text-xs text-gray-500">Khởi hành</div>
                      </div>
                      <div className="flex-1 px-4">
                        <div className="h-0.5 bg-gradient-to-r from-[#1861c5] to-[#ffc600] relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-[#1861c5] rounded-full flex items-center justify-center">
                            <span className="text-xs">🚌</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 text-center mt-1">{trip.duration}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{trip.arrival}</div>
                        <div className="text-xs text-gray-500">Đến nơi</div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {trip.amenities.map((amenity, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-[#1861c5] rounded-full font-medium">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {/* Seats */}
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <Users className="w-4 h-4 text-green-600" />
                      <span>Còn <span className="font-bold text-green-600">{trip.seats} chỗ</span> trống</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <div>
                        {trip.discount > 0 && (
                          <div className="text-xs text-gray-400 line-through mb-1">
                            {(trip.price / 1000).toFixed(0)}K
                          </div>
                        )}
                        <div className="flex items-baseline gap-2">
                          <div className="text-2xl font-bold text-[#1861c5]">
                            {((trip.price * (100 - trip.discount)) / 100000).toFixed(0)}K
                          </div>
                          {trip.discount > 0 && (
                            <span className="text-xs px-2 py-1 bg-[#ffc600] text-[#1861c5] rounded font-bold">
                              -{trip.discount}%
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-[#1861c5] to-[#2474E5] text-white rounded-lg hover:shadow-lg transition-all font-bold text-sm group-hover:scale-105">
                        Đặt vé
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Link to="/search-trips" className="md:hidden flex items-center justify-center gap-2 text-[#1861c5] font-bold hover:text-[#2474E5] transition-colors mt-6">
            Xem tất cả <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tuyến đường <span className="text-[#1861c5]">phổ biến</span>
            </h2>
            <p className="text-lg text-gray-600">
              Những tuyến xe được lựa chọn nhiều nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route, idx) => (
              <Link
                key={idx}
                to={`/search-trips?from=${route.from}&to=${route.to}`}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:border-[#1861c5] hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{route.image}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#1861c5] transition-colors">
                      {route.from} → {route.to}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{route.trips} chuyến</span>
                      </div>
                      <div className="text-[#1861c5] font-bold">
                        Từ {route.price}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1861c5] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-[#1861c5] via-[#2474E5] to-[#4a90e2]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Khách hàng nói gì về chúng tôi?
            </h2>
            <p className="text-lg text-white/90">
              Hơn 5 triệu hành khách hài lòng tin tưởng VeXeRe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#ffc600] text-[#ffc600]" />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1861c5] to-[#2474E5] rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 bg-[#ffc600] text-[#1861c5] rounded-full font-bold whitespace-nowrap">
                    {testimonial.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Tải ứng dụng VeXeRe ngay
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Đặt vé dễ dàng hơn, nhận thông báo nhanh hơn với ứng dụng di động
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-black text-white rounded-lg hover:shadow-xl transition-all font-bold flex items-center justify-center gap-3">
              <span className="text-2xl">📱</span>
              <div className="text-left">
                <div className="text-xs">Tải về trên</div>
                <div>App Store</div>
              </div>
            </button>
            <button className="px-8 py-4 bg-black text-white rounded-lg hover:shadow-xl transition-all font-bold flex items-center justify-center gap-3">
              <span className="text-2xl">🤖</span>
              <div className="text-left">
                <div className="text-xs">Tải về trên</div>
                <div>Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default VeXeReHome
