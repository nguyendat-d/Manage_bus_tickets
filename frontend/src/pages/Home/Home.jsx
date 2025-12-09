import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Bus, Shield, Clock, Phone, MapPin, Calendar, Users, 
  Star, ArrowRight, CheckCircle, Zap, Wifi, Battery,
  Coffee, Award, TrendingUp, Users as UsersIcon, Map,
  ChevronRight, Sparkles
} from 'lucide-react'
import SearchBox from '../../components/common/SearchBox'

const Home = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  })

  const stats = [
    { 
      number: '500K+', 
      label: 'Hành khách hài lòng', 
      icon: UsersIcon,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      number: '1000+', 
      label: 'Chuyến xe mỗi ngày', 
      icon: Bus,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      number: '50+', 
      label: 'Tỉnh thành phủ sóng', 
      icon: Map,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      number: '98%', 
      label: 'Tỷ lệ hài lòng', 
      icon: Star,
      color: 'from-orange-500 to-red-500'
    }
  ]

  const features = [
    {
      icon: Zap,
      title: 'Đặt vé siêu tốc',
      description: 'Hoàn tất đặt vé trong 30 giây với công nghệ hiện đại',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Shield,
      title: 'Bảo mật tuyệt đối',
      description: 'Mã hóa SSL 256-bit, đảm bảo an toàn thông tin',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Clock,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Award,
      title: 'Giá tốt nhất',
      description: 'Cam kết giá rẻ nhất, hoàn tiền 150% nếu đắt hơn',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ]

  const popularRoutes = [
    {
      from: 'Hà Nội',
      to: 'Hải Phòng',
      price: 120000,
      originalPrice: 140000,
      duration: '2h30m',
      frequency: '30 chuyến/ngày',
      amenities: [Wifi, Battery, Coffee],
      discount: 15
    },
    {
      from: 'TP.HCM',
      to: 'Vũng Tàu',
      price: 100000,
      originalPrice: 120000,
      duration: '2h',
      frequency: '25 chuyến/ngày',
      amenities: [Wifi, Battery],
      discount: 20
    },
    {
      from: 'Đà Nẵng',
      to: 'Huế',
      price: 80000,
      originalPrice: 100000,
      duration: '2h45m',
      frequency: '20 chuyến/ngày',
      amenities: [Wifi, Coffee],
      discount: 25
    }
  ]

  const handleSearchSubmit = (data) => {
    console.log('Search submitted:', data)
    // Handle search navigation
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 pt-24 pb-20">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 shadow-lg animate-fade-in">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </div>
                <span className="text-sm font-semibold">Được 500.000+ khách hàng tin dùng</span>
              </div>
              
              {/* Main Heading */}
              <div className="space-y-6 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Đặt Vé Xe Khách
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                    Dễ Dàng & Nhanh Chóng
                  </span>
                </h1>
                
                <p className="text-xl text-blue-100 leading-relaxed max-w-xl">
                  Hơn 1000 chuyến xe mỗi ngày đến mọi miền đất nước. 
                  Trải nghiệm dịch vụ đặt vé hiện đại, an toàn và tiện lợi nhất.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-blue-100">Xác nhận tức thì</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-blue-100">Bảo mật tuyệt đối</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-blue-100">Hỗ trợ 24/7</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Link
                  to="/search"
                  className="group btn-modern btn-primary text-lg px-8 py-4 rounded-xl"
                >
                  <span>Tìm chuyến xe ngay</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="group btn-modern bg-white/10 hover:bg-white/20 text-white border border-white/30 text-lg px-8 py-4 rounded-xl"
                >
                  Đăng ký tài khoản
                </Link>
              </div>
            </div>

            {/* Right Content - Search Box */}
            <div className="animate-scale-in">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="bg-white rounded-xl shadow-xl p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Tìm chuyến xe của bạn
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Điền thông tin để bắt đầu hành trình
                    </p>
                  </div>
                  
                  <SearchBox 
                    initialValues={searchParams}
                    onSearch={handleSearchSubmit}
                    variant="hero"
                  />
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>Bảo mật 100%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>Xác nhận ngay</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div 
                  key={index} 
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn BusTicket?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trải nghiệm dịch vụ đặt vé xe khách hiện đại với những ưu điểm vượt trội
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="card-modern p-6 text-center hover:border-blue-300 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`inline-flex p-4 rounded-2xl ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tuyến đường phổ biến
            </h2>
            <p className="text-lg text-gray-600">
              Khám phá những hành trình được yêu thích nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route, index) => (
              <div 
                key={index}
                className="trip-card-modern p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {route.discount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                    -{route.discount}%
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {route.from} → {route.to}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{route.duration}</span>
                      <span className="text-gray-400">•</span>
                      <span>{route.frequency}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  {route.amenities.map((Amenity, i) => (
                    <div key={i} className="p-2 bg-gray-50 rounded-lg">
                      <Amenity className="w-5 h-5 text-gray-600" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div>
                    {route.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        {route.originalPrice.toLocaleString()}đ
                      </div>
                    )}
                    <div className="text-2xl font-bold text-blue-600">
                      {route.price.toLocaleString()}đ
                    </div>
                    <div className="text-sm text-gray-500">/người</div>
                  </div>
                  
                  <Link
                    to="/search"
                    className="btn-modern btn-primary px-6 py-3 rounded-lg"
                  >
                    Đặt ngay
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/search"
              className="btn-modern border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg rounded-xl inline-flex items-center gap-2"
            >
              <span>Xem tất cả tuyến đường</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-semibold">Ưu đãi đặc biệt cho thành viên mới</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Bắt đầu hành trình của bạn ngay hôm nay!
          </h2>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Đăng ký tài khoản để nhận ưu đãi đặc biệt và trải nghiệm dịch vụ tốt nhất
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-modern bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl"
            >
              Đăng ký ngay - Nhận 50K
            </Link>
            <Link
              to="/about"
              className="btn-modern bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl"
            >
              Tìm hiểu thêm
            </Link>
          </div>
          
          <div className="mt-8 text-blue-100 text-sm">
            <p>✓ Hoàn tiền 100% trong 24h • ✓ Đảm bảo giá tốt nhất • ✓ Hỗ trợ 24/7</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home