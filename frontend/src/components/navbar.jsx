// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    // Clear stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #E5E7EB',
      padding: '0 20px',
      height: '65px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    }}>
      {/* Logo */}
      <Link to="/dashboard" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: '#E8520A',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: 'Sora, sans-serif', fontWeight: '700', fontSize: '18px'
          }}>Z</div>
          <span style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: '700',
            fontSize: '1.2rem',
            color: '#1A1A2E'
          }}>Zepnest</span>
        </div>
      </Link>

      {/* Navigation Links */}
      {isLoggedIn && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/dashboard" style={{ color: '#6B7280', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>
            Dashboard
          </Link>
          <Link to="/requests" style={{ color: '#6B7280', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>
            My Requests
          </Link>
          <Link to="/create-request" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            + New Request
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px',
              background: '#FFF0EA', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#E8520A', fontWeight: '700', fontSize: '0.9rem'
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <button onClick={handleLogout} style={{
              background: 'none', border: '1px solid #E5E7EB',
              padding: '6px 14px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '0.85rem', color: '#6B7280',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;