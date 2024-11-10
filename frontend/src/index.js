// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Optional: if you want to use custom styles
import App from './App'; // Main component

// Render the App component into the root div
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // 'root' is the id of the div in public/index.html
);
