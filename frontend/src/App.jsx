import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import authService from './services/authService';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Auth Components
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import BusCompanyManagement from './pages/Admin/BusCompanyManagement';
import RouteManagement from './pages/Admin/RouteManagement';
import PaymentManagement from './pages/Admin/PaymentManagement';

// Passenger Components
import PassengerDashboard from './pages/Passenger/PassengerDashboard';
import TripSearch from './pages/Passenger/TripSearch';
import Profile from './pages/Passenger/Profile';
import Payment from './pages/Passenger/Payment';

// Bus Company Components
import BusCompanyDashboard from './pages/BusCompany/BusCompanyDashboard';
import BusCompanyProfile from './pages/BusCompany/BusCompanyProfile';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (isAuthenticated && user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'bus_company') return <Navigate to="/company/dashboard" replace />;
    return <Navigate to="/passenger/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/search" element={<TripSearch />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="companies" element={<BusCompanyManagement />} />
          <Route path="routes" element={<RouteManagement />} />
          <Route path="payments" element={<PaymentManagement />} />
        </Route>

        {/* Passenger Routes */}
        <Route
          path="/passenger/dashboard"
          element={
            <ProtectedRoute>
              <PassengerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/bookings"
          element={
            <ProtectedRoute>
              <PassengerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* Bus Company Routes */}
        <Route
          path="/bus-company/dashboard"
          element={
            <ProtectedRoute>
              <BusCompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bus-company/profile"
          element={
            <ProtectedRoute>
              <BusCompanyProfile />
            </ProtectedRoute>
          }
        />
        {/* Legacy route redirect */}
        <Route path="/company/dashboard" element={<Navigate to="/bus-company/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
