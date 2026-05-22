// frontend/src/App.jsx
// This is the main app file — sets up all the routes (page addresses)

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RequestList from './pages/RequestList';
import CreateRequest from './pages/CreateRequest';
import EditRequest from './pages/EditRequest';

// ProtectedRoute — redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// PublicRoute — redirects to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public routes (only for non-logged-in users) */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected routes (only for logged-in users) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><RequestList /></ProtectedRoute>} />
        <Route path="/create-request" element={<ProtectedRoute><CreateRequest /></ProtectedRoute>} />
        <Route path="/requests/:id/edit" element={<ProtectedRoute><EditRequest /></ProtectedRoute>} />

        {/* 404 page */}
        <Route path="*" element={
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '2rem', color: '#1A1A2E' }}>404</h2>
            <p style={{ color: '#6B7280', marginTop: '10px' }}>Page not found.</p>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;