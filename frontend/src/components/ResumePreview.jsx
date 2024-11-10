import React from 'react';
import { Button } from './ui/Button';

export function ResumePreview({ resumeData, onGenerateResume }) {
  if (!resumeData) {
    return (
      <div className="h-[600px] flex items-center justify-center p-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Resume Generated Yet
          </h3>
          <p className="text-gray-500 mb-4">
            Chat with the AI assistant to create your resume. Once you've provided
            enough information, click the button below to generate your resume.
          </p>
          <Button onClick={onGenerateResume} disabled={!resumeData}>
            Generate Resume
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] overflow-y-auto p-8">
      {resumeData.sections.map((section, index) => (
        <ResumeSection key={index} section={section} />
      ))}
      <div className="mt-4 flex justify-end space-x-2">
        <Button onClick={() => window.print()}>
          Download PDF
        </Button>
      </div>
    </div>
  );
}

function ResumeSection({ section }) {
  switch (section.type) {
    case 'header':
      return (
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">{section.content.name}</h1>
          <div className="text-gray-600 mt-2">
            <p>{section.content.contact.email} | {section.content.contact.phone}</p>
            <p>{section.content.contact.location}</p>
          </div>
        </div>
      );
    
    case 'summary':
      return (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Professional Summary</h2>
          <p className="text-gray-700">{section.content}</p>
        </div>
      );
    
    case 'experience':
      return (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Experience</h2>
          {section.content.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{exp.title}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <div className="text-gray-600 text-right">
                  <p>{exp.duration}</p>
                  <p>{exp.location}</p>
                </div>
              </div>
              <ul className="list-disc ml-5 mt-2">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="text-gray-700">{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    
    case 'education':
      return (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Education</h2>
          {section.content.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                </div>
                <div className="text-gray-600 text-right">
                  <p>{edu.duration}</p>
                  <p>{edu.location}</p>
                </div>
              </div>
              {edu.details.length > 0 && (
                <ul className="list-disc ml-5 mt-2">
                  {edu.details.map((detail, i) => (
                    <li key={i} className="text-gray-700">{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      );
      
    case 'skills':
      return (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {section.content.technical.map((skill, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {section.content.soft.map((skill, i) => (
                  <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    
    default:
      return null;
  }
}
