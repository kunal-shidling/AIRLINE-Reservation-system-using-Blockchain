import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingsProvider } from './context/BookingsContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Layout/Navbar';
import PremiumLanding from './components/Landing/PremiumLanding';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import FlightList from './components/Flights/FlightList';
import BookingHistory from './components/Booking/BookingHistory';
import BlockchainViewer from './components/Blockchain/BlockchainViewer';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PremiumLanding />} />
            <Route path="/flights" element={<FlightList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={(
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/bookings"
              element={(
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              )}
            />
            <Route path="/blockchain" element={<BlockchainViewer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookingsProvider>
          <AppRoutes />
        </BookingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
