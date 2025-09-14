import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../store';

const StrictAdminRoute: React.FC = () => {
  const { user } = useAppStore();

  if (!user || !user.roles.includes('ADMIN')) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default StrictAdminRoute;
