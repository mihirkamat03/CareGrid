import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientTracker from './pages/PatientTracker';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './context/AuthContext';
import { CareGridProvider } from './context/CareGridContext';
import { ToastProvider } from './components/ToastProvider';
import PaymentModal from './components/PaymentModal';
import ReceiptPrinter from './components/ReceiptPrinter';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CareGridProvider>
          <Router>
            <PaymentModal />
            <ReceiptPrinter />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/doctor" element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/patient" element={
                <ProtectedRoute requiredRole="patient">
                  <PatientTracker />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </CareGridProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
