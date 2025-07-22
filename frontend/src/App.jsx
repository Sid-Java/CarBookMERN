import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import theme from './theme';

// Pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import VehicleDetails from './pages/VehicleDetails';
import BookVehicle from './pages/BookVehicle';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ManageVehicles from './pages/ManageVehicles';
import AllBookings from './pages/AllBookings';
import MyBookings from './pages/MyBookings';

// Components
import TabBar from './component/TabBar';
import Footer from './component/Footer';

// Protected Route Components
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

const AdminRoute = ({ children }) => (
  <ProtectedRoute requireAdmin>{children}</ProtectedRoute>
);

const UserRoute = ({ children }) => (
  <ProtectedRoute requireAdmin={false}>{children}</ProtectedRoute>
);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div
            className="app"
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <TabBar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/vehicle/:id" element={<VehicleDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected User Routes */}
                <Route
                  path="/book/:vehicleId"
                  element={
                    <UserRoute>
                      <BookVehicle />
                    </UserRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <UserRoute>
                      <MyBookings />
                    </UserRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/vehicles"
                  element={
                    <AdminRoute>
                      <ManageVehicles />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <AdminRoute>
                      <AllBookings />
                    </AdminRoute>
                  }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};
export default App;