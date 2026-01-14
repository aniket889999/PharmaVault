import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import OverviewDashboard from './components/dashboard/OverviewDashboard';
import AuthenticityChecker from './components/features/AuthenticityChecker';
import MedicineComparison from './components/features/MedicineComparison';
import PrescriptionUpload from './components/prescriptions/PrescriptionUpload';
import PharmacyDashboard from './components/pharmacy/PharmacyDashboard';
import MedicineAvailability from './components/availability/MedicineAvailability';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

console.log('App.tsx module executing');

const AppRoutes: React.FC = () => {
  console.log('AppRoutes rendering');
  const location = useLocation();

  // Redirect /home to /dashboard for better UX
  if (location.pathname === '/home') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewDashboard />} />
        <Route path="medicines" element={<HomePage />} />
        <Route path="authenticity" element={<AuthenticityChecker />} />
        <Route path="comparisons" element={<MedicineComparison />} />
        <Route path="prescriptions" element={<PrescriptionUpload />} />
        <Route path="pharmacies" element={<PharmacyDashboard />} />
        <Route path="availability" element={<MedicineAvailability />} />
        <Route path="users" element={<div className="p-6">Users (Coming Soon)</div>} />
        <Route path="settings" element={<div className="p-6">Settings (Coming Soon)</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  console.log('App component rendering');
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;