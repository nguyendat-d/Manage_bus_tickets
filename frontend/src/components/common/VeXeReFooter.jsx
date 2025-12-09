import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, Phone, Mail, Facebook, Youtube, 
  ChevronRight, Globe, Clock, Shield
} from 'lucide-react'

const VeXeReFooter = () => {
  const footerLinks = {
    about: [
      { name: 'Giới thiệu VeXeRe', path: '/about' },
      { name: 'Tuyển dụng', path: '/careers' },
      { name: 'Tin tức', path: '/news' },
      { name: 'Liên hệ', path: '/contact' },
    ],
    support: [
      { name: 'Hướng dẫn đặt vé', path: '/guide' },
      { name: 'Chính sách & Quy định', path: '/policy' },
      { name: 'Câu hỏi thường gặp', path: '/faq' },
      { name: 'Tra cứu đơn hàng', path: '/track-order' },
    ],
    services: [
      { name: 'Vé xe khách', path: '/bus-tickets' },
      { name: 'Thuê xe', path: '/car-rental' },
      { name: 'Đưa đón sân bay', path: '/airport-transfer' },
      { name: 'Tour du lịch', path: '/tours' },
    ],
    partner: [
      { name: 'Đăng ký nhà xe', path: '/register-company' },
      { name: 'Kết nối với chúng tôi', path: '/partner' },
      { name: 'Điều khoản hợp tác', path: '/partnership-terms' },
    ],
  }

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: Facebook, 
      url: 'https://facebook.com',
      color: '#1877F2'
    },
    { 
      name: 'YouTube', 
      icon: Youtube, 
      url: 'https://youtube.com',
      color: '#FF0000'
    },
    { 
      name: 'Zalo', 
      icon: '💬', 
      url: '#',
      color: '#0068FF'
    },
    { 
      name: 'TikTok', 
      icon: '🎵', 
      url: '#',
      color: '#000000'
    },
  ]

  const paymentMethods = ['Visa', 'Mastercard', 'JCB', 'Momo', 'ZaloPay', 'VNPay']

  return (
    <footer className="bg-[#1a1a2e] text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img 
                src="/vexere-logo.svg" 
                alt="VeXeRe" 
                className="h-10 w-auto brightness-0 invert"
              />
              <div>
                <div className="text-white font-bold text-lg">BusTicket</div>
                <div className="text-[#ffc600] text-xs">Đặt vé dễ dàng</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Hệ thống đặt vé xe trực tuyến hàng đầu Việt Nam. 
              Kết nối hành khách với hơn 500 nhà xe uy tín trên toàn quốc.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => {
                const Icon = typeof social.icon === 'string' ? null : social.icon
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#1861c5] flex items-center justify-center transition-all transform hover:scale-110"
                    style={{ backgroundColor: Icon ? 'rgba(255, 255, 255, 0.1)' : undefined }}
                  >
                    {Icon ? <Icon className="w-5 h-5" /> : <span className="text-lg">{social.icon}</span>}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#ffc600]" />
              Về chúng tôi
            </h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-[#ffc600] transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#ffc600]" />
              Hỗ trợ
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-[#ffc600] transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="text-[#ffc600]">🚌</span>
              Dịch vụ
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-[#ffc600] transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="text-[#ffc600]">🤝</span>
              Đối tác
            </h4>
            <ul className="space-y-3">
              {footerLinks.partner.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-[#ffc600] transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact & Payment Info */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div>
              <h5 className="text-white font-bold mb-4">Liên hệ</h5>
              <div className="space-y-3 text-sm">
                <a href="tel:1900969681" className="flex items-center gap-3 text-gray-400 hover:text-[#ffc600] transition-colors">
                  <Phone className="w-5 h-5 text-[#1861c5] flex-shrink-0" />
                  <span>Hotline: 1900 969 681</span>
                </a>
                <a href="mailto:hotro@vexere.com" className="flex items-center gap-3 text-gray-400 hover:text-[#ffc600] transition-colors">
                  <Mail className="w-5 h-5 text-[#1861c5] flex-shrink-0" />
                  <span>Email: hotro@vexere.com</span>
                </a>
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-[#1861c5] flex-shrink-0 mt-0.5" />
                  <span>Địa chỉ: Tầng 3, Tòa nhà Viettel, Hà Nội</span>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div>
              <h5 className="text-white font-bold mb-4">Giờ làm việc</h5>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#ffc600]" />
                  <span>Hotline: <span className="text-[#ffc600] font-bold">24/7</span></span>
                </div>
                <p>Văn phòng: Thứ 2 - Thứ 6</p>
                <p className="text-white">08:00 - 18:00</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h5 className="text-white font-bold mb-4">Thanh toán</h5>
              <div className="grid grid-cols-3 gap-3">
                {paymentMethods.map((method, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800 rounded-lg px-3 py-2 text-xs text-center text-gray-400 font-medium hover:bg-gray-700 transition-colors"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h5 className="text-white font-bold mb-4 text-center">Chứng nhận & Bảo mật</h5>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {['DMCA', 'SSL Secure', 'ISO 27001', 'PCI DSS', 'VNPay', 'Đã thông báo BCT'].map((cert, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-lg px-4 py-2 text-sm text-gray-400 font-medium hover:bg-gray-700 transition-colors"
              >
                🔒 {cert}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#0f0f1a] border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p className="text-center md:text-left">
              © 2024 BusTicket - VeXeRe. Bản quyền thuộc về Công ty TNHH VeXeRe.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-[#ffc600] transition-colors">
                Chính sách bảo mật
              </Link>
              <Link to="/terms" className="hover:text-[#ffc600] transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link to="/sitemap" className="hover:text-[#ffc600] transition-colors">
                Sơ đồ trang
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-gradient-to-r from-[#1861c5] to-[#2474E5] text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 flex items-center justify-center"
        title="Lên đầu trang"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  )
}

export default VeXeReFooter
