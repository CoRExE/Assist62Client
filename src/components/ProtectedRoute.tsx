import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../store';

const ProtectedRoute: React.FC = () => {
  const { token } = useAppStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
