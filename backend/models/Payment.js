const pool = require('../config/database');

class Payment {
  static async create(paymentData) {
    const { booking_id, payment_method, amount, transaction_id, vnpay_response } = paymentData;
    const [result] = await pool.execute(
      `INSERT INTO payments (booking_id, payment_method, amount, transaction_id, vnpay_response)
       VALUES (?, ?, ?, ?, ?)`,
      [booking_id, payment_method, amount, transaction_id, JSON.stringify(vnpay_response)]
    );
    return result.insertId;
  }

  static async findByBookingId(bookingId) {
    const [rows] = await pool.execute(
      'SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC',
      [bookingId]
    );
    return rows;
  }

  static async updateStatus(paymentId, status, transactionId = null) {
    let query = 'UPDATE payments SET payment_status = ?';
    const params = [status];

    if (transactionId) {
      query += ', transaction_id = ?';
      params.push(transactionId);
    }

    if (status === 'success') {
      query += ', payment_date = NOW()';
    }

    query += ' WHERE id = ?';
    params.push(paymentId);

    const [result] = await pool.execute(query, params);
    return result.affectedRows > 0;
  }

  static async getRevenueStats(timeRange = 'month') {
    let dateFilter = '';
    const params = [];

    switch (timeRange) {
      case 'day':
        dateFilter = 'AND DATE(payment_date) = CURDATE()';
        break;
      case 'week':
        dateFilter = 'AND payment_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
        break;
      case 'month':
        dateFilter = 'AND payment_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
        break;
      case 'year':
        dateFilter = 'AND payment_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)';
        break;
    }

    const [revenueStats] = await pool.execute(
      `SELECT 
        COUNT(*) as total_transactions,
        SUM(amount) as total_revenue,
        AVG(amount) as average_transaction,
        payment_method,
        DATE(payment_date) as date
       FROM payments 
       WHERE payment_status = 'success' 
       ${dateFilter}
       GROUP BY DATE(payment_date), payment_method
       ORDER BY date DESC`,
      params
    );

    return revenueStats;
  }

  static async getDailyRevenue(days = 7) {
    const [rows] = await pool.execute(
      `SELECT 
        DATE(payment_date) as date,
        SUM(amount) as daily_revenue,
        COUNT(*) as transaction_count
       FROM payments 
       WHERE payment_status = 'success' 
         AND payment_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY DATE(payment_date)
       ORDER BY date DESC`,
      [days]
    );
    return rows;
  }
}

module.exports = Payment;