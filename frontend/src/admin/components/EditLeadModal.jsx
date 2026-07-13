import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import API from '../../api/api';

const EditLeadModal = ({ lead, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lead) {
      // Deep copy to avoid mutating the original prop immediately
      setFormData(JSON.parse(JSON.stringify(lead)));
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const { data } = await API.put(`/leads/${lead.id || lead._id}`, formData);
      if (data.success) {
        onUpdate(data.data);
      } else {
        setError(data.message || 'Failed to update lead');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lead) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1100, padding: '1rem', backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '800px', width: '100%', maxHeight: '90vh',
        overflowY: 'auto', padding: '2rem', position: 'relative', background: 'var(--bg-surface)'
      }}>
        <button style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onClose}>
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Edit Student Details</h2>

        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Basic Info */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" name="full_name" value={formData.full_name || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" name="email" value={formData.email || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input className="form-input" name="mobile_number" value={formData.mobile_number || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" name="city" value={formData.city || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-select" name="gender" value={formData.gender || ''} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input className="form-input" type="date" name="dob" value={formData.dob ? formData.dob.split('T')[0] : ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" name="category" value={formData.category || ''} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic Details */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Academic Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Previous Qualification</label>
                <input className="form-input" name="qualification" value={formData.qualification || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">School / College Name</label>
                <input className="form-input" name="school_college_name" value={formData.previous_qualification?.school_college_name || ''} onChange={(e) => handleNestedChange(e, 'previous_qualification')} />
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Permanent Address</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">House No</label>
                <input className="form-input" name="house_no" value={formData.permanent_address?.house_no || ''} onChange={(e) => handleNestedChange(e, 'permanent_address')} />
              </div>
              <div className="form-group">
                <label className="form-label">Street</label>
                <input className="form-input" name="street" value={formData.permanent_address?.street || ''} onChange={(e) => handleNestedChange(e, 'permanent_address')} />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input className="form-input" name="state" value={formData.permanent_address?.state || ''} onChange={(e) => handleNestedChange(e, 'permanent_address')} />
              </div>
              <div className="form-group">
                <label className="form-label">Pin Code</label>
                <input className="form-input" name="pin_code" value={formData.permanent_address?.pin_code || ''} onChange={(e) => handleNestedChange(e, 'permanent_address')} />
              </div>
            </div>
          </div>

          {/* Parent Info */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Parent Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Father's Name</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input className="form-input" name="first_name" placeholder="First Name" value={formData.father?.first_name || ''} onChange={(e) => handleNestedChange(e, 'father')} />
                    <input className="form-input" name="last_name" placeholder="Last Name" value={formData.father?.last_name || ''} onChange={(e) => handleNestedChange(e, 'father')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Father's Phone</label>
                <input className="form-input" name="mobile_number" value={formData.father?.mobile_number || ''} onChange={(e) => handleNestedChange(e, 'father')} />
              </div>
              <div className="form-group">
                <label className="form-label">Mother's Name</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input className="form-input" name="first_name" placeholder="First Name" value={formData.mother?.first_name || ''} onChange={(e) => handleNestedChange(e, 'mother')} />
                    <input className="form-input" name="last_name" placeholder="Last Name" value={formData.mother?.last_name || ''} onChange={(e) => handleNestedChange(e, 'mother')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Mother's Phone</label>
                <input className="form-input" name="mobile_number" value={formData.mother?.mobile_number || ''} onChange={(e) => handleNestedChange(e, 'mother')} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeadModal;
