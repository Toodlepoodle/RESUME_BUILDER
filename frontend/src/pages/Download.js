import React from 'react';
import { useLocation } from 'react-router-dom';
import ResumePreview from '../components/ResumePreview';
import ExportOptions from '../components/ExportOptions';

const Download = () => {
  const location = useLocation();
  const resume = location.state?.resume;

  return (
    <div className="page-container">
      <h1 className="mb-4">Your Resume is Ready!</h1>
      <ResumePreview resume={resume} />
      <ExportOptions resume={resume} />
    </div>
  );
};

export default Download;