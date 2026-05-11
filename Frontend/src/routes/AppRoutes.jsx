import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config/routes';

// My Modules (Parent PWA)
import SplashScreen from '../modules/auth/SplashScreen';
import LoginPage from '../modules/auth/LoginPage';
import ParentDashboard from '../modules/parent/ParentDashboard';
import LiveTracking from '../modules/tracking/LiveTracking';
import NotificationsPage from '../modules/notification/NotificationsPage';
import MyTrips from '../modules/trip/MyTrips';
import BusInfo from '../modules/parent/BusInfo';
import ProfilePage from '../modules/parent/ProfilePage';
import SettingsPage from '../modules/parent/SettingsPage';

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
      <Route path={ROUTES.SPLASH} element={<SplashScreen />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
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
    </Routes>
  );
};

export default AppRoutes;
