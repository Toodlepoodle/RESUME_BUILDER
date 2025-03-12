import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="page-container text-center">
      <h1 className="mb-4">Welcome to Smart Resume Builder</h1>
      <p className="lead mb-4">
        Create professional, ATS-friendly resumes in minutes with our AI-powered resume builder.
      </p>
      <Link to="/builder" className="btn btn-primary btn-lg">
        Start Building Your Resume
      </Link>
    </div>
  );
};

export default Home;