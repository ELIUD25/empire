import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import ServicesPage from './pages/ServicesPage.tsx';
import BettingPage from './pages/BettingPage.tsx';
import TradingPage from './pages/TradingPage.tsx';
import ProxyPage from './pages/ProxyPage.tsx';
import BlogPage from './pages/BlogPage.tsx';
import CasinoPage from './pages/CasinoPage.tsx';
import AdsPage from './pages/AdsPage.tsx';
import MicrotasksPage from './pages/MicrotasksPage.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { DataProvider } from './context/DataContext.tsx';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/betting" element={<BettingPage />} />
          <Route path="/trading" element={<TradingPage />} />
          <Route path="/proxy" element={<ProxyPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/casino" element={<CasinoPage />} />
          <Route path="/ads" element={<AdsPage />} />
          <Route path="/microtasks" element={<MicrotasksPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;