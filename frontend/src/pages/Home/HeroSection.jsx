import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, Users, DollarSign, Zap, ArrowRight, Shield, 
  Clock, Star, CheckCircle, Sparkles, TrendingUp, 
  Award, Bus, Calendar, Navigation, Heart
} from 'lucide-react'
import SearchBox from '../../components/common/SearchBox'

const HeroSection = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  })

  const features = [
    {
      icon: Zap,
      title: 'Đặt vé siêu tốc',
      description: 'Hoàn tất trong 30 giây',
      stats: 'Xác nhận ngay',
      gradient: 'from-yellow-500 to-orange-500',
      delay: '0s'
    },
    {
      icon: Shield,
      title: 'Bảo mật tuyệt đối',
      description: 'Mã hóa SSL 256-bit',
      stats: 'An toàn 100%',
      gradient: 'from-green-500 to-emerald-500',
      delay: '0.1s'
    },
    {
      icon: DollarSign,
      title: 'Giá tốt nhất',
      description: 'Cam kết giá rẻ nhất',
      stats: 'Hoàn tiền 150%',
      gradient: 'from-blue-500 to-cyan-500',
      delay: '0.2s'
    },
    {
      icon: Clock,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ chuyên nghiệp',
      stats: 'Phản hồi 5 phút',
      gradient: 'from-purple-500 to-pink-500',
      delay: '0.3s'
    }
  ]

  const popularDestinations = [
    { name: 'Hà Nội', trips: 245, icon: '🏙️', color: 'from-blue-500 to-cyan-500' },
    { name: 'TP.HCM', trips: 312, icon: '🏢', color: 'from-purple-500 to-pink-500' },
    { name: 'Đà Nẵng', trips: 156, icon: '🌊', color: 'from-green-500 to-emerald-500' },
    { name: 'Nha Trang', trips: 89, icon: '🏖️', color: 'from-orange-500 to-red-500' }
  ]

  const handleSearchSubmit = (data) => {
    console.log('Search submitted:', data)
    // Handle search navigation
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8 animate-fade-in-up">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 shadow-2xl animate-fade-in">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <span className="text-sm font-semibold">Được hơn 500.000+ khách hàng tin dùng</span>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Đặt Vé Xe Khách
                <span className="block text-blue-100 font-bold">
                  Dễ Dàng & Nhanh Chóng
                </span>
              </h1>
              
              <p className="text-xl text-blue-50 leading-relaxed max-w-xl font-medium">
                Hơn 1000 chuyến xe mỗi ngày đến mọi miền đất nước. 
                Trải nghiệm dịch vụ đặt vé hiện đại, an toàn và tiện lợi nhất.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">Xác nhận tức thì</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">Bảo mật tuyệt đối</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-white font-semibold">Đánh giá 4.9/5</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                to="/search"
                className="group btn-modern btn-primary text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-3"
              >
                <span className="text-white-force">Tìm chuyến xe ngay</span>
                <ArrowRight className="w-5 h-5 text-white-force group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="group btn-modern bg-white/10 hover:bg-white/20 border-2 border-white/40 hover:border-white/60 text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-2"
              >
                <Award className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Đăng ký nhận ưu đãi</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-blue-500/30">
              {[
                { number: '500K+', label: 'Khách hài lòng', emoji: '😊' },
                { number: '1000+', label: 'Chuyến/ngày', emoji: '🚌' },
                { number: '50+', label: 'Tỉnh thành', emoji: '🗺️' }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{stat.emoji}</span>
                    <p className="text-2xl md:text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300">
                      {stat.number}
                    </p>
                  </div>
                  <p className="text-blue-200 text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Visual */}
          <div className="relative">
            {/* Main Card */}
            <div className="relative">
              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-900 px-4 py-2 rounded-lg shadow-2xl transform -rotate-6 animate-float">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Xác nhận ngay</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 z-10">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>4.9/5</span>
                </div>
              </div>

              {/* Main Booking Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:rotate-0 transition-transform duration-500 group">
                <div className="absolute -top-4 -right-4">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>🔥 Bán chạy nhất</span>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-full mb-4">
                    <Bus className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">Tìm chuyến xe nhanh</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Bắt đầu hành trình
                  </h3>
                  <p className="text-gray-600">Điền thông tin để tìm chuyến xe phù hợp</p>
                </div>
                
                <div className="space-y-6">
                  {/* Search Form */}
                  <SearchBox 
                    variant="hero"
                    initialValues={searchParams}
                    onSearch={handleSearchSubmit}
                  />
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">98%</div>
                      <div className="text-xs text-gray-600">Đúng giờ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">24/7</div>
                      <div className="text-xs text-gray-600">Hỗ trợ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">100%</div>
                      <div className="text-xs text-gray-600">Bảo mật</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Destination Cards */}
              <div className="absolute -bottom-6 -right-6 z-20">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs opacity-90">Điểm đến yêu thích</div>
                      <div className="font-bold">Đà Lạt</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-gradient-to-b from-transparent to-blue-800/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-semibold">Tại Sao Chọn Chúng Tôi?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trải nghiệm dịch vụ đẳng cấp
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Khám phá những điểm khác biệt tạo nên thương hiệu BusTicket
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="glass-effect rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: feature.delay }}
                >
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-medium bg-white/10 px-3 py-1.5 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white">{feature.stats}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Popular Destinations */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <Navigation className="w-6 h-6 text-blue-300" />
                <h3 className="text-2xl font-bold text-white">Điểm đến phổ biến</h3>
              </div>
              <p className="text-blue-200">Khám phá những thành phố được yêu thích nhất</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {popularDestinations.map((dest, index) => (
                <Link
                  key={index}
                  to={`/search?to=${dest.name}`}
                  className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${dest.color}"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-3">{dest.icon}</div>
                    <h4 className="font-bold text-white text-lg mb-2">{dest.name}</h4>
                    <div className="flex items-center gap-2 text-blue-200 text-sm">
                      <Bus className="w-4 h-4" />
                      <span>{dest.trips}+ chuyến/ngày</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-6 h-6 text-white transform rotate-45" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-cyan-700">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-20">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-8 animate-fade-in">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-semibold">Ưu đãi đặc biệt cho thành viên mới</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sẵn sàng cho hành trình của bạn?
          </h2>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Đăng ký ngay để nhận ưu đãi đặc biệt và trải nghiệm dịch vụ tốt nhất
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group btn-modern bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Award className="w-6 h-6" />
              <span>Đăng ký ngay - Nhận 50K</span>
            </Link>
            <Link
              to="/search"
              className="group btn-modern bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-3"
            >
              <MapPin className="w-6 h-6" />
              <span>Khám phá điểm đến</span>
            </Link>
          </div>
          
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-center gap-2 text-blue-100 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Hoàn tiền 100%</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-blue-100 text-sm">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Bảo mật tuyệt đối</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-blue-100 text-sm">
              <Clock className="w-4 h-4 text-green-400" />
              <span>Hỗ trợ 24/7</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-blue-100 text-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>Đánh giá 4.9/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection