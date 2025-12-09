import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  MessageCircle,
  Download,
  Award,
  Shield,
  Clock,
  Heart,
  Sparkles,
  Zap,
  Globe,
  CheckCircle,
  Users,
  Bus,
  CreditCard
} from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      // Simulate subscription
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const mobileApps = [
    {
      platform: 'iOS',
      url: '#',
      icon: '🍎',
      description: 'Tải trên App Store'
    },
    {
      platform: 'Android',
      url: '#',
      icon: '🤖',
      description: 'Tải trên Google Play'
    }
  ]

  const certifications = [
    { name: 'ISO 9001:2015', icon: <Award className="w-4 h-4" />, color: 'from-blue-500 to-cyan-500' },
    { name: 'Bảo mật SSL', icon: <Shield className="w-4 h-4" />, color: 'from-green-500 to-emerald-500' },
    { name: '24/7 Support', icon: <Clock className="w-4 h-4" />, color: 'from-purple-500 to-pink-500' },
    { name: 'Best Price', icon: <Zap className="w-4 h-4" />, color: 'from-yellow-500 to-orange-500' }
  ]

  const paymentMethods = [
    { name: 'VISA', icon: '💳' },
    { name: 'MasterCard', icon: '💳' },
    { name: 'JCB', icon: '💳' },
    { name: 'ATM', icon: '🏦' },
    { name: 'Momo', icon: '📱' },
    { name: 'ZaloPay', icon: '📱' },
    { name: 'VNPAY', icon: '🇻🇳' },
    { name: 'PayPal', icon: '🌐' }
  ]

  const socialMedia = [
    { platform: 'Facebook', icon: Facebook, url: '#', color: 'hover:bg-blue-600' },
    { platform: 'Twitter', icon: Twitter, url: '#', color: 'hover:bg-blue-400' },
    { platform: 'Instagram', icon: Instagram, url: '#', color: 'hover:bg-pink-600' },
    { platform: 'Youtube', icon: Youtube, url: '#', color: 'hover:bg-red-600' },
    { platform: 'Zalo', icon: MessageCircle, url: '#', color: 'hover:bg-blue-500' }
  ]

  const footerLinks = {
    company: [
      { label: 'Về chúng tôi', path: '/about' },
      { label: 'Tuyển dụng', path: '/careers' },
      { label: 'Đối tác', path: '/partners' },
      { label: 'Blog', path: '/blog' },
      { label: 'Liên hệ', path: '/contact' }
    ],
    services: [
      { label: 'Đặt vé xe', path: '/booking' },
      { label: 'Thuê xe', path: '/rental' },
      { label: 'Tour du lịch', path: '/tours' },
      { label: 'Đưa đón sân bay', path: '/airport' },
      { label: 'Vé combo', path: '/combo' }
    ],
    support: [
      { label: 'Trung tâm trợ giúp', path: '/help' },
      { label: 'Câu hỏi thường gặp', path: '/faq' },
      { label: 'Hướng dẫn đặt vé', path: '/guide' },
      { label: 'Chính sách hoàn vé', path: '/refund' },
      { label: 'Chăm sóc khách hàng', path: '/customer-care' }
    ],
    legal: [
      { label: 'Điều khoản sử dụng', path: '/terms' },
      { label: 'Chính sách bảo mật', path: '/privacy' },
      { label: 'Chính sách cookie', path: '/cookies' },
      { label: 'Bảo mật thanh toán', path: '/payment-security' },
      { label: 'Sơ đồ trang web', path: '/sitemap' }
    ]
  }

  const stats = [
    { value: '500K+', label: 'Khách hàng', icon: Users },
    { value: '1000+', label: 'Chuyến/ngày', icon: Bus },
    { value: '50+', label: 'Tỉnh thành', icon: Globe },
    { value: '98%', label: 'Hài lòng', icon: Heart }
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Top Section */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 to-cyan-900/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-300 font-medium mt-2">{stat.label}</div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Company Info & Newsletter */}
            <div className="lg:col-span-4">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">★</span>
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    BusTicket
                  </span>
                  <div className="text-gray-400 text-sm">Đặt vé dễ dàng</div>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                Hệ thống đặt vé xe khách trực tuyến hàng đầu Việt Nam. 
                Kết nối hàng triệu hành khách với các nhà xe uy tín trên toàn quốc.
              </p>
              
              {/* Newsletter Subscription */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <h4 className="text-lg font-semibold text-white">ĐĂNG KÝ NHẬN TIN</h4>
                </div>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email của bạn"
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                    >
                      Đăng ký
                    </button>
                  </div>
                  {isSubscribed && (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>✓ Đã đăng ký thành công!</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Certifications */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300 text-sm mb-3">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Chứng nhận & Bảo đảm</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {certifications.map((cert, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r ${cert.color} bg-opacity-20`}
                    >
                      <div className="text-white">{cert.icon}</div>
                      <span className="text-xs text-gray-300">{cert.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Company Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    Công ty
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link, index) => (
                      <li key={index}>
                        <Link 
                          to={link.path} 
                          className="text-gray-300 hover:text-white text-sm transition-all duration-200 flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Services Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <Bus className="w-4 h-4 text-green-400" />
                    Dịch vụ
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.services.map((link, index) => (
                      <li key={index}>
                        <Link 
                          to={link.path} 
                          className="text-gray-300 hover:text-white text-sm transition-all duration-200 flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-purple-400" />
                    Hỗ trợ
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.support.map((link, index) => (
                      <li key={index}>
                        <Link 
                          to={link.path} 
                          className="text-gray-300 hover:text-white text-sm transition-all duration-200 flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    Pháp lý
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.legal.map((link, index) => (
                      <li key={index}>
                        <Link 
                          to={link.path} 
                          className="text-gray-300 hover:text-white text-sm transition-all duration-200 flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Download Apps */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-400" />
                  Tải ứng dụng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mobileApps.map((app, index) => (
                    <a
                      key={index}
                      href={app.url}
                      className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all duration-300 group border border-gray-700 hover:border-blue-500/50"
                    >
                      <span className="text-3xl">{app.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Tải trên</p>
                        <p className="text-lg font-bold text-white">{app.platform}</p>
                        <p className="text-xs text-gray-400">{app.description}</p>
                      </div>
                      <Download className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Contact & Social */}
      <div className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-6">
              <h3 className="text-lg font-semibold mb-6 text-white">Liên hệ với chúng tôi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-200 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Hotline 24/7</p>
                    <p className="text-white font-bold text-lg">1900 1234</p>
                    <p className="text-gray-400 text-xs">Hỗ trợ đa kênh</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-200 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Zalo</p>
                    <p className="text-white font-bold text-lg">0900 123 456</p>
                    <p className="text-gray-400 text-xs">Chat ngay</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-200 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-bold text-lg">support@busticket.com</p>
                    <p className="text-gray-400 text-xs">Phản hồi trong 5 phút</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-200 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Trụ sở chính</p>
                    <p className="text-white font-bold">123 Đường ABC, Quận 1</p>
                    <p className="text-gray-400 text-xs">TP.HCM, Việt Nam</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media & Payment */}
            <div className="lg:col-span-6">
              <div className="space-y-8">
                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Kết nối với chúng tôi</h3>
                  <div className="flex gap-3">
                    {socialMedia.map((social, index) => {
                      const Icon = social.icon
                      return (
                        <a
                          key={index}
                          href={social.url}
                          className={`w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color} hover:text-white hover:scale-110`}
                          title={social.platform}
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      )
                    })}
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-400" />
                    Chấp nhận thanh toán
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethods.map((method, index) => (
                      <div 
                        key={index} 
                        className="px-3 py-2 bg-gray-800/50 rounded-lg text-sm text-gray-300 border border-gray-700 hover:border-blue-500/50 hover:text-white transition-all duration-200 flex items-center gap-2"
                      >
                        <span className="text-base">{method.icon}</span>
                        <span>{method.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 <span className="text-blue-400 font-bold">BusTicket</span>. 
                Tất cả các quyền được bảo lưu.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Giấy chứng nhận ĐKKD số: 0123456789 do Sở KH&ĐT TP.HCM cấp ngày 01/01/2024
              </p>
            </div>
            
            {/* Made with love */}
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span>in Vietnam</span>
              </div>
              <div className="w-px h-4 bg-gray-700"></div>
              <Link to="/sitemap" className="hover:text-white transition-colors">
                Sơ đồ trang web
              </Link>
              <div className="w-px h-4 bg-gray-700"></div>
              <Link to="/privacy" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Live Support Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          className="group relative"
          title="Chat với chúng tôi"
        >
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-ping opacity-75">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 group-hover:scale-110 animate-float">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -bottom-12 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            Chat với chúng tôi!
            <div className="absolute -top-2 right-6 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900"></div>
          </div>
        </button>
      </div>
    </footer>
  )
}

export default Footer