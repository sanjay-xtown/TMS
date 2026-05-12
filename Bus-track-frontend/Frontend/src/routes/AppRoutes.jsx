import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config/routes';

// My Modules (Parent PWA)
import SplashScreen from '../modules/auth/SplashScreen';
import LoginPage from '../modules/auth/AdminLoginPage';
import ParentDashboard from '../modules/parent/ParentDashboard';
import LiveTracking from '../modules/tracking/LiveTracking';
import NotificationsPage from '../modules/notification/NotificationsPage';
import MyTrips from '../modules/trip/MyTrips';
import BusInfo from '../modules/parent/BusInfo';
import ProfilePage from '../modules/parent/ProfilePage';
import SettingsPage from '../modules/parent/SettingsPage';

// Super Admin Module
import SuperAdminLogin from '../modules/superadmin/pages/SuperAdminLogin';
import SuperAdminDashboard from '../modules/superadmin/pages/SuperAdminDashboard';

// School Admin Module
import SchoolAdminLogin from '../modules/schooladmin/pages/SchoolAdminLogin';
import SchoolAdminDashboard from '../modules/schooladmin/pages/SchoolAdminDashboard';

// Team Placeholders
const TeamPlaceholder = ({ title }) => (
  <div className="h-screen flex items-center justify-center bg-black text-white p-6 text-center">
    <div>
      <h1 className="text-2xl font-bold text-primary mb-2">{title}</h1>
      <p className="text-gray-400 italic">This module is being developed by team members.</p>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Parent PWA Routes */}
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path={ROUTES.DASHBOARD} element={<ParentDashboard />} />
      <Route path={ROUTES.TRACKING} element={<LiveTracking />} />
      <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
      <Route path={ROUTES.TRIPS} element={<MyTrips />} />
      <Route path={ROUTES.BUS_INFO} element={<BusInfo />} />
      <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />

      {/* Team Member Placeholders */}
      <Route path={ROUTES.ADMIN_DASHBOARD} element={<TeamPlaceholder title="Admin Dashboard" />} />
      <Route path={ROUTES.SCHOOLS} element={<TeamPlaceholder title="School Management" />} />
      <Route path={ROUTES.BUSES} element={<TeamPlaceholder title="Bus Fleet Management" />} />
      <Route path={ROUTES.STUDENTS} element={<TeamPlaceholder title="Student Records" />} />
      <Route path={ROUTES.TRANSFERS} element={<TeamPlaceholder title="Bus Transfers" />} />
      <Route path={ROUTES.SUPPORT} element={<TeamPlaceholder title="Admin Support" />} />

      {/* Super Admin Module */}
      <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />

      {/* School Admin Module */}
      <Route path="/schooladmin/dashboard" element={<SchoolAdminDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
