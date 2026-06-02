import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// User Pages
import Navbar from './components/Navbar';
import Home from './pages/user/Home';
import Cakes from './pages/user/Cakes';
import CakeDetail from './pages/user/CakeDetail';
import Cart from './pages/user/Cart';
import OrderForm from './pages/user/OrderForm';
import MyOrders from './pages/user/MyOrders';
import Payment from './pages/user/Payment';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Profile from './pages/user/Profile';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCakes from './pages/admin/AdminCakes';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminReviews from './pages/admin/AdminReviews';

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

const UserLayout = ({ children }) => (
  <>
    <Navbar />
    <div style={{ minHeight: '100vh' }}>{children}</div>
  </>
);

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public User Routes */}
      <Route path="/" element={<UserLayout><Home /></UserLayout>} />
      <Route path="/cakes" element={<UserLayout><Cakes /></UserLayout>} />
      <Route path="/cakes/:id" element={<UserLayout><CakeDetail /></UserLayout>} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/'} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

      {/* Protected User Routes */}
      <Route path="/order/:cakeId" element={<ProtectedRoute><UserLayout><OrderForm /></UserLayout></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute><UserLayout><MyOrders /></UserLayout></ProtectedRoute>} />
      <Route path="/payment/:orderId" element={<ProtectedRoute><UserLayout><Payment /></UserLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserLayout><Profile /></UserLayout></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><UserLayout><Cart /></UserLayout></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="cakes" element={<AdminCakes />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="reviews" element={<AdminReviews />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{
          style: { fontFamily: 'DM Sans, sans-serif', borderRadius: '12px' }
        }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
