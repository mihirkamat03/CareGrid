import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientTracker from './pages/PatientTracker';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/patient" element={<PatientTracker />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
