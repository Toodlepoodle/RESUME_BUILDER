import React from 'react';
import ReactMarkdown from 'react-markdown';

const ResumePreview = ({ resume }) => {
  if (!resume) return <div>No resume data available.</div>;

  return (
    <div className="resume-preview">
      <ReactMarkdown>{resume.content}</ReactMarkdown>
    </div>
  );
};

export default ResumePreview;