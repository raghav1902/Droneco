import React, { useState } from 'react';
import { Search, User, Phone, BookOpen, CreditCard, AlertCircle } from 'lucide-react';
import API from '../../api/api';
import { showToast } from '../../utils/toast';

const StudentSearch = ({ onCollectFee, onViewProfile }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feeDetails, setFeeDetails] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    setSelectedStudent(null);
    setFeeDetails(null);

    try {
      const res = await API.get(`/leads?search=${search}&status=Enrolled`);
      setResults(res.data.data);
      if (res.data.data.length === 0) {
        showToast('No enrolled students found matching your search.', 'info');
      }
    } catch (error) {
      console.error('Error searching students:', error);
      showToast('Error searching students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = async (lead) => {
    setSelectedStudent(lead);
    setFeeDetails(null);
    try {
      const leadId = lead._id || lead.id;
      const res = await API.get(`/fees/student/${leadId}`);
      if (res.data.data && res.data.data.length > 0) {
        // Assume the first fee structure for the student
        setFeeDetails(res.data.data[0]);
      }
    } catch (err) {
      console.error('Error fetching fee details:', err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Student Search</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Search enrolled students by Name, ID, or Phone Number</p>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Enter student name, ID, or phone..."
              style={{ paddingLeft: '3rem', fontSize: '1.1rem', padding: '1rem 1rem 1rem 3rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {!selectedStudent && results.length > 0 && (
        <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Search Results ({results.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {results.map(lead => (
              <div
                key={lead._id || lead.id}
                style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                className="table-row-hover"
                onClick={() => handleSelectStudent(lead)}
              >
                <div>
                  <h4 style={{ fontWeight: 600 }}>{lead.full_name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ID: {lead._id || lead.id} | Ph: {lead.mobile_number}</p>
                </div>
                <button className="btn btn-secondary btn-sm">View Details</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedStudent && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setSelectedStudent(null)}>← Back to Results</button>
            {onViewProfile && (
              <button className="btn btn-primary btn-sm" onClick={() => onViewProfile(selectedStudent)}>View Full Profile</button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

            {/* Profile Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {selectedStudent.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{selectedStudent.full_name}</h3>
                  <span className="badge badge-secondary" style={{ marginTop: '0.25rem' }}>{selectedStudent._id || selectedStudent.id}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                  <Phone size={18} /> <span>{selectedStudent.mobile_number}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                  <BookOpen size={18} /> <span>Course ID: {selectedStudent.interested_course_id}</span>
                </div>
              </div>
            </div>

            {/* Fee Summary */}
            <div style={{ background: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={18} /> Fee Summary
              </h4>

              {!feeDetails ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <span>Loading fee details...</span>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Fee:</span>
                    <span style={{ fontWeight: 600 }}>₹{feeDetails.net_payable}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Paid Fee:</span>
                    <span style={{ fontWeight: 600, color: 'var(--success)' }}>₹{feeDetails.paid_amount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Remaining Fee:</span>
                    <span style={{ fontWeight: 700, color: 'var(--danger)', fontSize: '1.25rem' }}>₹{feeDetails.due_amount}</span>
                  </div>

                  {feeDetails.due_amount > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => onCollectFee && onCollectFee(selectedStudent)}>
                        Collect Payment
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSearch;
