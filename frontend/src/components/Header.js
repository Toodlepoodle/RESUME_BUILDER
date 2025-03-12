import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';

const Header = () => {
  return (
    <header className="app-header">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <Link className="app-logo" to="/">Smart Resume Builder</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/builder">Builder</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/download">Download</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;