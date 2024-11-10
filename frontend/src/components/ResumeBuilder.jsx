import React, { useState } from 'react';
import { Chat } from './Chat';
import { ResumePreview } from './ResumePreview';
import { useResumeBuilder } from '../hooks/useResumeBuilder';
import { LoadingSpinner } from './ui/LoadingSpinner';
import axios from 'axios';

export function ResumeBuilder() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  const isFormValid = name && email && experience && education && skills;

  // Function to handle resume generation
  const generateResume = async () => {
    if (!isFormValid) {
      alert('Please fill in all the fields.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/generate-resume', {
        conversationHistory: [
          { question: 'What is your name?', response: name },
          { question: 'What is your email?', response: email },
          { question: 'Describe your work experience.', response: experience },
          { question: 'Describe your educational background.', response: education },
          { question: 'What are your skills?', response: skills },
        ]
      });

      setResumeData(response.data); // Set resume data after successful API call
    } catch (error) {
      console.error('Error generating resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left side: Chat */}
      <div className="bg-white rounded-lg shadow">
        <Chat 
          conversationHistory={[]}  // Pass relevant conversation history if required
          onSendMessage={() => {}}   // Add logic for handling chat messages if needed
          loading={isLoading}
        />
      </div>

      {/* Right side: Resume Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Experience</label>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Education</label>
          <textarea
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Skills</label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        {/* Button for generating the resume */}
        <button
          onClick={generateResume}
          disabled={!isFormValid || isLoading}
          className={`w-full mt-6 bg-blue-500 text-white py-2 rounded ${!isFormValid || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {isLoading ? 'Generating Resume...' : 'Generate Resume'}
        </button>

        {/* Resume Preview or Loading Spinner */}
        {isLoading ? (
          <LoadingSpinner />
        ) : resumeData ? (
          <ResumePreview resumeData={resumeData} />
        ) : null}
      </div>
    </div>
  );
}
