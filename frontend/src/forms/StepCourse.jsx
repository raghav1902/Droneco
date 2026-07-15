import React from 'react';

import CustomFieldsRenderer from './CustomFieldsRenderer';

const StepCourse = ({
  formData,
  handleBasicChange,
  validationErrors,
  courses,
  prevStep,
  nextStep,
  formConfig
}) => {
  const getError = (field) => validationErrors?.[field];
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
        {getError('interested_course_id') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('interested_course_id')}</span>}
      </div>

      <div className='form-grid-2'>
        <div className="form-group">
          <label className="form-label">Admission Year *</label>
          <input
            type="text"
            name="admission_year"
            className="form-input"
            value={formData.admission_year}
            readOnly
            style={{ backgroundColor: 'var(--bg-hover)', cursor: 'not-allowed', color: 'var(--text-secondary)' }}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Learning Mode *</label>
          <select
            name="learningMode"
            className="form-select"
            value={formData.learningMode || ''}
            onChange={handleBasicChange}
          >
            <option value="">Select Mode</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
          {getError('learningMode') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('learningMode')}</span>}
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
