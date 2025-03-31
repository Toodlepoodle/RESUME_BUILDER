import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResumePreview from '../components/ResumePreview';
import ExportOptions from '../components/ExportOptions';

const Download = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resume = location.state?.resume;

  // If resume data is not available in location state,
  // show a message and provide a button to redirect to the builder page
  if (!resume) {
    return (
      <div className="page-container text-center">
        <div className="alert alert-warning mb-4">
          <h4>No Resume Data Available</h4>
          <p>It looks like you haven't generated a resume yet or the resume data was lost.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/builder')}
        >
          Go to Resume Builder
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="mb-4">Your Resume is Ready!</h1>
      <ResumePreview resume={resume} />
      <ExportOptions resume={resume} />
    </div>
  );
};

export default Download;