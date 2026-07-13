import React from 'react';

import CustomFieldsRenderer from './CustomFieldsRenderer';

const StepCourse = ({
  formData,
  handleBasicChange,
  courses,
  prevStep,
  nextStep,
  formConfig
}) => {
  return (
    <div className="animate-slide-up-fade">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2.25rem', letterSpacing: '-0.010em' }}>
        Course Details
      </h2>

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label">Interested Course *</label>
        <select
          name="interested_course_id"
          className="form-select"
          value={formData.interested_course_id}
          onChange={handleBasicChange}
        >
          <option value="">-- Select a Course --</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.course_name}</option>
          ))}
        </select>
      </div>

      <div className='form-grid-2'>
        <div className="form-group">
          <label className="form-label">Admission Year *</label>
          <select
            name="admission_year"
            className="form-select"
            value={formData.admission_year}
            onChange={handleBasicChange}
          >
            <option value="">Select Year</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Mode of Admission <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
          <input
            type="text"
            name="mode_of_admission"
            className="form-input"
            placeholder="e.g. Merit, Management"
            value={formData.mode_of_admission}
            onChange={handleBasicChange}
          />
        </div>
      </div>

      <div className='form-grid-2'>
        <div className="form-group">
          <label className="form-label">Department *</label>
          <select
            name="department"
            className="form-select"
            value={formData.department}
            onChange={handleBasicChange}
          >
            <option value="">Select Department</option>
            <option value="Science">Science</option>
            <option value="Commerce">Commerce</option>
            <option value="Arts">Arts</option>
            <option value="Engineering">Engineering</option>
            <option value="Medical">Medical</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Branch <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
          <input
            type="text"
            name="branch"
            className="form-input"
            placeholder="Branch"
            value={formData.branch}
            onChange={handleBasicChange}
          />
        </div>
      </div>



      <CustomFieldsRenderer
        stepName="Course"
        formConfig={formConfig}
        formData={formData}
        handleBasicChange={handleBasicChange}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button className="btn btn-secondary" onClick={prevStep}>&larr; Back</button>
        <button className="btn btn-primary" onClick={nextStep}>Next Step &rarr;</button>
      </div>
    </div>
  );
};

export default StepCourse;
