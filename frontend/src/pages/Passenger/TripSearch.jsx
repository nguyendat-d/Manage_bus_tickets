import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import authService from '../../services/authService';
import { handleError } from '../../utils/messageHandler';
import '../../styles/trip-search.css';

const TripSearch = () => {
  const navigate = useNavigate();
  const { success, error: showError, warning } = useNotification();
  const [routes, setRoutes] = useState([]);
  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    date: ''
  });
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [featuredTrips, setFeaturedTrips] = useState([]);

  useEffect(() => {
    fetchRoutes();
    fetchFeaturedTrips();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/trips/routes');
      setRoutes(response.data.data || []);
    } catch (error) {
      const errorMsg = error.friendlyMessage || handleError(error);
      showError(errorMsg);
    }
  };

  const fetchFeaturedTrips = async () => {
    try {
      const response = await api.get('/trips/featured');
      setFeaturedTrips(response.data.data || []);
    } catch (error) {
      const errorMsg = error.friendlyMessage || handleError(error);
      showError(errorMsg);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!searchForm.from || !searchForm.to || !searchForm.date) {
      warning('Vui lòng điền đầy đủ thông tin tìm kiếm!');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/trips/search', {
        params: {
          departure_city: searchForm.from,
          arrival_city: searchForm.to,
          date: searchForm.date
        }
      });
      
      // Backend returns { success, data: { trips, pagination } }
      const trips = response.data.data?.trips || [];
      setTrips(trips);
      
      if (trips.length === 0) {
        warning('Không tìm thấy chuyến xe phù hợp với điều kiện tìm kiếm của bạn.');
      } else {
        success(`Tìm thấy ${trips.length} chuyến xe!`);
      }
    } catch (error) {
      const errorMsg = error.friendlyMessage || handleError(error);
      showError(errorMsg);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTrip = (trip) => {
    setSelectedTrip(trip);
    setSelectedSeats([]);
    setShowSeatMap(true);
  };

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      warning('Vui lòng chọn ít nhất một ghế!');
      return;
    }

    const user = authService.getCurrentUser();
    if (!user) {
      warning('Vui lòng đăng nhập để đặt vé!');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    try {
      setLoading(true);
      const totalAmount = selectedTrip.price * selectedSeats.length;
      
      console.log('Creating booking with:', {
        trip_id: selectedTrip.id,
        seats: selectedSeats.join(','),
        total_amount: totalAmount
      });
      
      const response = await api.post('/bookings', {
        trip_id: selectedTrip.id,
        seats: selectedSeats.join(','),
        total_amount: totalAmount
      });

      console.log('Booking response:', response.data);
      
      // Kiểm tra response structure
      const bookingData = response.data.data || response.data;
      
      if (!bookingData || !bookingData.id) {
        throw new Error('Invalid booking response structure');
      }

      success('Đặt vé thành công! Đang chuyển đến thanh toán...');
      
      // Đóng modal và chuyển trang ngay lập tức
      setShowSeatMap(false);
      setLoading(false);
      
      // Navigate immediately without setTimeout
      navigate('/passenger/payment', { 
        state: { 
          bookingId: bookingData.id,
          booking: bookingData 
        } 
      });
    } catch (error) {
      const errorMsg = error.friendlyMessage || handleError(error);
      showError(errorMsg);
      setLoading(false);
    }
  };

  const generateSeatMap = () => {
    const totalSeats = selectedTrip?.total_seats || 40;
    const seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      seats.push(i);
    }
    return seats;
  };

  // Extract unique cities from routes, filtering out null/undefined
  const uniqueCities = [...new Set(
    routes
      .filter(r => r.departure_city && r.arrival_city)
      .flatMap(r => [r.departure_city, r.arrival_city])
  )].sort();

  console.log('Routes:', routes);
  console.log('Unique Cities:', uniqueCities);
  console.log('Featured Trips:', featuredTrips);

  return (
    <div className="trip-search-page">
      <header className="search-header">
        <div className="header-content">
          <h1>Search Trips</h1>
          <button onClick={() => navigate('/passenger/dashboard')} className="btn-secondary">
            ← Quay lại
          </button>
        </div>
      </header>

      <div className="search-container">
        <div className="search-box">
          <h2>Find Your Bus Ticket</h2>
          <form onSubmit={handleSearch}>
            <div className="form-row">
              <div className="form-group">
                <label>From</label>
                <select
                  value={searchForm.from}
                  onChange={(e) => setSearchForm({...searchForm, from: e.target.value})}
                  required
                >
                  <option value="">Select City</option>
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>To</label>
                <select
                  value={searchForm.to}
                  onChange={(e) => setSearchForm({...searchForm, to: e.target.value})}
                  required
                >
                  <option value="">Select City</option>
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={searchForm.date}
                  onChange={(e) => setSearchForm({...searchForm, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <button type="submit" className="btn-search">
                🔍 Search
              </button>
            </div>
          </form>
        </div>

        {/* Featured Trips - Hiện khi chưa tìm kiếm */}
        {!loading && trips.length === 0 && featuredTrips.length > 0 && (
          <div className="featured-trips-section">
            <h2 className="section-title">🌟 Chuyến xe hiện hành</h2>
            <div className="featured-trips-grid">
              {featuredTrips.map((trip) => (
                <div key={trip.id} className="featured-trip-card">
                  <div className="trip-header">
                    <h3>🚌 {trip.company_name}</h3>
                    <span className="trip-type">{trip.bus_type}</span>
                  </div>
                  <div className="trip-route">
                    <div className="route-info">
                      <span className="city">📍 {trip.departure_city}</span>
                      <span className="arrow">→</span>
                      <span className="city">📍 {trip.arrival_city}</span>
                    </div>
                    <div className="route-stations">
                      <small>{trip.departure_station} → {trip.arrival_station}</small>
                    </div>
                  </div>
                  <div className="trip-details">
                    <div className="detail-item">
                      <span className="label">🕒 Giờ đi:</span>
                      <span className="value">{new Date(trip.departure_time).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">💰 Giá:</span>
                      <span className="value price">{parseInt(trip.base_price).toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">💺 Chỗ trống:</span>
                      <span className="value">{trip.available_seats}/{trip.total_seats}</span>
                    </div>
                  </div>
                  <button 
                    className="btn-book-now"
                    onClick={() => {
                      setSearchForm({
                        from: trip.departure_city,
                        to: trip.arrival_city,
                        date: new Date(trip.departure_time).toISOString().split('T')[0]
                      });
                      document.querySelector('form').scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    🎫 Đặt vé ngay
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="loading-spinner">🔄</div>
            <p>Đang tìm kiếm chuyến xe...</p>
          </div>
        ) : trips.length > 0 ? (
          <div className="trips-results">
            <div className="results-header">
              <h3>✅ Tìm thấy {trips.length} chuyến xe</h3>
              <p className="results-subtitle">
                📍 {searchForm.from} → {searchForm.to} | 📅 {new Date(searchForm.date).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div className="trips-list">
              {trips.map(trip => (
                <div key={trip.id} className="trip-result-card">
                  <div className="trip-company">
                    <h4>🚌 {trip.company_name}</h4>
                    <span className="bus-type">{trip.bus_type}</span>
                    {trip.company_rating && (
                      <div className="rating">⭐ {trip.company_rating}</div>
                    )}
                  </div>
                  
                  <div className="trip-info">
                    <div className="trip-time">
                      <div className="time-point">
                        <strong>{new Date(trip.departure_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</strong>
                        <span>{trip.departure_city}</span>
                        <small>{trip.departure_station}</small>
                      </div>
                      <div className="trip-duration">
                        <div className="duration-line"></div>
                        <span>{Math.floor(trip.estimated_duration_minutes / 60)}h {trip.estimated_duration_minutes % 60}m</span>
                      </div>
                      <div className="time-point">
                        <strong>{new Date(trip.arrival_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</strong>
                        <span>{trip.arrival_city}</span>
                        <small>{trip.arrival_station}</small>
                      </div>
                    </div>

                    <div className="trip-details-info">
                      <div className="info-item">
                        <span className="icon">💺</span>
                        <span>Còn <strong>{trip.available_seats}/{trip.total_seats}</strong> chỗ</span>
                      </div>
                      <div className="info-item">
                        <span className="icon">📏</span>
                        <span><strong>{trip.distance_km}</strong> km</span>
                      </div>
                      <div className="info-item">
                        <span className="icon">🎯</span>
                        <span>{trip.amenities || 'Standard'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="trip-booking">
                    <div className="price-section">
                      <div className="price-label">Giá vé</div>
                      <div className="trip-price">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(trip.price || trip.base_price)}
                      </div>
                      <div className="price-note">/ người</div>
                    </div>
                    <button 
                      className="btn-select"
                      onClick={() => handleSelectTrip(trip)}
                      disabled={trip.available_seats === 0}
                    >
                      {trip.available_seats === 0 ? '❌ Hết chỗ' : '🎫 Đặt vé ngay'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Seat Selection Modal */}
      {showSeatMap && selectedTrip && (
        <div className="modal-overlay" onClick={() => setShowSeatMap(false)}>
          <div className="seat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Select Your Seats</h2>
              <button className="btn-close" onClick={() => setShowSeatMap(false)}>✕</button>
            </div>

            <div className="trip-summary">
              <p><strong>{selectedTrip.departure_city}</strong> → <strong>{selectedTrip.arrival_city}</strong></p>
              <p>{new Date(selectedTrip.departure_time).toLocaleString('vi-VN')}</p>
            </div>

            <div className="seat-legend">
              <div className="legend-item">
                <div className="seat-demo available"></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="seat-demo selected"></div>
                <span>Selected</span>
              </div>
              <div className="legend-item">
                <div className="seat-demo occupied"></div>
                <span>Occupied</span>
              </div>
            </div>

            <div className="seat-map">
              <div className="driver">🚗 Driver</div>
              <div className="seats-grid">
                {generateSeatMap().map(seatNum => (
                  <div
                    key={seatNum}
                    className={`seat ${selectedSeats.includes(seatNum) ? 'selected' : 'available'}`}
                    onClick={() => handleSeatClick(seatNum)}
                  >
                    {seatNum}
                  </div>
                ))}
              </div>
            </div>

            <div className="booking-summary">
              <div className="summary-info">
                <p>Selected Seats: <strong>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</strong></p>
                <p>Total: <strong>{selectedSeats.length > 0 ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedTrip.price * selectedSeats.length) : '0 ₫'}</strong></p>
              </div>
              <button 
                className="btn-confirm"
                onClick={handleBooking}
                disabled={selectedSeats.length === 0}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripSearch;
