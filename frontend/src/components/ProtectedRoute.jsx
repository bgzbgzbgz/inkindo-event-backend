import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  // Kalau nggak ada token, tendang balik ke halaman Login atau Landing
  if (!token) {
    return <Navigate to="/" />; 
  }
  
  // Kalau ada token, izinkan masuk (render halaman dashboard-nya)
  return children;
};

export default ProtectedRoute;