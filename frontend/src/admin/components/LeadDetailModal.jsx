import React, { useState } from 'react';
import { X, Edit2 } from 'lucide-react';
import EditLeadModal from './EditLeadModal';

const LeadDetailModal = ({
  selectedLead,
  setSelectedLead,
  getCourseName,
  questions,
  feedbackHistory,
  user,
  handleAdmitStudent,
  admittingLeadId,
  fetchLeads // Pass this down so we can refresh the list
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!selectedLead) return null;

  if (isEditing) {
    return (
      <EditLeadModal
        lead={selectedLead}
        onClose={() => setIsEditing(false)}
        onUpdate={(updatedLead) => {
          setSelectedLead(updatedLead);
          setIsEditing(false);
          if (fetchLeads) fetchLeads();
        }}
      />
    );
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, padding: '1rem', backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '600px', width: '100%', maxHeight: '85vh',
        overflowY: 'auto', padding: '2rem', position: 'relative', background: 'var(--bg-surface)'
      }}>
        <div style={{ display: 'flex', position: 'absolute', top: '1.25rem', right: '1.25rem', gap: '0.5rem' }}>
          <button style={{ background: 'none', border: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px' }} onClick={() => setIsEditing(true)}>
            <Edit2 size={16} /> <span style={{ fontSize: '0.8rem' }}>Edit</span>
          </button>
          <button style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSelectedLead(null)}>
            <X size={24} />
          </button>
        </div>

        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <span className={`badge badge-${selectedLead.status.toLowerCase().replace(' ', '-')}`} style={{ marginBottom: '0.5rem' }}>{selectedLead.status}</span>
          <h2 style={{ fontSize: '1.5rem' }}>{selectedLead.full_name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Submitted: {new Date(selectedLead.submitted_at).toLocaleString()}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Contact details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Email</label><span>{selectedLead.email || 'N/A'}</span></div>
            <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Phone</label><span>{selectedLead.mobile_number || 'N/A'}</span></div>
            <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>City</label><span>{selectedLead.city}</span></div>
            <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Course Interest</label><span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>{getCourseName(selectedLead.interested_course_id)}</span></div>
          </div>

          {/* Guardian details if applicable */}
          {selectedLead.filler_type === 'guardian' && (
            <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Guardian Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Guardian Name:</span> <span style={{ fontWeight: 500 }}>{selectedLead.guardian_name || `${selectedLead.guardian?.first_name || ''} ${selectedLead.guardian?.last_name || ''}`}</span></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Relationship:</span> <span style={{ fontWeight: 500 }}>{selectedLead.guardian_relation || selectedLead.guardian?.relationship || 'N/A'}</span></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Guardian Phone:</span> <span style={{ fontWeight: 500 }}>{selectedLead.guardian_phone || selectedLead.guardian?.mobile_number || 'N/A'}</span></div>
              </div>
            </div>
          )}

          {/* Academic Details */}
          {(selectedLead.qualification || selectedLead.previous_qualification?.school_college_name) && (
            <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Academic Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Previous Qualification:</span> <span style={{ fontWeight: 500 }}>{selectedLead.qualification || 'N/A'}</span></div>
                <div><span style={{ color: 'var(--text-muted)' }}>School/College:</span> <span style={{ fontWeight: 500 }}>{selectedLead.previous_qualification?.school_college_name || 'N/A'}</span></div>
              </div>
            </div>
          )}

          {/* Address Details */}
          {(selectedLead.permanent_address?.house_no || selectedLead.permanent_address?.city) && (
            <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Address Details</h4>
              <div style={{ fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 500 }}>
                  {[selectedLead.permanent_address?.house_no, selectedLead.permanent_address?.street, selectedLead.permanent_address?.city, selectedLead.permanent_address?.state, selectedLead.permanent_address?.pin_code].filter(Boolean).join(', ')}
                </span>
              </div>
            </div>
          )}

          {/* Dynamic Qs */}
          {selectedLead.responses && selectedLead.responses.length > 0 && (
            <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Qualifying Answers</h4>
              {selectedLead.responses.map(resp => {
                const q = questions.find(question => question.id === resp.question_id);
                return (
                  <div key={resp.question_id} style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>{q ? q.question_text : 'Question'}</span>
                    <span style={{ fontWeight: 500 }}>{resp.response_value}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Remarks History */}
          <div>
            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Follow-up remarks</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
              {feedbackHistory.length === 0 ? (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No follow-up remarks recorded.</span>
              ) : (
                feedbackHistory.map(log => (
                  <div key={log.id} style={{ background: 'var(--bg-primary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.15rem', fontSize: '0.75rem' }}>
                      <span>{log.staff_id === user.id ? 'You' : 'Counselor'}</span>
                      <span>{new Date(log.created_at).toLocaleDateString()}</span>
                    </div>
                    <p>{log.feedback_text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Admit Action */}
          {selectedLead.status !== 'Enrolled' && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-primary" 
                style={{ background: 'var(--success)', borderColor: 'var(--success)', padding: '0.75rem 1.5rem', fontWeight: 600 }}
                onClick={() => handleAdmitStudent(selectedLead)}
                disabled={admittingLeadId === (selectedLead.id || selectedLead._id)}
              >
                {admittingLeadId === (selectedLead.id || selectedLead._id) ? 'Admitting...' : 'Admit Student'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
