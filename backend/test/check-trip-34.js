const pool = require('../config/database');

(async () => {
  try {
    const tripId = 34;
    
    // Lấy thông tin đầy đủ của chuyến xe
    const [trips] = await pool.query(`
      SELECT 
        t.*,
        r.departure_city, r.departure_station,
        r.arrival_city, r.arrival_station,
        r.distance_km, r.estimated_duration_minutes,
        bc.id as company_id, bc.company_name, bc.rating as company_rating,
        bc.tax_code, bc.address as company_address, bc.phone as company_phone,
        b.license_plate, b.bus_type, b.total_seats, b.amenities, b.seat_map, b.status as bus_status
      FROM trips t
      JOIN routes r ON t.route_id = r.id
      JOIN bus_companies bc ON t.bus_company_id = bc.id
      JOIN buses b ON t.bus_id = b.id
      WHERE t.id = ?
    `, [tripId]);
    
    if (trips.length === 0) {
      console.log('❌ Trip not found');
      process.exit(1);
    }
    
    const trip = trips[0];
    
    console.log('\n📍 THÔNG TIN CHUYẾN XE #34\n');
    console.log('='.repeat(60));
    
    console.log('\n🚌 Thông tin cơ bản:');
    console.log(`   ID: ${trip.id}`);
    console.log(`   Trạng thái: ${trip.status}`);
    console.log(`   Giá vé: ${parseInt(trip.price).toLocaleString('vi-VN')} VNĐ`);
    console.log(`   Số ghế trống: ${trip.available_seats}/${trip.total_seats}`);
    
    console.log('\n📅 Lịch trình:');
    console.log(`   Khởi hành: ${new Date(trip.departure_time).toLocaleString('vi-VN')}`);
    console.log(`   Đến nơi: ${new Date(trip.arrival_time).toLocaleString('vi-VN')}`);
    console.log(`   Thời gian: ${trip.estimated_duration_minutes} phút (${(trip.estimated_duration_minutes/60).toFixed(1)} giờ)`);
    
    console.log('\n📍 Tuyến đường:');
    console.log(`   Từ: ${trip.departure_city} - ${trip.departure_station}`);
    console.log(`   Đến: ${trip.arrival_city} - ${trip.arrival_station}`);
    console.log(`   Khoảng cách: ${trip.distance_km} km`);
    
    console.log('\n🏢 Nhà xe:');
    console.log(`   Tên: ${trip.company_name}`);
    console.log(`   Đánh giá: ${trip.company_rating} ⭐`);
    console.log(`   Mã số thuế: ${trip.tax_code}`);
    console.log(`   Địa chỉ: ${trip.company_address}`);
    console.log(`   SĐT: ${trip.company_phone}`);
    
    console.log('\n🚐 Xe:');
    console.log(`   Biển số: ${trip.license_plate}`);
    console.log(`   Loại xe: ${trip.bus_type}`);
    console.log(`   Số ghế: ${trip.total_seats}`);
    console.log(`   Trạng thái xe: ${trip.bus_status}`);
    
    if (trip.amenities) {
      try {
        const amenities = typeof trip.amenities === 'string' ? JSON.parse(trip.amenities) : trip.amenities;
        if (Array.isArray(amenities)) {
          console.log(`   Tiện nghi: ${amenities.join(', ')}`);
        } else {
          console.log(`   Tiện nghi: ${trip.amenities}`);
        }
      } catch (e) {
        console.log(`   Tiện nghi: ${trip.amenities}`);
      }
    }
    
    // Kiểm tra các booking đã đặt
    const [bookings] = await pool.query(`
      SELECT 
        b.id, b.booking_code, b.seat_numbers,
        b.total_amount, b.payment_status, b.booking_status,
        u.full_name as customer_name, u.phone as customer_phone
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.trip_id = ?
    `, [tripId]);
    
    console.log('\n📋 Booking:');
    if (bookings.length > 0) {
      console.log(`   Tổng số booking: ${bookings.length}`);
      bookings.forEach((booking, index) => {
        const seats = JSON.parse(booking.seat_numbers);
        console.log(`\n   Booking #${index + 1}:`);
        console.log(`     Mã: ${booking.booking_code}`);
        console.log(`     Khách hàng: ${booking.customer_name} - ${booking.customer_phone}`);
        console.log(`     Ghế: ${seats.join(', ')}`);
        console.log(`     Số tiền: ${parseInt(booking.total_amount).toLocaleString('vi-VN')} VNĐ`);
        console.log(`     Thanh toán: ${booking.payment_status}`);
        console.log(`     Trạng thái: ${booking.booking_status}`);
      });
    } else {
      console.log('   Chưa có booking nào');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Query để tìm chuyến này:');
    console.log(`   GET /api/trips/search?from=Ho Chi Minh&to=Da Lat&date=2025-12-15`);
    console.log(`   GET /api/trips/${tripId}`);
    console.log(`   GET /api/trips/${tripId}/seat-map\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
})();
