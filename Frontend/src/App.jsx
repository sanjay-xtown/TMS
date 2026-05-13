import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SchoolAdminDashboard from './pages/SchoolAdminDashboard';
import SchoolSetup from './pages/SchoolSetup';
import StudentsPage from './pages/StudentsPage';
import TrackingPage from './pages/TrackingPage';
import BusesPage from './pages/BusesPage';
import SchoolAdminPage from './pages/SchoolAdminPage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRouter from './components/DashboardRouter';

import { ToastProvider } from './components/ToastProvider';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/schooladmin/dashboard" element={<SchoolAdminDashboard />} />
            
            <Route path="/school-setup" element={<SchoolSetup />} />
            <Route path="/schooladmin/students" element={<StudentsPage />} />
            <Route path="/schooladmin/buses" element={<BusesPage />} />
            <Route path="/schooladmin/tracking" element={<TrackingPage />} />
            
            <Route path="/school-admins" element={<SchoolAdminPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
