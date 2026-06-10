import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DashboardUser from './pages/DashboardUser'; // Pastikan file ini ada
import Login from './pages/Login'; // Pastikan kamu udah bikin file Login.jsx
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Publik */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Halaman Dashboard (Dilindungi Satpam/ProtectedRoute) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-user" element={<DashboardUser />} />
        
        <Route path="/dashboard-user" element={
          <ProtectedRoute>
            <DashboardUser />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;