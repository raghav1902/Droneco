import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power } from 'lucide-react';
import API from '../../api/api';
import { showToast } from '../../utils/toast';
import { discountSchema, validateForm } from '../../utils/validators';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Percentage',
    value: 0
  });

  const fetchDiscounts = async () => {
    try {
      const res = await API.get('/discounts');
      setDiscounts(res.data.data);
    } catch (err) {
      console.error('Error fetching discounts:', err);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const toggleStatus = async (item) => {
    try {
      await API.put(`/discounts/${item.id}`, { is_active: !item.is_active });
      fetchDiscounts();
    } catch (err) {
      showToast('Error toggling status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this discount?')) {
      try {
        await API.delete(`/discounts/${id}`);
        showToast('Discount deleted', 'success');
        fetchDiscounts();
      } catch (err) {
        showToast('Error deleting discount', 'error');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      type: item.type,
      value: item.value
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const validation = validateForm(discountSchema, formData);
    if (!validation.success) {
      const msgs = Object.values(validation.errors).join(', ');
      return showToast(msgs, 'error');
    }
    try {
      if (editingId) {
        await API.put(`/discounts/${editingId}`, formData);
      } else {
        await API.post('/discounts', formData);
      }
      showToast('Discount saved', 'success');
      setShowModal(false);
      fetchDiscounts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving discount', 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>Discount Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Configure scholarships and promotional discounts.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingId(null); setFormData({ name: '', type: 'Percentage', value: 0 }); setShowModal(true); }}>
          + Add Discount
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {discounts.map(discount => (
          <div key={discount.id} className="glass-card" style={{ padding: '1.5rem', opacity: discount.is_active ? 1 : 0.6, transition: 'var(--transition)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{discount.name}</h3>
                <span className={`badge badge-${discount.is_active ? 'success' : 'secondary'}`} style={{ marginTop: '0.5rem', display: 'inline-block' }}>
                  {discount.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--accent-hex)' }}>
                {discount.type === 'Percentage' ? `${discount.value}%` : `₹${discount.value}`}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: '1.5rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <button
                className="btn"
                style={{ background: 'transparent', color: discount.is_active ? 'var(--warning)' : 'var(--success)', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0 }}
                onClick={() => toggleStatus(discount)}
              >
                <Power size={16} /> {discount.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', padding: 0 }} onClick={() => handleEdit(discount)}>
                  <Edit2 size={16} />
                </button>
                <button className="btn" style={{ background: 'transparent', color: 'var(--danger)', border: 'none', padding: 0 }} onClick={() => handleDelete(discount.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Discount Configuration</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Discount Name</label>
                <input type="text" className="form-input" placeholder="e.g. Merit Scholarship" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.7rem' }}>TYPE</label>
                  <select className="form-select" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="Percentage">Percentage</option>
                    <option value="Flat">Flat Amount</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Value</label>
                  <input type="number" className="form-input" placeholder="e.g. 20" value={formData.value} onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountManagement;
