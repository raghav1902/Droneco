import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import API from '../../api/api';
import { showToast } from '../../utils/toast';

const FeeStructure = () => {
  const [structures, setStructures] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    total_fee: 0,
    installments_allowed: false
  });

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses');
      setStructures(res.data.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredStructures = structures.filter(s => s.course_name?.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to reset this fee structure?')) {
      try {
        await API.put(`/courses/${id}`, {
          fee_structure: { total_fee: 0, installments_allowed: false }
        });
        showToast('Fee structure reset successfully', 'success');
        fetchCourses();
      } catch (err) {
        showToast('Error resetting fee structure', 'error');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      total_fee: item.fee_structure?.total_fee || 0,
      installments_allowed: item.fee_structure?.installments_allowed || false
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      await API.put(`/courses/${editingId}`, {
        fee_structure: formData
      });
      showToast('Fee structure updated successfully', 'success');
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      showToast('Error saving fee structure', 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Fee Structure Management</h2>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by course name..."
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Course Name</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Total Fee</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Installments</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStructures.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{item.code}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{item.course_name}</td>
                <td style={{ padding: '1rem 1.5rem' }}>₹{(item.fee_structure?.total_fee || 0).toLocaleString()}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span className={`badge ${item.fee_structure?.installments_allowed ? 'badge-success' : 'badge-danger'}`} style={{
                    background: item.fee_structure?.installments_allowed ? 'var(--success-glow)' : 'var(--danger-glow)',
                    color: item.fee_structure?.installments_allowed ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {item.fee_structure?.installments_allowed ? 'Yes' : 'No'}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span className={`badge ${item.is_active ? 'badge-success' : 'badge-secondary'}`} style={{
                    background: item.is_active ? 'var(--success-glow)' : 'var(--bg-tertiary)',
                    color: item.is_active ? 'var(--success)' : 'var(--text-secondary)'
                  }}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => handleEdit(item)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem', color: 'var(--danger)', borderColor: 'var(--danger-glow)' }} onClick={() => handleDelete(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredStructures.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No fee structures found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - Basic mockup */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Edit Fee Structure</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Total Fee (₹)</label>
                <input type="number" className="form-input" placeholder="e.g. 15000" value={formData.total_fee} onChange={(e) => setFormData({ ...formData, total_fee: Number(e.target.value) })} />
              </div>
              <div>
                <label className="form-label">Installments Allowed</label>
                <select className="form-select" value={formData.installments_allowed ? 'Yes' : 'No'} onChange={(e) => setFormData({ ...formData, installments_allowed: e.target.value === 'Yes' })}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>Save Structure</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructure;
