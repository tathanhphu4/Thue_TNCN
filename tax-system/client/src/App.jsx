import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute   from './components/shared/PrivateRoute';
import AdminRoute     from './components/shared/AdminRoute';
import ErrorBoundary  from './components/shared/ErrorBoundary';

// Pages
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TaxDeclarePage from './pages/TaxDeclarePage';
import TaxHistoryPage from './pages/TaxHistoryPage';
import TaxCalculatorPage from './pages/TaxCalculatorPage';
import ProfilePage  from './pages/ProfilePage';
import ReportPage   from './pages/ReportPage';
import AdminPage    from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
        {/* Public */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User */}
        <Route element={<PrivateRoute />}>
          <Route path="/"              element={<DashboardPage />} />
          <Route path="/dashboard"     element={<DashboardPage />} />
          <Route path="/tax/declare"   element={<TaxDeclarePage />} />
          <Route path="/tax/history"   element={<TaxHistoryPage />} />
          <Route path="/tax/calculator" element={<TaxCalculatorPage />} />
          <Route path="/profile"       element={<ProfilePage />} />
          <Route path="/reports"       element={<ReportPage />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
