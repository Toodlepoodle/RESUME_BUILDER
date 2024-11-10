import React, { useState } from 'react';
import { ResumeBuilder } from './components/ResumeBuilder';

function App() {
  // State to manage if the resume builder is in progress
  const [isBuilding, setIsBuilding] = useState(false);

  const handleStartBuilding = () => {
    setIsBuilding(true);
  };

  const handleReset = () => {
    setIsBuilding(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Resume Builder</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Conditional rendering based on whether user has started building the resume */}
        {!isBuilding ? (
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-700 mb-4">
              Ready to create your resume?
            </h2>
            <button
              onClick={handleStartBuilding}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg focus:outline-none"
            >
              Start Building Resume
            </button>
          </div>
        ) : (
          <ResumeBuilder onReset={handleReset} />
        )}
      </main>
      
      {/* Footer (Optional) */}
      <footer className="bg-white shadow mt-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">&copy; 2024 AI Resume Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
