import React from 'react';
import { Users, GraduationCap } from 'lucide-react';

const Step0 = ({ formData, setFormData, nextStep, validationErrors, handleNestedChange }) => {
  return (
    <div className="animate-slide-up-fade">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '-0.010em' }}>
        Welcome to Droneco
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
        Please select who is filling out this inquiry form:
      </p>

      {validationErrors && validationErrors.filler_type && (
        <div style={{ padding: '0.75rem', background: 'var(--danger-glow)', color: 'var(--danger)', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
          {validationErrors.filler_type}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {/* Student Card */}
        <div
          onClick={() => {
            setFormData(prev => ({ ...prev, filler_type: 'student' }));
          }}
          style={{
            border: formData.filler_type === 'student' ? '2px solid var(--accent-hex)' : '1.5px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'var(--transition)',
            background: formData.filler_type === 'student' ? 'var(--accent-light)' : 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: formData.filler_type === 'student' ? '#fff' : 'var(--accent-light)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              color: 'var(--accent-hex)', fontSize: '1.2rem', fontWeight: 'bold'
            }}>
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>I am a Student</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                I want to register for a course myself.
              </p>
            </div>
          </div>
        </div>

        {/* Guardian Card */}
        <div
          onClick={() => setFormData(prev => ({ ...prev, filler_type: 'guardian' }))}
          style={{
            border: formData.filler_type === 'guardian' ? '2px solid var(--accent-hex)' : '1.5px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'var(--transition)',
            background: formData.filler_type === 'guardian' ? 'var(--accent-light)' : 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: formData.filler_type === 'guardian' ? '#fff' : 'var(--accent-light)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              color: 'var(--accent-hex)', fontSize: '1.2rem', fontWeight: 'bold'
            }}>
              <Users size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>I am a Parent / Guardian</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                I am registering details for my child/student.
              </p>
            </div>
          </div>
        </div>
      </div>

      {formData.filler_type === 'guardian' && (
        <div className="animate-slide-up-fade" style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Please enter your details:</h3>
          
          <div className="form-group">
            <label className="form-label">Your Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Parent/Guardian Name"
              value={formData.guardian?.first_name || ''}
              onChange={(e) => handleNestedChange('guardian', 'first_name', e.target.value)}
            />
            {validationErrors && validationErrors['guardian.first_name'] && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors['guardian.first_name']}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="parent@gmail.com"
                value={formData.guardian?.email || ''}
                onChange={(e) => handleNestedChange('guardian', 'email', e.target.value)}
              />
              {validationErrors && validationErrors['guardian.email'] && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors['guardian.email']}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="10-digit mobile number"
                value={formData.guardian?.mobile_number || ''}
                onChange={(e) => handleNestedChange('guardian', 'mobile_number', e.target.value)}
              />
              {validationErrors && validationErrors['guardian.mobile_number'] && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors['guardian.mobile_number']}</span>}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <button className="btn btn-primary" onClick={nextStep}>Next Step &rarr;</button>
      </div>
    </div>
  );
};

export default Step0;
