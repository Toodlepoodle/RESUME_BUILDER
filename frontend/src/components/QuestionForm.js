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
    years_of_experience: ''
  });
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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/generate-resume`, formData);
      navigate('/download', { state: { resume: response.data } });
    } catch (err) {
      setError('Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-section">
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
      <div className="mb-3">
        <label className="form-label">Professional Summary</label>
        <textarea name="summary" value={formData.summary} onChange={handleChange} className="form-control" rows="3" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Education</label>
        <textarea name="education" value={formData.education} onChange={handleChange} className="form-control" rows="3" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Work Experience</label>
        <textarea name="experience" value={formData.experience} onChange={handleChange} className="form-control" rows="5" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Skills</label>
        <textarea name="skills" value={formData.skills} onChange={handleChange} className="form-control" rows="3" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Target Role</label>
        <input type="text" name="target_role" value={formData.target_role} onChange={handleChange} className="form-control" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Industry</label>
        <input type="text" name="industry" value={formData.industry} onChange={handleChange} className="form-control" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Years of Experience</label>
        <input type="number" name="years_of_experience" value={formData.years_of_experience} onChange={handleChange} className="form-control" required />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Resume'}
      </button>
    </form>
  );
};

export default QuestionForm;