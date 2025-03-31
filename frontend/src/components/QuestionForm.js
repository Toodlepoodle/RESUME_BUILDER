import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuestionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    summary: '',
    education: '',
    experience: '',
    skills: '',
    target_role: '',
    industry: '',
    years_of_experience: '',
    job_description: '',
    template: 'modern'
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || '/api'}/generate-resume`, formData);
      navigate('/download', { state: { resume: response.data } });
    } catch (err) {
      setError('Failed to generate resume. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Template options
  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean, contemporary design suitable for most industries' },
    { id: 'classic', name: 'Classic', description: 'Traditional format ideal for conservative industries' },
    { id: 'creative', name: 'Creative', description: 'Distinctive design for creative fields' },
    { id: 'executive', name: 'Executive', description: 'Sophisticated layout for senior professionals' }
  ];

  // Step 1: Personal Information
  const renderPersonalInfoStep = () => (
    <>
      <h3 className="mb-3">Personal Information</h3>
      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-control" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Location</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-control" required />
      </div>
      <div className="mb-3">
        <label className="form-label">LinkedIn Profile</label>
        <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="form-control" />
      </div>
    </>
  );

  // Step 2: Professional Details
  const renderProfessionalDetailsStep = () => (
    <>
      <h3 className="mb-3">Professional Details</h3>
      <div className="mb-3">
        <label className="form-label">Professional Summary</label>
        <textarea 
          name="summary" 
          value={formData.summary} 
          onChange={handleChange} 
          className="form-control" 
          rows="3" 
          placeholder="Brief overview of your professional background and key strengths" 
          required 
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Skills</label>
        <textarea 
          name="skills" 
          value={formData.skills} 
          onChange={handleChange} 
          className="form-control" 
          rows="3" 
          placeholder="List your technical, soft, and specialized skills" 
          required 
        />
        <small className="form-text text-muted">Separate skills with commas</small>
      </div>
      <div className="mb-3">
        <label className="form-label">Target Role</label>
        <input 
          type="text" 
          name="target_role" 
          value={formData.target_role} 
          onChange={handleChange} 
          className="form-control" 
          placeholder="e.g., Software Engineer, Marketing Manager" 
          required 
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Industry</label>
        <input 
          type="text" 
          name="industry" 
          value={formData.industry} 
          onChange={handleChange} 
          className="form-control" 
          placeholder="e.g., Technology, Healthcare, Finance" 
          required 
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Years of Experience</label>
        <input 
          type="number" 
          name="years_of_experience" 
          value={formData.years_of_experience} 
          onChange={handleChange} 
          className="form-control" 
          min="0" 
          max="50" 
          required 
        />
      </div>
    </>
  );

  // Step 3: Experience & Education
  const renderExperienceEducationStep = () => (
    <>
      <h3 className="mb-3">Experience & Education</h3>
      <div className="mb-3">
        <label className="form-label">Work Experience</label>
        <textarea 
          name="experience" 
          value={formData.experience} 
          onChange={handleChange} 
          className="form-control" 
          rows="5" 
          placeholder="Format: Company, Title, Dates, Responsibilities and achievements (use multiple lines for different positions)" 
          required 
        />
        <small className="form-text text-muted">Be specific about your achievements and use numbers where possible</small>
      </div>
      <div className="mb-3">
        <label className="form-label">Education</label>
        <textarea 
          name="education" 
          value={formData.education} 
          onChange={handleChange} 
          className="form-control" 
          rows="3" 
          placeholder="Format: Degree, Institution, Year, GPA (optional)" 
          required 
        />
      </div>
    </>
  );

  // Step 4: Job Targeting & Template
  const renderJobTargetingStep = () => (
    <>
      <h3 className="mb-3">Job Targeting & Template</h3>
      <div className="mb-3">
        <label className="form-label">Job Description (for tailoring)</label>
        <textarea 
          name="job_description" 
          value={formData.job_description} 
          onChange={handleChange} 
          className="form-control" 
          rows="5" 
          placeholder="Paste the job description you're applying for to tailor your resume" 
        />
        <small className="form-text text-muted">This helps optimize your resume for the specific role</small>
      </div>
      
      <div className="mb-4">
        <label className="form-label">Select Resume Template</label>
        <div className="row">
          {templates.map(template => (
            <div className="col-md-6 mb-3" key={template.id}>
              <div 
                className={`card h-100 ${formData.template === template.id ? 'border-primary' : ''}`}
                onClick={() => setFormData({...formData, template: template.id})}
                style={{cursor: 'pointer'}}
              >
                <div className="card-body">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id={`template-${template.id}`}
                      name="template"
                      value={template.id}
                      checked={formData.template === template.id}
                      onChange={handleChange}
                    />
                    <label className="form-check-label fw-bold" htmlFor={`template-${template.id}`}>
                      {template.name}
                    </label>
                  </div>
                  <p className="card-text mt-2 small">{template.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="form-section">
      {currentStep === 1 && renderPersonalInfoStep()}
      {currentStep === 2 && renderProfessionalDetailsStep()}
      {currentStep === 3 && renderExperienceEducationStep()}
      {currentStep === 4 && renderJobTargetingStep()}
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="d-flex justify-content-between mt-4">
        {currentStep > 1 && (
          <button type="button" className="btn btn-secondary" onClick={prevStep}>
            Previous
          </button>
        )}
        
        {currentStep < 4 ? (
          <button type="button" className="btn btn-primary ms-auto" onClick={nextStep}>
            Next
          </button>
        ) : (
          <button type="submit" className="btn btn-success ms-auto" disabled={loading}>
            {loading ? 'Generating Resume...' : 'Generate Resume'}
          </button>
        )}
      </div>
      
      <div className="mt-3 text-center">
        <small className="text-muted">Step {currentStep} of 4</small>
        <div className="progress mt-2">
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{width: `${(currentStep/4)*100}%`}} 
            aria-valuenow={currentStep} 
            aria-valuemin="0" 
            aria-valuemax="4"
          ></div>
        </div>
      </div>
    </form>
  );
};

export default QuestionForm;