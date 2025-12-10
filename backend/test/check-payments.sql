-- Check if there are any payments in the database
SELECT COUNT(*) as payment_count FROM payments;

-- Get sample payments with booking info
SELECT 
  p.id,
  p.booking_id,
  p.payment_method,
  p.amount,
  p.payment_status,
  b.booking_code,
  u.full_name
FROM payments p
LEFT JOIN bookings b ON p.booking_id = b.id
LEFT JOIN users u ON b.user_id = u.id
LIMIT 10;

-- Check for orphaned payments (payments without bookings)
SELECT p.* 
FROM payments p
LEFT JOIN bookings b ON p.booking_id = b.id
WHERE b.id IS NULL;
