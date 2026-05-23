// frontend/src/pages/CreateRequest.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = [
  'Plumbing', 'Electrical', 'Cleaning', 'Carpentry',
  'Painting', 'Pest Control', 'AC/HVAC', 'Appliance Repair', 'Other'
];

const CreateRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    address: '',
    preferred_time: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // Image preview
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a local preview URL
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use FormData to send files along with text data
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('category', formData.category);
      form.append('address', formData.address);
      form.append('preferred_time', formData.preferred_time);
      if (image) {
        form.append('image', image); // Must match multer field name
      }

      const { data } = await api.post('/requests', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        setSuccess('Request created successfully!');
        setTimeout(() => navigate('/requests'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '650px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.6rem', color: '#1A1A2E', marginBottom: '4px' }}>
            New Service Request
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
            Describe what you need and we'll take care of it.
          </p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Request Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Fix leaking bathroom pipe"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                required
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Service Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address where service is needed"
                required
              />
            </div>

            <div className="form-group">
              <label>Preferred Time *</label>
              <input
                type="text"
                name="preferred_time"
                value={formData.preferred_time}
                onChange={handleChange}
                placeholder="e.g. Saturday 10am–12pm, or ASAP"
                required
              />
            </div>

            <div className="form-group">
              <label>Attach Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ padding: '8px 0' }}
              />
              {preview && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #E5E7EB' }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/requests')}
                style={{ flex: 1, padding: '12px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: 2, padding: '12px' }}
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;