import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, CreditCard, Bell } from 'lucide-react';
import { showToast } from '../../utils/toast.js';
import API from '../../api/api.js';

const DueList = ({ onCollectFee }) => {
  const [search, setSearch] = useState('');
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDues = async () => {
      try {
        const res = await API.get('/fees/dues');
        setDues(res.data.data);
      } catch (err) {
        console.error('Failed to fetch due list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDues();
  }, []);

  const filteredDues = dues.filter(fee => {
    const name = fee.lead_id?.full_name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleCollectFee = (fee) => {
    if (onCollectFee) {
      // Pass the lead as the student for CollectFee component
      const student = {
        id: fee.lead_id?._id || fee.lead_id?.id,
        name: fee.lead_id?.full_name,
        full_name: fee.lead_id?.full_name,
        mobile_number: fee.lead_id?.mobile_number,
        email: fee.lead_id?.email,
      };
      onCollectFee(student);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Due List</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Students with pending fee payments.</p>
        </div>
        {filteredDues.length > 0 && (
          <div style={{ background: 'var(--danger-glow, rgba(239,68,68,0.1))', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--danger, #ef4444)', fontWeight: 600 }}>
            ₹{filteredDues.reduce((sum, f) => sum + (f.due_amount || 0), 0).toLocaleString()} total dues
          </div>
        )}
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by student name..."
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="form-select">
            <option value="All">All Classes</option>
          </select>
          <select className="form-select">
            <option value="All">All Statuses</option>
            <option value="Overdue">Overdue</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student ID</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Class / Course</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paid</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Amount</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Fee</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : filteredDues.map((fee) => (
              <tr key={fee.id || fee._id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {(fee.lead_id?._id || '').substring(0, 8)}…
                </td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>
                  {fee.lead_id?.full_name || 'Unknown'}
                  <AlertCircle size={14} style={{ display: 'inline', marginLeft: '0.5rem', color: 'var(--danger, #ef4444)' }} />
                  {fee.lead_id?.mobile_number && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{fee.lead_id.mobile_number}</div>
                  )}
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ fontSize: '0.9rem' }}>{fee.course_id?.course_name || 'N/A'}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--success, #10b981)', fontWeight: 600 }}>
                  ₹{(fee.paid_amount || 0).toLocaleString()}
                </td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--warning, #f59e0b)' }}>
                  ₹{fee.due_amount?.toLocaleString()}
                </td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-main)' }}>
                  ₹{fee.net_payable?.toLocaleString()}
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      onClick={() => showToast(`Reminder noted for ${fee.lead_id?.full_name}`, 'info')}
                      title="Send Reminder"
                    >
                      <Bell size={13} /> Remind
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      onClick={() => handleCollectFee(fee)}
                      title="Collect Fee"
                    >
                      <CreditCard size={13} /> Collect Fee
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filteredDues.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  🎉 No pending dues — all fees are up to date!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DueList;
