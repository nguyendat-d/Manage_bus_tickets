-- Check bus companies in database
SELECT 
    bc.id,
    bc.company_name,
    bc.status,
    u.email,
    u.full_name,
    u.role,
    (SELECT COUNT(*) FROM buses WHERE bus_company_id = bc.id) as total_buses,
    (SELECT COUNT(*) FROM trips WHERE bus_company_id = bc.id) as total_trips
FROM bus_companies bc
JOIN users u ON bc.user_id = u.id
ORDER BY bc.created_at DESC;

-- Check if there are any buses
SELECT COUNT(*) as total_buses FROM buses;

-- Check if there are any trips
SELECT COUNT(*) as total_trips FROM trips;

-- Check bookings with bus company info
SELECT 
    b.id,
    b.booking_code,
    b.payment_status,
    b.total_amount,
    t.departure_time,
    bc.company_name
FROM bookings b
JOIN trips t ON b.trip_id = t.id
JOIN bus_companies bc ON t.bus_company_id = bc.id
LIMIT 10;
