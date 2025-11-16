const crypto = require('crypto');
const moment = require('moment');
require('dotenv').config();

const vnpayConfig = {
  tmnCode: process.env.VNP_TMNCODE || 'your_tmn_code',
  hashSecret: process.env.VNP_HASHSECRET || 'your_hash_secret',
  url: process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  returnUrl: process.env.VNP_RETURN_URL || 'http://localhost:5000/api/payments/vnpay-return',
  apiUrl: process.env.VNP_API_URL || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'
};

const paymentGateway = {
  // Tạo URL thanh toán VNPay
  createVNPayPaymentURL: (paymentData) => {
    const { amount, booking_id, payment_id, customer_email } = paymentData;
    
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const expireDate = moment(date).add(15, 'minutes').format('YYYYMMDDHHmmss');
    
    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpayConfig.tmnCode,
      vnp_Amount: Math.round(amount * 100), // Nhân 100 để chuyển sang đơn vị đồng
      vnp_BankCode: '',
      vnp_CreateDate: createDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: '127.0.0.1', // Trong thực tế sẽ lấy từ request
      vnp_Locale: 'vn',
      vnp_OrderInfo: `Thanh toan don hang ${booking_id}`,
      vnp_OrderType: 'billpayment',
      vnp_ReturnUrl: vnpayConfig.returnUrl,
      vnp_TxnRef: payment_id.toString(),
      vnp_ExpireDate: expireDate
    };

    // Thêm customer email nếu có
    if (customer_email) {
      vnp_Params.vnp_Bill_Email = customer_email;
    }

    // Sắp xếp tham số theo thứ tự alphabet
    const sortedParams = paymentGateway.sortObject(vnp_Params);

    // Tạo chuỗi hash
    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac('sha512', vnpayConfig.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Thêm chữ ký vào params
    sortedParams['vnp_SecureHash'] = signed;

    // Tạo URL thanh toán
    const paymentUrl = vnpayConfig.url + '?' + new URLSearchParams(sortedParams).toString();
    
    return paymentUrl;
  },

  // Xác thực chữ ký VNPay
  verifyVNPayPayment: (vnp_Params) => {
    try {
      const secureHash = vnp_Params['vnp_SecureHash'];
      
      // Loại bỏ các tham số không cần thiết
      delete vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHashType'];

      // Sắp xếp tham số
      const sortedParams = paymentGateway.sortObject(vnp_Params);

      // Tạo chuỗi hash để so sánh
      const signData = new URLSearchParams(sortedParams).toString();
      const hmac = crypto.createHmac('sha512', vnpayConfig.hashSecret);
      const checkSum = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      return secureHash === checkSum;
    } catch (error) {
      console.error('VNPay signature verification error:', error);
      return false;
    }
  },

  // Sắp xếp object theo key
  sortObject: (obj) => {
    const sorted = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = obj[key];
    });
    return sorted;
  },

  // Lấy thông tin giao dịch từ VNPay
  getTransactionInfo: async (transactionId) => {
    try {
      const vnp_Params = {
        vnp_RequestId: moment().format('HHmmss'),
        vnp_Version: '2.1.0',
        vnp_Command: 'querydr',
        vnp_TmnCode: vnpayConfig.tmnCode,
        vnp_TxnRef: transactionId,
        vnp_OrderInfo: `Kiem tra giao dich ${transactionId}`,
        vnp_TransDate: moment().format('YYYYMMDDHHmmss'),
        vnp_CreateDate: moment().format('YYYYMMDDHHmmss')
      };

      // Tạo chữ ký
      const sortedParams = paymentGateway.sortObject(vnp_Params);
      const signData = new URLSearchParams(sortedParams).toString();
      const hmac = crypto.createHmac('sha512', vnpayConfig.hashSecret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
      sortedParams['vnp_SecureHash'] = signed;

      // Gọi API VNPay
      const response = await fetch(vnpayConfig.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sortedParams)
      });

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Get transaction info error:', error);
      return null;
    }
  }
};

module.exports = paymentGateway;