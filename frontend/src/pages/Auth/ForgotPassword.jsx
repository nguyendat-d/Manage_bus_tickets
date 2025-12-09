import React from 'react'
import { Helmet } from 'react-helmet-async'
import ForgotPasswordComponent from '../../components/auth/ForgotPassword'

const ForgotPassword = () => {
  return (
    <>
      <Helmet>
        <title>Quên Mật Khẩu | BusTicket</title>
        <meta name="description" content="Khôi phục mật khẩu tài khoản BusTicket của bạn" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Background Decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          </div>

          {/* Header */}
          <div className="text-center relative z-10">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-3xl">B</span>
              </div>
            </div>
            <h2 className="mt-6 text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              Quên Mật Khẩu
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-sm mx-auto leading-relaxed">
              Nhập email của bạn để nhận liên kết đặt lại mật khẩu
            </p>
          </div>

          {/* Forgot Password Component */}
          <div className="relative z-10">
            <ForgotPasswordComponent />
          </div>

          {/* Additional Help Section */}
          <div className="text-center relative z-10">
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Cần hỗ trợ thêm?
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Liên hệ đội ngũ hỗ trợ của chúng tôi nếu bạn gặp vấn đề khi khôi phục tài khoản.
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <a 
                  href="mailto:support@busticket.com" 
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  📧 support@busticket.com
                </a>
                <span className="text-blue-300">•</span>
                <a 
                  href="tel:19001234" 
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  📞 1900 1234
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword