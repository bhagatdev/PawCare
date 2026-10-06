import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartCheckout from './components/CartCheckout';
import AuthModal from './components/AuthModal';

// Main Application Pages
import Home from './pages/Home';
import DoctorConsultation from './pages/DoctorConsultation';
import Pharmacy from './pages/Pharmacy';
import PrescriptionUpload from './pages/PrescriptionUpload';
import Dashboard from './pages/Dashboard';

// Additional Specialized Features & Dashboards
import AISymptomChecker from './components/AISymptomChecker';
import TelehealthRoom from './components/TelehealthRoom';
import VetDashboard from './components/VetDashboard';
import PharmacyDashboard from './components/PharmacyDashboard';
import AuthLanding from './components/AuthLanding';

/**
 * Global Layout Wrapper
 * Keeps Navbar, Footer, and the sliding CartCheckout Drawer persistent across all pages.
 */
function Layout({
  children,
  isCartOpen,
  setIsCartOpen,
  cartItems,
  setCartItems,
  onOpenAuth,
}) {
  const totalItemCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const handleUpdateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleOrderCompleted = (order) => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans selection:bg-teal-500/20">
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalItemCount}
        onOpenAuth={onOpenAuth}
      />

      <main className="flex-1 w-full">
        {children}
      </main>

      <Footer />

      <CartCheckout
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOrderCompleted={handleOrderCompleted}
      />
    </div>
  );
}

/**
 * Protected Route Wrapper
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { userRole, isAuthenticated } = useAuth();
  const token = localStorage.getItem('access_token');

  if (!token && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === 'VETERINARIAN') return <Navigate to="/vet-portal" replace />;
    if (userRole === 'PHARMACY_ADMIN') return <Navigate to="/pharmacy-admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/**
 * App Routing with Global Layout
 */
function AppContent() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Melonex Pet Oral Suspension (Meloxicam 1.5mg/ml, 10ml)',
      brand: 'Intas Pharmaceuticals',
      price_inr: 145.00,
      price: 145.00,
      quantity: 1,
      image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 2,
      name: 'Savavet Kiwof Plus Broad Spectrum Dewormer (4 Tabs)',
      brand: 'Savavet (Sava Healthcare)',
      price_inr: 210.00,
      price: 210.00,
      quantity: 2,
      image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=200',
    }
  ]);

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          price_inr: product.price_inr || product.price,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleAuthSuccess = (userObj) => {
    const token = localStorage.getItem('access_token') || 'demo_token';
    const refresh = localStorage.getItem('refresh_token') || 'demo_refresh';
    login(token, refresh, userObj);
    setIsAuthModalOpen(false);
  };

  const totalItemCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  return (
    <>
      <Layout
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
        setCartItems={setCartItems}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      >
        <Routes>
          {/* Landing Page */}
          <Route
            path="/"
            element={<Home onOpenCart={() => setIsCartOpen(true)} />}
          />

          {/* Doctor Consultation Booking */}
          <Route
            path="/consultation"
            element={<DoctorConsultation />}
          />

          {/* Live Telehealth Room Simulator */}
          <Route
            path="/telehealth-room"
            element={
              <div className="py-8 px-4 max-w-7xl mx-auto">
                <TelehealthRoom onEndCall={() => navigate('/dashboard')} />
              </div>
            }
          />

          {/* Pharmacy & Store */}
          <Route
            path="/pharmacy"
            element={
              <Pharmacy
                onAddToCart={handleAddToCart}
                onOpenCart={() => setIsCartOpen(true)}
                cartCount={totalItemCount}
              />
            }
          />

          {/* Upload Prescription */}
          <Route
            path="/upload-rx"
            element={<PrescriptionUpload />}
          />

          {/* Pet Owner Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* AI Symptom Checker & Triage */}
          <Route
            path="/symptom-checker"
            element={
              <div className="py-8 px-4 max-w-4xl mx-auto">
                <AISymptomChecker onBookAppointment={() => navigate('/consultation')} />
              </div>
            }
          />
          <Route
            path="/symptom-triage"
            element={
              <div className="py-8 px-4 max-w-4xl mx-auto">
                <AISymptomChecker onBookAppointment={() => navigate('/consultation')} />
              </div>
            }
          />

          {/* Vet Portal (Dr. Anjali Sharma) */}
          <Route
            path="/vet-portal"
            element={
              <ProtectedRoute allowedRoles={['VETERINARIAN', 'SYSTEM_ADMIN']}>
                <VetDashboard />
              </ProtectedRoute>
            }
          />

          {/* Pharmacy Admin Portal */}
          <Route
            path="/pharmacy-admin"
            element={
              <ProtectedRoute allowedRoles={['PHARMACY_ADMIN', 'SYSTEM_ADMIN']}>
                <PharmacyDashboard />
              </ProtectedRoute>
            }
          />

          {/* Authentication Landing */}
          <Route
            path="/auth"
            element={<AuthLanding onLoginSuccess={() => navigate('/dashboard')} />}
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>

      {/* Global Sliding Auth Modal for Log In / Sign Up */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
