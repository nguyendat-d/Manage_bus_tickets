import React from 'react'
import PaymentComponent from '../../components/booking/PaymentMethods'

const Payment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-bold">Thanh toán vé xe</h1>
            <p className="text-blue-100 mt-2">Hoàn tất đặt vé bằng cách thanh toán</p>
          </div>
          <PaymentComponent />
        </div>
        
        {/* Additional Security Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold text-xl">✓</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Bảo mật tuyệt đối</h3>
            <p className="text-gray-600 text-sm">Thông tin thanh toán được mã hóa an toàn</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-xl">🔄</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Hoàn tiền 100%</h3>
            <p className="text-gray-600 text-sm">Hoàn tiền đầy đủ khi hủy trước 2 giờ</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold text-xl">🛡️</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Hỗ trợ 24/7</h3>
            <p className="text-gray-600 text-sm">Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment