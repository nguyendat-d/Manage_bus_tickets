import React from 'react'
import { Helmet } from 'react-helmet-async' // THÊM IMPORT NÀY
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { BookingProvider } from './contexts/BookingContext'

// Layout Components
import VeXeReNavbar from './components/common/VeXeReNavbar'
import VeXeReFooter from './components/common/VeXeReFooter'
import NotificationCenter from './components/common/NotificationCenter'

// Public Pages
import VeXeReHome from './pages/Home/VeXeReHome'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import SearchTrips from './pages/Booking/SearchTrips'
import TripDetail from './pages/Booking/TripDetail'

// Protected Pages - Passenger
import MyBookings from './pages/Booking/MyBookings'
import Booking from './pages/Booking/Booking'
import Payment from './pages/Booking/Payment'

// Protected Pages - Profile
import Profile from './pages/Profile/Profile'
import EditProfile from './pages/Profile/EditProfile'
import ChangePassword from './pages/Profile/ChangePassword'

// Protected Pages - Admin
import AdminDashboard from './pages/Admin/AdminDashboard'
import Users from './pages/Admin/Users'
import Companies from './pages/Admin/Companies'
import RoutesPage from './pages/Admin/Routes'
import Analytics from './pages/Admin/Analytics'

// Protected Pages - Bus Company
import BusCompanyDashboard from './pages/BusCompany/BusCompanyDashboard'
import MyBuses from './pages/BusCompany/MyBuses'
import MyTrips from './pages/BusCompany/MyTrips'
import CompanyBookings from './pages/BusCompany/CompanyBookings'
import CompanyStats from './pages/BusCompany/CompanyStats'

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <>
      <Helmet>
        <title>BusTicket - Hệ thống đặt vé xe</title>
        <meta name="description" content="Đặt vé xe nhanh chóng, an toàn và tiện lợi" />
        <meta name="keywords" content="vé xe, đặt vé, xe khách, nhà xe, du lịch" />
      </Helmet>
      
      <NotificationProvider>
        <AuthProvider>
          <BookingProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <VeXeReNavbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<VeXeReHome />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/search-trips" element={<SearchTrips />} />
                  <Route path="/trip/:id" element={<TripDetail />} />

                  {/* Protected Routes - Passenger */}
                  <Route 
                    path="/booking/:tripId" 
                    element={
                      <ProtectedRoute requiredRole="passenger">
                        <Booking />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/payment" 
                    element={
                      <ProtectedRoute requiredRole="passenger">
                        <Payment />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/my-bookings" 
                    element={
                      <ProtectedRoute requiredRole="passenger">
                        <MyBookings />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Protected Routes - Profile (All authenticated users) */}
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/edit-profile" 
                    element={
                      <ProtectedRoute>
                        <EditProfile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/change-password" 
                    element={
                      <ProtectedRoute>
                        <ChangePassword />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Protected Routes - Admin */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/users" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <Users />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/companies" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <Companies />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/routes" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <RoutesPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/analytics" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <Analytics />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Protected Routes - Bus Company */}
                  <Route 
                    path="/bus-company" 
                    element={
                      <ProtectedRoute requiredRole="bus_company">
                        <BusCompanyDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/bus-company/buses" 
                    element={
                      <ProtectedRoute requiredRole="bus_company">
                        <MyBuses />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/bus-company/trips" 
                    element={
                      <ProtectedRoute requiredRole="bus_company">
                        <MyTrips />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/bus-company/bookings" 
                    element={
                      <ProtectedRoute requiredRole="bus_company">
                        <CompanyBookings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/bus-company/stats" 
                    element={
                      <ProtectedRoute requiredRole="bus_company">
                        <CompanyStats />
                      </ProtectedRoute>
                    } 
                  />

                  {/* 404 Page */}
                  <Route 
                    path="*" 
                    element={
                      <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                          <p className="text-xl text-gray-600">Trang không tồn tại</p>
                        </div>
                      </div>
                    } 
                  />
                </Routes>
              </main>
              <VeXeReFooter />
              <NotificationCenter />
            </div>
          </BookingProvider>
        </AuthProvider>
      </NotificationProvider>
    </>
  )
}

export default App