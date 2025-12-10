import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/bus-company.css';

const BusCompanyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trips');
  const [trips, setTrips] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalBuses: 0,
    totalBookings: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [showTripModal, setShowTripModal] = useState(false);
  const [showBusModal, setShowBusModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [editingBus, setEditingBus] = useState(null);
  
  const [tripForm, setTripForm] = useState({
    route_id: '',
    bus_id: '',
    departure_time: '',
    arrival_time: '',
    base_price: '',
    available_seats: ''
  });

  const [busForm, setBusForm] = useState({
    license_plate: '',
    bus_type: 'limousine',
    total_seats: 40,
    amenities: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      console.log('🔄 Fetching bus company data...');

      const [tripsRes, busesRes, routesRes, statsRes] = await Promise.all([
        axios.get('/api/bus-companies/trips', config),
        axios.get('/api/bus-companies/buses', config),
        axios.get('/api/trips/routes'),  // Public route, no auth needed
        axios.get('/api/bus-companies/stats', config)
      ]);

      console.log('✅ Data fetched:', {
        trips: tripsRes.data,
        buses: busesRes.data,
        routes: routesRes.data,
        stats: statsRes.data
      });

      // Handle different response structures
      const tripsData = tripsRes.data.data?.trips || tripsRes.data.data || [];
      const busesData = busesRes.data.data?.buses || busesRes.data.data || [];
      const routesData = routesRes.data.data || [];
      const statsData = statsRes.data.data || stats;

      setTrips(tripsData);
      setBuses(busesData);
      setRoutes(routesData);
      setStats(statsData);
      
      console.log('📊 State updated:', {
        trips: tripsData.length,
        buses: busesData.length,
        routes: routesData.length
      });

      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching data:', error.response?.data || error.message);
      alert('Không thể tải dữ liệu: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  const handleTripSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      console.log('💾 Saving trip:', tripForm);
      console.log('📊 Current data:', {
        routes_count: routes.length,
        buses_count: buses.length,
        selected_route: tripForm.route_id,
        selected_bus: tripForm.bus_id
      });

      // Validate data trước khi submit
      if (!tripForm.route_id) {
        alert('Vui lòng chọn tuyến đường!');
        return;
      }
      if (!tripForm.bus_id) {
        alert('Vui lòng chọn xe!');
        return;
      }
      if (!tripForm.departure_time || !tripForm.arrival_time) {
        alert('Vui lòng nhập thời gian khởi hành và đến!');
        return;
      }
      if (!tripForm.base_price || parseFloat(tripForm.base_price) <= 0) {
        alert('Vui lòng nhập giá vé hợp lệ!');
        return;
      }
      if (!tripForm.available_seats || parseInt(tripForm.available_seats) <= 0) {
        alert('Vui lòng nhập số ghế khả dụng hợp lệ!');
        return;
      }

      if (editingTrip) {
        await axios.put(`/api/bus-companies/trips/${editingTrip.id}`, tripForm, config);
        alert('Cập nhật chuyến xe thành công!');
      } else {
        const response = await axios.post('/api/bus-companies/trips', tripForm, config);
        console.log('✅ Trip created:', response.data);
        alert('Tạo chuyến xe mới thành công!');
      }
      setShowTripModal(false);
      setEditingTrip(null);
      setTripForm({
        route_id: '',
        bus_id: '',
        departure_time: '',
        arrival_time: '',
        base_price: '',
        available_seats: ''
      });
      fetchData();
    } catch (error) {
      console.error('❌ Error saving trip:', error.response?.data || error.message);
      console.error('❌ Full error:', error);
      alert(error.response?.data?.message || 'Lỗi khi lưu chuyến xe. Vui lòng kiểm tra console.');
    }
  };

  const handleBusSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      console.log('💾 Saving bus:', busForm);

      if (editingBus) {
        await axios.put(`/api/bus-companies/buses/${editingBus.id}`, busForm, config);
        alert('Cập nhật xe thành công!');
      } else {
        await axios.post('/api/bus-companies/buses', busForm, config);
        alert('Thêm xe mới thành công!');
      }
      setShowBusModal(false);
      setEditingBus(null);
      setBusForm({
        license_plate: '',
        bus_type: 'limousine',
        total_seats: 40,
        amenities: ''
      });
      fetchData();
    } catch (error) {
      console.error('❌ Error saving bus:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Lỗi khi lưu thông tin xe');
    }
  };

  const handleEditTrip = (trip) => {
    setEditingTrip(trip);
    setTripForm({
      route_id: trip.route_id,
      bus_id: trip.bus_id,
      departure_time: trip.departure_time,
      arrival_time: trip.arrival_time,
      base_price: trip.base_price,
      available_seats: trip.available_seats
    });
    setShowTripModal(true);
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Bạn có chắc muốn xóa chuyến xe này?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        await axios.delete(`/api/bus-companies/trips/${tripId}`, config);
        alert('Xóa chuyến xe thành công!');
        fetchData();
      } catch (error) {
        console.error('❌ Error deleting trip:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Lỗi khi xóa chuyến xe');
      }
    }
  };

  const handleEditBus = (bus) => {
    setEditingBus(bus);
    setBusForm({
      license_plate: bus.license_plate,
      bus_type: bus.bus_type,
      total_seats: bus.total_seats,
      amenities: bus.amenities || ''
    });
    setShowBusModal(true);
  };

  const handleDeleteBus = async (busId) => {
    if (window.confirm('Bạn có chắc muốn xóa xe này?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        await axios.delete(`/api/bus-companies/buses/${busId}`, config);
        alert('Xóa xe thành công!');
        fetchData();
      } catch (error) {
        console.error('❌ Error deleting bus:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Lỗi khi xóa xe');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="bus-company-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🚌 VeXeOnline - Nhà Xe</h1>
          </div>
          <nav className="header-nav">
            <button onClick={() => navigate('/')} className="nav-btn">
              🏠 Trang chủ
            </button>
            <button onClick={() => navigate('/bus-company/dashboard')} className="nav-btn active">
              📊 Quản lý
            </button>
            <button onClick={() => navigate('/bus-company/profile')} className="nav-btn">
              👤 Tài khoản
            </button>
          </nav>
        </div>
      </header>

      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">🚌</div>
          <div className="stat-info">
            <h3>{stats.totalTrips}</h3>
            <p>Total Trips</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚍</div>
          <div className="stat-info">
            <h3>{stats.totalBuses}</h3>
            <p>Total Buses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎫</div>
          <div className="stat-info">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.revenue)}</h3>
            <p>Revenue</p>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'trips' ? 'active' : ''}`}
            onClick={() => setActiveTab('trips')}
          >
            Trips Management
          </button>
          <button 
            className={`tab ${activeTab === 'buses' ? 'active' : ''}`}
            onClick={() => setActiveTab('buses')}
          >
            Buses Management
          </button>
        </div>

        {activeTab === 'trips' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Trips</h2>
              <button 
                className="btn-primary"
                onClick={() => {
                  setEditingTrip(null);
                  setTripForm({
                    route_id: '',
                    bus_id: '',
                    departure_time: '',
                    arrival_time: '',
                    base_price: '',
                    available_seats: ''
                  });
                  setShowTripModal(true);
                }}
              >
                + Add New Trip
              </button>
            </div>

            <div className="trips-grid">
              {trips.length === 0 ? (
                <p className="no-data">No trips found. Add your first trip!</p>
              ) : (
                trips.map(trip => (
                  <div key={trip.id} className="trip-card">
                    <div className="trip-route">
                      <h3>{trip.departure_city} → {trip.arrival_city}</h3>
                      <span className="trip-status">{trip.status}</span>
                    </div>
                    <div className="trip-details">
                      <p><strong>Bus:</strong> {trip.license_plate} ({trip.bus_type})</p>
                      <p><strong>Departure:</strong> {new Date(trip.departure_time).toLocaleString('vi-VN')}</p>
                      <p><strong>Arrival:</strong> {new Date(trip.arrival_time).toLocaleString('vi-VN')}</p>
                      <p><strong>Price:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(trip.base_price)}</p>
                      <p><strong>Available Seats:</strong> {trip.available_seats}/{trip.total_seats}</p>
                    </div>
                    <div className="trip-actions">
                      <button className="btn-edit" onClick={() => handleEditTrip(trip)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteTrip(trip.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'buses' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Buses</h2>
              <button 
                className="btn-primary"
                onClick={() => {
                  setEditingBus(null);
                  setBusForm({
                    license_plate: '',
                    bus_type: 'limousine',
                    total_seats: 40,
                    amenities: ''
                  });
                  setShowBusModal(true);
                }}
              >
                + Add New Bus
              </button>
            </div>

            <div className="buses-grid">
              {buses.length === 0 ? (
                <p className="no-data">No buses found. Add your first bus!</p>
              ) : (
                buses.map(bus => (
                  <div key={bus.id} className="bus-card">
                    <div className="bus-header">
                      <h3>{bus.license_plate}</h3>
                      <span className={`bus-status ${bus.status}`}>{bus.status}</span>
                    </div>
                    <div className="bus-details">
                      <p><strong>Type:</strong> {bus.bus_type}</p>
                      <p><strong>Seats:</strong> {bus.total_seats}</p>
                      <p><strong>Amenities:</strong> {bus.amenities || 'None'}</p>
                    </div>
                    <div className="bus-actions">
                      <button className="btn-edit" onClick={() => handleEditBus(bus)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteBus(bus.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Trip Modal */}
      {showTripModal && (
        <div className="modal-overlay" onClick={() => setShowTripModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingTrip ? 'Edit Trip' : 'Add New Trip'}</h2>
            <form onSubmit={handleTripSubmit}>
              <div className="form-group">
                <label>Route *</label>
                <select 
                  value={tripForm.route_id}
                  onChange={(e) => setTripForm({...tripForm, route_id: e.target.value})}
                  required
                >
                  <option value="">Select Route</option>
                  {routes.length === 0 ? (
                    <option disabled>No routes available</option>
                  ) : (
                    routes.map(route => (
                      <option key={route.id} value={route.id}>
                        {route.departure_city} → {route.arrival_city} ({route.distance_km || 0}km)
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Bus *</label>
                <select 
                  value={tripForm.bus_id}
                  onChange={(e) => setTripForm({...tripForm, bus_id: e.target.value})}
                  required
                >
                  <option value="">Select Bus</option>
                  {buses.filter(b => b.status === 'active').map(bus => (
                    <option key={bus.id} value={bus.id}>
                      {bus.license_plate} - {bus.bus_type} ({bus.total_seats} seats)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Departure Time *</label>
                <input 
                  type="datetime-local"
                  value={tripForm.departure_time}
                  onChange={(e) => setTripForm({...tripForm, departure_time: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Arrival Time *</label>
                <input 
                  type="datetime-local"
                  value={tripForm.arrival_time}
                  onChange={(e) => setTripForm({...tripForm, arrival_time: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Base Price (VND) *</label>
                <input 
                  type="number"
                  value={tripForm.base_price}
                  onChange={(e) => setTripForm({...tripForm, base_price: e.target.value})}
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div className="form-group">
                <label>Available Seats *</label>
                <input 
                  type="number"
                  value={tripForm.available_seats}
                  onChange={(e) => setTripForm({...tripForm, available_seats: e.target.value})}
                  min="1"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowTripModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingTrip ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bus Modal */}
      {showBusModal && (
        <div className="modal-overlay" onClick={() => setShowBusModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingBus ? 'Edit Bus' : 'Add New Bus'}</h2>
            <form onSubmit={handleBusSubmit}>
              <div className="form-group">
                <label>License Plate *</label>
                <input 
                  type="text"
                  value={busForm.license_plate}
                  onChange={(e) => setBusForm({...busForm, license_plate: e.target.value})}
                  placeholder="e.g., 51B-12345"
                  required
                />
              </div>

              <div className="form-group">
                <label>Bus Type *</label>
                <select 
                  value={busForm.bus_type}
                  onChange={(e) => setBusForm({...busForm, bus_type: e.target.value})}
                  required
                >
                  <option value="limousine">Limousine</option>
                  <option value="sleeper">Sleeper</option>
                  <option value="seat">Seat</option>
                </select>
              </div>

              <div className="form-group">
                <label>Total Seats *</label>
                <input 
                  type="number"
                  value={busForm.total_seats}
                  onChange={(e) => setBusForm({...busForm, total_seats: e.target.value})}
                  min="1"
                  max="50"
                  required
                />
              </div>

              <div className="form-group">
                <label>Amenities</label>
                <textarea 
                  value={busForm.amenities}
                  onChange={(e) => setBusForm({...busForm, amenities: e.target.value})}
                  placeholder="WiFi, AC, USB charger..."
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowBusModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingBus ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusCompanyDashboard;
