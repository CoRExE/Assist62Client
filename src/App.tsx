import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import StrictAdminRoute from './components/StrictAdminRoute';
import CategoryPage from './pages/Category';
import ProblemPage from './pages/Problem';
import NewsPage from './pages/News';
import ProfilePage from './pages/Profile';
import AdminDashboard from './pages/Admin/Dashboard';
import CategoryManager from './pages/Admin/CategoryManager';
import ProblemManager from './pages/Admin/ProblemManager';
import NewsManager from './pages/Admin/NewsManager';
import UserManager from './pages/Admin/UserManager';
import NavBar from './components/NavBar';

const AppLayout: React.FC = () => (
  <div>
    <NavBar />
    <Outlet />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          {/* User-facing routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/problem/:id" element={<ProblemPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/categories" element={<CategoryManager />} />
            <Route path="/admin/problems" element={<ProblemManager />} />
            <Route path="/admin/news" element={<NewsManager />} />
            {/* Strict Admin routes */}
            <Route element={<StrictAdminRoute />}>
              <Route path="/admin/users" element={<UserManager />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
