import React from 'react';
import ReactMarkdown from 'react-markdown';
import '../styles/resume-templates.css';

const ResumePreview = ({ resume }) => {
  if (!resume) {
    return (
      <div className="p-5 text-center border rounded bg-light">
        <h4 className="text-muted">No resume data available</h4>
        <p>Please complete the form and generate a resume first.</p>
      </div>
    );
  }
  
  // Handle case where resume exists but content is missing
  if (!resume.content) {
    return (
      <div className="p-5 text-center border rounded bg-light">
        <h4 className="text-muted">Resume content not available</h4>
        <p>There was an issue with the resume generation. Please try again.</p>
      </div>
    );
  }
  
  // Determine which template CSS class to apply
  const templateClass = `resume-template-${resume.template || 'modern'}`;
  
  return (
    <div className={`resume-preview ${templateClass}`}>
      <ReactMarkdown>{resume.content}</ReactMarkdown>
    </div>
  );
};

export default ResumePreview;