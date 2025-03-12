import React from 'react';
import '../styles/components.css';

const Footer = () => {
  return (
    <footer className="app-footer text-center">
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Smart Resume Builder. All rights reserved.
        </p>
        <p className="mb-0">
          <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;