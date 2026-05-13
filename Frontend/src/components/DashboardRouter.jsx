import React from 'react';
import { Navigate } from 'react-router-dom';

const DashboardRouter = () => {
  const role = localStorage.getItem('role');
  const schoolId = localStorage.getItem('schoolId');

  if (role === 'superadmin') {
    return <Navigate to="/superadmin/dashboard" replace />;
  }

  if (role === 'schooladmin') {
    if (!schoolId || schoolId === 'null') {
      return <Navigate to="/school-setup" replace />;
    }
    return <Navigate to="/schooladmin/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default DashboardRouter;
