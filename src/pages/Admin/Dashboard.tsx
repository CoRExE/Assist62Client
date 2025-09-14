import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin area.</p>
      <nav>
        <ul>
          <li>
            <Link to="/admin/categories">Manage Categories</Link>
          </li>
          <li>
            <Link to="/admin/problems">Manage Problems</Link>
          </li>
          <li>
            <Link to="/admin/news">Manage News</Link>
          </li>
          {/* Links to other admin pages will go here */}
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;