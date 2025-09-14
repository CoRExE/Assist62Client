import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import NotificationBell from './NotificationBell';

const NavBar: React.FC = () => {
  const { user } = useAppStore();
  const isAdminOrModo = user?.roles.includes('ADMIN') || user?.roles.includes('MODO');

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#eee' }}>
      <div>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/news" style={{ marginRight: '1rem' }}>News</Link>
        <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
        {isAdminOrModo && <Link to="/admin">Admin</Link>}
      </div>
      <NotificationBell />
    </nav>
  );
};

export default NavBar;
