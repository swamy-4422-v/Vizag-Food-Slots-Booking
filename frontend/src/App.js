import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FindStalls from './pages/FindStalls';
import Booking from './pages/Booking';
import BookingPage from './pages/BookingPage';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

// Scroll to top on route change component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
  
  return null;
};

// Protected Route Component - For authenticated users only
const PrivateRoute = ({ children }) => {
  const userData = localStorage.getItem('user');
  
  if (!userData) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const user = JSON.parse(userData);
    return user ? children : <Navigate to="/login" replace />;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

// Admin Route Component - For admin users only
const AdminRoute = ({ children }) => {
  const userData = localStorage.getItem('user');
  
  if (!userData) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const user = JSON.parse(userData);
    return user && user.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

// Public Route Component - Redirects to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const userData = localStorage.getItem('user');
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900 selection:bg-orange-100">
          <Navbar />
          
          <main className="flex-grow pt-20"> {/* Added padding-top for fixed navbar */}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              
              {/* Protected User Routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/find-stalls" element={
                <PrivateRoute>
                  <FindStalls />
                </PrivateRoute>
              } />
              
              <Route path="/bookings" element={
                <PrivateRoute>
                  <Booking />
                </PrivateRoute>
              } />
              
              <Route path="/book/:stallId" element={
                <PrivateRoute>
                  <BookingPage />
                </PrivateRoute>
              } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              <Route path="/admin/*" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              {/* 404 Redirect - Catch all unmatched routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;