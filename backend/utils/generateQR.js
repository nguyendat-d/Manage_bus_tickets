const QRCode = require('qrcode');
const cloudinary = require('../config/cloudinary');

const generateQR = {
  // Tạo QR code và upload lên Cloudinary
  generateQRCode: async (data) => {
    try {
      // Tạo QR code dưới dạng data URL
      const qrDataURL = await QRCode.toDataURL(data, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Upload QR code lên Cloudinary
      const result = await cloudinary.uploader.upload(qrDataURL, {
        folder: 'bus-ticket-system/qr-codes',
        resource_type: 'image',
        format: 'png'
      });

      return result.secure_url;
    } catch (error) {
      console.error('QR code generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  },

  // Tạo QR code cho booking
  generateBookingQR: async (bookingCode) => {
    const qrData = JSON.stringify({
      type: 'boarding_pass',
      booking_code: bookingCode,
      timestamp: new Date().toISOString()
    });

    return await generateQR.generateQRCode(qrData);
  },

  // Xác thực QR code
  verifyQRCode: (qrData) => {
    try {
      const data = JSON.parse(qrData);
      
      // Kiểm tra type và timestamp
      if (data.type !== 'boarding_pass') {
        return { valid: false, reason: 'Invalid QR type' };
      }

      // Kiểm tra timestamp (QR code hết hạn sau 24h)
      const qrTime = new Date(data.timestamp);
      const now = new Date();
      const timeDiff = now.getTime() - qrTime.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        return { valid: false, reason: 'QR code expired' };
      }

      return { valid: true, booking_code: data.booking_code };
    } catch (error) {
      return { valid: false, reason: 'Invalid QR data' };
    }
  }
};

module.exports = generateQR;