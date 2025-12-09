import React from 'react'
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Shield, 
  Zap,
  Check,
  Crown,
  BadgeCheck,
  Lock
} from 'lucide-react'

const PaymentMethods = ({ selectedMethod, onMethodSelect }) => {
  const paymentMethods = [
    {
      id: 'vnpay',
      name: 'VNPay',
      description: 'Thanh toán qua QR/Ví điện tử',
      icon: <Smartphone className="w-6 h-6 text-green-600" />,
      recommended: true,
      features: ['QR Code', 'Ví điện tử', 'Internet Banking'],
      processingTime: 'Ngay lập tức',
      fee: 'Miễn phí',
      security: 'high'
    },
    {
      id: 'momo',
      name: 'Ví MoMo',
      description: 'Thanh toán nhanh qua ví MoMo',
      icon: <div className="w-6 h-6 bg-[#A50064] rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">M</span>
      </div>,
      features: ['Quét QR', 'App MoMo', 'Nhanh chóng'],
      processingTime: 'Ngay lập tức',
      fee: 'Miễn phí',
      security: 'high'
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      description: 'Thanh toán qua ZaloPay',
      icon: <div className="w-6 h-6 bg-[#0180FF] rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">Z</span>
      </div>,
      features: ['QR Code', 'App ZaloPay'],
      processingTime: 'Ngay lập tức',
      fee: 'Miễn phí',
      security: 'high'
    },
    {
      id: 'credit_card',
      name: 'Thẻ tín dụng',
      description: 'Visa, Mastercard, JCB',
      icon: <CreditCard className="w-6 h-6 text-blue-600" />,
      features: ['Quốc tế', 'Bảo mật cao', 'Trả góp'],
      processingTime: '2-5 phút',
      fee: '1.5%',
      security: 'highest'
    },
    {
      id: 'debit_card',
      name: 'Thẻ ghi nợ',
      description: 'Thẻ ATM nội địa',
      icon: <CreditCard className="w-6 h-6 text-purple-600" />,
      features: ['ATM nội địa', 'Tự động trừ'],
      processingTime: '2-5 phút',
      fee: '1%',
      security: 'high'
    },
    {
      id: 'cash',
      name: 'Tiền mặt',
      description: 'Thanh toán khi lên xe',
      icon: <Wallet className="w-6 h-6 text-orange-600" />,
      features: ['Trực tiếp', 'Không cần thẻ'],
      processingTime: 'Khi lên xe',
      fee: 'Miễn phí',
      security: 'medium'
    }
  ]

  const getSecurityIcon = (level) => {
    switch (level) {
      case 'highest':
        return <Shield className="w-4 h-4 text-green-600" />
      case 'high':
        return <Lock className="w-4 h-4 text-blue-600" />
      case 'medium':
        return <BadgeCheck className="w-4 h-4 text-yellow-600" />
      default:
        return <BadgeCheck className="w-4 h-4 text-gray-600" />
    }
  }

  const getSecurityText = (level) => {
    switch (level) {
      case 'highest':
        return 'Bảo mật cao nhất'
      case 'high':
        return 'Bảo mật cao'
      case 'medium':
        return 'Bảo mật trung bình'
      default:
        return 'Bảo mật'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Phương Thức Thanh Toán</h3>
          <p className="text-gray-600 text-sm">Chọn cách thức thanh toán phù hợp với bạn</p>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid gap-4">
        {paymentMethods.map(method => (
          <div
            key={method.id}
            className={`border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => onMethodSelect(method.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {method.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900 text-lg">
                      {method.name}
                    </span>
                    {method.recommended && (
                      <span className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-1 rounded-full">
                        <Crown size={12} />
                        <span>Đề xuất</span>
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {method.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {method.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Zap size={12} className="text-green-600" />
                      <span>{method.processingTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Phí: </span>
                      <span className={method.fee === 'Miễn phí' ? 'text-green-600 font-medium' : 'text-orange-600'}>
                        {method.fee}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getSecurityIcon(method.security)}
                      <span>{getSecurityText(method.security)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Radio Button */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedMethod === method.id && (
                  <Check size={14} className="text-white" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security Assurance */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-green-900 text-sm mb-2">Bảo Mật Giao Dịch</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-green-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Mã hóa SSL 256-bit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>PCI DSS compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Không lưu thông tin thẻ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 text-sm mb-3">Thông Tin Quan Trọng</h4>
            <ul className="text-blue-800 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Vé được giữ trong <strong>15 phút</strong> để hoàn tất thanh toán</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Thanh toán tiền mặt: đến trước <strong>30 phút</strong> giờ khởi hành</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Hủy vé miễn phí trước <strong>2 giờ</strong> so với giờ khởi hành</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Nhận vé điện tử ngay sau khi thanh toán thành công</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethods