import React, { useState, useEffect } from 'react';
import { SettingsProvider } from './context/SettingsContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { HomePage } from './pages/HomePage.js';
import { BrowseCarsPage } from './pages/BrowseCarsPage.js';
import { CarDetailPage } from './pages/CarDetailPage.js';
import { SellCarPage } from './pages/SellCarPage.js';
import { FinancePage } from './pages/FinancePage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { AdminLoginPage } from './pages/AdminLoginPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname || '/';
  });

  const [adminToken, setAdminToken] = useState<string>(() => {
    return localStorage.getItem('admin_token') || 'demo-admin-token';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path.startsWith('/')) {
      window.history.pushState(null, '', path);
      setCurrentPath(path.split('?')[0]);
    } else {
      window.history.pushState(null, '', `/${path}`);
      setCurrentPath(`/${path}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('admin_token', token);
  };

  const handleAdminLogout = () => {
    setAdminToken('');
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  // ROUTE MATCHING
  const renderPage = () => {
    // 1. Car Detail Page (/cars/:slug)
    if (currentPath.startsWith('/cars/')) {
      const slug = currentPath.replace('/cars/', '');
      if (slug && slug !== 'all') {
        return <CarDetailPage slug={slug} onNavigate={navigate} />;
      }
    }

    // 2. Exact Path Matches
    switch (currentPath) {
      case '/cars':
        return <BrowseCarsPage onNavigate={navigate} />;
      case '/sell':
        return <SellCarPage onNavigate={navigate} />;
      case '/finance':
        return <FinancePage onNavigate={navigate} />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/contact':
        return <ContactPage onNavigate={navigate} />;
      case '/admin':
      case '/admin/login':
        return <AdminLoginPage onNavigate={navigate} onLoginSuccess={handleAdminLoginSuccess} />;
      case '/admin/dashboard':
        return (
          <AdminDashboardPage
            token={adminToken}
            onNavigate={navigate}
            onLogout={handleAdminLogout}
          />
        );
      case '/':
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <SettingsProvider>
      <AuthProvider>
        <div className="bg-slate-950 text-slate-100 min-h-screen selection:bg-red-600 selection:text-white">
          {renderPage()}
        </div>
      </AuthProvider>
    </SettingsProvider>
  );
}
