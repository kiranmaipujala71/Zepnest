// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch requests when component mounts
    const fetchData = async () => {
      try {
        const { data } = await api.get('/requests');
        if (data.success) {
          const requests = data.data;
          setRecentRequests(requests.slice(0, 5)); // Show 5 most recent
          setStats({
            total: requests.length,
            pending: requests.filter(r => r.status === 'Pending').length,
            inProgress: requests.filter(r => r.status === 'In Progress').length,
            completed: requests.filter(r => r.status === 'Completed').length
          });
        }
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty array = run only once when page loads

  const getStatusBadge = (status) => {
    const classes = {
      'Pending': 'badge badge-pending',
      'In Progress': 'badge badge-inprogress',
      'Completed': 'badge badge-completed',
      'Cancelled': 'badge badge-cancelled'
    };
    return <span className={classes[status] || 'badge'}>{status}</span>;
  };

  if (loading) return (
    <div className="page-wrapper">
      <div className="container">
        <div className="spinner"></div>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Welcome Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '1.8rem',
            color: '#1A1A2E',
            marginBottom: '4px'
          }}>
            Hello, {user.name} 👋
          </h1>
          <p style={{ color: '#6B7280' }}>Here's an overview of your service requests.</p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Total Requests', value: stats.total, color: '#E8520A', bg: '#FFF0EA' },
            { label: 'Pending', value: stats.pending, color: '#92400E', bg: '#FEF3C7' },
            { label: 'In Progress', value: stats.inProgress, color: '#1E40AF', bg: '#DBEAFE' },
            { label: 'Completed', value: stats.completed, color: '#065F46', bg: '#D1FAE5' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2.2rem',
                fontWeight: '700',
                fontFamily: 'Sora, sans-serif',
                color: stat.color,
                background: stat.bg,
                borderRadius: '12px',
                padding: '12px',
                display: 'inline-block',
                minWidth: '60px',
                marginBottom: '8px'
              }}>{stat.value}</div>
              <p style={{ color: '#6B7280', fontSize: '0.85rem', fontWeight: '600' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Action */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #E8520A 0%, #C44208 100%)',
          color: 'white',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.1rem', marginBottom: '4px' }}>
              Need a home service?
            </h3>
            <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>
              Create a new request and we'll get it done.
            </p>
          </div>
          <Link to="/create-request" style={{
            background: 'white',
            color: '#E8520A',
            padding: '10px 22px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '0.9rem'
          }}>
            + New Request
          </Link>
        </div>

        {/* Recent Requests */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.1rem', color: '#1A1A2E' }}>
              Recent Requests
            </h2>
            <Link to="/requests" style={{ color: '#E8520A', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
              View all →
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#6B7280', marginBottom: '16px' }}>No requests yet.</p>
              <Link to="/create-request" className="btn btn-primary">Create your first request</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentRequests.map(req => (
                <div key={req.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <p style={{ fontWeight: '600', color: '#1A1A2E', marginBottom: '2px' }}>{req.title}</p>
                    <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                      {req.category} • {new Date(req.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(req.status)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;