import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../store';

const AdminRoute: React.FC = () => {
  const { user } = useAppStore();

  if (!user || (!user.roles.includes('ADMIN') && !user.roles.includes('MODO'))) {
    // Redirect them to the home page if they are not an admin/modo
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
