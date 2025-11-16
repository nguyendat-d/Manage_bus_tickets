const nodemailer = require('nodemailer');
require('dotenv').config();

// Tạo transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const emailService = {
  // Gửi email
  sendEmail: async (emailOptions) => {
    try {
      const info = await transporter.sendMail({
        from: `"Bus Ticket System" <${process.env.SMTP_USER}>`,
        ...emailOptions
      });

      console.log('Email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  },

  // Gửi email xác nhận đặt vé
  sendBookingConfirmation: async (booking, user) => {
    const { booking_code, total_amount, seat_numbers, qr_code_url } = booking;
    const seatNumbers = JSON.parse(seat_numbers).join(', ');

    const emailContent = {
      to: user.email,
      subject: `Booking Confirmation - ${booking_code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">Booking Confirmation</h2>
          <p>Hello ${user.full_name},</p>
          <p>Your booking has been confirmed. Here are your booking details:</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking Details</h3>
            <p><strong>Booking Code:</strong> ${booking_code}</p>
            <p><strong>Total Amount:</strong> ${total_amount.toLocaleString()} VND</p>
            <p><strong>Seats:</strong> ${seatNumbers}</p>
          </div>

          ${qr_code_url ? `
          <div style="text-align: center; margin: 20px 0;">
            <p><strong>QR Code for Boarding:</strong></p>
            <img src="${qr_code_url}" alt="QR Code" style="max-width: 200px; border: 1px solid #ddd; padding: 10px;"/>
          </div>
          ` : ''}

          <p>Please present your QR code at the boarding point.</p>
          <p>Thank you for choosing our service!</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    };

    return await emailService.sendEmail(emailContent);
  },

  // Gửi email thông báo hủy vé
  sendCancellationNotification: async (booking, user, reason) => {
    const emailContent = {
      to: user.email,
      subject: `Booking Cancelled - ${booking.booking_code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Booking Cancelled</h2>
          <p>Hello ${user.full_name},</p>
          <p>Your booking has been cancelled. Here are the details:</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Cancellation Details</h3>
            <p><strong>Booking Code:</strong> ${booking.booking_code}</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p><strong>Refund Amount:</strong> ${booking.total_amount.toLocaleString()} VND</p>
            <p><strong>Cancellation Time:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <p>If you have any questions, please contact our support team.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    };

    return await emailService.sendEmail(emailContent);
  },

  // Gửi email thông báo cho nhà xe về booking mới
  sendBusCompanyNotification: async (booking, busCompany, trip) => {
    const passengerInfo = JSON.parse(booking.passenger_info);
    const seatNumbers = JSON.parse(booking.seat_numbers).join(', ');

    const emailContent = {
      to: busCompany.email,
      subject: `New Booking - ${booking.booking_code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">New Booking Received</h2>
          <p>Hello ${busCompany.company_name},</p>
          <p>You have received a new booking. Here are the details:</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking Details</h3>
            <p><strong>Booking Code:</strong> ${booking.booking_code}</p>
            <p><strong>Passenger:</strong> ${passengerInfo.full_name}</p>
            <p><strong>Phone:</strong> ${passengerInfo.phone}</p>
            <p><strong>Email:</strong> ${passengerInfo.email}</p>
            <p><strong>Seats:</strong> ${seatNumbers}</p>
            <p><strong>Total Amount:</strong> ${booking.total_amount.toLocaleString()} VND</p>
            <p><strong>Trip:</strong> ${trip.departure_station} to ${trip.arrival_station}</p>
            <p><strong>Departure:</strong> ${new Date(trip.departure_time).toLocaleString()}</p>
          </div>

          <p>Please prepare for the trip accordingly.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    };

    return await emailService.sendEmail(emailContent);
  }
};

module.exports = emailService;