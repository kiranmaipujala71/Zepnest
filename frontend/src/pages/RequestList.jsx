// frontend/src/pages/RequestList.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const RequestList = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/requests');
      if (data.success) setRequests(data.data);
    } catch (err) {
      setError('Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    
    try {
      await api.delete(`/requests/${id}`);
      // Remove from local state without re-fetching
      setRequests(requests.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to delete request.');
    }
  };

  // Filter requests by status
  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter);

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
      <div className="container"><div className="spinner"></div></div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.6rem', color: '#1A1A2E', marginBottom: '4px' }}>
              My Requests
            </h1>
            <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>{requests.length} total request{requests.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/create-request" className="btn btn-primary">+ New Request</Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '7px 16px',
                borderRadius: '20px',
                border: '1.5px solid',
                borderColor: filter === s ? '#E8520A' : '#E5E7EB',
                background: filter === s ? '#E8520A' : 'white',
                color: filter === s ? 'white' : '#6B7280',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.2s'
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ color: '#6B7280', fontSize: '1rem', marginBottom: '16px' }}>
              {filter === 'All' ? 'No requests yet.' : `No ${filter} requests.`}
            </p>
            {filter === 'All' && (
              <Link to="/create-request" className="btn btn-primary">Create your first request</Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered.map(req => (
              <div key={req.id} className="card" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <h3 style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '1rem' }}>{req.title}</h3>
                      {getStatusBadge(req.status)}
                    </div>
                    <p style={{ color: '#6B7280', fontSize: '0.88rem', marginBottom: '8px', lineHeight: '1.5' }}>
                      {req.description.length > 100 ? req.description.slice(0, 100) + '...' : req.description}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      {[
                        { label: '📦', value: req.category },
                        { label: '📍', value: req.address },
                        { label: '🕐', value: req.preferred_time },
                        { label: '📅', value: new Date(req.created_at).toLocaleDateString() }
                      ].map((item, i) => (
                        <span key={i} style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                          {item.label} {item.value}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => navigate(`/requests/${req.id}/edit`)}
                      className="btn btn-outline"
                      style={{ padding: '7px 14px', fontSize: '0.85rem' }}
                    >
                      Edit Status
                    </button>
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="btn btn-danger"
                      style={{ padding: '7px 14px', fontSize: '0.85rem' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Show image if exists */}
                {req.image_url && (
                  <div style={{ marginTop: '12px' }}>
                    <img
                      src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${req.image_url}`}
                      alt="Request"
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestList;